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
const fs = require("fs");
const path = require("path");
const Attendance = require("../models/attendance");
const Holiday = require("../models/holiday");
const tokenModel = require("../models/admintoken");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

/** POST: Create a new employee. */
exports.create_employee = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { firstName, lastName, email, phoneNumber, address, dob, panNumber, aadharNumber, shiftId, role, salaryPerDay, hireDate, emergencyLeaves, personalLeaves, referredBy } = req.body;

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
            companyId,
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
            emergencyLeaves,
            personalLeaves,
            referredBy
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
        const companyId = req.user.companyId;
        const { firstName, lastName, email, phoneNumber, address, dob, panNumber, aadharNumber, shiftId, role, salaryPerDay, hireDate, emergencyLeaves, personalLeaves, referredBy } = req.body;

        const employee = await Employee.findOne({
            where: {
                id,
                companyId,
                isActive: true
            }
        });
        if(!employee) {
            return res.status(404).json({ 
                status: "false", 
                message: "Employee not found" 
            });
        }

        const emailExists = await Employee.findOne({
            where: {
                companyId,
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
            companyId,
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
            emergencyLeaves, 
            personalLeaves,
            referredBy
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
        const companyId = req.user.companyId;
        const { search, bonusEligible } = req.query;
        const whereClause = { [Op.and]: [{ isActive: true }, { companyId }] };

        if (search) {
            whereClause[Op.or] = [
                { firstName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phoneNumber: { [Op.like]: `%${search}%` } },
                { address: { [Op.like]: `%${search}%` } },
                { panNumber: { [Op.like]: `%${search}%` } },
                { aadharNumber: { [Op.like]: `%${search}%` } },
                { role: { [Op.like]: `%${search}%` } },
            ];
        }

        const employees = await Employee.findAll({
            where: whereClause,
            include: [
                { model: Shift, as: "shift" },
                { model: Leave, as: "leaves" }
            ]
        });

        if (!employees.length) {
            return res.status(404).json({ 
                status: "false", 
                message: "No employees found",
                data: employees
            });
        }

        if (bonusEligible === 'true') {
            const bonusEligibleEmployees = employees.filter(employee => isJoiningDateGreaterThan6Months(employee.hireDate));
            if (!bonusEligibleEmployees.length) {
                return res.status(404).json({ 
                    status: "false", 
                    message: "No bonus eligible employees found",
                    data: bonusEligibleEmployees
                });
            }

            return res.status(200).json({ 
                status: "true", 
                message: "Employees fetched successfully",
                data: bonusEligibleEmployees 
            });
        }

        return res.status(200).json({ 
            status: "true", 
            message: "Employees fetched successfully",
            data: employees 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get a single employee by id. */
exports.get_employee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findOne({
            where: {
                id,
                isActive: true
            },
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
        const companyId = req.user.companyId;
        const { id } = req.params;

        const employee = await Employee.findOne({
            where: {
                id,
                companyId,
                isActive: true
            }
        });
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

        const employee = await Employee.findOne({
            where: {
                id,
                isActive: true
            }
        });
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
                companyId: employee.companyId,
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

        const existingToken = await tokenModel.findOne({
            where: { employeeId: employee.id },
          });
      
          if (existingToken) {
            await existingToken.update({ token });
          } else {
            await tokenModel.create({ employeeId: employee.id, token });
          }

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
        const { date } = req.query;

        const employee = await Employee.findOne({
            where: {
                id: employeeId,
                isActive: true
            }
        });
        if(!employee) {
            return res.status(404).json({
                status: "false",
                message: "Employee not found"
            });
        }

        const whereClause = {};
        whereClause[Op.and] = [];
        whereClause[Op.and].push(Sequelize.literal(`employeeId = ${employeeId}`));

        if(date) {
            whereClause[Op.and].push(Sequelize.literal(`month like '%${date}%'`));
        }

        const employeeSalary = await EmployeeSalary.findAll({
            where: whereClause
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
                id: employeeId,
                isActive: true
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

/** POST: Create dummy data for employee salary and overtimes. */
exports.create_dummy_data = async (req, res) => {
    try {
        const employeeOverTimes = [
            {
                employeeId: 3,
                date: "2025-02-05",
                overtimeHours: 2,
                amount: 200
            },
            {
                employeeId: 3,
                date: "2025-02-07",
                overtimeHours: 2,
                amount: 200
            },
            {
                employeeId: 3,
                date: "2025-02-08",
                overtimeHours: 3,
                amount: 300
            }
        ];

        const employeeSalaries = [
            {
                employeeId: 3,
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
                employeeId: 3,
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

/** POST: Save profile picture of an employee. */
exports.save_profile_picture = async (req, res) => {
    try {
        const { file } = req;
        const employeeId = req.params.employeeId;
        const { removeProfilePicture } = req.body;

        if(!file && !removeProfilePicture) {
            return res.status(400).json({ 
                status: "false", 
                message: "No file uploaded" 
            });
        }
        console.log('file: ', file);

        const employee = await Employee.findByPk(employeeId);
        if (!employee) {
            return res.status(404).json({
                status: "false",
                message: "Employee not found"
            });
        }

        // Remove profile picture from local
        if (employee.profilePicture) {
            const profilePicturePath = path.join(__dirname, '../public/profile-picture', employee.profilePicture.split('/').pop());
            if (fs.existsSync(profilePicturePath)) {
                fs.unlinkSync(profilePicturePath);
            }
        }

        employee.profilePicture = removeProfilePicture ? null : `${process.env.API_URL}/profile-picture/${file.filename}`;
        await employee.save();

        return res.status(200).json({
            status: "true",
            message: `Profile picture ${removeProfilePicture ? "removed" : "saved"} successfully`
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

const isJoiningDateGreaterThan6Months = (joiningDate) => {
    return moment(joiningDate).isSameOrBefore(moment().subtract(6, 'months'));
}

/** POST: Reset employee bonus. */
exports.reset_employee_bonus = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { employeeId } = req.body;

        if(employeeId) {
            const employee = await Employee.findOne({
                where: {
                    id: employeeId,
                    companyId,
                    isActive: true
                }
            });
            if (!employee) {
                return res.status(404).json({
                    status: "false",
                    message: "Employee not found"
                });
            }

            if(isJoiningDateGreaterThan6Months(employee.hireDate)) {
                employee.bonus = 0;
                await employee.save();
            }
        } else {
            const employees = await Employee.findAll({
                where: {
                    companyId,
                    isActive: true
                }
            });
            if(!employees.length) {
                return res.status(404).json({
                    status: "false",
                    message: "No employees found"
                });
            }

            const forLoop = async (i) => {
                if(i === employees.length) return;
    
                const employee = employees[i];
    
                if(isJoiningDateGreaterThan6Months(employee.hireDate)) {
                    employee.bonus = 0;
                    await employee.save();
                }
    
                await forLoop(i + 1);
            };
    
            await forLoop(0);
        }

        return res.status(200).json({
            status: "true",
            message: "Employee bonus reset successfully"
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get single employee monthly salary report. */
exports.get_employee_monthly_salary_report = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { date } = req.query;

        if(!date) {
            return res.status(400).json({
                status: "false",
                message: "Please provide date"
            });
        }

        if(date.length !== 7) {
            return res.status(400).json({
                status: "false",
                message: "Invalid date format"
            });
        }

        const startDate = `${date}-01`;
        const endDate = moment(startDate).endOf("month").format("YYYY-MM-DD");

        const attendances = await Attendance.findAll({
            where: {
                employeeId,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: Employee,
                    as: "employee",
                    include: {
                        model: Shift,
                        as: "shift"
                    }
                },
                {
                    model: Leave,
                    as: "leave"
                }
            ]
        });
        if(!attendances.length) {
            return res.status(404).json({
                status: "false",
                message: "No attendance found for employee"
            });
        }

        const holidays = await Holiday.findAll({
            where: {
                date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });
        
        const employeeSalaryReport = [];
        let penaltyOccurrence = 0;
        attendances.forEach(attendance => {
            const inTime = moment(attendance.inTime, 'YYYY-MM-DD hh:mm:ss A');
            const outTime = moment(attendance.outTime, 'YYYY-MM-DD hh:mm:ss A');
            const totalWorkedHours = moment.duration(outTime.diff(inTime)).asHours();
            const overtimeHours = parseFloat((totalWorkedHours - attendance.workingHours).toFixed(2));
            
            const isHoliday = holidays.find(holiday => holiday.date === attendance.date);

            let penalty = 0;
            if(!isHoliday) {
                if(attendance.status === "absent" && !attendance.leave) {
                    penalty++;
                } else if(attendance.leave && attendance.leave.leaveDuration !== "Full Day") {
                    penalty++;
                }
            }

            const report = {
                date: attendance.date,
                salaryPerDay: attendance.employee.salaryPerDay,
                overtimeHours: attendance.overtimeHours,
                workingHours: attendance.workingHours,
                workedHours: totalWorkedHours,
                overtimeAmount: parseFloat(((attendance.employee.salaryPerDay / attendance.workingHours) * overtimeHours).toFixed(2)),
                isLate: attendance.latePunch,
                isHoliday: isHoliday ? true : false,
                leave: attendance.leave,
                penaltyOccurrence: penalty > 0 ? penaltyOccurrence++ : penalty,
            };
            employeeSalaryReport.push(report);
        });

        return res.status(200).json({
            status: "true",
            message: "Employee monthly salary report fetched successfully",
            data: employeeSalaryReport
        });
    } catch(error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};