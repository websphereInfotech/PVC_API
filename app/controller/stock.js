const stock = require("../models/stoke");

exports.create_stockitem = async (req, res) => {
    try {
      const { itemname, unit, email, compustk, betchno, physicalstk, adjqty, adjustcomment, wastageqty, wastagecomment, consumeqty, consumecomment } = req.body
      // console.log("DATA>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.body);
      const data = await stock.create({
        itemname,
        unit,
        email,
        compustk,
        betchno,
        physicalstk,
        adjqty,
        adjustcomment,
        wastageqty,
        wastagecomment,
        consumeqty,
        consumecomment
      })
      return res.status(200).json({ status: "true", message: "Stock item created successfully", data: data })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  
  exports.get_all_stock = async (req, res) => {
    try {
      const data = await stock.findAll();
      if (!data) {
        return res.status(404).json({ status: "false", message: "Stock Not Found" });
      }
      return res.status(200).json({ status: "true", message: "Stock Data Fetch Successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  