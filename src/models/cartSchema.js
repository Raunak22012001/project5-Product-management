const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
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
                ref: "User",
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