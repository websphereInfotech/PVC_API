const { forgotPasswordMail } = require("../util/smtp-mails");
const Employee = require("../models/employee");
const { Sequelize, Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Shift = require("../models/shift");
const Leave = require("../models/leave");
const EmployeeSalary = require("../models/employeeSalary");
const moment = require("moment");
const EmployeeOvertime = require("../models/employeeOvertime");
const sequelize = require("../config");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

/** POST: Create a new employee. */
exports.create_employee = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, address, dob, panNumber, aadharNumber, shiftId, role, salaryPerDay, hireDate, sickLeaves, casualLeaves } = req.body;

        // TODO: lastName, role and panCard non-required.
        if(!firstName || !email || !shiftId || !salaryPerDay || !hireDate) {
            return res.status(400).json({
                status: "false",
                message: "Please provide all required fields: firstName, email, shiftId, salaryPerDay, hireDate"
            });
        }

        const employeeExists =  await Employee.findOne({
            where: {
                email,
                isActive: true
            }
        });
        if(employeeExists){
            return res.status(400).json({
                status: "false",
                message: "Employee already exists"
            });
        }

        const hashedPassword = await bcrypt.hash("Test@123", 10);

        const employee = await Employee.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            address,
            dob,
            panNumber,
            aadharNumber,
            shiftId,
            role,
            salaryPerDay,
            hireDate,
            sickLeaves,
            casualLeaves
        });
        if(!employee) {
            return res.status(400).json({
                status: "false",
                message: "Unable to create Employee"
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Employee created successfully",
            data: employee
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** PUT: Update an existing employee. */
exports.update_employee = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phoneNumber, address, dob, panNumber, aadharNumber, shiftId, role, salaryPerDay, hireDate, sickLeaves, casualLeaves } = req.body;

        const employee = await Employee.findByPk(id);
        if(!employee) {
            return res.status(404).json({ 
                status: "false", 
                message: "Employee not found" 
            });
        }

        const emailExists = await Employee.findOne({
            where: {
                email,
                isActive: true,
                id: { [Sequelize.Op.ne]: id }
            }
        });
        if(emailExists) {
            return res.status(400).json({
                status: "false",
                message: "Email already exists for another employee"
            });
        }

        const updatedEmployee = await employee.update({
            firstName,
            lastName,
            email,
            phoneNumber,
            address,
            dob,
            panNumber,
            aadharNumber,
            shiftId,
            role,
            salaryPerDay,
            hireDate,
            sickLeaves, 
            casualLeaves
        });
        if(!updatedEmployee) {
            return res.status(400).json({
                status: "false",
                message: "Unable to update Employee"
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Employee updated successfully",
            data: updatedEmployee
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get all employees. */
exports.get_all_employees = async (req, res) => {
    try {   
        const { search } = req.query;
        const whereClause = {};
        whereClause[Op.and] = [];
        whereClause[Op.and].push(Sequelize.literal(`isActive = true`));

        if (search) {
            whereClause[Op.or] = [];
            whereClause[Op.or].push(Sequelize.literal(`firstName like '%${search}%'`));
            whereClause[Op.or].push(Sequelize.literal(`lastName like '%${search}%'`));
            whereClause[Op.or].push(Sequelize.literal(`email like '%${search}%'`));
            whereClause[Op.or].push(Sequelize.literal(`phoneNumber like '%${search}%'`));
            whereClause[Op.or].push(Sequelize.literal(`address like '%${search}%'`));
            whereClause[Op.or].push(Sequelize.literal(`panNumber like '%${search}%'`));
            whereClause[Op.or].push(Sequelize.literal(`aadharNumber like '%${search}%'`));
            whereClause[Op.or].push(Sequelize.literal(`role like '%${search}%'`));
        }

        const employees = await Employee.findAll({
            where: whereClause,
            include: [
                {
                    model: Shift,
                    as: "shift"
                },
                {
                    model: Leave,
                    as: "leaves"
                }
            ] 
        });
        if(!employees.length) {
            return res.status(404).json({ 
                status: "false", 
                message: "No employees found",
                data:  employees
            });
        }

        return res.status(200).json({ 
            status: "true", 
            message: "Employees fetched successfully",
            data: employees 
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};  

/** GET: Get a single employee by id. */
exports.get_employee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findByPk(id, {
            include: {
                model: Shift,
                as: "shift"
            }
        });
        if(!employee) {
            return res.status(404).json({ 
                status: "false", 
                message: "Employee not found",
                data: employee
            });
        }

        return res.status(200).json({ 
            status: "true", 
            message: "Employee fetched successfully",
            data: employee 
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** DELETE: Delete an employee. */
exports.delete_employee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findByPk(id);
        if(!employee) {
            return res.status(404).json({ 
                status: "false", 
                message: "Employee not found",
                data: employee
            });
        }

        employee.isActive = false;
        await employee.save();
        return res.status(200).json({ 
            status: "true", 
            message: "Employee deleted successfully",
            data: employee
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** POST: Change employee's password. */
exports.change_password = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        const employee = await Employee.findByPk(id);
        if(!employee) {
            return res.status(404).json({
                status: "false",
                message: "Employee not found",
                data: employee
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, employee.password);
        if (!isMatch) {
            return res.status(400).json({ 
                status: "false", 
                message: "Old password is incorrent" 
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ 
                status: "false", 
                message: "New password and confirm password do not match" 
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await Employee.update({ 
            password: hashedPassword 
        }, { 
            where: { 
                id 
            } 
        });

        return res.status(200).json({ 
            status: "true", 
            message: "Password changed successfully" 
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** POST: Employee login into the system. */
exports.employee_login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const employee = await Employee.findOne({
            where: {
                email,
                isActive: true
            }
        });
        if(!employee) {
            return res.status(400).json({
                status: "false",
                message: "Employee not found"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, employee.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ 
                status: "false", 
                message: "Invalid password" 
            });
        }

        const token = jwt.sign(
            {
                employeeId: employee.id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                phoneNumber: employee.phoneNumber,
                role: employee.role,
            },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            status: "true",
            message: "Logged in successfully",
            data: {
                token,
                employee
            },
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** POST: Forgot password. */
exports.forgot_password = async (req, res) => {
    try {
        const { email } = req.body;

        const employee = await Employee.findOne({
            where: {
                email,
                isActive: true
            }
        });
        if(!employee) {
            return res.status(400).json({
                status: "false",
                message: "Employee not found"
            });
        }

        const newPassword = forgotPasswordMail(email);
        const hashedPassword = await bcrypt.hash(newPassword.toString(), 10);

        employee.password = hashedPassword;
        await employee.save();

        return res.status(200).json({
            status: "true",
            message: "New password sent to your email"
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET API: Get employee salary history. */
exports.get_employee_salary_history = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const employee = await Employee.findOne({
            where: {
                id: employeeId
            }
        });
        if(!employee) {
            return res.status(404).json({
                status: "false",
                message: "Employee not found"
            });
        }

        const employeeSalary = await EmployeeSalary.findAll({
            where: {
                employeeId
            }
        });
        if(!employeeSalary.length) {
            return res.status(404).json({
                status: "false",
                message: "No salary history found for employee",
                employeeSalary
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Employee salary history fetched successfully",
            data: employeeSalary    
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get employee's last month and yearly bonus. */
exports.get_employee_bonus = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const date = moment().subtract(1, 'months').format('YYYY-MM');
        console.log('date: ', date);

        const employee = await Employee.findOne({
            where: {
                id: employeeId
            }
        });
        if(!employee) {
            return res.status(404).json({
                status: "false",
                message: "Employee not found"
            });
        }

        const employeeSalary = await EmployeeSalary.findOne({
            where: {
                employeeId,
                month: date
            }
        });
        if(!employeeSalary) {
            return res.status(404).json({
                status: "false",
                message: "No bonus data found for employee",
                employeeSalary
            }); 
        }

        const bonus = {
            lastMonthBonus: employeeSalary.bonusAmount,
            yearlyBonus: employee.bonus
        };

        return res.status(200).json({
            status: "true",
            message: "Employee bonus fetched successfully",
            data: bonus
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

exports.create_dummy_data = async (req, res) => {
    try {
        const employeeOverTimes = [
            {
                employeeId: 2,
                date: "2025-02-05",
                overtimeHours: 2,
                amount: 200
            },
            {
                employeeId: 2,
                date: "2025-02-07",
                overtimeHours: 2,
                amount: 200
            },
            {
                employeeId: 2,
                date: "2025-02-08",
                overtimeHours: 3,
                amount: 300
            }
        ];

        const employeeSalaries = [
            {
                employeeId: 2,
                month: "2025-02",
                salary: 28_600,
                bonusAmount: 2000,
                overtimeAmount: 700,
                penaltyAmount: 0,
                overtimeHours: 7,
                numberOfWorkedDays: 26,
                numberOfLeaves: 0
            },
            {
                employeeId: 2,
                month: "2025-01",
                salary: 28_600,
                bonusAmount: 5000,
                overtimeAmount: 500,
                penaltyAmount: 300,
                overtimeHours: 5,
                numberOfWorkedDays: 26,
                numberOfLeaves: 2
            }
        ]

        await EmployeeOvertime.bulkCreate(employeeOverTimes);
        await EmployeeSalary.bulkCreate(employeeSalaries);

        return res.status(200).json({
            status: "true",
            message: "Dummy data created successfully"
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};