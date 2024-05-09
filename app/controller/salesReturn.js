const customer = require('../models/customer');
const salesReturn = require('../models/salesreturn');

exports.create_salesReturn = async (req, res) => {
    try {
      const { customerId, creditnote, creditdate } = req.body;
      const existingCredit = await salesReturn.findOne({ where:creditnote});

      if(existingCredit) {
        return res.status(400).json({status:'false', message:'Credit Note Already Exists'})
      }
      const customerData = await customer.findByPk(customerId);
      if(!customerData) {
        return res.status(404).json({ status:'false', message:'Customer Not Found'});
      }
      const data = await salesReturn.create({
        customerId: customerId,
        creditnote: creditnote,
        creditdate: creditdate
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