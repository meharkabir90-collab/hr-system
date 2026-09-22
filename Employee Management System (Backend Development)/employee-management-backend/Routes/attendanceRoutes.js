const express = require("express");

const router = express.Router();

const {
    checkIn,
    checkOut,
    getMyAttendance,
    getTeamAttendance,
    getAllAttendance,
    updateAttendance
} = require("../controller/attendanceController");
const authMiddleware = require("../middleware/authMiddleware");
const  adminMiddleware   = require('../middleware/adminMiddleware');


// Employee
router.post("/check-in", authMiddleware, adminMiddleware("SuperAdmin", "Manager", "Employee"), checkIn);
router.put("/check-out", authMiddleware, adminMiddleware("SuperAdmin", "Manager", "Employee"), checkOut);
router.get("/my", authMiddleware, adminMiddleware("Manager", "Employee"), getMyAttendance);

// Manager
router.get("/team-attendance", authMiddleware, adminMiddleware("SuperAdmin", "Manager"), getTeamAttendance);

// HR Admin / Super Admin
router.get("/all", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), getAllAttendance);
router.put("/:id", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), updateAttendance);

module.exports = router;