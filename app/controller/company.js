const company = require("../models/company");

exports.create_company = async (req, res) => {
  try {
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
      accountname,
      bankname,
      accountnumber,
      ifsccode,
      branch,
    } = req.body;

    const existingCompany = await company.findOne({
      where: { companyname: companyname },
    });
    if (existingCompany) {
      return res
        .status(400)
        .json({ status: "false", message: "Company Already Exists" });
    }
    const existingAccount = await company.findOne({
      where: { accountnumber: accountnumber },
    });
    if (existingAccount) {
      return res
        .status(400)
        .json({ status: "false", message: "Account Number Already Exists" });
    }
    const existingIfsc = await company.findOne({
      where: { ifsccode: ifsccode },
    });
    if (existingIfsc) {
      return res
        .status(400)
        .json({ status: "false", message: "IFSC Code Already Exists" });
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
      accountname,
      accountnumber,
      bankname,
      ifsccode,
      branch,
    });
    return res
      .status(200)
      .json({
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
        accountname,
        bankname,
        accountnumber,
        ifsccode,
        branch,
      } = req.body;

    if (!companyId) {
      return res
        .status(404)
        .json({ status: "false", message: "Company Not Found" });
    }

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
        accountname,
        accountnumber,
        bankname,
        branch,
        ifsccode
      },
      { where: { id } }
    );

    const data = await company.findByPk(id);

    return res
      .status(200)
      .json({
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

    const data = await company.destroy({ where: { id: id } });
    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Company Delete Successfully" });
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
exports.get_all_company = async (req, res) => {
  try {
    const data = await company.findAll();
    if (data) {
      return res
        .status(200)
        .json({
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

    const data = await company.findByPk(id);
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Company Not Found" });
    } else {
      return res
        .status(200)
        .json({
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
