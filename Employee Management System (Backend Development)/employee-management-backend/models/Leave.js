const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        leaveType: {
            type: String,
            enum: [
                "Annual",
                "Sick",
                "Casual",
                "Maternity",
                "Paternity",
                "Unpaid",
                "Emergency"
            ],
            required: true
        },

        startDate: {
            type: Date,
            required: true
        },

        endDate: {
            type: Date,
            required: true
        },

        totalDays: {
            type: Number,
            required: true
        },

        reason: {
            type: String,
            trim: true,
            required: true
        },

        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected", "Cancelled"],
            default: "Pending"
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        approvedAt: {
            type: Date,
            default: null
        },

        rejectionReason: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true,
        collection: "HR-Leaves"
    }
);

module.exports = mongoose.model("Leave", leaveSchema);