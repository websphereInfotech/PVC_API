const Salary = require("../models/salary");
const User = require("../models/user");
const moment = require("moment");
const {SALARY_STATUS} = require("../constant/constant");
exports.view_all_salary = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const salaries = await Salary.findAll({
            where: {
                companyId: companyId
            },
            include: [{ model: User, as: "employeeSalary" }]
        });

        const salariesByMonth = {};

        await Promise.all(salaries.map(async (salary) => {
            const monthName = moment(salary.monthStartDate).format('MMMM YYYY');

            if (!salariesByMonth[monthName]) {
                salariesByMonth[monthName] = [];
            }

            salariesByMonth[monthName].push({
                id: salary.id,
                companyId: salary.companyId,
                userId: salary.userId,
                amount: salary.amount,
                monthStartDate: salary.monthStartDate,
                monthEndDate: salary.monthEndDate,
                employee: salary.employeeSalary
            });
        }));

        const sortedMonths = Object.keys(salariesByMonth).sort((a, b) => {
            return moment(a, 'MMMM YYYY').valueOf() - moment(b, 'MMMM YYYY').valueOf();
        });

        const sortedSalariesByMonth = {};
        sortedMonths.forEach(month => {
            sortedSalariesByMonth[month] = salariesByMonth[month];
        });

        return res.status(200).json({
            status: "true",
            message: "Salaries Fetch Successfully.",
            data: sortedSalariesByMonth
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
}

exports.salary_status = async (req, res) => {
    try {
        const { id } = req.params;
        const {status} = req.query;
        if (!status || (status !== SALARY_STATUS.PAID && status !== SALARY_STATUS.CANCELED)) {
            return res.status(400).json({
                status: "false",
                message: "Invalid status provided. Status must be 'paid' or 'cancelled'."
            });
        }
        const findSalary = await Salary.findOne({
            where: {
                id: id,
                status: SALARY_STATUS.PENDING
            }
        });
        if(!findSalary){
            return res.status(404).json({ status: "false", message: "Employee Salary not found" });
        }
        findSalary.status = status
        await findSalary.save()
        return res.status(200).json({
            status: "true",
            message: "Operation Successfully Done.",
            data: findSalary
        })
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
}