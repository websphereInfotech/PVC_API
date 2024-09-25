const cron = require('node-cron');
const Stock = require('../models/stock');
const Product = require('../models/product');
const Notification = require('../models/notification');
const Salary = require('../models/salary')
const moment = require("moment");
const company = require("../models/company");
const User = require("../models/user");
const {Op} = require("sequelize");

exports.lowStockNotificationJob = cron.schedule('0 0 * * *', async () => {
    const itemStocks = await Stock.findAll({
        include: {model: Product, as: "itemStock"}
    })
    for(const item of itemStocks){
        const stock = item.qty;
        const isLowStock = item.itemStock.lowstock;
        const lowStockQty = item.itemStock.lowStockQty;
        const itemName = item.itemStock.productname;
        const companyId = item.itemStock.companyId
        if (isLowStock && stock <= lowStockQty) {
            await Notification.create({
                notification: `${itemName} product is below the low stock threshold. Current stock: ${stock}`,
                companyId: companyId
            })
        }
    }
});

exports.employeeSalaryCountJob = cron.schedule('0 0 * * *', async () => {
    const date = new Date();
    const startDate = moment().startOf('month').format('YYYY-MM-DD');
    const endDate = moment().endOf('month').format('YYYY-MM-DD');
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
                const daySalary = user.salary
                await Salary.create({
                    companyId: company.id,
                    userId: user.id,
                    amount: daySalary,
                    monthStartDate: startDate,
                    monthEndDate: endDate,
                    payableAmount: daySalary
                })
            }
        }
    }else{
        for(const company of companies){
            const users = company.users;
            for(const user of users){
                const daySalary = user.salary
                let latestSalary = await Salary.findOne({
                    where: {
                        companyId: company.id,
                        userId: user.id,
                    },
                    order: [
                        ['monthStartDate', 'DESC']
                    ]
                });
                latestSalary.amount += daySalary;
                latestSalary.payableAmount += daySalary;
                await latestSalary.save();
                // if (!latestSalary) {
                //     await Salary.create({
                //         companyId: company.id,
                //         userId: user.id,
                //         amount: daySalary,
                //         monthStartDate: date,
                //         monthEndDate: date,
                //     });
                // } else {
                //     if (latestSalary.status === SALARY_STATUS.PENDING) {
                //         latestSalary.amount += daySalary;
                //         latestSalary.monthEndDate = date;
                //         await latestSalary.save();
                //     } else if (latestSalary.status === SALARY_STATUS.PAID || latestSalary.status === SALARY_STATUS.CANCELED) {
                //         await Salary.create({
                //             companyId: company.id,
                //             userId: user.id,
                //             amount: daySalary,
                //             monthStartDate: latestSalary.monthEndDate,
                //             monthEndDate: date,
                //         });
                //     }
                // }
            }
        }
    }
})