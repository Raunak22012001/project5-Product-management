const productModel = require("../models/productModel");
const { uploadFile } = require("../aws Config/awsConfig");
const mongoose = require("mongoose");
const {
  isValidName,
  isValidprice,
  isValidInstallment,
  isValidDescription
} = require("../validator/validator");

//_____________________________Create product ___________________________________
const createProduct = async function (req, res) {
  try {
    let data = req.body;

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide details" });
    }

    let { title, description, price, currencyId, currencyFormat, installments, isFreeShipping, productImage, style, availableSizes, ...rest } = { ...data };

    if (Object.keys(rest).length != 0) {
      return res.status(400).send({
        status: false,
        msg: "Data required are title description price currencyId currencyFormat image style availableSizes installments isFreeShipping"
      });
    }

    let files = req.files;

    if (!title)
      return res.status(400).send({ status: false, msg: "title is required" });
    if (!description)
      return res
        .status(400)
        .send({ status: false, msg: "description is required" });
    if (!price)
      return res.status(400).send({ status: false, msg: "price is required" });
    if (!currencyId)
      return res
        .status(400)
        .send({ status: false, msg: "currencyId is required" });
    if (!currencyFormat)
      return res
        .status(400)
        .send({ status: false, msg: "currencyFormat is required" });

    if (files.length === 0)
      return res
        .status(400)
        .send({ status: false, msg: "productImage is required" });

    if (!availableSizes)
      return res
        .status(400)
        .send({ status: false, msg: "availableSizes is required" });

    availableSizes = availableSizes.toUpperCase().split(",");

    if (availableSizes) {
      for (let i = 0; i < availableSizes.length; i++) {
        const element = availableSizes[i];

        if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(element)) {
          return res.status(400).send({
            status: false,
            message: `available sizes must be from: S, XS, M, X, L, XXL, XL without any spaces`,
          });
        }
      }
      data.availableSizes = availableSizes;
    }
    if (!isValidName(title))
      return res.status(400).send({ status: false, msg: "Invalid title" });

    const isTitleAlreadyUsed = await productModel.findOne({
      title: req.body.title,
    });
    if (isTitleAlreadyUsed)
      return res
        .status(404)
        .send({ status: false, msg: "Title is already used" });

    if (!isValidDescription(description))
      return res
        .status(400)
        .send({ status: false, msg: "description must be string type" });

    if (!isValidprice(price))
      return res
        .status(400)
        .send({ status: false, msg: "Price must be Numeric or Decimal (upto 4 digits)" });

    if (currencyId != 'INR')
      return res
        .status(400)
        .send({ status: false, msg: "currencyId must be INR " })


    if (currencyFormat != '₹')
      return res
        .status(400)
        .send({ status: false, msg: "currencyFormat must be in ₹ " });


    if (isFreeShipping && isFreeShipping !== "true" && isFreeShipping !== "false")
      return res
        .status(400)
        .send({ status: false, msg: "isFreeShipping must be boolean" });

    if (!isValidInstallment(installments))
      return res
        .status(400)
        .send({ status: false, msg: "installments must be Numeric" });

    let uploadedFileURL;

    if (req.files && req.files.length > 0) {
      uploadedFileURL = await uploadFile(req.files[0]);
    } else {
      res.status(400).send({ msg: "No file found" });
    }
    data.productImage = uploadedFileURL;

    const savedData = await productModel.create(data);
    return res.status(201).send({ status: true, msg: savedData });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

///================================== get product data by query ============================================///

