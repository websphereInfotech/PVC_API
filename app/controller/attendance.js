const Attendance = require("../models/attendance");
const { Sequelize, Op } = require("sequelize");
const Employee = require("../models/employee");
const moment = require("moment");
const Leave = require("../models/leave");
const Shift = require("../models/shift");
const BonusConfiguration = require("../models/bonusConfiguration");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

/** POST: Create all employees attendance entry */
exports.create_attendance = async (req, res) => {
    try {
        const data = await create_all_employees_attendance();

        if(data.ATTENDANCE_ALREADY_EXISTS) {
            return res.status(409).json({
                status: "false",
                message: "Attendance already exists."
            });
        } else if(data.EMPLOYEES_NOT_FOUND) {
            return res.status(404).json({ 
                status: "false",
                message: "Employees not found" 
            });
        } else if(data.ATTENDANCE_NOT_CREATED) {
            return res.status(400).json({
                status: "false",
                message: "Attendance not created"
            });
        } else {
            return res.status(200).json({
                status: "true",
                message: "Attendance created successfully",
            });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** Create attendance entry for all employees */
const create_all_employees_attendance = async () => {
    try {
        const date = moment().format("YYYY-MM-DD"); // Get current date

        const attendanceExists = await Attendance.findOne({
            where: {
                date
            }
        });
        if(attendanceExists) {
            console.log("Attendances already added this day: ", date);
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
            console.log('employee: ', employee);
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
};

/** GET: Get all attendances with date and employee filter. */
exports.get_all_attendances = async (req, res) => {
    try {
        const { date, employeeId } = req.query;
        const whereClause = {};

        if(date || employeeId) {
            whereClause[Op.and] = [];

            if(date) {
                if (date.length === 7) { // For month filter (YYYY-MM)
                    const startDate = `${date}-01`;
                    const endDate = moment(startDate).endOf("month").format("YYYY-MM-DD");
        
                    whereClause[Op.and].push({
                        date: {
                            [Op.between]: [startDate, endDate]
                        }
                    });
                } else if (date.length === 10) { // For single date filter (YYYY-MM-DD)
                    whereClause[Op.and].push({ date });
                }
            } 

            if(employeeId) {
                whereClause[Op.and].push(Sequelize.literal(`P_attendance.employeeId = ${employeeId}`));
            }
        }

        const attendances = await Attendance.findAll({
            where: whereClause,
            include: [
                {
                    model: Employee,
                    as: "employee",
                },
                {
                    model: Leave,
                    as: "leave",
                },
            ],
        });
        if(!attendances.length) {
            return res.status(404).json({
                status: "false",
                message: "Attendances Not Found",
                data: attendances
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Attendances fetched successfully",
            data: attendances
        });
    } catch(error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** POST: Approve an existing attendance */
exports.approve_attendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { approvedBy } = req.body;

        const attendance = await Attendance.findByPk(id);
        if(!attendance) {
            return res.status(404).json({
                status: "false",
                message: "Attendance Not Found",
                data: attendance
            });
        }

        if(attendance.approvedBy) {
            return res.status(400).json({
                status: "false",
                message: "Attendance already approved",
                data: attendance
            });
        }

        attendance.approvedBy = approvedBy;
        attendance.approvedDate = new Date();
        await attendance.save();

        res.status(200).json({
            status: "true",
            message: "Attendance approved successfully",
            data: attendance
        });
    } catch(error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get single attendance by Id */
exports.get_attendance_by_id = async (req, res) => {
    try {
        const { id } = req.params;

        const attendance = await Attendance.findByPk(id, {
            include: [
                {
                    model: Employee,
                    as: "employee",
                },
                {
                    model: Leave,
                    as: "leave",
                },
            ]
        });
        if(!attendance) {
            return res.status(404).json({
                status: "false",
                message: "Attendance Not Found",
                data: attendance
            });
        }

        res.status(200).json({
            status: "true",
            message: "Attendance fetched successfully",
            data: attendance
        });
    } catch(error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** PUT: Update attendance for clock-in, clock-out, break-in, break-out */
exports.update_attendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;

        const attendance = await Attendance.findByPk(id);
        if(!attendance) {
            return res.status(404).json({
                status: "false",
                message: "Attendance Not Found",
                data: attendance
            });
        }

        const employee = await Employee.findByPk(attendance.employeeId, {
            include: {
                model: Shift,
                as: "shift",
            }
        });
        if(!employee) {
            return res.status(404).json({
                status: "false",
                message: "Employee Not Found",
            });
        }

        const shiftStartTime = moment(employee.shift.shiftStartTime, 'hh:mm:ss A');
        const shiftEndTime = moment(employee.shift.shiftEndTime, 'hh:mm:ss A');

        if(type === "ClockIn") {
            if(attendance.inTime) {
                return res.status(400).json({
                    status: "false",
                    message: "Employee is already clocked in",
                });
            }

            const clockInTime = moment().format("YYYY-MM-DD HH:mm:ss");
            
            attendance.inTime = clockInTime;
            attendance.status = "Present";

            if(moment(clockInTime, "YYYY-MM-DD HH:mm:ss").isAfter(shiftStartTime)) {
                attendance.latePunch = true;
            }
        } else if(type === "BreakIn") {
            if(attendance.breakStart) {
                return res.status(400).json({
                    status: "false",
                    message: "Employee is already in break",
                });
            }

            attendance.breakStart = moment().format("YYYY-MM-DD HH:mm:ss");
        } else if(type === "BreakOut") {
            if(attendance.breakEnd) {
                return res.status(400).json({
                    status: "false",
                    message: "Employee is not in break",
                });
            }

            attendance.breakEnd = moment().format("YYYY-MM-DD HH:mm:ss");
        } else if(type === "ClockOut") {
            if(attendance.outTime) {
                return res.status(400).json({
                    status: "false",
                    message: "Employee is already clocked out",
                });
            }

            attendance.outTime = moment().format("YYYY-MM-DD HH:mm:ss");

            const inTime = moment(attendance.inTime, 'YYYY-MM-DD hh:mm:ss A');
            const outTime = moment(attendance.outTime, 'YYYY-MM-DD hh:mm:ss A');

            const totalWorkedHours = moment.duration(outTime.diff(inTime)).asHours();
            const totalWorkingHours = moment.duration(shiftEndTime.diff(shiftStartTime)).asHours();
            
            attendance.workingHours = parseFloat(totalWorkingHours.toFixed(2));
            attendance.overtimeHours = parseFloat((totalWorkedHours - totalWorkingHours).toFixed(2));
        }

        await attendance.save();

        res.status(200).json({
            status: "true",
            message: "Attendance Updated Successfully",
            data: attendance
        });
    } catch(error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

const attendanceMetrics = [
    {
        min: 0,
        max: 20,
        performance: "Poor",
    },
    {
        min: 21,
        max: 40,
        performance: "Average",
    },
    {   
        min: 41,
        max: 60,
        performance: "Good",
    },
    {
        min: 61,
        max: 80,
        performance: "Very Good",
    },
    {
        min: 81,
        max: 100,
        performance: "Excellent",
    },
];

const getAttendancePerformance = (attendancePercentage) => {
    const attendanceMetric = attendanceMetrics.find((metric) => attendancePercentage >= metric.min && attendancePercentage <= metric.max);
    return attendanceMetric.performance;
};

/** GET: Get monthly attendance percentage with performance metrics */
exports.get_monthly_attendance_performance_metrics = async (req, res) => {
    try {
        const { employeeId } = req.query;
        const date = moment().format("YYYY-MM").toString();
        console.log('date: ', date);

        const startDate = moment().startOf("month").toDate(); // First day of the month
        const endDate = moment().endOf("month").toDate(); // Last day of the month

        const attendances = await Attendance.findAll({
            where: {
                employeeId,
                date: {
                    [Op.between]: [startDate, endDate], // Matches any date within the month
                }
            },
            include: [
                {
                    model: Leave,
                    as: "leave",
                },
            ]
        });
        if(!attendances.length) {
            return res.status(404).json({
                status: "false",
                message: "Attendances Not Found",
            });
        }

        const totalDays = attendances.length;
        let totalPresentDays = 0;
        let totalLateInDays = 0;
        attendances.forEach((attendance) => {
            if (attendance.status === "Present") {
                const leave = attendance.leave;
                
                if (!leave || leave.status === "Rejected" || (leave.status === "Approved" && leave.leaveDuration === "Full Day")) {
                    totalPresentDays++;
                } else if (leave.status === "Approved") {
                    totalPresentDays += 0.5;
                }
            }

            if(attendance.latePunch) {
                totalLateInDays++;
            }
        });
        const totalAbsentDays = totalDays - totalPresentDays;
        const attendancePercentage = parseFloat(((totalPresentDays / totalDays) * 100).toFixed(2));
        const performance = getAttendancePerformance(attendancePercentage);

        let bonusEligibility = false;
        const bonusConfiguration = await BonusConfiguration.findAll({
            where: {
                month: date,
            }
        });
        if(bonusConfiguration.length) {
            const configuration = bonusConfiguration.find((config) => totalPresentDays >= config.minAttendance && totalPresentDays <= config.maxAttendance);
            if(configuration) {
                bonusEligibility = true;
            }
        }

        const performanceMetrics = {
            totalDays,
            totalPresentDays,
            totalAbsentDays,
            attendancePercentage,
            performance,
            bonusEligibility,
            totalLateInDays
        };

        res.status(200).json({
            status: "true",
            message: "Monthly Attendance Percentage Fetched Successfully",
            data: performanceMetrics
        });
    } catch(error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};