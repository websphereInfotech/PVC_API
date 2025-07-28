const BonusConfiguration = require("../models/bonusConfiguration");
const { Sequelize, Op } = require("sequelize");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

/** POST: Create a new bonus configuration. */
exports.create_bonusConfiguration = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const bonusConfigurations  = req.body;

        if (!Array.isArray(bonusConfigurations) || bonusConfigurations.length === 0) {
            return res.status(400).json({
                status: "false",
                message: "Invalid request. Provide an array of bonus configurations."
            });
        }

        bonusConfigurations.forEach((bonusConfiguration) => {
            bonusConfiguration.companyId = companyId;
        });

        const bonuses = await BonusConfiguration.bulkCreate(bonusConfigurations, {
            updateOnDuplicate: ["duty0To50", "duty51To75", "duty76To90", "duty91To100", "dutyAbove100", "workingDays"],
        });
        if(!bonuses) {
            return res.status(400).json({
                status: "false",
                message: "Unable to create Bonus Configurations"
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Bonus Configurations created successfully",
            data: bonuses
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** PUT: Update an existing bonus configuration. */
exports.update_bonusConfiguration = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const bonusConfigurations  = req.body;

        if (!Array.isArray(bonusConfigurations) || bonusConfigurations.length === 0) {
            return res.status(400).json({
                status: "false",
                message: "Invalid request. Provide an array of bonus configurations."
            });
        }

        bonusConfigurations.forEach((bonusConfiguration) => {
            bonusConfiguration.companyId = companyId;
        });

        const bonuses = await BonusConfiguration.bulkCreate(bonusConfigurations, {
            updateOnDuplicate: ["duty0To50", "duty51To75", "duty76To90", "duty91To100", "dutyAbove100", "workingDays"],
        });
        if(!bonuses) {
            return res.status(400).json({
                status: "false",
                message: "Unable to update Bonus Configurations"
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Bonus Configuration updated successfully",
            data: bonuses
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get all bonus configurations. */
exports.get_bonusConfigurations = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { search } = req.query;
        const whereClause = {
            companyId
        };

        if (search) {
            whereClause[Op.or] = [];
            whereClause[Op.or].push(Sequelize.literal(`month like '%${search}%'`));
        }

        const bonus = await BonusConfiguration.findAll({
            where: whereClause
        });
        if(!bonus.length) {
            return res.status(404).json({
                status: "false",
                message: "Bonus Configurations Not Found",
                data: bonus
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Bonus Configurations fetched successfully",
            data: bonus
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get a single bonus configuration by id. */
exports.get_bonusConfiguration = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { id } = req.params;

        const bonus = await BonusConfiguration.findOne({
            where: {
                companyId,
                id
            }
        });
        if(!bonus){
            return res.status(404).json({
                status: "false",
                message: "Bonus Configuration Not Found",
                data: bonus
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Bonus Configuration fetched successfully",
            data: bonus
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** DELETE: Delete a single bonus configuration by id. */
exports.delete_bonusConfiguration = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { id } = req.params;

        const bonus = await BonusConfiguration.findOne({
            where: {
                companyId,
                id
            }
        });
        if(!bonus){
            return res.status(404).json({
                status: "false",
                message: "Bonus Configuration Not Found"
            });
        }

        await bonus.destroy();
        return res.status(200).json({
            status: "true",
            message: "Bonus Configuration deleted successfully"
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

exports.get_bonus_percentage_by_attendance_percentage = async (totalWorkedDays, date) => {
    try {
        const data = {
            bonusPercentage: 0,
            workingDays: 0
        }

        const bonusConfiguration = await BonusConfiguration.findOne({
            where: {
                month: date,
            }
        });
        if(!bonusConfiguration){
            return data;
        }
        const attendancePercentage = parseFloat(((totalWorkedDays / bonusConfiguration.workingDays) * 100).toFixed(2));
        if(attendancePercentage <= 50) {
            data.bonusPercentage = bonusConfiguration.duty0To50;
        }else if(attendancePercentage <= 75) {
            data.bonusPercentage = bonusConfiguration.duty51To75;
        }else if(attendancePercentage <= 90) {
            data.bonusPercentage = bonusConfiguration.duty76To90;
        } else if(attendancePercentage <= 100) {
            data.bonusPercentage = bonusConfiguration.duty91To100;
        } else {
            data.bonusPercentage = bonusConfiguration.dutyAbove100;
        }

        data.workingDays = bonusConfiguration.workingDays;
        return data;
    }catch (error) {
        console.error(error);
        return data;
    }
};