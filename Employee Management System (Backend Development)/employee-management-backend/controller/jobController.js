const Joi = require("joi");
const Job = require("../models/job");
const Department = require("../models/Department");

const jobValidationSchema = Joi.object({
    title: Joi.string().trim().min(2).max(100).required(),
    department: Joi.string().required(),
    description: Joi.string().trim().min(10).max(2000).required(),
    location: Joi.string().trim().max(100).default("Remote"),
    employmentType: Joi.string()
        .valid("Full Time", "Part Time", "Contract", "Internship")
        .default("Full Time"),
    experience: Joi.string().trim().max(50).default("0-2 years"),
    salaryRange: Joi.object({
        min: Joi.number().min(0).required(),
        max: Joi.number().min(Joi.ref("min")).required()
    }).required(),
    requirements: Joi.array().items(Joi.string().trim()).default([]),
    responsibilities: Joi.array().items(Joi.string().trim()).default([]),
    status: Joi.string().valid("Open", "Closed", "Draft").default("Open"),
    applicationDeadline: Joi.date().allow(null).optional(),
    isActive: Joi.boolean().default(true)
});

const createJob = async (req, res, next) => {
    try {
        const { error } = jobValidationSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const departmentExists = await Department.findById(req.body.department);
        if (!departmentExists) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        const job = await Job.create({
            ...req.body,
            postedBy: req.user.id
        });

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });
    } catch (err) {
        next(err);
    }
};

const getJobs = async (req, res, next) => {
    try {
        const { status, department, isActive } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (department) filter.department = department;
        if (isActive !== undefined) filter.isActive = isActive === "true";

        const jobs = await Job.find(filter)
            .populate("department", "name")
            .populate("postedBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });
    } catch (err) {
        next(err);
    }
};

const getJobById = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("department", "name")
            .populate("postedBy", "name email");

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            job
        });
    } catch (err) {
        next(err);
    }
};

const updateJob = async (req, res, next) => {
    try {
        const { error } = jobValidationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        if (req.body.department) {
            const departmentExists = await Department.findById(req.body.department);
            if (!departmentExists) {
                return res.status(404).json({
                    success: false,
                    message: "Department not found"
                });
            }
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        ).populate("department", "name").populate("postedBy", "name email");

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job: updatedJob
        });
    } catch (err) {
        next(err);
    }
};

const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

const closeJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        job.status = "Closed";
        job.isActive = false;

        await job.save();

        return res.status(200).json({
            success: true,
            message: "Job closed successfully",
            job
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    closeJob
};
