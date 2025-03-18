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
const { get_bonus_percentage_by_attendance_percentage } = require('../controller/bonusConfiguration');
const PenaltyConfiguration = require('../models/penaltyConfiguration');
const { get_total_penalty_amount } = require('../controller/penaltyConfiguration');
const EmployeePunch = require('../models/employeePunch');
const { update_employee_punching_data } = require('../controller/attendance');

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

exports.calculateEmployeesMonthlySalaryJob = cron.schedule('0 3 1 * *', async () => {
    try {
        const date = moment().subtract(2, 'day').format("YYYY-MM");

        const employees = await Employee.findAll({ 
            include: [
                { 
                    model: Leave, 
                    as: 'leaves' 
                },
                {
                    model: Employee,
                    as: 'referral'
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
            leaves.forEach((leave) => {
                if(leave.leaveDuration === "Full Day") {
                    numberOfLeaves++;
                }else {
                    numberOfLeaves += 0.5;
                }
            });

            let totalWorkedDays = 0;
            let penaltyDays = 0;
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
                    const leave = attendance.leave;

                    if(attendance.status === "Present") {
                        if(leave) {
                            if(leave.leaveDuration === "First Half") {
                                totalWorkedDays += 0.5;
                            }else if(leave.leaveDuration === "Second Half") {
                                totalWorkedDays += 0.5;
                            }
                        }else {
                            totalWorkedDays++;
                        }
                    }else if(leave && leave.leaveDuration !== "Full Day") {
                        penaltyDays++;
                    } else if(!leave) {
                        penaltyDays++;
                    }
                });
            }

            const bonusConfiguration = await get_bonus_percentage_by_attendance_percentage(attendancePercentage, date);
            const attendancePercentage = parseFloat(((totalWorkedDays / bonusConfiguration.workingDays) * 100).toFixed(2));
            console.log('attendancePercentage: ', attendancePercentage);

            // Calculate monthly bonus
            let bonus = 0;
            if(bonusConfiguration.bonusPercentage) {
                bonus = (employee.salaryPerDay * bonusConfiguration.workingDays) + (employee.salaryPerDay * (bonusConfiguration.bonusPercentage / 100));
                console.log('bonus: ', bonus);  
            }

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
            const finalPenaltyDays = penaltyDays - (attendances.length - bonusConfiguration.workingDays);
            const penaltyAmount = await get_total_penalty_amount(finalPenaltyDays, employee.salaryPerDay);

            // Add employee referral bonus into monthly salary
            let referralBonus = 0;
            if(employee.referral) {
                const referralBonusPercentage = await SystemSettings.findOne({
                    where: {
                        field: "referralBonus"
                    }
                });
                if(referralBonusPercentage) {
                    referralBonus = (employee.referral.salaryPerDay * bonusConfiguration.workingDays) * (referralBonusPercentage.value / 100);
                }
            }

            // Calculate employee's monthly discipline bonus
            let disciplineBonus = 0;
            const disciplineBonusInDays = await SystemSettings.findOne({
                where: {
                    field: "disciplineBonus"
                }
            });
            if(totalWorkedDays === bonusConfiguration.workingDays && disciplineBonusInDays) {
                disciplineBonus = employee.salaryPerDay * disciplineBonusInDays;
            }

            // Create employee monthly salary record with all other required information
            await EmployeeSalary.create({
                employeeId: employee.id,
                month: date, 
                salary: employee.salaryPerDay * totalWorkedDays,
                bonusAmount: bonus,
                overtimeAmount,
                penaltyAmount,
                referralBonusAmount: referralBonus,
                disciplineBonusAmount: disciplineBonus,
                overtimeHours,
                numberOfWorkedDays: totalWorkedDays,
                numberOfLeaves,
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

            employee.emergencyLeaves += 1;
            employee.personalLeaves += 1;
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
   
/** NOT NEEDED ANY MORE */
// exports.employeeBonusResetJob = cron.schedule('0 3 1 1 *', async () => {
//     try {
//         const employees = await Employee.findAll();
//         if(!employees.length) {
//             console.log("No employees found.");
//             return;
//         }

//         const forLoop = async (i) => {
//             if(i === employees.length) return;

//             const employee = employees[i];

//             employee.bonus = 0;
//             await employee.save();

//             await forLoop(i + 1);
//         };

//         await forLoop(0);

//         console.log("Employee bonuses reset successfully.");
//     } catch(error) {
//         console.log("error: ", error);
//     }
// });

exports.employeePunchingAttendance = cron.schedule('*/30 * * * * *', async () => {
    try {
        const date = moment().format("DD/MM/YYYY");

        let employeesPunchingData = await EmployeePunch.findAll({
            where: {
                date
            }
        });
        if(!employeesPunchingData.length) {
           console.log("Employee punching data not found for the day: ", date);
           return;
        }

        const employees = await Employee.findAll({
            where: {
                isActive: true
            }
        });
        if(!employees.length) {
            console.log("Employees not found for the day: ", date);
            return;
        }

        employeesPunchingData = employeesPunchingData.map((data) => data.dataValues);
        
        const employeeAttendance = [];
        const forLoop = async (i) => {
            if(i === employees.length) return;

            const employee = employees[i];

            const employeePunchingData = [];
            employeesPunchingData.forEach((data) => {
                if(data.empId == employee.id) {
                    employeePunchingData.push(data);
                }
            });
            if(!employeePunchingData.length) return await forLoop(i + 1);

            employeePunchingData.sort((a, b) => new Date(a.time) - new Date(b.time));

            let lastPunch = null;
            const punchData = {
                emp_id: employee.id,
                date: moment().format("YYYY-MM-DD"),
                InTime: null,
                BreakInTime: null,
                BreakOutTime: null,
                OutTime: null
            };

            for(const punch of employeePunchingData) {
                const punchTime = moment(`${date} ${punch.time}`, "DD/MM/YYYY HH:mm:ss");

                // Ignore duplicate punches within 5 minutes
                if (lastPunch && punchTime.diff(lastPunch, "minutes") < 5) {
                    continue;
                }

                lastPunch = punchTime;

                // Assign punches based on time ranges
                if (!punchData.InTime) {
                    punchData.InTime = punchTime;
                    continue;
                }
                if (!punchData.BreakInTime) {
                    punchData.BreakInTime = punchTime;
                    continue;
                }
                if (!punchData.BreakOutTime) {
                    punchData.BreakOutTime = punchTime;
                    continue;
                }
                if (!punchData.OutTime) {
                    punchData.OutTime = punchTime;
                }
            }

            employeeAttendance.push(punchData);

            await forLoop(i + 1);
        };

        await forLoop(0);

        await update_employee_punching_data(employeeAttendance);

        console.log("Employee punching attendance management done successfully.");
    } catch(error) {
        console.error(error);
        console.log("Employee punching attendance management failed");
    }
});