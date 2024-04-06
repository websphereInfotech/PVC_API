const purchasebill = require("../models/purchasebill");
const purchasebillItem = require("../models/purchasebill_item");


exports.create_purchasebill = async (req, res) => {
    try {
      const { vendor, mobileno, email, billno, billdate, terms, duedate, book, pono } = req.body;
      // console.log("req",req.body);
      const data = await purchasebill.create({
        vendor,
        mobileno,
        email,
        billno,
        billdate,
        terms,
        duedate,
        book,
        pono
      });
      // console.log("data",data);
      return res.status(200).json({ status: "True", message: "Purchase Bill Create Successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.create_purchasebill_item = async (req, res) => {
    try {
      const { purchasebillId, items } = req.body;
  
      await Promise.all(items.map(async item => {
        await purchasebillItem.create({
          ...item,
          purchasebillId: purchasebillId
        });
      }));
  
      const data = await purchasebillItem.findAll({ where: { purchasebillId } });
  
      return res.status(200).json({ status: true, message: "Purchase Bill Item Create Successfully", data: data });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.update_purchasebill = async (req, res) => {
    try {
      const { id } = req.params;
      const { vendor, mobileno, email, billno, billdate, terms, duedate, book, pono } = req.body;
  
      const billId = await purchasebill.findByPk(id);
      if (!billId) {
        return res.status(404).json({ status: "false", message: "Purchase Bill Not Found" });
      }
  
      await purchasebill.update({
        vendor: vendor,
        mobileno: mobileno,
        email: email,
        billno: billno,
        billdate: billdate,
        terms: terms,
        duedate: duedate,
        book: book,
        pono: pono
      }, { where: { id: id } });
  
      const data = await purchasebill.findByPk(id);
      return res.status(200).json({ status: 'true', message: "Purchase Bill Update Successfully", data: data });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.update_purchasebill_item = async (req, res) => {
    try {
      const { id } = req.params;
      const { product, qty, rate, mrp } = req.body;
  
      const billId = await purchasebillItem.findByPk(id);
      if (!billId) {
        return res.status(404).json({ status: "false", message: "Purchase Bill Item Not Found" });
      }
  
      await purchasebillItem.update({
        product: product,
        qty: qty,
        rate: rate,
        mrp: mrp
      }, {
        where: { id: id }
      });
  
      const data = await purchasebillItem.findByPk(id);
      return res.status(200).json({ status: 'true', message: "Purchase Bill Item Update Successfully", data: data });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.delete_purchasebill = async (req, res) => {
    try {
      const { id } = req.params;
      const billId = await purchasebill.destroy({ where: { id: id } });
      console.log("bill", billId);
      if (billId) {
        return res.status(200).json({ status: "true", message: "Purchase Bill Delete Successfully" });
      } else {
        return res.status(404).json({ status: "False", message: "Purchase Bill Not Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.delete_purchasebill_item = async (req, res) => {
    try {
      const { id } = req.params;
      const billId = await purchasebillItem.destroy({ where: { id: id } });
  
      if (billId) {
        return res.status(200).json({ status: "true", message: "Purchase Bill Item Delete Successfully" });
      } else {
        return res.status(404).json({ status: "False", message: "Purchase Bill Item Not Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.get_all_purchasebill = async (req, res) => {
    try {
      const data = await purchasebill.findAll({
        include: [{ model: purchasebillItem }]
      });
  
      if (data) {
        return res.status(200).json({ status: "true", message: "All Purchase data show Successfully", data: data });
      } else {
        return res.status(404).json({ status: "false", message: "Purchase Bill Not Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.view_purchasebill = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await purchasebill.findOne({
        where: { id },
        include: [{ model: purchasebillItem }]
      });
      if (data) {
        return res.status(200).json({ status: "true", message: "Purchase data show Successfully", data: data });
      } else {
        return res.status(404).json({ status: "false", message: "Purchase Bill Not Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }