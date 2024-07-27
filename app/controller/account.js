const AccountGroup = require('../models/AccountGroup');
const Account = require('../models/Account');
const AccountDetail = require('../models/AccountDetail');
const {isUnique} = require("../constant/common");

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
        const {email, mobileNo, gstNumber} = accountDetail;
        if(await isUnique('email', email, companyId)) return res.status(400).json({status: "false", message: "Email already exists"});
        if(await isUnique('mobileNo', mobileNo, companyId)) return res.status(400).json({status: "false", message: "Mobile No. already exists"});
        if(await isUnique('gstNumber', gstNumber, companyId)) return res.status(400).json({status: "false", message: "Gst Number already exists"});
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
                id: accountId,
                isActive: true
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

exports.update_account = async (req, res)=>{
    try {
        const companyId = req.user.companyId;
        const {accountId} = req.params;
        const {accountDetail, ...accountsInfo} = req.body;
        const {email, mobileNo, gstNumber} = accountDetail;
        const accountExist = await Account.findOne({
            where: {
                companyId: companyId,
                id: accountId,
                isActive: true
            }
        })
        if(!accountExist) return res.status(404).json({status: "false", message: "Account Not Found"});
        if(await isUnique('email', email, companyId, accountId)) return res.status(400).json({status: "false", message: "Email already exists"});
        if(await isUnique('mobileNo', mobileNo, companyId, accountId)) return res.status(400).json({status: "false", message: "Mobile No. already exists"});
        if(await isUnique('gstNumber', gstNumber, companyId, accountId)) return res.status(400).json({status: "false", message: "Gst Number already exists"});
        await Account.update({...accountsInfo}, {
            where: {
                id: companyId,
                companyId: companyId
            }
        })
        if(Object.keys(accountDetail ?? {}).length){
            await AccountDetail.update({
                ...accountDetail,
            }, {
                where: {
                    accountId: accountId,
                }
            });
        }
        const account = await Account.findOne({
            where: {
                companyId: companyId,
                id: accountId,
                isActive: true
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
        return res.status(200).json({status: "true", message: "Successfully Updated Account.", data: account});
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error"});
    }
}


exports.view_all_account = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const accounts = await Account.findAll({
            where: {
                companyId: companyId,
                isActive: true
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
        return res.status(200).json({status: "true", message: "Successfully Fetch All Account", data: accounts})
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}
exports.delete_account = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { accountId } = req.params;
        const account = await Account.findOne({
            where: {
                companyId: companyId,
                isActive: true,
                id: accountId
            }
        })
        if(!account) return res.status(404).json({status: "false", message: "Account Not Found"});
        account.isActive = false;
        await account.save();
        return res.status(200).json({status: "true", message: "Successfully Delete Account"})
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}
