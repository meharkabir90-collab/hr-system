const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        checkIn: {
            type: Date
        },

        checkOut: {
            type: Date
        },

        Status: {
            type: String,
            enum: [
                "Present",
                "Absent",
                "On Leave",
                "Half Day",
                "Late"
            ],
            default: "Present",
            required: true
        },

        WorkingHours: {
            type: Number,
            default: 0
        },

        notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true,
        collection: "HR-Attendance"
    }
);

module.exports = mongoose.model(
    "Attendance",
    attendanceSchema
);

