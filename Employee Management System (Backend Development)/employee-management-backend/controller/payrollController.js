const Employee = require("../models/Employee");
const Salary = require("../models/salaryModel");
const Payroll = require("../models/payrollModel");

const getMonthName = (date = new Date()) =>
    date.toLocaleString("en-US", { month: "long" });

const getCurrentYear = () => new Date().getFullYear();

const buildSalarySnapshot = (employee, salaryRecord = null, payrollRecord = null) => {
    const basicSalary = Number(salaryRecord?.basicSalary ?? employee?.salary ?? 0);
    const allowance = Number(salaryRecord?.allowances ?? basicSalary * 0.1);
    const deduction = Number(salaryRecord?.deductions ?? basicSalary * 0.05);
    const grossSalary = Number(salaryRecord?.grossSalary ?? basicSalary + allowance);
    const netSalary = Number(salaryRecord?.netSalary ?? grossSalary - deduction);

    const payrollId = payrollRecord?._id || salaryRecord?._id || employee?._id;

    return {
        _id: payrollId,
        payrollId,
        employeeId: employee?._id,
        employee: employee?._id,
        name: employee?.name,
        department: employee?.department?.name || "N/A",
        salary: basicSalary,
        allowance,
        deduction,
        grossSalary,
        netSalary,
        paymentStatus: payrollRecord?.paymentStatus || salaryRecord?.paymentStatus || "Pending",
        month: salaryRecord?.month || payrollRecord?.month || getMonthName(),
        year: salaryRecord?.year || payrollRecord?.year || getCurrentYear(),
        createdAt: salaryRecord?.createdAt || payrollRecord?.createdAt || null,
        updatedAt: salaryRecord?.updatedAt || payrollRecord?.updatedAt || null
    };
};

