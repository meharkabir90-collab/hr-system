const mongoose = require("mongoose");

const allowanceDeductionSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
            index: true
        },
        payroll: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payroll",
            default: null
        },
        type: {
            type: String,
            enum: ["Allowance", "Deduction"],
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        description: {
            type: String,
            default: "",
            trim: true
        },
        month: {
            type: String,
            required: true,
            trim: true
        },
        year: {
            type: Number,
            required: true,
            min: 2000
        },
        isApproved: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("AllowanceDeduction", allowanceDeductionSchema);
