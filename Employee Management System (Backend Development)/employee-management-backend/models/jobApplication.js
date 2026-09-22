const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    applicantName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    experience: {
      type: String,
      default: "0-2 years"
    },
    resume: {
      type: String,
      default: ""
    },
    coverLetter: {
      type: String,
      default: ""
    },
    portfolio: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["Applied", "Reviewed", "Shortlisted", "Rejected", "Interviewed",
        "Selected"
      ],
      default: "Applied"
    },
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
