const receipt = require("../models/receipt");

exports.create_receipt = async (req, res) => {
    try {
      const { voucherno, account, email, receiptdate, mode, refno, depositto, amountrecive } = req.body;
  
      const data = await receipt.create({
        voucherno,
        account,
        email,
        receiptdate,
        mode,
        refno,
        depositto,
        amountrecive
      });
      return res.status(200).json({ status: 'true', message: 'Receipt Data Create Successfully', data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 'false', message: 'Internal Server Error' });
    }
  }
  exports.update_receipt = async (req, res) => {
    try {
      const { id } = req.params;
      const { voucherno, account, email, receiptdate, mode, refno, depositto, amountrecive } = req.body;
  
      const receiptId = await receipt.findByPk(id);
      if (!receiptId) {
        return res.status(404).json({ status: 'false', message: 'Receipt Data not found' });
      }
  
      await receipt.update({
        voucherno: voucherno,
        account: account,
        email: email,
        receiptdate: receiptdate,
        mode: mode,
        refno: refno,
        depositto: depositto,
        amountrecive: amountrecive
      }, { where: { id: id } });
  
      const data = await receipt.findByPk(id);
      return res.status(200).json({ status: 'true', message: 'Receipt Data Update Successfully', data: data });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 'false', message: 'Internal Server Error' });
    }
  }
  exports.get_all_receipt = async (req, res) => {
    try {
      const data = await receipt.findAll();
      if (data) {
        return res.status(200).json({ status: 'true', message: 'Receipt Data Show Successfully', data: data })
      } else {
        return res.status(404).json({ status: 'false', message: 'Receipt Data Show Successfully' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 'false', message: 'INternal Server Error' });
    }
  }
  exports.view_receipt = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await receipt.findByPk(id);
  
      if (data) {
        return res.status(200).json({ status: 'true', message: 'Receipt Data show Successfully', data: data });
      } else {
        return res.status(404).json({ status: 'false', message: 'Receipt Data Not Found' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 'false', message: 'Internal Server Error' });
    }
  }
  exports.delete_receipt = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await receipt.destroy({ where: { id: id } });
  
      if (data) {
        return res.status(200).json({ status: 'true', message: 'Receipt Data Delete Successfully' });
      } else {
        return res.status(404).json({ status: 'false', message: 'Receipt Data Not Found' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 'false', message: 'Internal Server Error' });
    }
  }