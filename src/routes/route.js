const express = require('express');
const router = express.Router();
const { createUser, login } = require('../controllers/userController')
const { userValidation, logInValidation } = require('../Validator/validator.js')

router.post("/register",  createUser)
router.post("/register", logInValidation, login)

module.exports = router;   