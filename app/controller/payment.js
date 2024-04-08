const payment = require("../models/payment");

exports.create_payment = async (req, res) => {
    try {
      const { voucherno, account, email, paymentdate, mode, refno, amountpaid, paidfrom, billno, billfromdate, billtodate,amount } = req.body
      // console.log("DATA>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.body);
      const data = await payment.create({
        voucherno,
        email,
        account,
        paymentdate,
        mode,
        refno,
        paidfrom,
        amountpaid,
        billno,
        billfromdate,
        billtodate,
        amount
      })
      return res.status(200).json({ status: "true", message: "Payment created successfully", data: data })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.update_payment = async (req, res) => {
    try {
      const { id } = req.params
      const { voucherno, account, email, paymentdate, mode, refno, amountpaid, paidfrom, billno, billfromdate, billtodate,amount } = req.body
  
      const updatepayment = await payment.findByPk(id)
  
      if (!updatepayment) {
        return res.status(404).json({ status: "false", message: "Payment Not Found" });
      }
  
      await payment.update({
        voucherno: voucherno,
        email: email,
        account: account,
        paymentdate: paymentdate,
        mode: mode,
        refno: refno,
        paidfrom: paidfrom,
        amountpaid: amountpaid,
        billno: billno,
        billfromdate: billfromdate,
        billtodate: billtodate,
        amount :amount
      }, {
        where: { id: id }
      });
  
      const data = await payment.findByPk(id)
      return res.status(200).json({ status: "true", message: "Payment Updated Successfully", data: data });
    } catch (error) {
      console.log("ERROR", error)
      return res.status(500).json({ status: "false", message: "Internal server error" })
    }
  }
  exports.delete_payment = async (req, res) => {
    try {
      const { id } = req.params;
  
      const data = await payment.destroy({ where: { id: id } });
  
      if (!data) {
        return res.status(400).json({ status: "false", message: "Payment Not Found" });
      } else {
        return res.status(200).json({ status: "true", message: "Payment Delete Successfully" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.view_payment = async (req, res) => {
    try {
      const { id } = req.params;
  
      const data = await payment.findOne({
        where: { id }
      });
  
      if (!data) {
        return res.status(404).json({ status: "false", message: "Payment Not Found" });
      }
      return res.status(200).json({ status: "true", message: "Payment data fetch successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.get_all_payment = async (req, res) => {
    try {
      const data = await payment.findAll();
      if (!data) {
        return res.status(404).json({ status: "false", message: "Payment Not Found" });
      }
      return res.status(200).json({ status: "true", message: "Payment Data Fetch Successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }