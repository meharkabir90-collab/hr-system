const express = require("express");
const router = express.Router();

const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    closeJob
} = require("../controller/jobController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), createJob);
router.get("/", authMiddleware, getJobs);
router.get("/:id", authMiddleware, getJobById);
router.put("/:id", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), updateJob);
router.patch("/:id/close", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), closeJob);
router.delete("/:id", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), deleteJob);

module.exports = router;
