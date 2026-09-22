const Leave = require("../models/Leave");
const Employee = require("../models/Employee");


// =====================================================
// EMPLOYEE / MANAGER
// APPLY FOR LEAVE
// =====================================================

const applyLeave = async (req, res) => {
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

    try {
        const employeeId = req.user.id;

        const {
            leaveType,
            startDate,
            endDate,
            reason
        } = req.body;

        if (!leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({
                success: false,
                message: "All leave fields are required"
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid leave dates"
            });
        }

        if (end < start) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date"
            });
        }

        const difference = end.getTime() - start.getTime();

        const totalDays =
            Math.ceil(
                difference / (1000 * 60 * 60 * 24)
            ) + 1;

        const leave = await Leave.create({
            employee: employeeId,
            leaveType,
            startDate: start,
            endDate: end,
            totalDays,
            reason,
            status: "Pending"
        });

        return res.status(201).json({
            success: true,
            message: "Leave application submitted",
            leave
        });

    } catch (error) {
        console.error("Apply leave error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================================
// EMPLOYEE / MANAGER
// GET MY LEAVES
// =====================================================

const getMyLeaves = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const leaves = await Leave.find({
            employee: employeeId
        })
        .sort({ createdAt: -1 })
        .populate("approvedBy", "name email");

        return res.status(200).json({
            success: true,
            count: leaves.length,
            leaves
        });

    } catch (error) {
        console.error("Get my leaves error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================================
// MANAGER / HR
// GET PENDING TEAM LEAVES
// =====================================================

const getPendingLeaves = async (req, res) => {
    try {

        // ==========================================
        // HR ADMIN / SUPER ADMIN
        // ==========================================

        if (req.user.role === "HRAdmin" || req.user.role === "SuperAdmin") {

            const leaves = await Leave.find({
                status: "Pending"
            })
                .sort({ createdAt: -1 })
                .populate("employee", "name email")
                .populate("approvedBy", "name email");

            return res.status(200).json({
                success: true,
                count: leaves.length,
                leaves
            });
        }


        // ==========================================
        // MANAGER
        // ==========================================

        if (req.user.role === "Manager") {

            const manager = await Employee.findOne({
                user: req.user.id
            });

            if (!manager) {
                return res.status(404).json({
                    success: false,
                    message: "Manager profile not found"
                });
            }

            if (!manager.department) {
                return res.status(400).json({
                    success: false,
                    message: "Manager is not assigned to a department"
                });
            }


            // Find employees in manager's department
            const teamEmployees = await Employee.find({
                department: manager.department,
                _id: { $ne: manager._id }
            }).select("user name email position");


            const teamUserIds = teamEmployees.map(
                employee => employee.user
            );


            // Find pending leaves
            const leaves = await Leave.find({
                employee: {
                    $in: teamUserIds
                },
                status: "Pending"
            })
                .sort({ createdAt: -1 })
                .populate("employee", "name email");


            return res.status(200).json({
                success: true,
                count: leaves.length,
                leaves
            });
        }


        // ==========================================
        // OTHER ROLES
        // ==========================================

        return res.status(403).json({
            success: false,
            message: "You are not authorized to view pending leaves"
        });

    } catch (error) {

        console.error("Get pending leaves error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================================
// MANAGER / HR
// APPROVE LEAVE
// =====================================================

const approveLeave = async (req, res) => {
    try {

        const { id } = req.params;
        const approverId = req.user.id;

        const leave = await Leave.findById(id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found"
            });
        }

        if (leave.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Leave request has already been processed"
            });
        }

        leave.status = "Approved";
        leave.approvedBy = approverId;
        leave.approvedAt = new Date();

        await leave.save();

        return res.status(200).json({
            success: true,
            message: "Leave approved successfully",
            leave
        });

    } catch (error) {

        console.error("Approve leave error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


// =====================================================
// MANAGER / HR
// REJECT LEAVE
// =====================================================

const rejectLeave = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            rejectionReason
        } = req.body;

        const approverId = req.user.id;

        const leave = await Leave.findById(id);

        if (!leave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found"
            });
        }

        if (leave.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Leave request has already been processed"
            });
        }

        leave.status = "Rejected";
        leave.approvedBy = approverId;
        leave.approvedAt = new Date();
        leave.rejectionReason =
            rejectionReason || "No reason provided";

        await leave.save();

        return res.status(200).json({
            success: true,
            message: "Leave rejected successfully",
            leave
        });

    } catch (error) {

        console.error("Reject leave error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


const getApprovedLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({
            status: "Approved"
        })
        .sort({ createdAt: -1 })
        .populate("employee", "name email")
        .populate("approvedBy", "name email");

        return res.status(200).json({
            success: true,
            leaves
        });

    } catch (error) {
        console.error("Get approved leaves error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


const getRejectedLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({
            status: "Rejected"
        })
        .sort({ createdAt: -1 })
        .populate("employee", "name email")
        .populate("approvedBy", "name email");

        return res.status(200).json({
            success: true,
            leaves
        });

    } catch (error) {
        console.error("Get rejected leaves error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};



// =====================================================
// EXPORT
// =====================================================

module.exports = {
    applyLeave,
    getMyLeaves,
    getPendingLeaves,
    approveLeave,
    rejectLeave,
    getApprovedLeaves, getRejectedLeaves,
};
