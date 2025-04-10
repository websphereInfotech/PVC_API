const Shift = require("../models/shift");
const { Sequelize } = require("sequelize");
const SystemSettings = require("../models/systemSettings");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

/** POST: Create a new system setting. */
exports.create_setting = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { field, value } = req.body;

        const settingExists =  await SystemSettings.findOne({
            where: {
                companyId,
                field
            }
        });
        if(settingExists){
            return res.status(400).json({
                status: "false",
                message: "System setting already exists"
            });
        }

        const setting = await SystemSettings.create({
            companyId,
            field,
            value
        });
        if(!setting) {
            return res.status(400).json({
                status: "false",
                message: "Unable to add a new system setting"
            });
        }

        return res.status(200).json({
            status: "true",
            message: "System setting added successfully",
            data: setting
        })
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};
  
/** PUT: Update an existing system setting. */
exports.update_setting = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { field, value } = req.body;
        const { id } = req.params;

        const setting = await SystemSettings.findOne({
            where: {
                companyId,
                id
            }
        });
        if(!setting){
            return res.status(404).json({
                status: "false",
                message: "System setting not found"
            });
        }

        const settingExists = await SystemSettings.findOne({
            where: {
                companyId,
                field,
                id: {
                    [Sequelize.Op.ne]: id
                }
            }
        });
        if(settingExists){
            return res.status(400).json({
                status: "false",
                message: "System setting already exists"
            });
        }

        const updatedSystemSetting = await SystemSettings.update({
            companyId,
            field,
            value
        }, {
            where: {
                id
            }
        });
        if(!updatedSystemSetting){
            return res.status(400).json({
                status: "false",
                message: "Unable to update system setting"
            });
        }

        return res.status(200).json({
            status: "true",
            message: "System setting updated successfully",
            data: updatedSystemSetting
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get all system settings. */
exports.get_system_settings = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { search } = req.query;
        const whereClause = {
            companyId
        };

        if (search) {
            whereClause[Op.or] = [];
            whereClause[Op.or].push(Sequelize.literal(`field like '%${search}%'`));
        }

        const settings = await SystemSettings.findAll({
            where: whereClause
        });
        if(!settings.length){
            return res.status(404).json({
                status: "false",
                message: "System settings not found",
                data: settings
            });
        }

        return res.status(200).json({
            status: "true",
            message: "System settings fetched successfully",
            data: settings
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get a single system setting by id. */
exports.get_system_setting = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { id } = req.params;

        const setting = await SystemSettings.findOne({
            where: {
                companyId,
                id
            }
        });
        if(!setting){
            return res.status(404).json({
                status: "false",
                message: "System setting not found",
                data: setting
            });
        }

        return res.status(200).json({
            status: "true",
            message: "System setting fetched successfully",
            data: setting
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** GET: Get a single system setting by name. */
exports.get_system_setting_by_name = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { name } = req.query;

        const setting = await SystemSettings.findOne({
            where: {
                companyId,
                field: name
            }
        });
        if(!setting){
            return res.status(404).json({
                status: "false",
                message: "System setting not found",
                data: setting
            });
        }

        return res.status(200).json({
            status: "true",
            message: "System setting fetched successfully",
            data: setting
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

/** DELETE: Delete a system setting by id. */
exports.delete_system_setting = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { id } = req.params;

        const setting = await SystemSettings.findOne({
            where: {
                companyId,
                id
            }
        });
        if(!setting){
            return res.status(404).json({
                status: "false",
                message: "System setting not found"
            });
        }

        await setting.destroy();
        return res.status(200).json({
            status: "true",
            message: "System setting deleted successfully"
        });
    }catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};