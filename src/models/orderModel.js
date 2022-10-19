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
          productId: {
            type: mongoose.Types.ObjectId,
            ref: Product,
            required: true,
        },
          quantity: {
            type: Number,
            required: true,
            min: 1
        }
        }],
        totalPrice: {
            type: Number,
            required: true
        },
        totalItems: {
            type: Number,
            required: true
        },
        totalQuantity: {
            type: Number,
            required: true
        },
        cancellable: {
            type: Boolean,
            default: true
        },
        status: {
            type: String,
            default: 'pending',
            enum: ["pending", "completed", "cancled"]
        },
        deletedAt: {
            type: Date,
            default: null,
          }, 
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);