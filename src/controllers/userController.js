const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
} = require("../validator/validator");

/////===================================  Create User ===========================================//////
const createUser = async function (req, res) {
  try {
    if (Object.keys(req.body).length == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Please provide details" });

    let files = req.files;

    if (!req.body.fname)
      return res.status(400).send({ status: false, msg: "fname is required" });
    if (!req.body.lname)
      return res.status(400).send({ status: false, msg: "lname is required" });
    if (!req.body.email)
      return res.status(400).send({ status: false, msg: "email is required" });
    if (files.length === 0)
      return res
        .status(400)
        .send({ status: false, msg: "profileImage is required" });
    if (!req.body.phone)
      return res.status(400).send({ status: false, msg: "phone is required" });
    if (!req.body.password)
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });

    if (!req.body.address) {
      return res
        .status(400)
        .send({ status: false, msg: "address is required" });
    }
    let address = JSON.parse(req.body.address);

    if (!address.shipping.street)
      return res
        .status(400)
        .send({ status: false, msg: "shipping street is required" });
    if (!address.shipping.city)
      return res
        .status(400)
        .send({ status: false, msg: "shipping city is required" });
    if (!address.shipping.pincode)
      return res
        .status(400)
        .send({ status: false, msg: "shipping pincode is required" });
    if (!address.billing.street)
      return res
        .status(400)
        .send({ status: false, msg: "billing street is required" });
    if (!address.billing.city)
      return res
        .status(400)
        .send({ status: false, msg: "billing city is required" });
    if (!address.billing.pincode)
      return res
        .status(400)
        .send({ status: false, msg: "billing pincode is required" });

    ///-------- validation ----------///

    if (!isValidName(req.body.fname))
      return res.status(400).send({ status: false, msg: "Invalid fname" });
    if (!isValidName(req.body.lname))
      return res.status(400).send({ status: false, msg: "Invalid lname" });

    if (!isValidEmail(req.body.email))
      return res.status(400).send({ status: false, msg: "Invalid email" });
    const isEmailAlreadyUsed = await userModel.findOne({
      email: req.body.email,
    });
    if (isEmailAlreadyUsed)
      return res
        .status(404)
        .send({ status: false, msg: "Email is already used" });

    if (!isValidPhone(req.body.phone))
      return res.status(400).send({ status: false, msg: "Invalid phone" });
    const isPhoneAlreadyUsed = await userModel.findOne({
      phone: req.body.phone,
    });
    if (isPhoneAlreadyUsed)
      return res
        .status(404)
        .send({ status: false, msg: "Phone is already used" });

    if (!isValidPassword(req.body.password))
      return res.status(400).send({
        status: false,
        msg: "Password must have 8 to 15 characters with at least one lowercase, uppercase, numeric value and a special character",
      });

    if (address && typeof address !== "object") {
      return res
        .status(400)
        .send({ status: false, message: "Address is in wrong format" });
    }

    if (!isValidRequestBody(address.shipping))
      return res
        .status(400)
        .send({ status: false, message: "shipping address is required" });

    if (!isValid(address.shipping.street))
      return res.status(400).send({
        status: false,
        message: "street is required in shipping address!",
      });

    if (!isValid(address.shipping.city))
      return res
        .status(400)
        .send({ status: false, message: "shipping city is required" });

    if (!isvalidPincode(address.shipping.pincode))
      return res
        .status(400)
        .send({ status: false, message: "shipping city pincode  is required" });

    if (!isValidRequestBody(address.billing))
      return res
        .status(400)
        .send({ status: false, message: "billing address is required" });

    if (!isValid(address.billing.street))
      return res.status(400).send({
        status: false,
        message: "street is required in billing address!",
      });

    if (!isValid(address.billing.city))
      return res.status(400).send({
        status: false,
        message: "billing city is required in billing address",
      });

    if (!isvalidPincode(address.billing.pincode))
      return res
        .status(400)
        .send({ status: false, message: "billing city pincode  is required" });


    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let uploadedFileURL;

    if (req.files && req.files.length > 0) {
      uploadedFileURL = await uploadFile(req.files[0]);
    } else {
      res.status(400).send({ msg: "No file found" });
    }

    let createUserData = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      profileImage: uploadedFileURL,
      phone: req.body.phone,
      password: hashedPassword,
      address,
    };

    const savedData = await userModel.create(createUserData);
    return res.status(201).send({ status: true, msg: savedData });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

/////================================================ LogIn ===============================================///////

