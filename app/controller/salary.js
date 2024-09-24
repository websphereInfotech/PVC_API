const Salary = require("../models/salary");
const User = require("../models/user");
const SalaryPayment = require("../models/salaryPayment");
const CompanyBank = require("../models/companyBankDetails");
const UserBankAccount = require("../models/userBankAccount");
const moment = require("moment");
exports.view_all_salary = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const salaries = await Salary.findAll({
      where: {
        companyId: companyId,
      },
      include: [{ model: User, as: "employeeSalary" }],
    });

    const salariesByMonth = {};

    await Promise.all(
      salaries.map(async (salary) => {
        const monthName = moment(salary.monthStartDate)
          .format("MMMM YYYY")
          .replace(" ", "_");

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
          status: salary.status,
          payableAmount: salary.payableAmount,
          employee: salary.employeeSalary,
        });
      })
    );

    const sortedMonths = Object.keys(salariesByMonth).sort((a, b) => {
      return (
        moment(a.replace("_", " "), "MMMM YYYY").valueOf() -
        moment(b.replace("_", " "), "MMMM YYYY").valueOf()
      );
    });

    const sortedSalariesByMonth = {};
    sortedMonths.forEach((month) => {
      sortedSalariesByMonth[month] = salariesByMonth[month];
    });
    // Object.keys(sortedSalariesByMonth).forEach(month => {
    //     const totalAmount = sortedSalariesByMonth[month].reduce((acc, record) => acc + record.amount, 0);
    //     sortedSalariesByMonth[month] = {
    //         total_amount: totalAmount,
    //         records: sortedSalariesByMonth[month]
    //     };
    // });

    return res.status(200).json({
      status: "true",
      message: "Salaries Fetch Successfully.",
      data: sortedSalariesByMonth,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

// exports.salary_status = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const {status} = req.query;
//         if (!status || (status !== SALARY_STATUS.PAID && status !== SALARY_STATUS.CANCELED)) {
//             return res.status(400).json({
//                 status: "false",
//                 message: "Invalid status provided. Status must be 'paid' or 'cancelled'."
//             });
//         }
//         const findSalary = await Salary.findOne({
//             where: {
//                 id: id,
//                 status: SALARY_STATUS.PENDING
//             }
//         });
//         if(!findSalary){
//             return res.status(404).json({ status: "false", message: "Employee Salary not found" });
//         }
//         findSalary.status = status
//         await findSalary.save()
//         return res.status(200).json({
//             status: "true",
//             message: "Operation Successfully Done.",
//             data: findSalary
//         })
//     }
//     catch (e) {
//         console.error(e);
//         return res.status(500).json({ status: "false", message: "Internal Server Error" });
//     }
// }

exports.add_salary_payment = async (req, res) => {
  try {
    const { salaryId } = req.params;
    const { amount, date, paymentType, companyBankId, userBankId } = req.body;
    const companyId = req.user.companyId;
    const salaryData = await Salary.findOne({
      where: {
        id: salaryId,
        companyId: companyId,
      },
    });
    if (!salaryData) {
      return res.status(404).json({
        status: "false",
        message: "User Salary Not Found.",
      });
    }
    const payableAmount = salaryData.payableAmount;
    if (payableAmount < amount)
      return res.status(400).json({
        status: "false",
        message: `Amount larger than payable amount ${payableAmount}.`,
      });
    const data = await SalaryPayment.create({
      amount: amount,
      salaryId: salaryId,
      paymentType: paymentType,
      date: date,
      companyBankId: companyBankId,
      userBankId: userBankId,
    });
    salaryData.payableAmount -= amount;
    await salaryData.save();
    return res.status(200).json({
      status: "true",
      message: "Salary Payment Successfully.",
      data: data,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.edit_salary_payment = async (req, res) => {
  try {
    const { salaryPaymentId } = req.params;
    const { amount, date, paymentType, companyBankId, userBankId } = req.body;
    const companyId = req.user.companyId;
    const salaryPaymentData = await SalaryPayment.findOne({
      where: {
        id: salaryPaymentId,
      },
    });
    if (!salaryPaymentData) {
      return res.status(404).json({
        status: "false",
        message: "Salary Payment Not Found.",
      });
    }
    const salaryId = salaryPaymentData.salaryId;
    const salaryData = await Salary.findOne({
      where: {
        id: salaryId,
        companyId: companyId,
      },
    });
    if (!salaryData) {
      return res.status(404).json({
        status: "false",
        message: "User Salary Not Found.",
      });
    }

    const payableAmount = salaryData.payableAmount + salaryPaymentData.amount;
    if (payableAmount < amount)
      return res.status(400).json({
        status: "false",
        message: `Amount larger than payable amount ${payableAmount}.`,
      });
    const data = await SalaryPayment.update(
      {
        amount: amount,
        date: date,
        paymentType: paymentType,
        companyBankId: companyBankId,
        userBankId: userBankId,
      },
      { where: { id: salaryPaymentId }, returning: true }
    );

    salaryData.payableAmount -= payableAmount - amount;
    await salaryData.save();
    return res.status(200).json({
      status: "false",
      message: "Salary Payment Update Successfully.",
      data: data,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.delete_salary_payment = async (req, res) => {
  try {
    const { salaryPaymentId } = req.params;
    const companyId = req.user.companyId;
    const salaryPaymentData = await SalaryPayment.findOne({
      where: {
        id: salaryPaymentId,
      },
    });
    if (!salaryPaymentData) {
      return res.status(404).json({
        status: "false",
        message: "Salary Payment Not Found.",
      });
    }
    const salaryId = salaryPaymentData.salaryId;
    const salaryData = await Salary.findOne({
      where: {
        id: salaryId,
        companyId: companyId,
      },
    });
    if (!salaryData) {
      return res.status(404).json({
        status: "false",
        message: "User Salary Not Found.",
      });
    }
    const amount = salaryPaymentData.amount;
    await salaryPaymentData.destroy();
    salaryData.payableAmount += amount;
    await salaryData.save();
    return res.status(200).json({
      status: "false",
      message: "User Salary Payment Delete Successfully.",
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "false", message: "Interval Server Error." });
  }
};

exports.view_all_salary_payment = async (req, res) => {
  try {
    const { salaryId } = req.params;
    const companyId = req.user.companyId;
    const salaryData = await Salary.findOne({
      where: {
        id: salaryId,
        companyId: companyId,
      },
    });
    if (!salaryData) {
      return res.status(404).json({
        status: "false",
        message: "User Salary Not Found.",
      });
    }
    const data = await SalaryPayment.findAll({
      where: {
        salaryId: salaryId,
      },
      include: [
        { model: CompanyBank, as: "salaryPaymentBank" },
        { model: UserBankAccount, as: "salaryPaymentUserBank" },
      ],
    });
    return res.status(200).json({
      status: "true",
      message: "Successfully Fetch User Salary Payment.",
      data: data,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};

exports.employee = async (req, res) => {
  try {
    const {userId}= req.user;
    const employee = await User.findByPk(userId, {attributes: ["username", "entryTime", "exitTime"]});
    return res.status(200).json({
        status: "true",
        message: "Employee Detail Fetch Successfully.",
        data: employee
    })
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};
