const Holiday = require("../models/holiday");
const { Sequelize, Op } = require("sequelize");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

/** POST: Create a new holiday. */
exports.create_holiday = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { date, name }  = req.body;

        if (!date || !name) {
            return res.status(400).json({
                message: "Please provide both date and name for the holiday.",
            });
        }

        const holidayExists = await Holiday.findOne({
            where: {
                companyId,
                date
            }
        });
        if(holidayExists){
            return res.status(400).json({
                status: "false",
                message: "Holiday already exists",
                data: holidayExists
            });
        }

        const holiday = await Holiday.create({
            companyId,
            date,
            name
        });
        if(!holiday) {
            return res.status(400).json({
                status: "false",
                message: "Unable to create Holiday"
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Holiday created successfully",
            data: holiday
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** PUT: Update an existing holiday. */
exports.update_holiday = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { date, name }  = req.body;
        const { id } = req.params;

        if (!date || !name) {
            return res.status(400).json({
                status: "false",
                message: "Please provide date and name",
            });
        }

        const holiday = await Holiday.findOne({
            where: {
                companyId,
                id
            }
        });
        if(!holiday){
            return res.status(404).json({
                status: "false",
                message: "Holiday not found"
            });
        }

        const holidayExists = await Holiday.findOne({
            where: {
                companyId,
                date,
                id: {
                    [Op.ne]: id
                }
            }
        });
        if(holidayExists){
            return res.status(400).json({
                status: "false",
                message: "Holiday already exists",
            });
        }

        holiday.date = date;
        holiday.name = name;
        await holiday.save();

        return res.status(200).json({
            status: "true",
            message: "Holiday updated successfully",
            data: holiday
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get all holidays. */
exports.get_holidays = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { search } = req.query;
        const whereClause = {
            companyId
        };

        if (search) {
            whereClause[Op.or] = [];
            whereClause[Op.or].push(Sequelize.literal(`date like '%${search}%'`));
            whereClause[Op.or].push(Sequelize.literal(`name like '%${search}%'`));
        }

        const holidays = await Holiday.findAll({
            where: whereClause
        });
        if(!holidays.length) {
            return res.status(404).json({
                status: "false",
                message: "Holidays Not Found",
                data: holidays
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Holidays fetched successfully",
            data: holidays
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get a single holiday by id. */
exports.get_holiday = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { id } = req.params;

        const holiday = await Holiday.findOne({
            where: {
                companyId,
                id
            }
        });
        if(!holiday){
            return res.status(404).json({
                status: "false",
                message: "Holiday Not Found",
                data: holiday
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Holiday fetched successfully",
            data: holiday
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** DELETE: Delete a single holiday by id. */
exports.delete_holiday = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { id } = req.params;

        const holiday = await Holiday.findOne({
            where: {
                companyId,
                id
            }
        });
        if(!holiday){
            return res.status(404).json({
                status: "false",
                message: "Holiday Not Found"
            });
        }

        await holiday.destroy();
        return res.status(200).json({
            status: "true",
            message: "Holiday deleted successfully"
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};