const expense = require("../models/expense");
const expenseItem = require("../models/expenseItem");


exports.create_expense = async (req, res) => {
    try {
      const { customer, voucherno, date, gstin, mobileno, email, billno, billdate, payment } = req.body;
  
      const data = await expense.create({
        customer: customer,
        voucherno: voucherno,
        date: date,
        gstin: gstin,
        mobileno: mobileno,
        email: email,
        billno: billno,
        billdate: billdate,
        payment: payment
      })
  
      return res.status(200).json({ status: "true", message: "Expense Create Successfully", data: data });
    } catch (error) {
  
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.create_expenseItem = async (req, res) => {
    try {
      const { expenseId, items } = req.body;
  
      await Promise.all(items.map(async item => {
        await expenseItem.create({
          ...item,
          expenseId: expenseId
        });
      }));
  
      const data = await expenseItem.findAll({ where: { expenseId } });
  
      return res.status(200).json({ status: "true", message: "Expense Item Create Successfully", data: data });
    } catch (error) {
  
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.get_all_expense = async (req, res) => {
    try {
  
      const data = await expense.findAll({
        include: [{ model: expenseItem }]
      });
  
      if (!data) {
        return res.status(404).json({ status: "false", message: "Expense Data Not Found" });
      } else {
        return res.status(200).json({ status: "true", message: "Expense Data Fetch Successfully", data: data });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.view_expense = async (req, res) => {
    try {
  
      const { id } = req.params;
      const data = await expense.findOne({
        where: { id },
        include: [{ model: expenseItem }]
      });
  
      if (!data) {
        return res.status(404).json({ status: "Fail", message: "Expense Data Not Found" });
      } else {
        return res.status(200).json({ status: "True", message: "Expense Data Fetch Successfully", data: data });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "Fail", message: "Internal Server Error" });
    }
  }
  exports.update_expense = async (req, res) => {
    try {
  
      const { id } = req.params;
      const { customer, voucherno, date, gstin, mobileno, email, billno, billdate, payment } = req.body;
  
      const expensedata = await expense.findByPk(id);
      if (!expensedata) {
        return res.status(404).json({ status: "false", message: "Expense not Found" });
      }
      await expense.update({
        customer: customer,
        voucherno: voucherno,
        date: date,
        gstin: gstin,
        mobileno: mobileno,
        email: email,
        billno: billno,
        billdate: billdate,
        payment: payment
      }, {
        where: { id: id }
      });
      const data = await expense.findByPk(id);
      return res.status(200).json({ status: "true", message: "Expense Data Update Successfully", data: data });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.update_expenseItem = async (req, res) => {
    try {
      const { id } = req.params;
      const { serialno, expensse, description, taxable, price } = req.body;
  
      const expenseId = await expenseItem.findByPk(id);
  
      if (!expenseId) {
        return res.status(404).json({ status: "false", message: "Expense Item Not Found" });
      }
  
      await expenseItem.update({
        serialno: serialno,
        expensse: expensse,
        description: description,
        taxable: taxable,
        price: price
      }, {
        where: { id: id }
      });
      const data = await expenseItem.findOne({
        where: { id: id },
      })
      return res.status(200).json({ status: "true", message: "Expense Item Update Successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.delete_expense = async (req, res) => {
    try {
  
      const { id } = req.params;
      const data = await expense.destroy({ where: { id: id } });
  
      if (!data) {
        return res.status(404).json({ status: "false", message: "Expense Not Found" });
      } else {
        return res.status(200).json({ status: "true", message: 'Expense Item Delete Successfully' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.delete_expenseItem = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await expenseItem.destroy({ where: { id: id } });
  
      if (!data) {
        return res.status(404).json({ status: "false", message: "Expense Item Not Found" });
      } else {
        return res.status(200).json({ status: "true", message: 'Expense Item Delete Successfully' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  