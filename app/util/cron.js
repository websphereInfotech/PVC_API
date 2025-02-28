const cron = require('node-cron');
const Stock = require('../models/stock');
const Product = require('../models/product');
const Notification = require('../models/notification');
const Salary = require('../models/salary')
const moment = require("moment");
const company = require("../models/company");
const User = require("../models/user");
const {Op} = require("sequelize");
const Attendance = require('../models/attendance');
const Employee = require('../models/employee');
const Leave = require('../models/leave');
const Shift = require('../models/shift');
const EmployeeOvertime = require('../models/employeeOvertime');
const BonusConfiguration = require('../models/bonusConfiguration');
const EmployeeSalary = require('../models/employeeSalary');
const SystemSettings = require('../models/systemSettings');

exports.lowStockNotificationJob = cron.schedule('0 0 * * *', async () => {
    const itemStocks = await Stock.findAll({
        include: {model: Product, as: "itemStock"}
    })
    for(const item of itemStocks){
        const stock = item.qty;
        const isLowStock = item.itemStock.lowstock;
        const lowStockQty = item.itemStock.lowStockQty;
        const itemName = item.itemStock.productname;
        const companyId = item.itemStock.companyId
        if (isLowStock && stock <= lowStockQty) {
            await Notification.create({
                notification: `${itemName} product is below the low stock threshold. Current stock: ${stock}`,
                companyId: companyId
            })
        }
    }
});

exports.employeeSalaryCountJob = cron.schedule('0 0 * * *', async () => {
    const date = new Date();
    const startDate = moment().startOf('month').format('YYYY-MM-DD');
    const endDate = moment().endOf('month').format('YYYY-MM-DD');
    const momentDate = moment(date);
    const isFirstDayOfMonth = momentDate.isSame(momentDate.clone().startOf('month'), 'day');
    const companies = await company.findAll({
        include: {
            model: User,
            as: "users",
            through: { attributes: [] },
            where: {
                role: { [Op.ne]: "Super Admin" },
            }
        },
    });

    if(isFirstDayOfMonth){
        for(const company of companies){
            const users = company.users;
            for(const user of users){
                const daySalary = user.salary
                await Salary.create({
                    companyId: company.id,
                    userId: user.id,
                    amount: daySalary,
                    monthStartDate: startDate,
                    monthEndDate: endDate,
                    payableAmount: daySalary
                })
            }
        }
    }else{
        for(const company of companies){
            const users = company.users;
            for(const user of users){
                const daySalary = user.salary
                let latestSalary = await Salary.findOne({
                    where: {
                        companyId: company.id,
                        userId: user.id,
                    },
                    order: [
                        ['monthStartDate', 'DESC']
                    ]
                });
                latestSalary.amount += daySalary;
                latestSalary.payableAmount += daySalary;
                await latestSalary.save();
                // if (!latestSalary) {
                //     await Salary.create({
                //         companyId: company.id,
                //         userId: user.id,
                //         amount: daySalary,
                //         monthStartDate: date,
                //         monthEndDate: date,
                //     });
                // } else {
                //     if (latestSalary.status === SALARY_STATUS.PENDING) {
                //         latestSalary.amount += daySalary;
                //         latestSalary.monthEndDate = date;
                //         await latestSalary.save();
                //     } else if (latestSalary.status === SALARY_STATUS.PAID || latestSalary.status === SALARY_STATUS.CANCELED) {
                //         await Salary.create({
                //             companyId: company.id,
                //             userId: user.id,
                //             amount: daySalary,
                //             monthStartDate: latestSalary.monthEndDate,
                //             monthEndDate: date,
                //         });
                //     }
                // }
            }
        }
    }
});

