const Shift = require("../models/shift");
const { Sequelize } = require("sequelize");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

/** POST: Create a new shift. */
exports.create_shift = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { shiftName, shiftStartTime, shiftEndTime, breakStartTime, breakEndTime, maxOvertimeHours } = req.body;

        const shiftExists =  await Shift.findOne({
            where: {
                companyId,
                shiftName
            }
        });
        if(shiftExists){
            return res.status(400).json({
                status: "false",
                message: "Shift already exists"
            });
        }

        const shift = await Shift.create({
            companyId,
            shiftName,
            shiftStartTime,
            shiftEndTime,
            breakStartTime,
            breakEndTime,
            maxOvertimeHours
        });
        if(!shift) {
            return res.status(400).json({
                status: "false",
                message: "Unable to create shift"
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Shift created successfully",
            data: shift
        })
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};
  
/** PUT: Update an existing shift. */
exports.update_shift = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { shiftName, shiftStartTime, shiftEndTime, breakStartTime, breakEndTime, maxOvertimeHours } = req.body;
        const { id } = req.params;

        const shift = await Shift.findOne({
            where: {
                companyId,
                id
            }
        });
        if(!shift){
            return res.status(404).json({
                status: "false",
                message: "Shift not found"
            });
        }

        const shiftExists = await Shift.findOne({
            where: {
                companyId,
                shiftName,
                id: {
                    [Sequelize.Op.ne]: id
                }
            }
        });
        if(shiftExists){
            return res.status(400).json({
                status: "false",
                message: "Shift already exists"
            });
        }

        const updatedShift = await Shift.update({
            companyId,
            shiftName,
            shiftStartTime,
            shiftEndTime,
            breakStartTime,
            breakEndTime,
            maxOvertimeHours
        }, {
            where: {
                id
            }
        });
        if(!updatedShift){
            return res.status(400).json({
                status: "false",
                message: "Unable to update shift"
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Shift updated successfully",
            data: updatedShift
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get all shifts. */
exports.get_shifts = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { search } = req.query;
        const whereClause = {
            companyId
        };

        if (search) {
            whereClause[Op.or] = [];
            whereClause[Op.or].push(Sequelize.literal(`shiftName like '%${search}%'`));
        }

        const shifts = await Shift.findAll({
            where: whereClause
        });
        if(!shifts.length){
            return res.status(404).json({
                status: "false",
                message: "Shifts not found",
                data: shifts
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Shifts fetched successfully",
            data: shifts
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get a single shift by id. */
exports.get_shift = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { id } = req.params;

        const shift = await Shift.findOne({
            where: {
                companyId,
                id
            }
        });
        if(!shift){
            return res.status(404).json({
                status: "false",
                message: "Shift not found",
                data: shift
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Shift fetched successfully",
            data: shift
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** DELETE: Delete a shift by id. */
exports.delete_shift = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { id } = req.params;

        const shift = await Shift.findOne({
            where: {
                companyId,
                id
            }
        });
        if(!shift){
            return res.status(404).json({
                status: "false",
                message: "Shift not found"
            });
        }

        await shift.destroy();
        return res.status(200).json({
            status: "true",
            message: "Shift deleted successfully"
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};