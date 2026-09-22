const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
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
        grossSalary: {
            type: Number,
            required: true,
            min: 0
        },
        totalAllowance: {
            type: Number,
            default: 0,
            min: 0
        },
        totalDeduction: {
            type: Number,
            default: 0,
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
        paidAt: {
            type: Date,
            default: null
        },
        generatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        notes: {
            type: String,
            default: "",
            trim: true
        }
    },
    {
        timestamps: true
    }
);

payrollSchema.index(
    { employee: 1, month: 1, year: 1 },
    { unique: true }
);

module.exports = mongoose.model("Payroll", payrollSchema);
