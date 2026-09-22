const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");

// =====================================================
// EMPLOYEE: CHECK IN
// =====================================================
const checkIn = async (req, res) => {
    try {
        const employeeId = req.user.id;

        // Start of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // End of today
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Check if already checked in today
        const existingAttendance = await Attendance.findOne({
            employee: employeeId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                message: "You have already checked in today"
            });
        }

        const now = new Date();

        // 9:15 AM allowed start time
        const lateTime = new Date();
        lateTime.setHours(9, 15, 0, 0);

        const status = now > lateTime
            ? "Late"
            : "Present";

        const attendance = await Attendance.create({
             employee: employeeId,
            date: now.toISOString(),
            checkIn: now,
           Status: status
        });

        return res.status(201).json({
            success: true,
            message: "Check-in successful",
            attendance
        });

    } catch (error) {
        console.error("Check-in error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =====================================================
// EMPLOYEE: CHECK OUT
// =====================================================
const checkOut = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const attendance = await Attendance.findOne({
            employee: employeeId,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "No attendance record found for today"
            });
        }

        if (!attendance.checkIn) {
            return res.status(400).json({
                success: false,
                message: "You have not checked in yet"
            });
        }

        if (attendance.checkOut) {
            return res.status(400).json({
                success: false,
                message: "You have already checked out"
            });
        }

        const now = new Date();

        // Calculate working hours
        const difference = now - attendance.checkIn;

        const workingHours =
            difference / (1000 * 60 * 60);

        attendance.checkOut = now;

        // Use the field name from your existing schema
        attendance.WorkingHours =
            Number(workingHours.toFixed(2));

        await attendance.save();

        return res.status(200).json({
            success: true,
            message: "Check-out successful",
            attendance
        });

    } catch (error) {
        console.error("Check-out error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =====================================================
// EMPLOYEE: GET MY ATTENDANCE
// =====================================================
const getMyAttendance = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const attendance = await Attendance.find({
            employee: employeeId
        })
            .sort({ date: -1 })
            .populate("employee", "name email");

        return res.status(200).json({
            success: true,
            attendance
        });

    } catch (error) {
        console.error("Get my attendance error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =====================================================
// MANAGER: GET TEAM ATTENDANCE
// =====================================================
const getTeamAttendance = async (req, res) => {
    try {

        // ---------------------------------------------
        // 1. Find manager's Employee profile
        // ---------------------------------------------
        const manager = await Employee.findOne({
            user: req.user.id
        });

        if (!manager) {
            return res.status(404).json({
                success: false,
                message: "Manager profile not found"
            });
        }


        // ---------------------------------------------
        // 2. Check manager department
        // ---------------------------------------------
        if (!manager.department) {
            return res.status(400).json({
                success: false,
                message: "Manager is not assigned to a department"
            });
        }


        // ---------------------------------------------
        // 3. Find employees in manager's department
        // ---------------------------------------------
        const teamEmployees = await Employee.find({
            department: manager.department,
            _id: {
                $ne: manager._id
            }
        })
            .select(
                "_id user name email phone position department"
            );


        // ---------------------------------------------
        // 4. IMPORTANT
        //
        // Attendance.employee stores USER ID
        // NOT Employee ID
        // ---------------------------------------------
        const userIds = teamEmployees.map(
            employee => employee.user
        );
        // ---------------------------------------------
        // 5. Get attendance using USER IDs
        // ---------------------------------------------
        const attendance = await Attendance.find({
            employee: {
                $in: userIds
            }
        })
            .sort({
                date: -1
            })
            .populate(
                "employee",
                "name email username"
            );
        // ---------------------------------------------
        // 6. Return response
        // ---------------------------------------------
        return res.status(200).json({
            success: true,
            count: attendance.length,
            attendance
        });

    } catch (error) {

        console.error(
            "Get team attendance error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =====================================================
// HR ADMIN / SUPER ADMIN: GET ALL ATTENDANCE
// =====================================================
const getAllAttendance = async (req, res) => {
    try {

        const attendance = await Attendance.find()
            .sort({
                date: -1
            })
            .populate(
                "employee",
                "name email department"
            );

        return res.status(200).json({
            success: true,
            attendance
        });

    } catch (error) {

        console.error(
            "Get all attendance error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =====================================================
// HR ADMIN: UPDATE ATTENDANCE
// =====================================================
const updateAttendance = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            checkIn,
            checkOut,
            status,
            notes
        } = req.body;


        // Find attendance
        const attendance =
            await Attendance.findById(id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance record not found"
            });
        }


        // Update check-in
        if (checkIn !== undefined) {
            attendance.checkIn = checkIn;
        }


        // Update check-out
        if (checkOut !== undefined) {
            attendance.checkOut = checkOut;
        }


        // Update status
        if (status !== undefined) {
            attendance.status = status;
        }


        // Update notes
        if (notes !== undefined) {
            attendance.notes = notes;
        }


        // Recalculate working hours
        if (
            attendance.checkIn &&
            attendance.checkOut
        ) {

            const difference =
                new Date(attendance.checkOut) -
                new Date(attendance.checkIn);


            attendance.WorkingHours =
                Number(
                    (
                        difference /
                        (1000 * 60 * 60)
                    ).toFixed(2)
                );
        }


        await attendance.save();


        return res.status(200).json({
            success: true,
            message: "Attendance updated successfully",
            attendance
        });

    } catch (error) {

        console.error(
            "Update attendance error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =====================================================
// EXPORTS
// =====================================================
module.exports = {
    checkIn,
    checkOut,
    getMyAttendance,
    getTeamAttendance,
    getAllAttendance,
    updateAttendance
};

