const purchase = require("../models/purchase");
const purchaseitem = require("../models/purchaseitem");

exports.create_purchase = async (req, res) => {
    try {
      const { email, date, quotation_no, mobileno, customer, pono, quotationref } = req.body
    //   console.log("DATA>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", req.body);
      const data = await purchase.create({
        email,
        mobileno,
        date,
        quotation_no,
        customer,
        quotationref,
        pono
      })
      return res.status(200).json({ status: "true", message: "Purchase created successfully", data: data })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.create_purchaseitem = async (req, res) => {
    try {
      const { purchaseId, items } = req.body;
  
      await Promise.all(items.map(async item => {
        await purchaseitem.create({
          ...item,
          purchaseId
        });
      }));
  
      const createdItems = await purchaseitem.findAll({ where: { purchaseId } });
      // console.log(createdItems,">>>>>>>>>>>>>>>>>>>>>>>");
      return res.status(200).json({ status: "true", message: "Purchase items Created Successfully", data: createdItems });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.update_purchaseitem = async (req, res) => {
    try {
      const { itemid } = req.params;
      const { date, discount, product, qty, rate, serialno, amount } = req.body;
  
      const deliverychallan = await purchaseitem.findByPk(itemid);
      if (!deliverychallan) {
        return res.status(404).json({ message: "Purchase Item not Found" });
      }
      await purchaseitem.update({
        serialno: serialno,
        qty: qty,
        product: product,
        discount: discount,
        date: date,
        rate: rate,
        amount: amount
      }, {
        where: { id: itemid }
      });
      const data = await purchaseitem.findByPk(itemid);
      return res.status(200).json({ status: "true", message: "Purchase Item Update Successfully", data: data });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }

  exports.update_purchase = async (req, res) => {
    try {
      const { id } = req.params
      const { email, mobileno, date, pono, customer, quotation_no, quotationref } = req.body
  
      const updatechallan = await purchase.findByPk(id)
  
      if (!updatechallan) {
        return res.status(404).json({ status: "false", message: "Purchase Not Found" });
      }
  
      await purchase.update({
        quotation_no: quotation_no,
        date: date,
        email: email,
        mobileno: mobileno,
        customer: customer,
        pono: pono,
        quotationref: quotationref
  
      }, {
        where: { id: id }
      });
      const data = await purchase.findByPk(id)
      return res.status(200).json({ status: "true", message: "Purchase Updated Successfully", data: data });
    } catch (error) {
      console.log("ERROR", error)
      return res.status(500).json({ status: "false", message: "Internal server error" })
    }
  }
  exports.delete_purchase = async (req, res) => {
    try {
      const { id } = req.params;
  
      const data = await purchase.destroy({ where: { id: id } });
  
      if (!data) {
        return res.status(400).json({ status: "false", message: "Purchase Not Found" });
      } else {
        return res.status(200).json({ status: "true", message: "Purchase Delete Successfully" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.delete_purchaseitem = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await purchaseitem.destroy({ where: { id: id } });
  
      if (!data) {
        return res.status(400).json({ status: "false", message: "Purchase Item Not Found" });
      } else {
        return res.status(200).json({ status: "true", message: 'Purchase Item Delete Successfully' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.get_all_purchase = async (req, res) => {
    try {
      const data = await purchase.findAll({
        include: [{ model: purchaseitem }]
      });
      if (!data) {
        return res.status(404).json({ status: "false", message: "Purchase Not Found" });
      }
      return res.status(200).json({ status: "true", message: "Purchase Data Fetch Successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.view_purchase = async (req, res) => {
    try {
      const { id } = req.params;
  
      const data = await purchase.findOne({
        where: { id },
        include: [{ model: purchaseitem }]
      });
  
      if (!data) {
        return res.status(404).json({ status: "false", message: "Purchase Not Found" });
      }
      return res.status(200).json({ status: "true", message: "Purchase data fetch successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }