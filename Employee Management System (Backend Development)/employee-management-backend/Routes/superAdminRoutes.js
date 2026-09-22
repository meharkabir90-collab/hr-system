const express = require("express");

const { getEmployeePortalUsers, createHR
} = require("../controller/superAdminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
"/portal-users", authMiddleware, adminMiddleware("SuperAdmin", "HRAdmin"), getEmployeePortalUsers);

router.post(
	"/hr", authMiddleware, adminMiddleware("SuperAdmin"), createHR);

module.exports = router;