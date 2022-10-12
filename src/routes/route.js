const express = require('express');
const router = express.Router();
const { createUser, login, getProfile, updateUser} = require('../controllers/userController')
const { createProduct,getProductByQuery, deleteProduct} = require('../controllers/productController')
const { authentication } = require('../middleware/auth')
const { userValidation } = require('../validator/validator')


//------- user api --------//

router.post("/register",  createUser)
router.post("/login", login)
router.get("/user/:userId/profile", authentication,  getProfile)
router.put("/user/:userId/profile", createProduct )


//------- product api --------//

router.post("/products", createProduct )
router.get("/products", getProductByQuery )
router.delete("/products/:productId", deleteProduct)

module.exports = router;   