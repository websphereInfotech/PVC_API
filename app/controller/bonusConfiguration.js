const BonusConfiguration = require("../models/bonusConfiguration");
const { Sequelize, Op } = require("sequelize");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

/** POST: Create a new bonus configuration. */
exports.create_bonusConfiguration = async (req, res) => {
    try {
        const bonusConfigurations  = req.body;

        if (!Array.isArray(bonusConfigurations) || bonusConfigurations.length === 0) {
            return res.status(400).json({
                status: "false",
                message: "Invalid request. Provide an array of bonus configurations."
            });
        }

        const bonuses = await BonusConfiguration.bulkCreate(bonusConfigurations, {
            updateOnDuplicate: ["bonusPercentage"],
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
        const bonusConfigurations  = req.body;

        if (!Array.isArray(bonusConfigurations) || bonusConfigurations.length === 0) {
            return res.status(400).json({
                status: "false",
                message: "Invalid request. Provide an array of bonus configurations."
            });
        }

        const bonuses = await BonusConfiguration.bulkCreate(bonusConfigurations, {
            updateOnDuplicate: ["bonusPercentage"],
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
        const { search } = req.query;
        const whereClause = {};

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
        const { id } = req.params;

        const bonus = await BonusConfiguration.findOne({
            where: {
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
        const { id } = req.params;

        const bonus = await BonusConfiguration.findOne({
            where: {
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