const getProductByQuery = async (req, res) => {
  try {
    let { name, size, priceGreaterThan, priceLessThan, priceSort, ...rest } = { ...req.query };

    if (Object.keys(rest).length != 0) {
      return res.status(400).send({
        status: false,
        msg: "Filter data through keys => name, size, priceGreaterThan, priceLessThan, priceSort",
      });
    }
    let data = { isDeleted: false };

    if (priceGreaterThan) {
      let pric = parseFloat(priceGreaterThan);
      if (!isValidprice(priceGreaterThan)) {
        return res
          .status(400)
          .send({ status: false, msg: "priceGreaterThan must be Numeric or decimal (upto 4 digits)" });
      }
      data.price = { $gt: pric };
    }

    if (priceLessThan) {
      let pric = parseFloat(priceLessThan);
      if (!isValidprice(priceLessThan)) {
        return res
          .status(400)
          .send({ status: false, msg: "priceLessThan must be Numeric or decimal (upto 4 digits)" });
      }
      data.price = { $lt: pric };
    }

    if (priceGreaterThan && priceLessThan) {
      let pric = parseFloat(priceGreaterThan);
      let pri = parseFloat(priceLessThan);
      data.price = { $gt: pric, $lt: pri };
    }

    if (size) {
      size = size.toUpperCase().split(",");
      for (let i = 0; i < size.length; i++) {
        const element = size[i];

        if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(element)) {
          return res.status(400).send({
            status: false,
            message: `available sizes should be from:  S, XS, M, X, L, XXL, XL`,
          });
        }
      }
      data.availableSizes = { $in: size };
    }
    if (name) {
      const regexForName = new RegExp(name, "i");
      data.title = { $regex: regexForName };
    }

    let allProducts = await productModel.find(data);

    if (allProducts.length == 0) {
      return res.status(404).send({ status: false, msg: "No Product found" });
    }

    if (priceSort == 1) {
      allProducts.sort((a, b) => {
        return a.price - b.price;
      });
    } else if (priceSort == -1) {
      allProducts.sort((a, b) => {
        return b.price - a.price;
      });
    }

    return res.status(200).send({ status: true, msg: allProducts });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

///=========================================== get Product by id ============================================///

const getProductsById = async (req, res) => {
  try {
    let productId = req.params.productId;

    if (!mongoose.isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid productId" });
    }

    const product = await productModel
      .findOne({ _id: productId, isDeleted: false })
      .select({ __v: 0 });
    if (!product)
      return res.status(404).send({
        status: false,
        message: "product not found or already deleted",
      });

    return res
      .status(200)
      .send({ status: true, message: "Success", data: product });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

///=========================================== update Product by id ============================================///

const updateProduct = async function (req, res) {
  try {
    let uploadedFileURL;
    let productId = req.params.productId;

    let details = req.body;
    if (Object.keys(details).length === 0) {
      return res.status(400).send({ status: false, msg: "Please provide details which you want to update" })
    }

    let { title, description, price, currencyId, currencyFormat, isFreeShipping, availableSizes, style, installments, ...rest } = { ...details };

    if (Object.keys(rest).length != 0) {
      return res.status(400).send({
        status: false,
        msg: "Details for updation must be among these title, description, price, currencyId, currencyFormat, isFreeShipping, style, installments ",
      });
    }

    if (!mongoose.isValidObjectId(productId))
      return res
        .status(400)
        .send({ status: false, message: "Ivalid productId" });

    if (currencyId)
      return res
        .status(400)
        .send({ status: false, msg: "You can't change currencyId" });

    if (currencyFormat)
      return res
        .status(400)
        .send({ status: false, msg: "You can't change currencyFormat" });

    if (title) {
      if (!isValidName(title)) {
        return res.status(400).send({ status: false, msg: "Invalid title" });
      }

      const isTitleAlreadyUsed = await productModel.findOne({ title });
      if (isTitleAlreadyUsed)
        return res
          .status(404)
          .send({ status: false, msg: "Title is already used" });
    }
    if (description && !isValidDescription(description))
      return res
        .status(400)
        .send({ status: false, msg: "Invalid description must not have numeric" });

    if (price && !isValidprice(price))
      return res
        .status(400)
        .send({ status: false, msg: "Price must be Numeric or Decimal (upto 4 digits" });

    if (isFreeShipping && isFreeShipping !== "true" && isFreeShipping !== "false") {
      return res
        .status(400)
        .send({ status: false, msg: "isFreeShipping must be boolean" });
    }

    if (installments && !isValidInstallment(installments))
      return res
        .status(400)
        .send({ status: false, msg: "installments must be Numeric" });

    if (availableSizes) {
      availableSizes = availableSizes.toUpperCase().split(",");
      for (let i = 0; i < availableSizes.length; i++) {
        const element = availableSizes[i];

        if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(element)) {
          return res.status(400).send({
            status: false,
            message: `available sizes must be from:  [S, XS, M, X, L, XXL, XL] without any spaces`,
          });
        }
      }
    }

    if (req.files && req.files.length > 0) {
      uploadedFileURL = await uploadFile(req.files[0]);
    }

    let updatedProduct = await productModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      {
        $set: {
          title: title,
          description: description,
          price: price,
          isFreeShipping: isFreeShipping,
          productImage: uploadedFileURL,
          style: style,
          availableSizes: availableSizes,
          installments: installments,
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ status: false, msg: "Product not found" });
    }

    return res.status(200).send({
      status: true,
      message: "Product details updated",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

///=========================================== Delete Product by id ============================================///

const deleteProduct = async (req, res) => {
  try {
    let productId = req.params.productId;

    if (!mongoose.isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Ivalid product Id" });
    } else {
      let deleteProduct = await productModel.findOneAndUpdate(
        { _id: productId, isDeleted: false },
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true }
      );

      if (!deleteProduct) {
        return res
          .status(400)
          .send({ status: false, message: "Product Does Not exists!!!" });
      } else {
        return res.status(200).send({
          status: true,
          message: "Success",
          data: "Product deleted successfully!",
        });
      }
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  getProductByQuery,
  getProductsById,
  updateProduct,
  deleteProduct,
};
