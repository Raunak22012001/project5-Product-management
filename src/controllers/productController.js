const productModel = require("../models/productModel");
const { uploadFile } = require("../aws Config/awsConfig");
const mongoose = require("mongoose");
const {
  isValidName,
  isValidPhone,
  isValidEmail,
  isValidPassword,
  isValidRequestBody,
  isValid,
  isvalidPincode,
  isValidObjectId,
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

    let { title, description, price, currencyId, currencyFormat } = { ...data };

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

    if (!req.body.availableSizes)
      return res
        .status(400)
        .send({ status: false, msg: "availableSizes is required" });

    let availableSizes = JSON.parse(req.body.availableSizes);

    if (!Array.isArray(availableSizes)) {
      return res.status(400).send({
        status: false,
        message: "size should be in array format: [X, M,L]",
      });
    }

    if (Array.isArray(availableSizes) && availableSizes.length > 0) {
      for (let i = 0; i < availableSizes.length; i++) {
        const element = availableSizes[i];

        if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(element)) {
          return res.status(400).send({
            status: false,
            message: `available sizes must be from:  S, XS, M, X, L, XXL, XL`,
          });
        }
      }
      // availableSizes = { $in: availableSizes };
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

    if (!isValidName(description))
      return res
        .status(400)
        .send({ status: false, msg: "Invalid description" });

    if (currencyId !== "INR")
      return res
        .status(400)
        .send({ status: false, msg: "crrencyId must be INR" });

    if (currencyFormat !== "₹")
      return res
        .status(400)
        .send({ status: false, msg: "currencyFormat must be in ₹" });

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
    let data = { isDeleted: false };

    if (req.query.priceGreaterThan) {
      // if(){

      // }
      let pric = parseFloat(req.query.priceGreaterThan);
      data.price = { $gt: pric };
    }

    if (req.query.priceLessThan) {
      let pric = parseFloat(req.query.priceLessThan);
      data.price = { $lt: pric };
    }

    if (req.query.priceGreaterThan && req.query.priceLessThan) {
      let pric = parseFloat(req.query.priceGreaterThan);
      let pri = parseFloat(req.query.priceLessThan);
      data.price = { $gt: pric, $lt: pri };
    }

    if (req.query.size) {
      req.query.size = JSON.parse(req.query.size);
      if (!Array.isArray(req.query.size)) {
        return res.status(400).send({
          status: false,
          message: "size should be in array format: [X, M,L]",
        });
      }
      if (Array.isArray(req.query.size) && req.query.size.length > 0) {
        for (let i = 0; i < req.query.size.length; i++) {
          const element = req.query.size[i];

          if (!["S", "XS", "M", "X", "L", "XXL", "XL"].includes(element)) {
            return res.status(400).send({
              status: false,
              message: `available sizes should be from:  S, XS, M, X, L, XXL, XL`,
            });
          }
        }
        data.availableSizes = { $in: req.query.size };
      }
    }
    if (req.query.name) {
      const regexForName = new RegExp(req.query.name, "i");
      data.title = { $regex: regexForName };
    }

    let allProducts = await productModel.find(data);

    if (allProducts.length == 0) {
      return res.status(404).send({ status: false, msg: "No Product found" });
    }

    if (req.query.priceSort == 1) {
      allProducts.sort((a, b) => {
        return a.price - b.price;
      });
    } else if (req.query.priceSort == -1) {
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

    //checking is product id is valid or not
    if (!mongoose.isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid productId" });
    }

    //getting the product by it's ID
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

    let {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      style,
      installments,
    } = { ...details };

    if (!mongoose.isValidObjectId(productId))
      return res
        .status(400)
        .send({ status: false, message: "Ivalid productId" });

    //   if (req.body.currencyId && req.body.currencyId !== "INR")
    // return res.status(400).send({ status: false, msg: "crrencyId must be INR" })

    if (currencyId)
      return res
        .status(400)
        .send({ status: false, msg: "You can't change currencyId" });

    if (currencyFormat)
      return res
        .status(400)
        .send({ status: false, msg: "You can't change currencyFormat" });

    // if (req.body.currencyFormat && req.body.currencyFormat !== "₹")
    // return res.status(400).send({ status: false, msg: "currencyFormat must be in ₹" })

    if (title && !isValidName(title))
      return res.status(400).send({ status: false, msg: "Invalid title" });

    if (description && !isValidName(description))
      return res
        .status(400)
        .send({ status: false, msg: "Invalid description" });

    let availableSizes;
    if (details.availableSizes) {
      availableSizes = JSON.parse(details.availableSizes);
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
