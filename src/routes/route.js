const express = require('express');
const router = express.Router();
const { createUser, login, getProfile, updateUser} = require('../controllers/userController')
const { authentication } = require('../middleware/auth')
const { userValidation } = require('../validator/validator')

router.post("/register",  createUser)
router.post("/login", login)
router.get("/user/:userId/profile", authentication,  getProfile)
router.put("/user/:userId/profile", authentication, updateUser )

module.exports = router;   