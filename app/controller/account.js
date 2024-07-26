const AccountGroup = require('../models/AccountGroup');
const Account = require('../models/Account');
const AccountDetail = require('../models/AccountDetail');

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

exports.create_account = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const {accountDetail, ...accountsInfo} = req.body;
        const accountCreate = await Account.create({...accountsInfo, companyId: companyId})
        if(Object.keys(accountDetail ?? {}).length){
            const accountId = accountCreate.id;
            const accountDetailCreate = await AccountDetail.create({
                ...accountDetail,
                accountId: accountId,
            });
            console.log(accountDetailCreate)
        }
        return res.status(200).json({status: "true", message: "Successfully Created Account.", data: accountCreate});
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error"})
    }
}

exports.view_one_account = async (req, res) => {
    try {
        const {accountId} = req.params;
        const companyId = req.user.companyId;
        const account = await Account.findOne({
            where: {
                companyId: companyId,
                id: accountId
            },
            include: [
                {
                    model: AccountGroup,
                    as: "accountGroup"
                },
                {
                    model: AccountDetail,
                    as: "accountDetail"
                }
            ]
        })
        if(!account) return res.status(404).json({status: "false", message: "Account Not Found"});
        return res.status(200).json({status: "true", message: "Successfully Fetch Account", data: account})
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}