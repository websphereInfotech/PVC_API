const Attendance = require("../models/attendance");
const { Sequelize, Op } = require("sequelize");
const Employee = require("../models/employee");
const moment = require("moment");
const Leave = require("../models/leave");
const Shift = require("../models/shift");
const BonusConfiguration = require("../models/bonusConfiguration");
const { get_bonus_percentage_by_attendance_percentage } = require("./bonusConfiguration");
const EmployeePunch = require("../models/employeePunch");
const AttendanceType = require("../models/attendanceType");
const Holiday = require("../models/holiday");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

/** POST: Create all employees attendance entry */
exports.create_attendance = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const data = await create_all_employees_attendance(companyId);

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
const create_all_employees_attendance = async (companyId) => {
    try {
        const date = moment().format("YYYY-MM-DD"); // Get current date

        const attendanceExists = await Attendance.findOne({
            where: {
                companyId,
                date
            }
        });
        if(attendanceExists) {
            console.log("Attendances already added this day: ", date);
            return { ATTENDANCE_ALREADY_EXISTS: true };
        }

        const employees = await Employee.findAll({
            where: {
                companyId,
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
                companyId,
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
        const companyId = req.user.companyId;
        const { date, employeeId } = req.query;
        const whereClause = {};

        if(date || employeeId) {
            whereClause[Op.and] = [];
            whereClause[Op.and].push(Sequelize.literal(`P_attendance.companyId = ${companyId}`));

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
                {
                    model: AttendanceType,
                    as: "attendanceType",
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
        const companyId = req.user.companyId;
        const { id } = req.params;
        const { approvedBy } = req.body;

        const attendance = await Attendance.findOne({
            where: {
                id,
                companyId
            }
        });
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
                {
                    model: AttendanceType,
                    as: "attendanceType",
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
        const companyId = req.user.companyId;
        const { id } = req.params;
        const { type } = req.body;

        const attendance = await Attendance.findOne({
            where: {
                id,
                companyId
            }
        });
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
        
        const bonusConfiguration = await get_bonus_percentage_by_attendance_percentage(attendancePercentage, date);
        if(bonusConfiguration.bonusPercentage) {
            bonusEligibility = true;
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

/** POST: Manage employee attendance at every 30sec. */
exports.manage_employee_attendance = async (req, res) => {
    try {
        const date = moment().format("DD/MM/YYYY");

        let employeesPunchingData = await EmployeePunch.findAll({
            where: {
                date
            }
        });
        if(!employeesPunchingData.length) {
            return res.status(404).json({
                status: "false",
                message: "Punching Data Not Found",
                data: employeesPunchingData
            });
        }

        const employees = await Employee.findAll({
            where: {
                isActive: true
            }
        });
        if(!employees.length) {
            return res.status(404).json({
                status: "false",
                message: "Employees Not Found",
                data: employees
            });
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

        await this.update_employee_punching_data(employeeAttendance);

        res.status(200).json({
            status: "true",
            message: "Employee Attendance Managed Successfully",
            data: employeeAttendance
        });
    } catch(error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** Update employee punching data into employee attendance table. */
exports.update_employee_punching_data = async (employeeAttendance) => {
    try {
        const forLoop = async (i) => {
            if(i === employeeAttendance.length) return;

            const employeePunchData = employeeAttendance[i];

            const attendance = await Attendance.findOne({
                where: {
                    employeeId: employeePunchData.emp_id,
                    date: employeePunchData.date
                }
            });
            if(!attendance) {
                // console.log("Attendance not found for employee: ", employeePunchData.emp_id);
                return await forLoop(i + 1);
            }

            const employee = await Employee.findByPk(attendance.employeeId, {
                include: {
                    model: Shift,
                    as: "shift",
                }
            });
            if(!employee) {
                console.log("Employee not found for employee id: ", attendance.employeeId);
                return await forLoop(i + 1);
            }

            const shiftStartTime = moment(employee.shift.shiftStartTime, 'hh:mm:ss A');
            const shiftEndTime = moment(employee.shift.shiftEndTime, 'hh:mm:ss A');

            if(employeePunchData.InTime) {
                const clockInTime = moment(employeePunchData.InTime).format("YYYY-MM-DD HH:mm:ss");
                
                attendance.inTime = clockInTime;
                attendance.status = "Present";
    
                if(moment(clockInTime, "YYYY-MM-DD HH:mm:ss").isAfter(shiftStartTime)) {
                    attendance.latePunch = true;
                }
            } 

            if(employeePunchData.BreakInTime) {
                attendance.breakStart = moment(employeePunchData.BreakInTime).format("YYYY-MM-DD HH:mm:ss");
            } 
            
            if(employeePunchData.BreakOutTime) {
                attendance.breakEnd = moment(employeePunchData.BreakOutTime).format("YYYY-MM-DD HH:mm:ss");
            } 
            
            if(employeePunchData.OutTime) {
                attendance.outTime = moment(employeePunchData.OutTime).format("YYYY-MM-DD HH:mm:ss");
    
                const inTime = moment(attendance.inTime, 'YYYY-MM-DD hh:mm:ss A');
                const outTime = moment(attendance.outTime, 'YYYY-MM-DD hh:mm:ss A');
    
                const totalWorkedHours = moment.duration(outTime.diff(inTime)).asHours();
                const totalWorkingHours = moment.duration(shiftEndTime.diff(shiftStartTime)).asHours();
                
                attendance.workingHours = parseFloat(totalWorkingHours.toFixed(2));
                attendance.overtimeHours = parseFloat((totalWorkedHours - totalWorkingHours).toFixed(2));
            }
    
            await attendance.save();

            await forLoop(i + 1);
        }

        await forLoop(0);
    } catch(error) {
        console.error(error);
    }
};

/** PUT: Update attendance type for an attendance record */
exports.update_attendance_type = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { id } = req.params;
        const { attendanceTypeId } = req.body;

        // Validate attendance type ID
        if (!attendanceTypeId) {
            return res.status(400).json({
                status: "false",
                message: "Attendance type ID is required"
            });
        }

        // Check if attendance type exists
        const attendanceType = await AttendanceType.findOne({
            where: {
                id: attendanceTypeId,
                companyId
            }
        });

        if (!attendanceType) {
            return res.status(404).json({
                status: "false",
                message: "Attendance type not found"
            });
        }

        // Check if attendance exists
        const attendance = await Attendance.findOne({
            where: {
                id,
                companyId
            }
        });

        if (!attendance) {
            return res.status(404).json({
                status: "false",
                message: "Attendance record not found"
            });
        }

        // Update attendance type
        attendance.attendanceTypeId = attendanceTypeId;
        await attendance.save();

        // Get updated attendance with relationships
        const updatedAttendance = await Attendance.findByPk(id, {
            include: [
                {
                    model: Employee,
                    as: "employee",
                },
                {
                    model: Leave,
                    as: "leave",
                },
                {
                    model: AttendanceType,
                    as: "attendanceType",
                },
            ]
        });

        return res.status(200).json({
            status: "true",
            message: "Attendance type updated successfully",
            data: updatedAttendance
        });
    } catch (error) {
        console.error("Error updating attendance type:", error);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error"
        });
    }
};

/** GET: Get employee attendance status list (present/absent) */
exports.get_employee_attendance_status = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        console.log('companyId: ', companyId);
        const { date = moment().format("YYYY-MM-DD") } = req.query;

        // Build where clause for employees
        const employeeWhereClause = {
            companyId,
            isActive: true
        };

        // Get all active employees
        const employees = await Employee.findAll({
            where: employeeWhereClause,
            order: [['firstName', 'ASC']]
        });

        console.log('employees: ', employees);
        if (!employees.length) {
            return res.status(404).json({
                status: "false",
                message: "No employees found"
            });
        }

        // Get attendance records for the specified date
        const attendances = await Attendance.findAll({
            where: {
                companyId,
                date
            },
            include: [
                {
                    model: Leave,
                    as: "leave",
                    attributes: ['id', 'status', 'leaveDuration', 'reason']
                },
                {
                    model: AttendanceType,
                    as: "attendanceType",
                    attributes: ['id', 'code', 'description', 'salaryPerDay']
                }
            ]
        });

        // Create a map of attendance records by employee ID
        const attendanceMap = {};
        attendances.forEach(attendance => {
            attendanceMap[attendance.employeeId] = attendance;
        });

        // Build response with employee attendance status
        const employeeAttendanceList = employees.map(employee => {
            const attendance = attendanceMap[employee.id];
            const leave = attendance?.leave;
            
            let status = 'Absent';
            let statusDetails = {
                type: 'Absent',
                description: 'No attendance record found',
                color: '#dc3545'
            };

            if (attendance) {
                if (attendance.status === 'Present') {
                    status = 'Present';
                    if (leave && leave.status === 'Approved') {
                        if (leave.leaveDuration === 'Half Day') {
                            statusDetails = 'Half Day Leave';
                        } else {
                            statusDetails = 'Full Day Leave';
                        }
                    } else if (leave && leave.status === 'Pending') {
                        statusDetails = 'Present (Leave Pending)';
                    } else if (leave && leave.status === 'Rejected') {
                        statusDetails = 'Present (Leave Rejected)';
                    } else {
                        statusDetails = 'Present';
                    }
                } else if (attendance.status === 'Absent') {
                    status = 'Absent';
                    if (leave && leave.status === 'Approved') {
                        statusDetails = 'Approved Leave';
                    } else if (leave && leave.status === 'Pending') {
                        statusDetails = 'Leave Pending';
                    } else if (leave && leave.status === 'Rejected') {
                        statusDetails = 'Leave Rejected';
                    } else {
                        statusDetails = 'Absent';
                    }
                }
            }

            return {
                employeeId: employee.id,
                employeeCode: employee.employeeCode,
                firstName: employee.firstName,
                lastName: employee.lastName,
                fullName: `${employee.firstName} ${employee.lastName}`,
                email: employee.email,
                phone: employee.phone,
                attendanceStatus: status,
                statusDetails: statusDetails,
                attendanceRecord: attendance ? {
                    id: attendance.id,
                    inTime: attendance.inTime,
                    outTime: attendance.outTime,
                    breakStart: attendance.breakStart,
                    breakEnd: attendance.breakEnd,
                    latePunch: attendance.latePunch,
                    workingHours: attendance.workingHours,
                    overtimeHours: attendance.overtimeHours,
                    approvedBy: attendance.approvedBy,
                    approvedDate: attendance.approvedDate,
                    leave: leave,
                    attendanceType: attendance.attendanceType
                } : null,
                lastUpdated: attendance ? attendance.updatedAt : null
            };
        });

        // Calculate summary statistics
        const summary = {
            totalEmployees: employeeAttendanceList.length,
            present: employeeAttendanceList.filter(emp => emp.attendanceStatus === 'Present').length,
            absent: employeeAttendanceList.filter(emp => emp.attendanceStatus === 'Absent').length,
            // halfDayLeave: employeeAttendanceList.filter(emp => emp.attendanceStatus === 'Half Day Leave').length,
            // fullDayLeave: employeeAttendanceList.filter(emp => emp.attendanceStatus === 'Full Day Leave').length,
            // approvedLeave: employeeAttendanceList.filter(emp => emp.attendanceStatus === 'Approved Leave').length,
            // leavePending: employeeAttendanceList.filter(emp => emp.attendanceStatus.includes('Leave Pending')).length,
            // leaveRejected: employeeAttendanceList.filter(emp => emp.attendanceStatus.includes('Leave Rejected')).length
        };

                 return res.status(200).json({
             status: "true",
             message: "Employee attendance status retrieved successfully",
             data: {
                 date: date,
                 summary: summary,
                 employees: employeeAttendanceList
             }
         });
     } catch (error) {
         console.error("Error fetching employee attendance status:", error);
         return res.status(500).json({
             status: "false",
             message: "Internal Server Error"
         });
     }
 };

/** GET: Get full month employee attendance details */
exports.get_full_month_employee_attendance = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { employeeId, month, year } = req.query;
        
        // Use current month/year if not provided
        const currentDate = moment();
        const targetMonth = month || currentDate.format('MM');
        const targetYear = year || currentDate.format('YYYY');
        
        // Create date range for the month
        const startDate = moment(`${targetYear}-${targetMonth}-01`).startOf('month');
        const endDate = moment(startDate).endOf('month');
        const monthName = startDate.format('MMM-YY'); // e.g., "Aug-25"
        
        // Validate employee ID
        if (!employeeId) {
            return res.status(400).json({
                status: "false",
                message: "Employee ID is required"
            });
        }

        // Get employee details
        const employee = await Employee.findOne({
            where: {
                id: employeeId,
                companyId,
                isActive: true
            },
            include: {
                model: Shift,
                as: "shift",
            }
        });

        if (!employee) {
            return res.status(404).json({
                status: "false",
                message: "Employee not found"
            });
        }

        // Get holidays for the month
        const holidays = await Holiday.findAll({
            where: {
                companyId,
                date: {
                    [Op.between]: [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
                }
            }
        });

        // Create a map of holidays by date
        const holidayMap = {};
        holidays.forEach(holiday => {
            holidayMap[holiday.date] = holiday;
        });

        // Get all attendance records for the month
        const attendances = await Attendance.findAll({
            where: {
                employeeId,
                companyId,
                date: {
                    [Op.between]: [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]
                }
            },
            include: [
                {
                    model: Leave,
                    as: "leave",
                    attributes: ['id', 'status', 'leaveDuration', 'reason']
                },
                {
                    model: AttendanceType,
                    as: "attendanceType",
                    attributes: ['id', 'code', 'description', 'salaryPerDay']
                }
            ],
            order: [['date', 'ASC']]
        });

        // Create daily attendance array for the entire month
        const dailyAttendance = [];
        const totalDays = endDate.date();
        
        for (let day = 1; day <= totalDays; day++) {
            const currentDate = moment(`${targetYear}-${targetMonth}-${day.toString().padStart(2, '0')}`);
            const dayOfWeek = currentDate.format('ddd').toUpperCase();
            const dateKey = currentDate.format('YYYY-MM-DD');
            
            // Find attendance record for this date
            const attendance = attendances.find(att => att.date === dateKey);
            
            // Check if it's a holiday
            const isHoliday = holidayMap[dateKey];
            
            let attendanceStatus = 'A'; // Default to Absent
            let overtimeHours = 0;
            let workingHours = 0;
            let inTime = null;
            let outTime = null;
            let breakIn = null;
            let breakOut = null;
            let latePunch = false;
            let leaveInfo = null;
            let attendanceTypeInfo = null;
            
            if (attendance) {
                if (attendance.status === 'Present') {
                    // Determine status based on attendanceType
                    if (attendance.attendanceType) {
                        switch (attendance.attendanceType.code) {
                            case 'P':
                                attendanceStatus = 'P'; // General
                                break;
                            case 'M':
                                attendanceStatus = 'M'; // Mixer
                                break;
                            case 'BM':
                                attendanceStatus = 'BM'; // Big Mixer
                                break;
                            default:
                                attendanceStatus = 'P'; // Default to General
                        }
                    } else {
                        attendanceStatus = 'P'; // Default to Present if no attendance type
                    }
                    
                    workingHours = attendance.workingHours || 0;
                    overtimeHours = attendance.overtimeHours || 0;
                    inTime = attendance.inTime;
                    outTime = attendance.outTime;
                    breakIn = attendance.breakStart;
                    breakOut = attendance.breakEnd;
                    latePunch = attendance.latePunch || false;
                    
                    // Check if there's an approved leave
                    // if (attendance.leave && attendance.leave.status === 'Approved') {
                    //     if (attendance.leave.leaveDuration === 'Half Day') {
                    //         attendanceStatus = 'M'; // Half day
                    //     }
                    // }
                } else if (attendance.status === 'Absent') {
                    if (isHoliday) {
                        attendanceStatus = 'O'; // Off (Holiday)
                    } else if (attendance.leave && attendance.leave.status === 'Approved') {
                        attendanceStatus = 'L'; // Leave
                    } else {
                        attendanceStatus = 'A'; // Absent
                    }
                }
                
                leaveInfo = attendance.leave;
                attendanceTypeInfo = attendance.attendanceType;
            }
            
            dailyAttendance.push({
                day: day,
                dayOfWeek: dayOfWeek,
                date: dateKey,
                status: attendanceStatus,
                overtimeHours: overtimeHours,
                workingHours: workingHours,
                inTime: inTime,
                outTime: outTime,
                breakIn: breakIn,
                breakOut: breakOut,
                latePunch: latePunch,
                leave: leaveInfo,
                attendanceType: attendanceTypeInfo
            });
        }

        // Calculate monthly summary
        const summary = {
            totalDays: totalDays,
            general: dailyAttendance.filter(day => day.status === 'P').length,
            mixer: dailyAttendance.filter(day => day.status === 'M').length,
            bigMixer: dailyAttendance.filter(day => day.status === 'BM').length,
            absent: dailyAttendance.filter(day => day.status === 'A').length,
            leave: dailyAttendance.filter(day => day.status === 'L').length,
            off: dailyAttendance.filter(day => day.status === 'O').length,
            totalOvertime: dailyAttendance.reduce((sum, day) => sum + (+day.overtimeHours || 0), 0),
            totalWorkingHours: dailyAttendance.reduce((sum, day) => sum + (+day.workingHours || 0), 0)
        };

        // Calculate attendance percentage
        const workingDays = totalDays - summary.off;
        const presentDays = summary.general + summary.mixer + summary.bigMixer;
        const attendancePercentage = workingDays > 0 ? parseFloat(((presentDays / workingDays) * 100).toFixed(2)) : 0;

        // Prepare response data
        const responseData = {
            monthInfo: {
                month: monthName,
                year: targetYear,
                totalDays: totalDays,
                workingDays: workingDays
            },
            employeeInfo: {
                id: employee.id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                fullName: `${employee.firstName} ${employee.lastName}`,
                phoneNumber : employee.phoneNumber ,
                address: employee.address,
                panNumber: employee.panNumber,
                aadharNumber: employee.aadharNumber,
                email: employee.email,
                dob: employee.dob,
                shift: employee.shift
            },
            dailyAttendance: dailyAttendance,
            monthlySummary: {
                ...summary,
                attendancePercentage: attendancePercentage,
                presentDays: presentDays
            }
        };

        return res.status(200).json({
            status: "true",
            message: "Full month employee attendance details retrieved successfully",
            data: responseData
        });

    } catch (error) {
        console.error("Error fetching full month employee attendance:", error);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error"
        });
    }
};