const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
     },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        salary: {
            type: Number,
            required: true
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true
        }
    },
    {
        timestamps: true
    }
);



module.exports = mongoose.model("Employee", employeeSchema);