const login = async function (req, res) {
  try {
    let credentials = req.body;
    let { email, password } = { credentials };

    if (Object.keys(req.body).length == 0) {
      return res
        .status(400)
        .send({ status: false, data: "Login Credential required !!!" });
    }
    if (!email || !password) {
      return res.status(400).send({
        status: false,
        data: "Email and Password Both are required...",
      });
    }
    if (!isValidEmail(email)) {
      return res.status(400).send({ status: false, data: "Invalid Email!!!" });
    }

    if (!isValidPassword(req.body.password))
      return res.status(400).send({
        status: false,
        msg: "Password must have 8 to 15 characters with at least one lowercase, uppercase, numeric value and a special character",
      });

    let user = await userModel.findOne({ email: email });
    if (!user)
      return res.status(400).send({ status: false, data: "User Not Found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send({ status: false, data: "Invalid Password" });
    } else {
      var token = jwt.sign({ user }, "shoppingCartSecreteKey", {
        expiresIn: "1hr",
      }); // will expire in 1hr
      let userId = user._id;
      let loginData = { userId, token };
      res.status(200).send({
        status: true,
        message: "User login successfull",
        data: loginData,
      });
    }
  } catch (err) {
    res.status(500).send({ status: "error", error: err.message });
  }
};

///===========================================  fetch User data ==============================================///

const getProfile = async function (req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.userId))
      return res
        .status(400)
        .send({ status: false, message: "invalid user Id" });

    if (req.tokenID.user._id != req.params.userId)
      return res.status(403).send({ status: false, message: "unauthorized" });

    let allProfiles = await userModel.findById(req.params.userId);
    if (!allProfiles)
      return res
        .status(404)
        .send({ status: false, message: "user id does not exist" });
    res.status(200).send({
      status: true,
      message: "User profile details",
      data: allProfiles,
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

///==================================================== update user ========================================////

const updateUser = async (req, res) => {
  try {
    let address = JSON.parse(req.body.address);

    ///-------- validation ----------///

    if (!isValidName(req.body.fname))
      return res.status(400).send({ status: false, msg: "Invalid fname" });
    if (!isValidName(req.body.lname))
      return res.status(400).send({ status: false, msg: "Invalid lname" });

    if (!isValidEmail(req.body.email))
      return res.status(400).send({ status: false, msg: "Invalid email" });
    const isEmailAlreadyUsed = await userModel.findOne({
      email: req.body.email,
    });
    if (isEmailAlreadyUsed)
      return res
        .status(404)
        .send({ status: false, msg: "Email is already used" });

    if (!isValidPhone(req.body.phone))
      return res.status(400).send({ status: false, msg: "Invalid phone" });
    const isPhoneAlreadyUsed = await userModel.findOne({
      phone: req.body.phone,
    });
    if (isPhoneAlreadyUsed)
      return res
        .status(404)
        .send({ status: false, msg: "Phone is already used" });

    if (!isValidPassword(req.body.password))
      return res.status(400).send({
        status: false,
        msg: "Password must have 8 to 15 characters with at least one lowercase, uppercase, numeric value and a special character",
      });

    if (address && typeof address !== "object") {
      return res
        .status(400)
        .send({ status: false, message: "Address is in wrong format" });
    }

    if (!isValidRequestBody(address.shipping))
      return res
        .status(400)
        .send({ status: false, message: "shipping address is required" });

    if (!isValid(address.shipping.street))
      return res.status(400).send({
        status: false,
        message: "street is required in shipping address!",
      });

    if (!isValid(address.shipping.city))
      return res
        .status(400)
        .send({ status: false, message: "shipping city is required" });

    if (!isvalidPincode(address.shipping.pincode))
      return res
        .status(400)
        .send({ status: false, message: "shipping city pincode  is required" });

    if (!isValidRequestBody(address.billing))
      return res
        .status(400)
        .send({ status: false, message: "billing address is required" });

    if (!isValid(address.billing.street))
      return res.status(400).send({
        status: false,
        message: "street is required in billing address!",
      });

    if (!isValid(address.billing.city))
      return res.status(400).send({
        status: false,
        message: "billing city is required in billing address",
      });

    if (!isvalidPincode(address.billing.pincode))
      return res
        .status(400)
        .send({ status: false, message: "billing city pincode  is required" });

    if (req.tokenID.user._id != req.params.userId)
      return res.status(403).send({ status: false, message: "unauthorized" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let uploadedFileURL;

    if (req.files && req.files.length > 0) {
      uploadedFileURL = await uploadFile(req.files[0]);
    } else {
      res.status(400).send({ msg: "No file found" });
    }

    let updateuser = await userModel.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $set: {
          fname: req.body.fname,
          lname: req.body.lname,
          email: req.body.email,
          profileImage: uploadedFileURL,
          phone: req.body.phone,
          password: hashedPassword,
          address: address,
        },
      },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      message: "User profile updated",
      data: updateuser,
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports = { createUser, login, getProfile, updateUser };
