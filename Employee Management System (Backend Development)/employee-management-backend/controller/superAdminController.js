const User = require('../models/User');
const Employee = require('../models/Employee');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const createHR = async (req, res, next) => {
    try {
        const schema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required()
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { username, name, email, password } = req.body;
        const [emailInUse, usernameInUse] = await Promise.all([
            User.exists({ email }),
            User.exists({ username })
        ]);

        if (emailInUse) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        if (usernameInUse) {
            return res.status(409).json({ success: false, message: 'Username not available' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            name,
            email,
            password: hashedPassword,
            role: 'HRAdmin'
        });

        return res.status(201).json({
            success: true,
            message: 'HR account created successfully',
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

const getEmployeePortalUsers = async (req, res) => {
    try {
        const users = await User.find({
            role: {
                $in: ["Employee", "Manager", "HRAdmin"]
            }
        }).select("_id name username email role");

        const employeeUsers = users.filter(
            user => user.role === "Employee"
        );

        const managers = users.filter(
            user => user.role === "Manager"
        );

        const hr = users.filter(
            user => user.role === "HRAdmin"
        );

        // Get Employee documents for Employee users
        const employees = await Employee.find({
            user: {
                $in: employeeUsers.map(user => user._id)
            }
        })
            .populate("user", "name username email role")
            .populate("department", "name");

        return res.status(200).json({
            success: true,
            employees,
            managers,
            hr
        });

    } catch (error) {
        console.error("❌ Get portal users error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getEmployeePortalUsers,
    createHR
};