exports.addEmployeeAttendanceJob = cron.schedule('0 2 * * *', async () => {
    try {
        const date = moment().format("YYYY-MM-DD"); // Get current date

        const attendanceExists = await Attendance.findOne({
            where: {
                date
            }
        });
        if(attendanceExists) {
            console.log("Attendances already added for the day: ", date);
            return { ATTENDANCE_ALREADY_EXISTS: true };
        }

        const employees = await Employee.findAll({
            where: {
                isActive: true
            },
            include: {
                model: Leave,
                as: "leaves"
            }
        });
        if(!employees) {
            console.log("Employees not found");
            return { EMPLOYEES_NOT_FOUND: true };
        }

        const attendanceArray = [];
        employees.forEach((employee) => {
            const leave = employee.leaves.find((leave) => leave.date === date);

            const attendance = {
                employeeId: employee.id,
                leaveId: leave?.id,
                date,
            };
            attendanceArray.push(attendance);
        });

        const attendance = await Attendance.bulkCreate(attendanceArray);
        if(!attendance) {
            console.log("Attendance not created");
            return { ATTENDANCE_NOT_CREATED: true };
        }

        console.log("Attendance created successfully.");
        return { SUCCESS: true };
    } catch(error) {
        console.error(error);
    }
});

exports.calculateEmployeesOvertimeJob = cron.schedule('0 1 * * *', async () => {
    try {
        const date = moment().subtract(1, 'day').format("YYYY-MM-DD");

        const attendances = await Attendance.findAll({
            where: {
                date
            },
            include: {
                model: Employee,
                as: "employee",
                include: {
                    model: Shift,
                    as: "shift"
                }
            }
        });
        if(!attendances.length) {
            console.log("Attendances not found for the day: ", date);
            return;
        }

        const forLoop = async (i) => {
            if(i === attendances.length) return;

            const attendance = attendances[i];
            const employee = attendance.employee;

            const inTime = moment(attendance.inTime, 'YYYY-MM-DD hh:mm:ss A');
            const outTime = moment(attendance.outTime, 'YYYY-MM-DD hh:mm:ss A');
            const totalWorkedHours = moment.duration(outTime.diff(inTime)).asHours();
            console.log('totalWorkedHours: ', totalWorkedHours);

            const shiftStartTime = moment(employee.shift.shiftStartTime, 'hh:mm:ss A');
            const shiftEndTime = moment(employee.shift.shiftEndTime, 'hh:mm:ss A');    
            const totalWorkingHours = moment.duration(shiftEndTime.diff(shiftStartTime)).asHours();
            console.log('totalWorkingHours: ', totalWorkingHours);

            const overtimeHours = parseFloat((totalWorkedHours - totalWorkingHours).toFixed(2));
            console.log('overtimeHours: ', overtimeHours);
            if(overtimeHours > 0) {
                const overTimeAmount = parseFloat(((employee.salaryPerDay / totalWorkingHours) * overtimeHours).toFixed(2));

                await EmployeeOvertime.create({
                    employeeId: employee.id,
                    date,
                    overtimeHours,
                    amount: overTimeAmount
                });

                await Employee.increment(["overtime"], { by: overTimeAmount, where: { id: employee.id } });
            }
            
            await forLoop(i + 1);
        };

        await forLoop(0);

        console.log("Overtime amount added to employees");
    } catch(error) {
        console.error(error);
    }
}); 

