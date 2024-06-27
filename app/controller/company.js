const C_companyBalance = require("../models/C_companyBalance");
const C_userBalance = require("../models/C_userBalance");
const admintoken = require("../models/admintoken");
const company = require("../models/company");
const companyBalance = require("../models/companyBalance");
const companyBankDetails = require("../models/companyBankDetails");
const companySingleBank = require("../models/companySingleBank");
const companyUser = require("../models/companyUser");
const permissionAdd = require("../util/permissions");
const jwt = require("jsonwebtoken");

/*=============================================================================================================
                                        Without Typc C API
 ============================================================================================================ */

exports.create_company = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      companyname,
      gstnumber,
      email,
      mobileno,
      address1,
      address2,
      pincode,
      state,
      city,
      country,
    } = req.body;

    const existingCompany = await company.findOne({
      where: { companyname: companyname },
    });
    if (existingCompany) {
      return res
        .status(400)
        .json({ status: "false", message: "Company Already Exists" });
    }
    const existingEmail = await company.findOne({ where: { email: email } });
    if (existingEmail) {
      return res
        .status(400)
        .json({ status: "false", message: "Email Already Exists" });
    }
    const existingMobile = await company.findOne({
      where: { mobileno: mobileno },
    });
    if (existingMobile) {
      return res
        .status(400)
        .json({ status: "false", message: "Mobile Number Already Exists" });
    }
    const existingGstNumber = await company.findOne({
      where:{gstnumber:gstnumber}
    });
    if(existingGstNumber) {
      return res.status(400).json({ status:'false', message:'GST Number Already Exists'});
    }
    const data = await company.create({
      companyname,
      gstnumber,
      email,
      mobileno,
      address1,
      address2,
      pincode,
      state,
      city,
      country,
    });


    await permissionAdd(data.id);

    await companyUser.create({
      userId: userId,
      companyId: data.id,
      balance: 0,
    });

    await C_userBalance.create({
      userId: userId,
      companyId: data.id,
      balance: 0,
    });
    
    await C_companyBalance.create({
      companyId: req.user.companyId,
      balance: 0,
    });
    
    await companyBalance.create({
      companyId:req.user.companyId,
      balance:0
    });
    return res.status(200).json({
      status: "true",
      message: "Company Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_company = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = await company.findByPk(id);
    const {
      companyname,
      gstnumber,
      email,
      mobileno,
      address1,
      address2,
      pincode,
      state,
      city,
      country,
    } = req.body;

    if (!companyId) {
      return res
        .status(404)
        .json({ status: "false", message: "Company Not Found" });
    }
    if (companyId.email !== email) {
      const existingEmail = await company.findOne({ where: { email: email } });
      if (existingEmail) {
        return res
          .status(400)
          .json({ status: "false", message: "Email Already Exists" });
      }}
   
    if (companyId.mobileno !== mobileno) {
      const existingMobile = await company.findOne({ where: { mobileno: mobileno } });
      if (existingMobile) {
        return res
          .status(400)
          .json({ status: "false", message: "Mobile Number Already Exists" });
      }}
    if (companyId.gstnumber !== gstnumber) {
      const existingGstNumber = await company.findOne({ where: { gstnumber: gstnumber } });
      if(existingGstNumber) {
        return res
      .status(400)
    .json({ status: "false", message: "GST Number Already Exists" });
  }}
    await company.update(
      {
        companyname,
        gstnumber,
        email,
        mobileno,
        address1,
        address2,
        pincode,
        state,
        city,
        country,
      },
      { where: { id } }
    );

    const data = await company.findByPk(id);

    return res.status(200).json({
      status: "true",
      message: "Company Updated Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_company = async (req, res) => {
  try {
    const { id } = req.params;
    const {userId} = req.user;

    const data = await company.findOne({ where: { id: id } });
    if(!data){
      return res
          .status(404)
          .json({ status: "false", message: "Company Not Found" });
    }
    const currentCompany = await companyUser.findOne({
      where: {
        companyId: data.id,
        userId: userId,
        setDefault: true
      }
    })
    if(currentCompany){
      return res
          .status(404)
          .json({ status: "false", message: "You cannot delete the current company. Please switch to another company before deleting this one." });
    }
    await data.setUsers([]);
    await data.destroy()
    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Company Delete Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_company = async (req, res) => {
  try {
    const data = await company.findAll();
    if (data) {
      return res.status(200).json({
        status: "Success",
        message: "Company Data Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Company Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_single_company = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await company.findOne({
      where: { id },
      include: [{ model: companyBankDetails, as: "comapnyBank" }],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Company Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Company Show Successfully",
        data: data,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.set_default_comapny = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const companyData = await company.findOne({ where: { id: id } });

    if (!companyData) {
      return res
        .status(404)
        .json({ status: "false", message: "Company Not Found" });
    }
    const userData = await companyUser.findAll({ where: { userId: userId } });
    const userToUpdate = userData.find(
      (userComapny) => userComapny.companyId === Number(id)
    );

    if (userToUpdate.setDefault === true) {
      return res
        .status(400)
        .json({ status: "false", message: "Company Already Set Default" });
    } else {
      await Promise.all(
        userData.map(async (userComapny) => {
          if (userComapny.companyId !== id && userComapny.setDefault === true) {
            await userComapny.update({ setDefault: false });
          }
        })
      );

      await userToUpdate.update({ setDefault: true });

      const token = jwt.sign(
        { ...req.user, companyId: companyData.id },
        process.env.SECRET_KEY
      );
      const existingToken = await admintoken.findOne({
        where: { userId: userId },
      });
      await existingToken.update({ token });

      const data = await company.findByPk(id);
      return res.status(200).json({
        status: "true",
        message: "Default Company Set Successfully",
        data: data,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
//sinlgle company balance
exports.view_company_balance = async (req, res) => {
  try {
    const data = await companyBalance.findOne({
      where: { companyId: req.user.companyId },
    });

    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Company Balance Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Company Balance Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
//single bank balance
exports.view_single_bank_balance = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await companySingleBank.findOne({
      where: {
        companyId: req.user.companyId,
        accountId: id,
      },
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Company Balance Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Company Balance Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
/*=============================================================================================================
                                             Typc C API
 =========================================================================================================== */
//single comapny balance cash
exports.view_company_cash_balance = async (req, res) => {
  try {
    const data = await C_companyBalance.findOne({
      where: { companyId: req.user.companyId },
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Company Cash Balance Show Successfuly",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Company Cash Balance Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
