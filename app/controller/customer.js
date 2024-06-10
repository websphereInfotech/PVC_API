const C_customer = require("../models/C_customer");
const bankAccount = require("../models/bankAccount");
const customer = require("../models/customer");

/*=============================================================================================================
                                          Widhout Typc C API
 ============================================================================================================ */
exports.create_customer = async (req, res) => {
  try {
    const {
      accountname,
      shortname,
      email,
      contactpersonname,
      mobileno,
      creditperiod,
      address1,
      address2,
      pincode,
      state,
      city,
      bankdetail,
      creditlimit,
      balance,
      gstnumber,
      bankdetails,
      totalcreadit,
    } = req.body;

    let panno = req.body.panno;
    if (panno === "") {
      panno = null;
    }
    const existingEmail = await customer.findOne({where:{ email:email}});
    if(existingEmail) {
      return res.status(400).json({ status:'false', message:'Email Already Exists'});
    }
    const existingMobile = await customer.findOne({where:{ mobileno:mobileno}});
    if(existingMobile) {
      return res.status(400).json({ status:'false', message:'Mobile Number Already Exists'});
    }
    if (bankdetail === true) {
      if (!bankdetails || bankdetails.length === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Required Filed Of Items" });
      }
      const existingAccount = await bankAccount.findOne({
        where: { accountnumber: bankdetails.accountnumber },
      });

      const existingIFSC = await bankAccount.findOne({
        where: { ifsccode: bankdetails.ifsccode },
      });

      if (existingAccount) {
        return res.status(400).json({
          status: "false",
          message: "Account Number Already Exists",
        });
      }
      if (existingIFSC) {
        return res.status(400).json({
          status: "false",
          message: "IFSC Code Already Exists",
        });
      }
    }
    const customerdata = {
      accountname,
      shortname,
      email,
      contactpersonname,
      mobileno,
      panno,
      creditperiod,
      address1,
      address2,
      pincode,
      state,
      city,
      bankdetail,
      creditlimit,
      balance,
      gstnumber,
      companyId: req.user.companyId,
    };

    if (creditlimit === true) {
      customerdata.totalcreadit = totalcreadit;
    }
    const data = await customer.create(customerdata);
    if (bankdetail === true && bankdetails) {
      const bankdata = {
        customerId: data.id,
        accountnumber: bankdetails.accountnumber,
        ifsccode: bankdetails.ifsccode,
        bankname: bankdetails.bankname,
        accounttype: bankdetails.accounttype,
      };
      await bankAccount.create(bankdata);
    }

    const customerData = await customer.findOne({
      where: { id: data.id,companyId:req.user.companyId },
      include: [{ model: bankAccount, as: "bankdetails" }],
    });
    await C_customer.create({
      customername: contactpersonname,
      companyId: req.user.companyId,
    });
    return res.status(200).json({
      status: "true",
      message: "New customer created successfully",
      data: customerData,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_customer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      accountname,
      shortname,
      email,
      contactpersonname,
      mobileno,
      panno,
      creditperiod,
      address1,
      address2,
      pincode,
      state,
      city,
      bankdetail,
      creditlimit,
      balance,
      gstnumber,
      bankdetails,
      totalcreadit,
    } = req.body;

    const updateData = await customer.findOne({
      where: { id: id,companyId: req.user.companyId },
      include: [{ model: bankAccount, as: "bankdetails" }],
    });

    if (!updateData) {
      return res
        .status(404)
        .json({ status: "false", message: "Customer Not Found" });
    }
   
    if (updateData.email !== email) {
      const existingEmail = await customer.findOne({ where: { email: email } });
      if (existingEmail) {
        return res
          .status(400)
          .json({ status: "false", message: "Email Already Exists" });
      }
      const existingMobile = await customer.findOne({ where: { mobileno: mobileno } });
      if (existingMobile) {
        return res
          .status(400)
          .json({ status: "false", message: "Mobile Number Already Exists" });
      }
    }
    const customerUpdate = {
      accountname,
      shortname,
      email,
      contactpersonname,
      mobileno,
      panno,
      creditperiod,
      address1,
      address2,
      pincode,
      state,
      city,
      bankdetail,
      creditlimit,
      balance,
      gstnumber,
      companyId: req.user.companyId,
    };
    if (creditlimit === true) {
      customerUpdate.totalcreadit = totalcreadit;
    }

    await customer.update(customerUpdate, { where: { id } });

    if (bankdetail === true && bankdetails) {
      const existingItem = await bankAccount.findOne({
        where: { customerId: id, accountnumber: bankdetails.accountnumber },
      });

      if (existingItem) {
        await bankAccount.update(
          {
            ifsccode: bankdetails.ifsccode,
            accounttype: bankdetails.accounttype,
            bankname: bankdetails.bankname,
          },
          {
            where: { id: existingItem.id },
          }
        );
      } else {
        await bankAccount.create({
          customerId: id,
          accountnumber: bankdetails.accountnumber,
          ifsccode: bankdetails.ifsccode,
          accounttype: bankdetails.accounttype,
          bankname: bankdetails.bankname,
        });
      }
    }
    const data = await customer.findOne({
      where: { id: id,companyId: req.user.companyId },
      include: [{ model: bankAccount, as: "bankdetails" }],
    });

    return res.status(200).json({
      status: "true",
      message: "New customer Updated Successfully",
      data: data,
    });
  } catch (error) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal server error" });
  }
};
exports.delete_customer = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;

    const data = await customer.destroy({
      where: { id: id, companyId: companyId },
    });

    if (!data) {
      return res
        .status(400)
        .json({ status: "false", message: "Cusomer Not Found" });
    } else {
      return res
        .status(200)
        .json({ status: "true", message: "Cusomer Delete Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.view_customer = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await customer.findOne({
      where: { id: id, companyId: req.user.companyId },
      include: [{ model: bankAccount, as: "bankdetails" }],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "customer Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "customer data fetch successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_customer = async (req, res) => {
  try {
    const data = await customer.findAll({
      where: { companyId: req.user.companyId },
      include: [{ model: bankAccount, as: "bankdetails" }],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Customer Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Customer Data Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */
exports.C_get_all_customer = async (req, res) => {
  try {
    const data = await C_customer.findAll({
      where: { companyId: req.user.companyId },
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Customer Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Customer Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
