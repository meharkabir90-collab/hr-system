const express = require("express");
const router = express.Router();

const {
    getPayrollSummary,
    getMyPayroll,
    generatePayroll,
    updatePayrollStatus
} = require("../controller/payrollController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/summary", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin", "Manager"), getPayrollSummary);
router.get("/me", authMiddleware, adminMiddleware("Employee", "Manager", "HRAdmin", "SuperAdmin"), getMyPayroll);
router.post("/generate", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), generatePayroll);
router.patch("/:id/status", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), updatePayrollStatus);

module.exports = router;
