const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require('../models/User')
const Employee = require('../models/Employee');
const Department = require("../models/Department");
const bcrypt = require("bcryptjs");

const startEmployeeView = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the employee selected by SuperAdmin
        const employee = await Employee.findById(id).populate("user");

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        // Make sure employee has a User account
        if (!employee.user) {
            return res.status(404).json({
                success: false,
                message: "Employee user account not found"
            });
        }

        if (employee.user.role !== "Employee") {
            return res.status(400).json({
                success: false,
                message: "Selected user is not an employee"
            });
        }

        // Create temporary token for this employee
        const employeeToken = jwt.sign(
            {
                id: employee.user._id,
                role: "Employee",

                // Keep track of who started the employee view
                impersonatedBy: req.user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Employee portal access granted",
            token: employeeToken
        });

    } catch (error) {
        console.error("START EMPLOYEE VIEW ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const startManagerView = async (req, res) => {
    try {
        const { id } = req.params;

        const manager = await User.findById(id);

        if (!manager) {
            return res.status(404).json({
                success: false,
                message: "Manager not found"
            });
        }

        if (manager.role !== "Manager") {
            return res.status(400).json({
                success: false,
                message: "Selected user is not a manager"
            });
        }

        const managerToken = jwt.sign(
            {
                id: manager._id,
                role: "Manager",
                impersonatedBy: req.user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Manager portal access granted",
            token: managerToken
        });
    } catch (error) {
        console.error("START MANAGER VIEW ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const startHRView = async (req, res) => {
    try {
        const { id } = req.params;

        const hrUser = await User.findById(id);

        if (!hrUser) {
            return res.status(404).json({
                success: false,
                message: "HR user not found"
            });
        }

        if (hrUser.role !== "HRAdmin") {
            return res.status(400).json({
                success: false,
                message: "Selected user is not an HR admin"
            });
        }

        const hrToken = jwt.sign(
            {
                id: hrUser._id,
                role: "HRAdmin",
                impersonatedBy: req.user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        return res.status(200).json({
            success: true,
            message: "HR portal access granted",
            token: hrToken
        });
    } catch (error) {
        console.error("START HR VIEW ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create Employee

const createEmployee = async (req, res) => {
    try {
        const {
            username,
            name,
            email,
            phone,
            position,
            salary,
            department,
            password
        } = req.body;

        // Validate required employee fields
        if (
            !name ||
            !email ||
            !phone ||
            !position ||
            !salary ||
            !department
        ) {
            return res.status(400).json({
                success: false,
                message: "All employee fields are required"
            });
        }

        // Check if Employee profile already exists
        const existingEmployee = await Employee.findOne({ email });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: "Employee profile already exists for this email"
            });
        }

        // Check if User already exists
        let user = await User.findOne({ email });

        // ==========================================
        // CASE 1: USER ALREADY EXISTS
        // ==========================================
        if (user) {

            // Existing Employee or Manager can be
            // connected to an HR Employee profile
            if (user.role !== "Employee" && user.role !== "Manager") {
                return res.status(400).json({
                    success: false,
                    message: `This email belongs to a ${user.role} account and cannot be used here`
                });
            }

            console.log("Existing User Found:", user._id);
            console.log("Existing User Role:", user.role);
        }

        // ==========================================
        // CASE 2: USER DOES NOT EXIST
        // ==========================================
        else {

            // Password required only for a new account
            if (!password) {
                return res.status(400).json({
                    success: false,
                    message: "Password is required for a new employee account"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            user = await User.create({
                username,
                name,
                email,
                password: hashedPassword,
                role: "Employee"
            });

            console.log("New Employee User Created:", user._id);
        }

        // ==========================================
        // CREATE EMPLOYEE PROFILE
        // ==========================================

        const employee = await Employee.create({
            user: user._id,
            name,
            email,
            phone,
            position,
            salary,
            department
        });

        console.log("Employee Profile Created:", employee._id);

        return res.status(201).json({
            success: true,
            message: "Employee profile created successfully",
            employee
        });

    } catch (error) {

        console.error("Create employee error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};





// Get All Employees
// Search + Filter

const getEmployees = async (req, res, next) => {
       


    try {
          console.log("Query Params:", req.query);
        const { search, department } = req.query;
           console.log("Search:", search);
        console.log("Department:", department);

        

        let query = {};

        // Search by Name OR Email
        if (search) {
            query.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        // Filter by Department
        if (department) {
            query.department = department;
        }
        console.log("Mongo Query:", query);

        const employees = await Employee.find(query)
            .populate("department", "name")
            .populate("user", "_id username name email role")
            .sort({ createdAt: -1 });

         

        return res.status(200).json({
            success: true,
            totalEmployees: employees.length,
            employees
        });

    } catch (err) {
        next(err);
    }
};


const getEmployeeById = async (req, res, next) => {
    try {

        const employee = await Employee.findById(req.params.id)
            .populate("department", "name")
            .populate("user", "username name email role");

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }
        

        return res.status(200).json({
            success: true,
            employee
        });

    } catch (err) {
        next(err);
    }
};


//Update
const updateEmployee = async (req, res, next) => {
    try {

        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            employee
        });

    } catch (err) {
        next(err);
    }
};


//Delete
const deleteEmployee = async (req, res, next) => {
    try {

        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });

    } catch (err) {
        next(err);
    }
};

//myprofile
const myProfile = async (req, res, next) => {
    try {
        const employee = await Employee.findOne({
            user: req.user.id
        })
            .populate({
                path: "department",
                select: "name manager",
                populate: {
                    path: "manager",
                    select: "name email"
                }
            })
            .populate("user", "username name email role");

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            employee
        });

    } catch (err) {
        next(err);
    }
};


const getManagerDashboard = async (req, res, next) => {
    try {
        // Find logged-in manager's employee profile
        const manager = await Employee.findOne({
            user: req.user.id
        }).populate({
            path: "department",
            select: "name manager",
            populate: {
                path: "manager",
                select: "name email position"
            }
        });

        if (!manager) {
            return res.status(404).json({
                success: false,
                message: "Manager profile not found"
            });
        }

        // Get employees from manager's department
        const employees = await Employee.find({
            department: manager.department._id,
            _id: { $ne: manager._id }
        }).select("name email phone position");

        return res.status(200).json({
            success: true,
            manager: {
                name: manager.name,
                position: manager.position
            },
            department: manager.department,
            employees
        });

    } catch (err) {
        next(err);
    }
};

 module.exports = {  startEmployeeView, startManagerView, startHRView, createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee,
    myProfile, getManagerDashboard
   };