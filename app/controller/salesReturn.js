const salesReturn = require('../models/salesreturn');

exports.create_salesReturn = async (req, res) => {
    try {
      const { customer, creditnote, creditdate, sr_no, batch_no, expiry_date, amount, invoiceno, invoicedate,
        quantity } = req.body;
  
      const data = await salesReturn.create({
        customer: customer,
        creditnote: creditnote,
        creditdate: creditdate,
        sr_no: sr_no,
        batch_no: batch_no,
        expiry_date: expiry_date,
        amount: amount,
        invoiceno: invoiceno,
        invoicedate: invoicedate,
        quantity: quantity
      });
  
      return res.status(200).json({ status: "true", message: "Sales Return Create Successfully", data: data })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.get_all_salesReturn = async (req, res) => {
    try {
      const data = await salesReturn.findAll();
  
      if (!data) {
        return res.status(404).json({ status: "false", message: "Sales Return Not Found" });
      } else {
        return res.status(200).json({ status: "true", message: "Sales Return Data Fetch Successfully", data: data });
      }
    } catch (error) {
  
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }