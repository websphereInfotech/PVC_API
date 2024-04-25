const expense = require("../models/expense");
const expenseItem = require("../models/expenseItem");


exports.create_expense = async (req, res) => {
    try {
      const { customer, voucherno, date, gstin, mobileno, email, billno, billdate, payment,items } = req.body;
  
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
      });
      if(!items || items.length === 0){
        return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
      }

      const addToItem = items.map((item) => ({
        expenseId: data.id,
        ...item
      }));
      await expenseItem.bulkCreate(addToItem);

      const expenseData = await expense.findOne({
        where : {id:data.id},
        include:[{model:expenseItem, as:'items'}]
      })
      return res.status(200).json({ status: "true", message: "Expense Create Successfully", data: expenseData });
    } catch (error) {
  
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.get_all_expense = async (req, res) => {
    try {
  
      const data = await expense.findAll({
        include: [{ model: expenseItem, as:'items' }]
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
        include: [{ model: expenseItem, as:'items' }]
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
      const { customer, voucherno, date, gstin, mobileno, email, billno, billdate, payment,items } = req.body;
  
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

      if(Array.isArray(items)) {
        const existingItems = await expenseItem.findAll({
          where :{ expenseId:id}
        });

        for(const item of items) {
          const existingItem = existingItems.find((i) => i.serialno === item.serialno);
          if(existingItem) {
            await expenseItem.update({
              expensse: item.expensse,
              description:item.description,
              taxable: item.taxable,
              mrp: item.mrp
            });
          } else {
            await expenseItem.create({
              expenseId : id,
              ...item
            });
          }
        }
      }
      const data = await expense.findOne({
        where:{id},
        include:[{model:expenseItem, as:'items'}]
      });
      return res.status(200).json({ status: "true", message: "Expense Data Update Successfully", data: data });
    } catch (error) {
      console.log(error.message);
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
  