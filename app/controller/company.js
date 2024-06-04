const admintoken = require("../models/admintoken");
const company = require("../models/company");
const companyBankDetails = require("../models/companyBankDetails");
const companyUser = require("../models/companyUser");
const permissionAdd = require("../util/permissions");
const jwt = require('jsonwebtoken');


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

    await data.addUser(userId);

    permissionAdd(data.id);
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
      (userComapny) => userComapny.companyId == id
    );

    if (userToUpdate.setDefault === true) {
      return res
        .status(400)
        .json({ status: "false", message: "Company Already Set Default" });
    } else {
      await Promise.all(
        userData.map(async (userComapny) => {
          if (userComapny.companyId != id && userComapny.setDefault === true) {
            await userComapny.update({ setDefault: false });
          }
        })
      );

      await userToUpdate.update({ setDefault: true });

      const token = jwt.sign({  ...req.user,companyId: companyData.id }, process.env.SECRET_KEY);
      const existingToken = await admintoken.findOne({
        where: { userId: userId  },
      });
      await existingToken.update({token});

      const data = await company.findByPk(id);
      return res.status(200).json({
        status: "true",
        message: "Default Company Set Successfully",
        data: data,
        token
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
