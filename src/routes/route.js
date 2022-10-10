const express = require('express');
const router = express.Router();
const { createUser, login } = require('../controllers/userController')
const { userValidation, logInValidation } = require('../middleware/validator.js')

router.post("/register", userValidation, createUser)
router.post("/register", logInValidation, login)

module.exports = router;   