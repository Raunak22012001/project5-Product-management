const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(

    // userId: {ObjectId, refs to User, mandatory, unique},
    // items: [{
    //   productId: {ObjectId, refs to Product model, mandatory},
    //   quantity: {number, mandatory, min 1}
    // }],
    // totalPrice: {number, mandatory, comment: "Holds total price of all the items in the cart"},
    // totalItems: {number, mandatory, comment: "Holds total number of items in the cart"},
    // createdAt: {timestamp},
    // updatedAt: {timestamp},

    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
            unique: true,
            ref: "User",
        },
        items: [{
            type: String,
            productId: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "Product",
            },
            totalItems: {
                type: Number,
                required: true,
                min: 1
            },

        }],

        totalPrice: {
            type: Number,
            required: true,
        },
        totalItems: {
            type: Number,
            required: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema);