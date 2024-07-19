const cron = require('node-cron');
const Stock = require('../models/stock');
const Product = require('../models/product');
const Notification = require('../models/notification');
const RegularMaintenance = require('../models/RegularMaintenance');
const PreventiveMaintenance = require('../models/PreventiveMaintenance');
const Machine = require('../models/Machine');
const Salary = require('../models/salary')
const moment = require("moment");
const company = require("../models/company");
const User = require("../models/user");
const {Op} = require("sequelize");

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
            await Notification.create({
                notification: `${productName} product is below the low stock threshold. Current stock: ${stock}`,
                companyId: companyId
            })
        }
    }



    // Regular Maintenance Notification Logic......................
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const regularMaintenanceDates = await RegularMaintenance.findAll({
        where: {
            date: {
                [Op.between]: [today, nextWeek]
            }
        },
        include: [{model: Machine, as: "machineRegularMaintenance"}]
    })
    for(const regularMaintenanceDate of regularMaintenanceDates){
        const machineName = regularMaintenanceDate.machineRegularMaintenance.name;
        const date = regularMaintenanceDate.date;
        const companyId = regularMaintenanceDate.companyId;
        const notification = `Scheduled regular maintenance on ${machineName} will occur on ${date}. Please plan accordingly`;
        await Notification.create({
            notification: notification,
            type: null,
            companyId: companyId
        })
    }

    // Preventive Maintenance Notification Logic......................
    const preventiveMaintenanceDates = await PreventiveMaintenance.findAll({
        where: {
            date: {
                [Op.between]: [today, nextWeek]
            }
        },
        include: [{model: Machine, as: "machineRegularMaintenance"}]
    })
    for(const preventiveMaintenanceDate of preventiveMaintenanceDates){
        const machineName = preventiveMaintenanceDate.preventiveMaintenanceDate.name;
        const date = preventiveMaintenanceDate.date;
        const companyId = preventiveMaintenanceDate.companyId;
        const notification = `Scheduled preventive maintenance on ${machineName} will occur on ${date}. Please plan accordingly`;
        await Notification.create({
            notification: notification,
            type: null,
            companyId: companyId
        })
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