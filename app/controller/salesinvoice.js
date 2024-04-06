const salesInvoice = require("../models/salesInvoice");
const salesInvoiceItem = require("../models/salesInvoiceitem");

exports.create_salesInvoiceItem = async (req, res) => {
    try {
      const { salesInvoiceId, items } = req.body;
  
      await Promise.all(items.map(async item => {
        await salesInvoiceItem.create({
          ...item,
          salesInvoiceId
        });
      }));
  
      const data = await salesInvoiceItem.findAll({ where: { salesInvoiceId } });
  
      return res.status(200).json({ status: "true", message: "Sales Invoive Item Create Successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.create_salesInvoice = async (req, res) => {
    try {
      const { challanno, challendate, email, mobileno, customer, items } = req.body;
  
      const salesInvoiceData = await salesInvoice.create({
        challanno,
        challendate,
        email,
        mobileno,
        customer
      });
  
      return res.status(200).json({ status: "true", message: "SalesInvoice Create Successfully", data: salesInvoiceData });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.get_all_salesInvoice = async (req, res) => {
    try {
      const data = await salesInvoice.findAll({
        include: [{ model: salesInvoiceItem }]
      });
      if (!data) {
        return res.status(404).json({ status: "false", message: "Sales Invoice Not Found" });
      }
      return res.status(200).json({ status: "true", message: "Sales Invoice Data Fetch Successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.view_salesInvoice = async (req, res) => {
    try {
  
      const { id } = req.params;
  
      const data = await salesInvoice.findOne({
        where: { id },
        include: [{ model: salesInvoiceItem }]
      });
  
      if (!data) {
        return res.status(404).json({ status: "false", message: "Sales Invoice Not Found" });
      }
      return res.status(200).json({ status: "true", message: "Sales invoice data get successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.view_salesInvoice = async (req, res) => {
    try {
      const { id } = req.params;
  
      const data = await salesInvoice.findOne({
        where: { id },
        include: [{ model: salesInvoiceItem }]
      });
  
      if (!data) {
        return res.status(404).json({ status: "false", message: "Sales Invoice Not Found" });
      }
      return res.status(200).json({ status: "ture", message: "Sales Invoice Data Fetch SUccessfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.update_salesInvoiceItem = async (req, res) => {
    try {
      const { id } = req.params;
      const { serialno, quotationno, product, batchno, expirydate, price, quantity } = req.body;
  
      const salesId = await salesInvoiceItem.findByPk(id);
  
      if (!salesId) {
        return res.status(404).json({ status: "false", message: "Sales Invoice Item not Found" });
      }
  
      await salesInvoiceItem.update({
        serialno: serialno,
        quotationno: quotationno,
        product: product,
        batchno: batchno,
        expirydate: expirydate,
        price: price,
        quantity: quantity
      }, {
        where: { id: id }
      });
  
      const data = await salesInvoiceItem.findByPk(id);
  
      return res.status(200).json({ status: "true", message: "Sales Invoice Item Update Successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.update_salesInvoice = async (req, res) => {
    try {
  
      const { id } = req.params;
      const { challenno, challendate, email, mobileno, customer } = req.body;
  
      const salesId = await salesInvoice.findByPk(id);
  
      if (!salesId) {
        return res.status(404).json({ status: "false", message: "Sales Invoice Not Found" });
      }
      await salesInvoice.update({
        challenno: challenno,
        challendate: challendate,
        email: email,
        mobileno: mobileno,
        customer: customer
      }, {
        where: { id: id }
      });
  
      const data = await salesInvoice.findOne({
        where: { id: id },
        // include: [{ model: salesInvoiceItem }]
      });
  
      return res.status(200).json({ status: "true", message: "Sales Invoice Update Successfuly", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.delete_salesInvoiceItem = async (req, res) => {
    try {
  
      const { id } = req.params;
      const data = await salesInvoiceItem.destroy({ where: { id: id } });
  
      if (!data) {
        return res.status(404).json({ status: "false", message: "Sales Invoice Not Found" });
      } else {
        return res.status(200).json({ status: "true", message: "Sales Deleted Successfully" });
      }
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.delete_salesInvoice = async (req, res) => {
    try {
  
      const { id } = req.params;
      const data = await salesInvoice.destroy({ where: { id: id } });
      if (!data) {
        return res.status(404).json({ status: "false", message: "Sales Invoice Not Found" });
      } else {
        return res.status(200).json({ status: "true", message: "Sales Invoice Deleted Successfully" });
      }
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "nternal Server Error" });
    }
  }
  