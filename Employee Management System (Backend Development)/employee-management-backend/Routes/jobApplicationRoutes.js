const express = require("express");
const router = express.Router();

const {
  submitApplication,
  getMyApplications,
  getApplicationsByJob,
  getAllApplications,
  updateApplicationStatus
} = require("../controller/jobApplicationController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const candidateMiddleware = require("../middleware/candidateMiddleware");

router.post("/apply", candidateMiddleware, submitApplication);
router.get("/my-applications", candidateMiddleware, getMyApplications);
router.get("/job/:jobId", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), getApplicationsByJob);
router.get("/all", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), getAllApplications);
router.patch("/:id/status", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), updateApplicationStatus);

module.exports = router;
