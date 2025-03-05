const PenaltyConfiguration = require("../models/penaltyConfiguration");
const { Sequelize, Op } = require("sequelize");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

/** POST: Create new penalty configurations. */
exports.create_penaltyConfiguration = async (req, res) => {
    try {
        const penaltyConfigurations  = req.body;

        if (!Array.isArray(penaltyConfigurations) || penaltyConfigurations.length === 0) {
            return res.status(400).json({
                status: "false",
                message: "Invalid request. Provide an array of penalty configurations."
            });
        }

        const penalties = await PenaltyConfiguration.bulkCreate(penaltyConfigurations, {
            updateOnDuplicate: ["firstPenalty", "secondPenalty", "thirdPenalty", "fourthPenalty", "fifthPenalty"],
        });
        if(!penalties) {
            return res.status(400).json({
                status: "false",
                message: "Unable to create penalty Configurations"
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Penalty Configurations created successfully",
            data: penalties
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** PUT: Update an existing penalty configurations. */
exports.update_penaltyConfiguration = async (req, res) => {
    try {
        const penaltyConfigurations  = req.body;

        if (!Array.isArray(penaltyConfigurations) || penaltyConfigurations.length === 0) {
            return res.status(400).json({
                status: "false",
                message: "Invalid request. Provide an array of penalty configurations."
            });
        }

        const penalties = await PenaltyConfiguration.bulkCreate(penaltyConfigurations, {
            updateOnDuplicate: ["firstPenalty", "secondPenalty", "thirdPenalty", "fourthPenalty", "fifthPenalty"],
        });
        if(!penalties) {
            return res.status(400).json({
                status: "false",
                message: "Unable to update penalty Configurations"
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Penalty Configuration updated successfully",
            data: penalties
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get all penalty configurations. */
exports.get_penaltyConfigurations = async (req, res) => {
    try {
        const { search } = req.query;
        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [];
            whereClause[Op.or].push(Sequelize.literal(`type like '%${search}%'`));
        }

        const penalty = await PenaltyConfiguration.findAll({
            where: whereClause
        });
        if(!penalty.length) {
            return res.status(404).json({
                status: "false",
                message: "Penalty Configurations Not Found",
                data: penalty
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Penalty Configurations fetched successfully",
            data: penalty
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get a single penalty configuration by id. */
exports.get_penaltyConfiguration = async (req, res) => {
    try {
        const { id } = req.params;

        const penalty = await PenaltyConfiguration.findOne({
            where: {
                id
            }
        });
        if(!penalty){
            return res.status(404).json({
                status: "false",
                message: "Penalty Configuration Not Found",
                data: penalty
            });
        }

        return res.status(200).json({
            status: "true",
            message: "Penalty Configuration fetched successfully",
            data: penalty
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** DELETE: Delete a single penalty configuration by id. */
exports.delete_penaltyConfiguration = async (req, res) => {
    try {
        const { id } = req.params;

        const penalty = await PenaltyConfiguration.findOne({
            where: {
                id
            }
        });
        if(!penalty){
            return res.status(404).json({
                status: "false",
                message: "Penalty Configuration Not Found"
            });
        }

        await penalty.destroy();
        return res.status(200).json({
            status: "true",
            message: "Penalty Configuration deleted successfully"
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

exports.get_total_penalty_amount = async (penaltyDays, perDaySalary) => {
    try {
        let penaltyAmount = 0;

        const penaltyConfiguration = await PenaltyConfiguration.findOne({
            where: {
                type: "leaves"
            }
        });
        if(!penaltyConfiguration){
            return penaltyAmount;
        }

        if(penaltyDays >= 5) {
            penaltyAmount = (perDaySalary * penaltyConfiguration.firstPenalty / 100) + (perDaySalary * penaltyConfiguration.secondPenalty / 100) + (perDaySalary * penaltyConfiguration.thirdPenalty / 100) + (perDaySalary * penaltyConfiguration.fourthPenalty / 100) + (perDaySalary * penaltyConfiguration.fifthPenalty / 100);
        } else if(penaltyDays === 4) {
            penaltyAmount = (perDaySalary * penaltyConfiguration.firstPenalty / 100) + (perDaySalary * penaltyConfiguration.secondPenalty / 100) + (perDaySalary * penaltyConfiguration.thirdPenalty / 100) + (perDaySalary * penaltyConfiguration.fourthPenalty / 100);
        } else if(penaltyDays === 3) {
            penaltyAmount = (perDaySalary * penaltyConfiguration.firstPenalty / 100) + (perDaySalary * penaltyConfiguration.secondPenalty / 100) + (perDaySalary * penaltyConfiguration.thirdPenalty / 100);
        } else if(penaltyDays === 2) {
            penaltyAmount = (perDaySalary * penaltyConfiguration.firstPenalty / 100) + (perDaySalary * penaltyConfiguration.secondPenalty / 100);
        } else if(penaltyDays === 1) {
            penaltyAmount = (perDaySalary * penaltyConfiguration.firstPenalty / 100);
        }

        return penaltyAmount;
    } catch(error) {
        console.error(error);
        return 0;
    }
}