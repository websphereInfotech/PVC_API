const AccountGroup = require('../models/AccountGroup');

exports.view_all_account_group = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const accountGroups = await AccountGroup.findAll({
            where: {
                companyId: companyId
            }
        });

        return res.status(200).json({status: "true", message: "Successfully Fetch Account Groups.", data: accountGroups});

    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error"});
    }
}