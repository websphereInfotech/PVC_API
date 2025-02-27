const Employee = require("../models/employee");
const Leave = require("../models/leave");
const { Sequelize, Op } = require("sequelize");
const moment = require("moment");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

/** POST: Create a new leave request. */
exports.create_leave_request = async (req, res) => {
    try {
        // TODO -> replace employee_id with the id we get from the token
        // TODO -> Manage multiple days leave, if required
        const { employeeId, date, leaveType, leaveDuration, reason } = req.body;

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

        // Calculate the casual and sick leave balance
        let casualLeave = 0;
        let sickLeave = 0;
        if(leaveType === "Casual Leave") {
            if(leaveDuration === "Full Day") {
                casualLeave++;
            }else {
                casualLeave += 0.5;
            }
        } else if(leaveType === "Sick Leave") {
            if(leaveDuration === "Full Day") {
                sickLeave++;
            }else {
                sickLeave += 0.5;
            }
        }

        // Check if the employee has sufficient leave balance
        if(employee.sickLeaves < sickLeave) {
            return res.status(400).json({
                status: "false",
                message: "Insufficient sick leaves, please select a different leave type"
            })
        } else if(employee.casualLeaves < casualLeave) {
            return res.status(400).json({
                status: "false",
                message: "Insufficient casual leaves, please select a different leave type"
            });
        }

        const leaveRequestExists =  await Leave.findOne({
            where: {
                date
            }
        });
        if(leaveRequestExists){
            return res.status(400).json({
                status: "false",
                message: "Leave request already exists"
            });
        }

        const leaveRequest = await Leave.create({
            employeeId,
            date,
            leaveType,
            leaveDuration,
            reason
        });
        if(!leaveRequest) {
            return res.status(400).json({
                status: "false",
                message: "Unable to create a leave request"
            });
        }

        // Update the employee's leave balance
        if(casualLeave > 0 || sickLeave > 0) {
            employee.casualLeaves -= casualLeave;
            employee.sickLeaves -= sickLeave;
            await employee.save();
        } 

        return res.status(200).json({
            status: "true",
            message: "Leave request created successfully",
            data: leaveRequest
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** PUT: Update an existing leave request. */
exports.update_leave_request = async (req, res) => {
    try {
        const { date, leaveType, leaveDuration, reason } = req.body;
        const { id } = req.params;

        const leaveRequest = await Leave.findOne({
            where: {
                id
            }
        });
        if(!leaveRequest){
            return res.status(404).json({
                status: "false",
                message: "Leave request Not Found"
            });
        }

        const leaveRequestExists = await Leave.findOne({
            where: {
                date,
                id: {
                    [Sequelize.Op.ne]: id
                }
            }
        });
        if(leaveRequestExists){
            return res.status(400).json({
                status: "false",
                message: "Leave request already exists"
            });
        }

        let casualLeave = 0;
        let sickLeave = 0;
        const employee = await Employee.findOne({
            where: {
                id: leaveRequest.employeeId
            }
        });
        if(employee) {
            // Calculate the casual and sick leave balance
            let employeeCasualLeave = employee.casualLeaves;
            let employeeSickLeave = employee.sickLeaves;
            if(leaveRequest.leaveType === "Casual Leave") {
                if(leaveRequest.leaveDuration === "Full Day") {
                    employeeCasualLeave++;
                }else {
                    employeeCasualLeave += 0.5;
                }
            } else if(leaveRequest.leaveType === "Sick Leave") {
                if(leaveRequest.leaveDuration === "Full Day") {
                    employeeSickLeave++;
                }else {
                    employeeSickLeave += 0.5;
                }
            }

            if(leaveType === "Casual Leave") {
                if(leaveDuration === "Full Day") {
                    casualLeave++;
                }else {
                    casualLeave += 0.5;
                }
            } else if(leaveType === "Sick Leave") {
                if(leaveDuration === "Full Day") {
                    sickLeave++;
                }else {
                    sickLeave += 0.5;
                }
            }

            // Check if the employee has sufficient leave balance
            if(employeeSickLeave < sickLeave) {
                return res.status(400).json({
                    status: "false",
                    message: "Insufficient sick leaves, please select a different leave type"
                })
            } else if(employeeCasualLeave < casualLeave) {
                return res.status(400).json({
                    status: "false",
                    message: "Insufficient casual leaves, please select a different leave type"
                });
            }

            employeeSickLeave -= sickLeave;
            employeeCasualLeave -= casualLeave;
        }

        const updatedLeaveRequest = await Leave.update({
            date,
            leaveType,
            leaveDuration,
            reason
        }, {
            where: {
                id
            }
        });
        if(!updatedLeaveRequest) {
            return res.status(400).json({
                status: "false",
                message: "Unable to update a leave request"
            });
        }
        
        employee.casualLeaves = employeeCasualLeave;
        employee.sickLeaves = employeeSickLeave;
        await employee.save();  

        return res.status(200).json({
            status: "true",
            message: "Leave request updated successfully",
            data: updatedLeaveRequest
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get all leave requests. */
exports.get_leave_requests = async (req, res) => {
    try {
        const { date, employeeId } = req.query;
        const whereClause = {};

        if(employeeId || date) {
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
                whereClause[Op.and].push(Sequelize.literal(`employeeId = ${employeeId}`));
            }
        }


        const leaveRequests = await Leave.findAll({
            where: whereClause
        });
        if(!leaveRequests.length) {
            return res.status(404).json({
                status: "false",
                message: "Leave requests Not Found",
                data: leaveRequests
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Leave requests fetched successfully",
            data: leaveRequests
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get a single leave request by id. */
exports.get_leave_request = async (req, res) => {
    try {
        const { id } = req.params;

        const leaveRequest = await Leave.findOne({
            where: {
                id
            }
        });
        if(!leaveRequest){
            return res.status(404).json({
                status: "false",
                message: "Leave request Not Found",
                data: leaveRequest
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Leave request fetched successfully",
            data: leaveRequest
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** DELETE: Delete a single leave request by id. */
exports.delete_leave_Request = async (req, res) => {
    try {
        const { id } = req.params;

        const leaveRequest = await Leave.findOne({
            where: {
                id
            }
        });
        if(!leaveRequest){
            return res.status(404).json({
                status: "false",
                message: "Leave request Not Found"
            });
        }

        const employee = await Employee.findOne({
            where: {
                id: leaveRequest.employeeId
            }
        });
        if(employee) {
            let casualLeave = 0;
            let sickLeave = 0;

            if(employee.leaveType === "Casual Leave") {
                if(employee.leaveDuration === "Full Day") {
                    casualLeave++;
                }else {
                    casualLeave += 0.5;
                }
            } else if(employee.leaveType === "Sick Leave") {
                if(employee.leaveDuration === "Full Day") {
                    sickLeave++;
                }else {
                    sickLeave += 0.5;
                }
            }

            employee.sickLeaves += sickLeave;
            employee.casualLeaves += casualLeave;
            await employee.save();
        }


        await leaveRequest.destroy();
        return res.status(200).json({
            status: "true",
            message: "Leave request deleted successfully"
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** POST: Approve or Reject an existing leave request. */
// TODO -> Take approved by id from the token.
exports.approve_reject_leave_Request = async (req, res) => {
    try {
        const { status, approvedBy } = req.body;
        const { id } = req.params;

        const leaveRequest = await Leave.findOne({
            where: {
                id
            }   
        });
        if(!leaveRequest){
            return res.status(404).json({
                status: "false",
                message: "Leave request Not Found"
            });
        }

        if(status === "Rejected"){
            const employee = await Employee.findOne({   
                where: {
                    id: leaveRequest.employeeId
                }
            });
            if(employee) {
                let casualLeave = 0;
                let sickLeave = 0;

                if(employee.leaveType === "Casual Leave") {
                    if(employee.leaveDuration === "Full Day") {
                        casualLeave++;
                    }else {
                        casualLeave += 0.5;
                    }
                } else if(employee.leaveType === "Sick Leave") {
                    if(employee.leaveDuration === "Full Day") {
                        sickLeave++;
                    }else {
                        sickLeave += 0.5;
                    }
                }

                employee.sickLeaves += sickLeave;
                employee.casualLeaves += casualLeave;
                await employee.save();
            }
        }

        leaveRequest.status = status;
        leaveRequest.approvedBy = approvedBy;
        leaveRequest.approvedDate = new Date();
        await leaveRequest.save();
        
        return res.status(200).json({
            status: "true",
            message: `Leave request ${status.toLowerCase()} successfully`
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get total leaves for the running month */
exports.get_total_leaves = async (req, res) => {
    try {
        const { employeeId } = req.query;

        const startDate = moment().startOf("month").toDate(); // First day of the month
        const endDate = moment().endOf("month").toDate(); // Last day of the month

        const totalLeaves = await Leave.findAll({
            where: {
                employeeId,
                date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        let casualLeaves = 0;
        let sickLeaves = 0;
        let unPaidLeaves = 0;
        totalLeaves.forEach(leave => {
            if(leave.leaveType === "Casual Leave") {
                casualLeaves++;
            } else if(leave.leaveType === "Sick Leave") {
                sickLeaves++;
            } else {
                unPaidLeaves++;
            }
        });

        const leaveData = {
            casualLeaves,
            sickLeaves,
            unPaidLeaves
        };

        return res.status(200).json({
            status: "true",
            message: "Total leaves fetched successfully",
            data: leaveData
        });
    } catch(error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};