exports.calculateEmployeesMonthlyBonusJob = cron.schedule('0 3 1 * *', async () => {
    try {
        const date = moment().subtract(2, 'day').format("YYYY-MM");

        const bonusConfigurations = await BonusConfiguration.findAll({
            where: {
                month: date
            }
        });
        if(!bonusConfigurations.length) {
            console.log('No bonus configurations found for this month: ', date);
            return;
        }

        const employees = await Employee.findAll({ 
            include: [
                { 
                    model: Leave, 
                    as: 'leaves' 
                }
            ] 
        });
        if(!employees.length) {
            console.log("Employees not found");
            return; 
        }

        const forLoop = async (i) => {
            if(i === employees.length) return;

            const employee = employees[i];
            const leaves = employees[i].leaves.filter((leave) => leave.date.includes(date));
            console.log('leaves: ', leaves);
            
            let numberOfLeaves = 0;
            let penaltyDays = 0;
            leaves.forEach((leave) => {
                if(leave.leaveDuration === "Full Day") {
                    numberOfLeaves++;
                }else {
                    numberOfLeaves += 0.5;
                }

                if(leave.leaveType === "Unpaid Leave") {
                    if(leave.leaveDuration === "Full Day") {
                        penaltyDays++;
                    }else {
                        penaltyDays += 0.5;
                    }
                }
            });

            let totalWorkedDays = 0;
            let totalWorkingDays = 0;
            const attendances = await Attendance.findAll({
                include: {
                    model: Leave,
                    as: "leave"
                },
                where: {
                    employeeId: employee.id,
                    date: {
                        [Op.like]: `%${date}%`  
                    }
                }
            });
            if(attendances.length) {
                attendances.forEach((attendance) => {
                    totalWorkingDays++;
                    const leave = attendance.leave;

                    if(leave) {
                        if(leave.leaveDuration === "First Half" && attendance.status === "Present") {
                            totalWorkedDays += 0.5;
                        }else if(leave.leaveDuration === "Second Half" && attendance.status === "Present") {
                            totalWorkedDays += 0.5;
                        }
                    }else if(attendance.status === "Present") {
                        totalWorkedDays++;
                    }
                });
            }

            const attendancePercentage = parseFloat(((totalWorkedDays / totalWorkingDays) * 100).toFixed(2));
            console.log('attendancePercentage: ', attendancePercentage);

            // Calculate monthly bonus
            let bonus = 0;
            bonusConfigurations.forEach((configuration) => {
                if(attendancePercentage >= configuration.minAttendance && attendancePercentage <= configuration.maxAttendance) {
                    bonus = (employee.salaryPerDay * 26) * (bonusPercentage / 100); // 26 is number of days for monthly salary.
                    console.log('bonus: ', bonus);
                }
            });

            // Calculate employee's overtime hours for the month and overtime amount for the month
            let overtimeHours = 0;
            let overtimeAmount = 0;
            const employeeOvertimes = await EmployeeOvertime.findAll({
                where: {
                    employeeId: employee.id,
                    date: {
                        [Op.like]: `%${date}%`
                    }
                }
            });
            if(employeeOvertimes.length) {
                employeeOvertimes.forEach((overtime) => {
                    overtimeHours += overtime.overtimeHours;
                    overtimeAmount += overtime.amount;
                });
            }

            // Calculate employee's monthly penalty based on unpaid leaves
            let penaltyAmount = 0;
            const penaltyPercentage = await SystemSettings.findOne({
                where: {
                    field: "penalty"
                }
            });
            if(penaltyPercentage) {
                const penalty = (employee.salaryPerDay * 26) * (penaltyPercentage.value / 100); // 26 is number of days for monthly salary.
                penaltyAmount = penaltyDays * penalty;
            }

            // Create employee monthly salary record with all other required information
            await EmployeeSalary.create({
                employeeId: employee.id,
                month: date,
                salary: employee.salaryPerDay * totalWorkedDays,
                bonusAmount: bonus,
                overtimeAmount,
                penaltyAmount,
                overtimeHours,
                numberOfWorkedDays: totalWorkedDays,
                numberOfLeaves
            });

            await Employee.increment(["bonus"], { by: bonus, where: { id: employee.id } });

            await forLoop(i + 1);
        };

        await forLoop(0);

        console.log("Bonus amount added for all employees.");
    } catch(error) {
        console.log("error: ", error);
    }
});

exports.employeesLeavesSettlementJob = cron.schedule('0 2 1 * *', async () => {
    try {
        const employees = await Employee.findAll();
        if(!employees.length) {
            console.log("No employees found.");
            return;
        }

        const forLoop = async (i) => {
            if(i === employees.length) return;

            const employee = employees[i];

            employee.sickLeaves = 1;
            employee.casualLeaves += 1;
            employee.overtime = 0;
            await employee.save();

            await forLoop(i + 1);
        };

        await forLoop(0);

        console.log("Employee leaves settlement done successfully.");
    } catch(error) {
        console.log("error: ", error);
    }
});
    
exports.employeeBonusResetJob = cron.schedule('0 3 1 1 *', async () => {
    try {
        const employees = await Employee.findAll();
        if(!employees.length) {
            console.log("No employees found.");
            return;
        }

        const forLoop = async (i) => {
            if(i === employees.length) return;

            const employee = employees[i];

            employee.bonus = 0;
            await employee.save();

            await forLoop(i + 1);
        };

        await forLoop(0);

        console.log("Employee bonuses reset successfully.");
    } catch(error) {
        console.log("error: ", error);
    }
});