const userModel = require("../models/userModel");

const isValidName = function (body) {
  const nameRegex = /^[a-zA-Z_ ]*$/;
  return nameRegex.test(body);
};

const isValidPhone = function (body) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(body);
};

const isValidEmail = function (body) {
  const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  return emailRegex.test(body);
};

const isValidPassword = function (body) {
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/;
  return passwordRegex.test(body);
};

const isValidRequestBody = function (request) {
  return Object.keys(request).length > 0;
};
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "string") return true;
};
const isvalidPincode = function (pincode) {
  if (/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/.test(pincode)) return true;
  return false;
};

/////////////////////////////////////////////////// userValidation /////////////////////////////////////////////////////////


module.exports = {
  isValidName,
  isValidPhone,
  isValidEmail,
  isValidPassword,
  isValidRequestBody,
  isValid,
  isvalidPincode,
};


// const userValidation = async function (req, res, next) {
//   try {
    

//     next();
//   } catch (error) {
//     res.status(500).send({ status: false, error: error.message });
//   }
// };
//////////////////////////////////////////// Login Validation /////////////////////////////////////////////////////////////

// const logInValidation = async function (req, res, next) {
//   try {
//     let data = req.body;
//     let { email, password, ...rest } = { ...data };

//     if (Object.keys(rest) != 0)
//       return res
//         .status(400)
//         .send({
//           status: false,
//           msg: "please provide EmaliId and Password only",
//         });
//     if (Object.keys(data) == 0)
//       return res
//         .status(400)
//         .send({ status: false, msg: "Please provide details" });

//     if (!email || !password)
//       return res
//         .status(400)
//         .send({ status: false, msg: "Please enter email and password both" });

//     next();
//   } catch (error) {
//     res.status(500).send({ status: false, error: error.message });
//   }
// };

// / if (!fname) return res.status(400).send({ status: false, message: "fname is required" })
// if (!isValid(fname)) return res.status(400).send({ status: false, message: "fname is not empty" })

// if (!lname) return res.status(400).send({ status: false, message: "lname is required" })
// if (!isValid(lname)) return res.status(400).send({ status: false, message: "lname is not empty" })

// if (!email) return res.status(400).send({ status: false, message: "email is required" })
// if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "enter valid email" })

// let checkEmail = await userModel.findOne({ email: email })
// if (checkEmail)
//     return res.status(409).send({ status: false, message: "email already exist" })

// if (!phone) return res.status(400).send({ status: false, message: "phone is required" })
// if (!isValidNum(phone)) return res.status(400).send({ status: false, message: "enter valid email" })

// let checkNum = await userModel.findOne({ phone: phone })
// if (checkNum)
//     return res.status(409).send({ status: false, message: "phone already exist" })

// if (!password) return res.status(400).send({ status: false, message: "password is required" })
// if (!matchPass(password)) return res.status(400).send({ status: false, message: "enter valid password" })

// if (!address) return res.status(400).send({ status: false, message: "address is required" })

// if (address && typeof address !=="JSON") {
//     return res.status(400).send({ status: false, message: "Address is in wrong format" })
// };

// if (!address.shipping) { return res.status(400).send({ status: false, message: "Please include shipping address" }) };
// if (!isValidRequestBody(address.shipping)) return res.status(400).send({ status: false, message: "shipping address is required" })

// if (!address.shipping.street) { return res.status(400).send({ status: false, message: "Please include shipping street" }) };
// if (!isValid(address.shipping.street)) return res.status(400).send({ status: false, message: "street is required in shipping address!" })

// if (!address.shipping.city) { return res.status(400).send({ status: false, message: "Please include shipping city" }) };
// if (!isValid(address.shipping.city)) return res.status(400).send({ status: false, message: "shipping city is required" })

// if (!address.shipping.pincode) { return res.status(400).send({ status: false, message: "Please include shipping pincode" }) };
// if (!isvalidPincode(address.shipping.pincode)) return res.status(400).send({ status: false, message: "shipping city pincode  is required" })

// if (!address.billing) { return res.status(400).send({ status: false, message: "Please include billing address" }) };
// if (!isValidRequestBody(address.billing)) return res.status(400).send({ status: false, message: "billing address is required" })

// if (!address.billing.street) { return res.status(400).send({ status: false, message: "Please include billing street" }) };
// if (!isValid(address.billing.street)) return res.status(400).send({ status: false, message: "street is required in billing address!" })

// if (!address.billing.city) { return res.status(400).send({ status: false, message: "Please include billing city " }) };
// if (!isValid(address.billing.city)) return res.status(400).send({ status: false, message: "billing city is required in billing address" })

// if (!address.billing.pincode) { return res.status(400).send({ status: false, message: "Please include billing pincode" }) };
// if (!isvalidPincode(address.billing.pincode)) return res.status(400).send({ status: false, message: "billing city pincode  is required" })

//____profile image__________________
// let files = req.files
// if (files && files.length > 0) {
//     let uploadedFileUrl = await uploadFiles.uploadFiles(files[0])
//     data.profileImage = uploadedFileUrl
//  //   res.status(201).send({ message: "File uploaded succesfully", data: uploadedFileUrl })
// }
// else {
//     return res.status(400).send({ message: "No file found" })
// }

//         const savedData = await userModel.create(data)
//         return res.status(201).send({ status: true, message: 'User Created Successfully',data:savedData })
//     }
//     catch (error) {
//         return res.status(500).send({ status: false, error: error.message })
//     }
// }

// module.exports = { createUser }

// const isValidEmail = function (body) {
//     const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
//     return emailRegex.test(body)
// }

// const isValidNum = function (value) {
//     let regex = /^[6789][0-9]{9}$/
//     return regex.test(value)
// }

// const matchPass = function (value) {
//     let regex = /^(?=.[0-9])(?=.[!@#$%^&])[a-zA-Z0-9!@#$%^&]{8,15}$/;
//     return regex.test(value)
// }
