const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
            index: true
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
        basicSalary: {
            type: Number,
            required: true,
            min: 0
        },
        allowances: {
            type: Number,
            default: 0,
            min: 0
        },
        deductions: {
            type: Number,
            default: 0,
            min: 0
        },
        grossSalary: {
            type: Number,
            required: true,
            min: 0
        },
        netSalary: {
            type: Number,
            required: true,
            min: 0
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Approved", "Paid"],
            default: "Pending"
        },
        notes: {
            type: String,
            default: "",
            trim: true
        },
        paidAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

salarySchema.index(
    { employee: 1, month: 1, year: 1 },
    { unique: true }
);

module.exports = mongoose.model("Salary", salarySchema);