const getPayrollSummary = async (req, res) => {
    try {
        const { month, year } = req.query;
        const filters = {};

        if (month) filters.month = month;
        if (year) filters.year = Number(year);

        const employees = await Employee.find({})
            .populate("department", "name")
            .select("_id name department salary");

        const salaryRecords = await Salary.find(filters)
            .select("employee basicSalary allowances deductions grossSalary netSalary paymentStatus month year createdAt updatedAt")
            .lean();

        const payrollRecords = await Payroll.find(filters)
            .select("employee paymentStatus month year grossSalary totalAllowance totalDeduction netSalary createdAt updatedAt")
            .lean();

        const salaryByEmployee = new Map();
        salaryRecords.forEach((record) => {
            salaryByEmployee.set(String(record.employee), record);
        });

        const payrollByEmployee = new Map();
        payrollRecords.forEach((record) => {
            payrollByEmployee.set(String(record.employee), record);
        });

        const payroll = employees.map((employee) => {
            const salaryRecord = salaryByEmployee.get(String(employee._id));
            const payrollRecord = payrollByEmployee.get(String(employee._id));
            return buildSalarySnapshot(employee, salaryRecord, payrollRecord);
        });

        return res.status(200).json({
            success: true,
            count: payroll.length,
            payroll
        });
    } catch (error) {
        console.error("Get payroll summary error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getMyPayroll = async (req, res) => {
    try {
        const employee = await Employee.findOne({ user: req.user.id })
            .populate("department", "name");

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee record not found"
            });
        }

        const { month, year } = req.query;
        const salaryFilter = { employee: employee._id };
        const payrollFilter = { employee: employee._id };

        if (month) {
            salaryFilter.month = month;
            payrollFilter.month = month;
        }

        if (year) {
            salaryFilter.year = Number(year);
            payrollFilter.year = Number(year);
        }

        const salaryRecord = await Salary.findOne(salaryFilter).sort({ createdAt: -1 }).lean();
        const payrollRecord = await Payroll.findOne(payrollFilter).sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            success: true,
            payroll: buildSalarySnapshot(employee, salaryRecord, payrollRecord)
        });
    } catch (error) {
        console.error("Get my payroll error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const generatePayroll = async (req, res) => {
    try {
        const { employeeId, month, year } = req.body;

        const isAdmin = ["SuperAdmin", "HRAdmin"].includes(req.user.role);
        const isSelf = ["Employee", "Manager"].includes(req.user.role);
        const selectedMonth = month || getMonthName();
        const selectedYear = Number(year || getCurrentYear());

        if (!employeeId && !isAdmin && !isSelf) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        if (!employeeId && isAdmin) {
            const employees = await Employee.find({}).populate("department", "name");

            const generated = [];

            for (const employee of employees) {
                const basicSalary = Number(employee.salary || 0);
                const allowances = Number((basicSalary * 0.1).toFixed(2));
                const deductions = Number((basicSalary * 0.05).toFixed(2));
                const grossSalary = Number((basicSalary + allowances).toFixed(2));
                const netSalary = Number((grossSalary - deductions).toFixed(2));

                const salaryRecord = await Salary.findOneAndUpdate(
                    { employee: employee._id, month: selectedMonth, year: selectedYear },
                    {
                        employee: employee._id,
                        month: selectedMonth,
                        year: selectedYear,
                        basicSalary,
                        allowances,
                        deductions,
                        grossSalary,
                        netSalary,
                        paymentStatus: "Pending"
                    },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );

                const payrollRecord = await Payroll.findOneAndUpdate(
                    { employee: employee._id, month: selectedMonth, year: selectedYear },
                    {
                        employee: employee._id,
                        month: selectedMonth,
                        year: selectedYear,
                        grossSalary,
                        totalAllowance: allowances,
                        totalDeduction: deductions,
                        netSalary,
                        paymentStatus: "Pending",
                        generatedBy: req.user.id
                    },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );

                generated.push(buildSalarySnapshot(employee, salaryRecord, payrollRecord));
            }

            return res.status(201).json({
                success: true,
                message: "Payroll generated successfully for all employees",
                payroll: generated,
                count: generated.length
            });
        }

        let employee;

        if (employeeId) {
            if (!isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to generate payroll for another employee"
                });
            }
            employee = await Employee.findById(employeeId).populate("department", "name");
        } else {
            employee = await Employee.findOne({ user: req.user.id }).populate("department", "name");
        }

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee record not found"
            });
        }

        const basicSalary = Number(employee.salary || 0);
        const allowances = Number((basicSalary * 0.1).toFixed(2));
        const deductions = Number((basicSalary * 0.05).toFixed(2));
        const grossSalary = Number((basicSalary + allowances).toFixed(2));
        const netSalary = Number((grossSalary - deductions).toFixed(2));

        const salaryRecord = await Salary.findOneAndUpdate(
            { employee: employee._id, month: selectedMonth, year: selectedYear },
            {
                employee: employee._id,
                month: selectedMonth,
                year: selectedYear,
                basicSalary,
                allowances,
                deductions,
                grossSalary,
                netSalary,
                paymentStatus: "Pending"
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        const payrollRecord = await Payroll.findOneAndUpdate(
            { employee: employee._id, month: selectedMonth, year: selectedYear },
            {
                employee: employee._id,
                month: selectedMonth,
                year: selectedYear,
                grossSalary,
                totalAllowance: allowances,
                totalDeduction: deductions,
                netSalary,
                paymentStatus: "Pending",
                generatedBy: req.user.id
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return res.status(201).json({
            success: true,
            message: "Payroll generated successfully",
            payroll: buildSalarySnapshot(employee, salaryRecord, payrollRecord),
            salaryRecord,
            payrollRecord
        });
    } catch (error) {
        console.error("Generate payroll error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const updatePayrollStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["Pending", "Approved", "Paid"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be Pending, Approved or Paid"
            });
        }

        const payrollRecord = await Payroll.findById(id);

        if (!payrollRecord) {
            return res.status(404).json({
                success: false,
                message: "Payroll record not found"
            });
        }

        payrollRecord.paymentStatus = status;

        if (status === "Paid") {
            payrollRecord.paidAt = new Date();
        } else if (status !== "Paid") {
            payrollRecord.paidAt = null;
        }

        await payrollRecord.save();

        await Salary.findOneAndUpdate(
            { employee: payrollRecord.employee, month: payrollRecord.month, year: payrollRecord.year },
            { paymentStatus: status, paidAt: payrollRecord.paidAt }
        );

        const employee = await Employee.findById(payrollRecord.employee).populate("department", "name");
        const salaryRecord = await Salary.findOne({
            employee: payrollRecord.employee,
            month: payrollRecord.month,
            year: payrollRecord.year
        }).lean();

        return res.status(200).json({
            success: true,
            message: "Payroll status updated",
            payroll: buildSalarySnapshot(employee, salaryRecord, payrollRecord)
        });
    } catch (error) {
        console.error("Update payroll status error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getPayrollSummary,
    getMyPayroll,
    generatePayroll,
    updatePayrollStatus
};
