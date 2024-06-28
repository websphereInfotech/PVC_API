const Salary = require("../models/salary");
const User = require("../models/user");
exports.view_all_salary = async (req, res) => {
    try{
        const companyId = req.user.companyId
        const salaries = await Salary.findAll({
            where: {
                companyId: companyId
            },
            include: [{model: User, as: "employeeSalary"}]
        })
        return res.status(200).json({
            status: "true",
            message: "Salaries Fetch Successfully.",
            data: salaries
        })
    }catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}