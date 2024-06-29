const cron = require('node-cron');
const Stock = require('../models/stock');
const C_Stock = require('../models/C_stock');
const Product = require('../models/product');
const C_Product = require('../models/C_product');
const Notification = require('../models/notification');
const Salary = require('../models/salary')
const {isLastDayOfMonth} = require("../constant/common");
const moment = require("moment");
const company = require("../models/company");
const User = require("../models/user");
const {Op} = require("sequelize");
const {SALARY_STATUS} = require("../constant/constant");

exports.lowStockNotificationJob = cron.schedule('0 0 * * *', async () => {
    const productStocks = await Stock.findAll({
        include: {model: Product, as: "productStock"}
    })
    for(const product of productStocks){
        const stock = product.qty;
        const isLowStock = product.productStock.lowstock;
        const lowStockQty = product.productStock.lowStockQty;
        const productName = product.productStock.productname;
        const companyId = product.productStock.companyId
        if (isLowStock && stock <= lowStockQty) {
            console.log("Hello this is one of use................", product.id);
            await Notification.create({
                notification: `${productName} product is below the low stock threshold. Current stock: ${stock}`,
                companyId: companyId
            })
        }
    }


    // For Cash
    const productCashStocks = await C_Stock.findAll({
        include: {model: C_Product, as: "productCashStock"}
    })
    for(const product of productCashStocks){
        const stock = product.qty;
        const isLowStock = product.productCashStock.lowstock;
        const lowStockQty = product.productCashStock.lowStockQty;
        const productName = product.productCashStock.productname;
        const companyId = product.productCashStock.companyId
        if (isLowStock && stock <= lowStockQty) {
            console.log("Hello this is one of use................", product.id);
            await Notification.create({
                notification: `${productName} cash product is below the low stock threshold. Current stock: ${stock}`,
                type: "C",
                companyId: companyId
            })
        }
    }
});

exports.employeeSalaryCountJob = cron.schedule('0 0 * * *', async () => {
    const date = new Date();
    const startDate = moment().startOf('month').format('YYYY-MM-DD');
    const daysInThisMonth = moment().daysInMonth();
    const momentDate = moment(date);
    const isFirstDayOfMonth = momentDate.isSame(momentDate.clone().startOf('month'), 'day');
    const companies = await company.findAll({
        include: {
            model: User,
            as: "users",
            through: { attributes: [] },
            where: {
                role: { [Op.ne]: "Super Admin" },
            }
        },
    });


    if(isFirstDayOfMonth){
        for(const company of companies){
            const users = company.users;
            for(const user of users){
                const daySalary = user.salary / daysInThisMonth
                await Salary.create({
                    companyId: company.id,
                    userId: user.id,
                    amount: daySalary,
                    monthStartDate: startDate,
                    monthEndDate: date,
                })
            }
        }
    }else{
        for(const company of companies){
            const users = company.users;
            for(const user of users){
                const daySalary = user.salary / daysInThisMonth
                let latestSalary = await Salary.findOne({
                    where: {
                        companyId: company.id,
                        userId: user.id,
                    },
                    order: [
                        ['monthStartDate', 'DESC']
                    ]
                });
                if (!latestSalary) {
                    await Salary.create({
                        companyId: company.id,
                        userId: user.id,
                        amount: daySalary,
                        monthStartDate: date,
                        monthEndDate: date,
                    });
                } else {
                    if (latestSalary.status === SALARY_STATUS.PENDING) {
                        latestSalary.amount += daySalary;
                        latestSalary.monthEndDate = date;
                        await latestSalary.save();
                    } else if (latestSalary.status === SALARY_STATUS.PAID || latestSalary.status === SALARY_STATUS.CANCELED) {
                        await Salary.create({
                            companyId: company.id,
                            userId: user.id,
                            amount: daySalary,
                            monthStartDate: latestSalary.monthEndDate,
                            monthEndDate: date,
                        });
                    }
                }
            }
        }
    }
})