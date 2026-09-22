const Joi = require("joi");
const Job = require("../models/job");
const JobApplication = require("../models/jobApplication");

const applicationSchema = Joi.object({
  job: Joi.string().required(),
  applicantName: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().min(7).max(20).required(),
  experience: Joi.string().trim().max(50).default("0-2 years"),
  resume: Joi.string().uri().allow("").optional(),
  coverLetter: Joi.string().trim().max(4000).allow(""),
  portfolio: Joi.string().uri().allow("").optional(),
});

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({
      $or: [
        { candidate: req.candidate._id },
        {
          $or: [
            { candidate: { $exists: false } },
            { candidate: null },
          ],
          email: req.candidate.email.trim().toLowerCase(),
        },
      ],
    })
      .populate("job", "title department location employmentType")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    next(err);
  }
};

const submitApplication = async (req, res, next) => {
  try {
    const { error } = applicationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const jobExists = await Job.findById(req.body.job);
    if (!jobExists) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    const duplicateApplication = await JobApplication.findOne({
      job: req.body.job,
      candidate: req.candidate._id,
    });

    if (duplicateApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job"
      });
    }

    const application = await JobApplication.create({
      ...req.body,
      candidate: req.candidate._id,
      applicantName: req.candidate?.name || req.body.applicantName,
      email: req.candidate?.email || req.body.email,
      status: "Applied"
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application
    });
  } catch (err) {
    next(err);
  }
};

const getApplicationsByJob = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({ job: req.params.jobId })
      .populate("job", "title department")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (err) {
    next(err);
  }
};

const getAllApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find()
      .populate("job", "title department")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (err) {
    next(err);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Applied", "Reviewed", "Shortlisted", "Rejected", "Interviewed", "Selected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status"
      });
    }

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("job", "title department");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application status updated",
      application
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitApplication,
  getMyApplications,
  getApplicationsByJob,
  getAllApplications,
  updateApplicationStatus
};
