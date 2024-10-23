const SalesInvoice = require('../models/salesInvoice')
const PurchaseInvoice = require('../models/purchaseInvoice')
const moment = require('moment')
const {Op} = require("sequelize");
const Receipt = require('../models/Receipt');
const Payment = require('../models/Payment');
const C_Receipt = require('../models/C_Receipt');
const C_Payment = require('../models/C_Payment');

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

exports.totalReceivedAmount = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const totalAmount = await Receipt.sum('amount',
            {
            where: {
                companyId: companyId
            }
        }
    )
       return res.status(200).json({status: "true", message: "Successfully fetch total received.",data: totalAmount ?? 0});
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
};

exports.totalPaymentAmount = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const totalAmount = await Payment.sum('amount',
            {
            where: {
                companyId: companyId
            }
        }
    )
       return res.status(200).json({status: "true", message: "Successfully fetch total received.",data: totalAmount ?? 0});
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
};

exports.totalCashReceivedAmount = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const totalAmount = await C_Receipt.sum('amount',
            {
            where: {
                companyId: companyId
            }
        }
    )
       return res.status(200).json({status: "true", message: "Successfully fetch total cash received.",data: totalAmount ?? 0});
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
};

exports.totalCashPaymentAmount = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const totalAmount = await C_Payment.sum('amount',
            {
            where: {
                companyId: companyId
            }
        }
    )
       return res.status(200).json({status: "true", message: "Successfully fetch total received.",data: totalAmount ?? 0});
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
};