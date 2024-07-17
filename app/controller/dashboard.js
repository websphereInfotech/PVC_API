const SalesInvoice = require('../models/salesInvoice')
const PurchaseInvoice = require('../models/purchaseInvoice')
const moment = require('moment')
const {Op} = require("sequelize");

exports.totalSales = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();
        const sales = await SalesInvoice.sum('mainTotal',{
            where: {
                invoicedate: {
                    [Op.between]: [startOfMonth, endOfMonth]
                },
                companyId: companyId
            }
        })
        return res.status(200).json({status: "true", message: "Successfully fetch total sales.", data: sales ?? 0});
    }catch (e) {
        console.log(e);
        return res.status(500).json({status: "false", message: "Internal Server Error"})
    }
}

exports.totalPurchase = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();
        const purchases = await PurchaseInvoice.sum('mainTotal',{
            where: {
                invoicedate: {
                    [Op.between]: [startOfMonth, endOfMonth]
                },
                companyId: companyId
            }
        })
        return res.status(200).json({status: "true", message: "Successfully fetch total purchase.", data: purchases ?? 0});
    }catch (e) {
        console.log(e);
        return res.status(500).json({status: "false", message: "Internal Server Error"})
    }
}