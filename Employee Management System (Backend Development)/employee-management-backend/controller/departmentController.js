const Joi = require("joi");
const Department = require("../models/Department");
const Employee = require("../models/Employee");



//Create 
const createDepartment = async (req, res, next) => {
    try {
        // Validate request
        const schema = Joi.object({
            name: Joi.string().min(2).max(50).required(),
            description: Joi.string().max(200).allow("")
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { name, description } = req.body;

        // Check if department already exists
        const departmentExists = await Department.findOne({ name });

        if (departmentExists) {
            return next({
                status: 409,
                message: "Department already exists"
            });
        }

        // Create department
        const department = await Department.create({
            name,
            description
        });

        return res.status(201).json({
            success: true,
            message: "Department created successfully",
            department
        });

    } catch (err) {
        next(err);
    }
};


//Read
const getDepartments = async (req, res, next) => {
    try {

        const departments = await Department.find()
         .populate("manager", "name email");

        return res.status(200).json({
            success: true,
            departments
        });

    } catch (err) {
        next(err);
    }
};



//read by ID
const getDepartmentById = async (req, res, next) => {
       
    try {

        const department = await Department.findById(req.params.id)
        .populate("manager", "name email");

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        return res.status(200).json({
            success: true,
            department
        });

    } catch (err) {
        next(err);
    }
};

const assignManager = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    department.manager = employee._id;

    await department.save();

    res.status(200).json({
      success: true,
      message: "Manager assigned successfully",
      department
    });

  } catch (error) {
    next(error);
  }
};

 


//Update
const updateDepartment = async (req, res, next) => {
    try {

        const department = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Department updated successfully",
            department
        });

    } catch (err) {
        next(err);
    }
};




//Delete
const deleteDepartment = async (req, res, next) => {
    try {

        const department = await Department.findByIdAndDelete(req.params.id);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Department deleted successfully"
        });

    } catch (err) {
        next(err);
    }
};


module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentById,
    assignManager,
    updateDepartment,
    deleteDepartment
};