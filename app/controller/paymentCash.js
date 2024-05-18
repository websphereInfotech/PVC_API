const C_PaymentCash = require("../models/C_paymentCash");
const C_vendor = require("../models/C_vendor");


/*=============================================================================================================
                                         Typc C API
 ============================================================================================================ */

 exports.C_create_paymentCash = async (req, res) => {
    try {
      const { vendorId, amount, description, date } = req.body;
  
      const customerData = await C_vendor.findByPk(vendorId);
      if (!customerData) {
        return res
          .status(404)
          .json({ status: "false", message: "Vendor Not Found" });
      }
  
      if(description.length > 20) {
        return res.status(400).json({ status:'false', message:'Description Cannot Have More Then 20 Characters'})
      }
      const data = await C_PaymentCash.create({
        vendorId,
        amount,
        description,
        date,
      });
  
      return res.status(200).json({
        status: "true",
        message: "Payment Cash Create Successfully",
        data: data,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "false", message: "Internal Server Error" });
    }
  };
  
  exports.C_get_all_paymentCash = async (req,res) => {
    try {
      const data = await C_PaymentCash.findAll({
        include:[{model:C_vendor, as:'PaymentVendor'}]
      })
      if(data) {
        return res.status(200).json({ status:'true', message:'Payment Cash Data Fetch Successfully',data:data});
      } else {
        return res.status(404).json({ status:'false', message:'Payment Cash not found'});
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "false", message: "Internal Server Error" });
    }
  }
  
  exports.C_view_paymentCash = async (req,res) => {
    try {
      const {id} = req.params;
      const data = await C_PaymentCash.findOne({ where:{id:id}, include:[{model:C_vendor, as:'PaymentVendor'}]});
      if(data) {
        return res.status(200).json({ status:'true', message:'Payment Cash Data Fetch Successfully',data:data});
      } else {
        return res.status(404).json({ status:'false', message:'Payment Cash not found'});
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "false", message: "Internal Server Error" });
    }
  }
  
  exports.C_update_paymentCash = async (req,res) => {
    try {
      const {id} = req.params;
      const { customerId, amount, description, date } = req.body;
  
      const paymentId = await C_PaymentCash.findByPk(id);
      if(!paymentId) {
        return res.status(404).json({ status:'false', message:'Payment Cash Not Found'});
      }
  
      await C_PaymentCash.update({
        customerId,
        amount,
        description,
        date
      }, {where:{id:id}});
      const data = await C_PaymentCash.findByPk(id);
      return res.status(200).json({ status:'true', message:'Payment Cash Updated Successfully',data:data});
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "false", message: "Internal Server Error" });
    }
  }
  
  exports.C_delete_paymentCash = async (req,res) => {
    try {
      const {id} = req.params;
  
      const data = await C_PaymentCash.destroy({ where:{id}});
      if(data) {
        return res.status(200).json({ status:'true', message:'Payment Cash Deleted Successfully'});
      } else {
        return res.status(404).json({ status:'false', message:'Payment Cash Not Found'});
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: "false", message: "Internal Server Error" });
    }
  }