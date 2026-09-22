const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            default: "Remote",
            trim: true
        },
        employmentType: {
            type: String,
            enum: ["Full Time", "Part Time", "Contract", "Internship"],
            default: "Full Time"
        },
        experience: {
            type: String,
            default: "0-2 years"
        },
        salaryRange: {
            min: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 0
            }
        },
        requirements: [{
            type: String,
            trim: true
        }],
        responsibilities: [{
            type: String,
            trim: true
        }],
        status: {
            type: String,
            enum: ["Open", "Closed", "Draft"],
            default: "Open"
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        applicationDeadline: {
            type: Date,
            default: null
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);
