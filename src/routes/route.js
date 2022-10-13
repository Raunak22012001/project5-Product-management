const express = require('express');
const router = express.Router();
const { createUser, login, getProfile, updateUser} = require('../controllers/userController')
const { createProduct, getProductByQuery, getProductsById, updateProduct, deleteProduct} = require('../controllers/productController')
const { authentication } = require('../middleware/auth')


//------- user api --------//

router.post("/register",  createUser)

router.post("/login", login)

router.get("/user/:userId/profile", authentication,  getProfile)

router.put("/user/:userId/profile", authentication,updateUser )


//------- product api --------//

router.post("/products", createProduct )

router.get("/products", getProductByQuery )

router.get("/products/:productId", getProductsById)

router.put("/products/:productId", updateProduct )

router.delete("/products/:productId", deleteProduct)




module.exports = router;   