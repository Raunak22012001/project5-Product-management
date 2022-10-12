const productModel = require("../models/productModel");
const { uploadFile } = require("../aws Config/awsConfig");
const mongoose = require('mongoose')
const { isValidObjectId} = require("../validator/validator");




//_____________________________Create product ___________________________________ 
const createProduct = async function (req, res) {
  try {
    if (Object.keys(req.body).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide details" });
    }

    let availableSizes = JSON.parse(req.body.availableSizes);

    let files = req.files;

    let uploadedFileURL;

    if (req.files && req.files.length > 0) {
      uploadedFileURL = await uploadFile(req.files[0]);
    } else {
      res.status(400).send({ msg: "No file found" });
    }

    let createUserData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      currencyId: req.body.currencyId,
      currencyFormat: req.body.currencyFormat,
      isFreeShipping: req.body.isFreeShipping,
      productImage: uploadedFileURL,
      style: req.body.style,
      availableSizes: availableSizes,
      installments: req.body.installments,
    };

    const savedData = await productModel.create(createUserData);
    return res.status(201).send({ status: true, msg: savedData });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

///================================== fetch product data by query ============================================///

const getProductByQuery = async (req, res) => {
  try {
    let data = { isDeleted: false };

    if (req.query.priceGreaterThan) {
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
      data.availableSizes = [req.query.size];
    }
    if (req.query.name) {
      data.title = req.query.name;
    }

    
    let allProducts = await productModel.find(data);
    
    if (allProducts.length == 0) {
        return res.status(404).send({ status: false, msg: "No Product found" });
    }

    if(req.query.priceSort == 1){
        allProducts.sort((a, b) => {
            return a.price - b.price;
          })
    }else if (req.query.priceSort == -1){
        allProducts.sort((a, b) => {
            return b.price-a.price;
          })
    }

    return res.status(200).send({ status: true, msg: allProducts });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
//_________________get Product by id_______________//
const getProductsById = async (req, res) => {
  try {
      let productId = req.params.productId;

      //checking is product id is valid or not
      if (!isValidObjectId(productId)) {
          return res.status(400).send({ status: false, message: 'Please provide valid productId' })
      }

      //getting the product by it's ID
      const product = await productModel.findOne({ _id: productId, isDeleted: false }).select({__v:0})
      if (!product) return res.status(404).send({ status: false, message: "product not found or already deleted" })

      return res.status(200).send({ status: true, message: 'Success', data: product })
  } catch (err) {
      res.status(500).send({ status: false, error: err.message })
  }
}




const deleteProduct = async (req, res) =>{
  try {

    let productId = req.params.productId

    let ObjectId = mongoose.Types.ObjectId;

    if(!(ObjectId.isValid(productId))){
      return res.status(400).send({status:false, message: "Ivalid product Id"})
    }else{
      let deleteProduct = await productModel.findOneAndUpdate({_id:productId, isDeleted:false},{$set:{isDeleted:true}},{new:true})

      if(!deleteProduct){
        return res.status(400).send({status:false, message: "Product Does Not exists!!!"})
      }else{
        return res.status(200).send({status:true, message: "Success" ,data:deleteProduct})
      }

    }
  } catch (error) {
    return res.status(500).send({status:false, message: error.message})
  }

  }

module.exports = { createProduct, getProductByQuery, deleteProduct ,getProductsById};
