const C_customer = require("../models/C_customer");
const C_salesinvoice = require("../models/C_salesinvoice");

exports.C_create_receivePayment = async(req,res) => {
    try {
        const {customerId,mrp,description,date} = req.body;
        const customerData = await C_customer.findByPk(customerId);
        if(!customerData) {
            return res.status(404).json({ status:'false', message:'Customer Not Found'});
        }
        const customerdata = await C_salesinvoice.findOne({ where: {customerId}});
        console.log("customerdata>>>>>>>>>>>>",customerdata);
    } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ status: "false", message: "Internal Server Error" });
    }
}
