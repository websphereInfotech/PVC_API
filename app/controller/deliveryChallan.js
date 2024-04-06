const deliverychallan = require("../models/deliverychallan");
const deliverychallanitem = require("../models/deliverychallanitem");


exports.create_deliverychallanitem = async (req, res) => {
    try {
      const { deliverychallanId, items } = req.body;
      // console.log("req",req.body);
      await Promise.all(items.map(async item => {
        await deliverychallanitem.create({
          ...item,
          deliverychallanId
        });
      }));
      const createdItems = await deliverychallanitem.findAll({ where: { deliverychallanId } });
      // console.log(createdItems,">>>>>>>>>>>>>>>>>>>>>>>");
      return res.status(200).json({ status: "true", message: "Delivery challan items Created Successfully", data: createdItems });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.create_deliverychallan = async (req, res) => {
    try {
      const { email, date, challanno, mobileno, customer } = req.body
      // console.log("DATA>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.body);
      const data = await deliverychallan.create({
        email,
        mobileno,
        date,
        challanno,
        customer
      })
      return res.status(200).json({ status: "true", message: "delivery challan created successfully", data: data })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.update_deliverychallanitem = async (req, res) => {
    try {
      const { id } = req.params;
      const { expirydate, quotationno, batchno, description, product, qty, mrp, serialno } = req.body;
  
      const deliverychallan = await deliverychallanitem.findByPk(id);
      if (!deliverychallan) {
        return res.status(404).json({ status:'false' ,message: "Delivery challan Item not Found" });
      }
      await deliverychallanitem.update({
        serialno: serialno,
        qty: qty,
        product: product,
        description: description,
        quotationno: quotationno,
        batchno: batchno,
        expirydate: expirydate,
        mrp: mrp
      }, {
        where: { id: id }
      });
      const data = await deliverychallanitem.findByPk(id)
      return res.status(200).json({ status: "true", message: "Delivery challan Item Update Successfully", data: data });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.update_deliverychallan = async (req, res) => {
    try {
      const { id } = req.params
      const { email, mobileno, date, challanno, customer } = req.body
  
      const updatechallan = await deliverychallan.findByPk(id)
  
      if (!updatechallan) {
        return res.status(404).json({ status: "false", message: "Delivery challan Not Found" });
      }
  
      await deliverychallan.update({
        challanno: challanno,
        date: date,
        email: email,
        mobileno: mobileno,
        customer: customer
      }, {
        where: { id: id }
      });
      const data = await deliverychallan.findByPk(id)
      return res.status(200).json({ status: "true", message: "Delivery challan Update Successfully", data: data });
    } catch (error) {
      console.log("ERROR", error)
      return res.status(500).json({ status: "false", message: "Internal server error" })
    }
  }
  exports.delete_deliverychallan = async (req, res) => {
    try {
      const { id } = req.params;
  
      const data = await deliverychallan.destroy({ where: { id: id } });
  
      if (!data) {
        return res.status(400).json({ status: "false", message: "Delivery challan Not Found" });
      } else {
        return res.status(200).json({ status: "true", message: "Delivery challan Delete Successfully" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.delete_deliverychallanitem = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await deliverychallanitem.destroy({ where: { id: id } });
  
      if (!data) {
        return res.status(400).json({ status: "false", message: "Delivery challan Item Not Found" });
      }
      else {
        return res.status(200).json({ status: "true", message: 'Delivery challan Item Delete Successfully' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.get_all_deliverychallan = async (req, res) => {
    try {
      const data = await deliverychallan.findAll({
        include: [{ model: deliverychallanitem }]
      });
      if (!data) {
        return res.status(404).json({ status: "false", message: "Delivery challan Not Found" });
      }
      return res.status(200).json({ status: "true", message: "Delivery challan Data Fetch Successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.view_deliverychallan = async (req, res) => {
    try {
      const { id } = req.params;
  
      const data = await deliverychallan.findOne({
        where: { id },
        include: [{ model: deliverychallanitem }]
      });
  
      if (!data) {
        return res.status(404).json({ status: "false", message: "Delivery challan Not Found" });
      }
      return res.status(200).json({ status: "true", message: "Fetch delivery challan data successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }