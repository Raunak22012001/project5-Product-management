const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const mongoose = require("mongoose");



//==========================================  createCart ==================================================///

const createCart = async (req, res) => {
    try {
        let userId = req.params.userId
        let { productId, cartId, ...rest } = req.body
        let createData = {}

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({ status: false, msg: "Request body empty... Please provide data for input" })
        }

        if (!mongoose.isValidObjectId(userId))
            return res
                .status(400)
                .send({ status: false, message: "Ivalid userId" });

        if (!mongoose.isValidObjectId(productId))
            return res
                .status(400)
                .send({ status: false, message: "Ivalid productId" });

        if (cartId) {
            if (!mongoose.isValidObjectId(cartId))
                return res
                    .status(400)
                    .send({ status: false, message: "Ivalid cartid" });
        }

        if (Object.keys(rest).length != 0) {
            return res.status(400).send({
                status: false,
                msg: "Extra data provided...Please provide only productId or productId and cartId from body",
            });
        }

        if (req.token.user._id != req.params.userId)
            return res.status(403).send({ status: false, message: "unauthorized" });

        let productData = await productModel.findOne({ _id: productId, isDeleted: false })

        let userAlreadyHaveCart = await cartModel.findOne({ userId, isDeleted: false })

        if (userAlreadyHaveCart) {
            let cartObj = userAlreadyHaveCart.toObject()
            let prod
            cartObj.items.map(x => { if (x.productId == productId) prod = x.productId })
            if (prod) {
                if (prod.toString() === productId) {

                    let update = await cartModel.findOneAndUpdate(
                        { _id: userAlreadyHaveCart._id, "items.productId": prod, isDeleted: false },
                        { $inc: { "items.$.quantity": 1, totalPrice: productData.price } },
                        { new: true }
                    )
                    return res.status(201).send({ status: true, msg: update })
                }
            } else {
                let update = await cartModel.findOneAndUpdate(
                    { _id: userAlreadyHaveCart._id, isDeleted: false },
                    {
                        $push: {
                            items: {
                                productId: productId,
                                quantity: 1
                            }
                        },
                        $inc: { totalPrice: productData.price, totalItems: 1 }
                    }, { new: true }
                )
                return res.status(201).send({ status: true, msg: update })

            }
        }

        createData.userId = userId
        createData.items = [{
            productId: productId,
            quantity: 1
        }]
        createData.totalPrice = productData.price
        createData.totalItems = createData.items.length

        let createCart = await cartModel.create(createData)
        return res.status(201).send({ status: true, msg: createCart })

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}



///===================================== updatecart ===================================================///

const updatecart = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
}
module.exports = { createCart , updatecart}

