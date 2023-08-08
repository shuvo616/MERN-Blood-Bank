const mongoose = require("mongoose");

const inventoryScheme = new mongoose.Schema({
    inventoryType: {
        type: String,
        required: [true, 'Inventory type required'],
        enum: ['In', 'Out']
    },
    bloodGroup: {
        type: String,
        required: [true, 'Blood group is required'],
        enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"]
    },
    email: {
        type: String,
        required: [true, "Donar email is required"]
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'Organization is required']
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: function () {
            return this.inventoryType === "Out"
        }
    },
    donar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: function () {
            return this.inventoryType === "In"
        }
    },
}, { timestamps: true })

module.exports = mongoose.model('Inventory', inventoryScheme)