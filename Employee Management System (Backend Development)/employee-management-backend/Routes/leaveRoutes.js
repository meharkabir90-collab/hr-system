const express = require("express");

const {
     applyLeave,
     getMyLeaves,
     getPendingLeaves,
     approveLeave,
     rejectLeave,
     getApprovedLeaves,
     getRejectedLeaves,
} = require("../controller/leaveController");

const authMiddleware = require("../middleware/authMiddleware");
const  adminMiddleware   = require('../middleware/adminMiddleware');
const router = express.Router();


// Employee
router.post("/apply", authMiddleware, adminMiddleware("Employee", "Manager"), applyLeave);

router.get("/my", authMiddleware, adminMiddleware("Employee", "Manager"), getMyLeaves);


// Manager / HR
router.get("/pending", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin",  "Manager"), getPendingLeaves);

router.patch("/:id/approve", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin",  "Manager"), approveLeave);

router.patch("/:id/reject", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin","Manager"), rejectLeave);

router.get("/approved", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin", "Manager"),
    getApprovedLeaves
);

router.get( "/rejected", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin", "Manager"),
    getRejectedLeaves
);


module.exports = router;