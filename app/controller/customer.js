const bankAccount = require("../models/bankAccount");
const customer = require("../models/customer");

exports.create_customer = async (req, res) => {
  try {
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
      country,
      gstnumber,
      items,
      totalcreadit,
    } = req.body;

    if (bankdetail === true) {
      if (!items || items.length === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Required Filed Of Items" });
      }
    for (const item of items) {
      const existingAccount = await bankAccount.findOne({
        where: { accountnumber: item.accountnumber },
      });

      const existingIFSC = await bankAccount.findOne({
        where: { ifsccode: item.ifsccode },
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
      country,
      gstnumber,
    };

    if (creditlimit === true) {
      customerdata.totalcreadit = totalcreadit;
    }
    const data = await customer.create(customerdata);
    if (bankdetail === true && items) {
      const bankdata = items.map((item) => ({
        customerId: data.id,
        accountnumber: item.accountnumber,
        ifsccode: item.ifsccode,
        bankname: item.bankname,
        accounttype: item.accounttype,
      }));
      await bankAccount.bulkCreate(bankdata);
    }

    const customerData = await customer.findOne({
      where: { id: data.id },
      include: [{ model: bankAccount, as: "items" }],
    });

    return res
      .status(200)
      .json({
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
      country,
      gstnumber,
      items,
      totalcreadit,
    } = req.body;

    const updateData = await customer.findOne({
      where: { id: id },
      include: [{ model: bankAccount, as: "items" }],
    });

    if (!updateData) {
      return res
        .status(404)
        .json({ status: "false", message: "Customer Not Found" });
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
      country,
      gstnumber,
    };
    if (creditlimit === true) {
      customerUpdate.totalcreadit = totalcreadit;
    }

    await customer.update(customerUpdate, { where: { id } });

    if (bankdetail === true && items && Array.isArray(items)) {
      for (const item of items) {
        const existingItem = await bankAccount.findOne({
          where: { customerId: id, accountnumber: item.accountnumber },
        });

        if (existingItem) {
          await bankAccount.update(
            {
              ifsccode: item.ifsccode,
              accounttype: item.accounttype,
              bankname: item.bankname,
            },
            {
              where: { id: existingItem.id },
            }
          );
        } else {
          await bankAccount.create({
            customerId: id,
            accountnumber: item.accountnumber,
            ifsccode: item.ifsccode,
            accounttype: item.accounttype,
            bankname: item.bankname,
          });
        }
      }
    }
    const data = await customer.findOne({
      where: { id: id },
      include: [{ model: bankAccount, as: "items" }],
    });

    return res
      .status(200)
      .json({
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
    const { id } = req.params;

    const data = await customer.destroy({ where: { id: id } });

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
// exports.create_customfeild = async (req, res) => {
//   try {
//     const { customerId, items } = req.body;

//     await Promise.all(items.map(async item => {
//       await customfeild.create({
//         ...item,
//         customerId
//       });
//     }));

//     const createdItems = await customfeild.findAll({ where: { customerId } });
//     // console.log(createdItems,">>>>>>>>>>>>>>>>>>>>>>>");
//     return res.status(200).json({ status: "true", message: "Customfeild Created Successfully", data: createdItems });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).json({ status: "false", message: "Internal Server Error" });
//   }
// }
// exports.update_customfeild = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { label, value } = req.body;

//     const deliverychallan = await customfeild.findByPk(id);
//     if (!deliverychallan) {
//       return res.status(404).json({ message: "Custom feild not Found" });
//     }
//     await customfeild.update({
//       label: label,
//       value: value
//     }, {
//       where: { id: id }
//     });

//     return res.status(200).json({ status: "true", message: "Custom feild Update Successfully" });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).json({ status: "false", message: "Internal Server Error" });
//   }
// }
// exports.delete_customfeild = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const data = await customfeild.destroy({ where: { id: id } });

//     if (!data) {
//       return res.status(400).json({ status: "false", message: "Custom feild Not Found" });
//     } else {
//       return res.status(200).json({ status: "true", message: 'Custom feild Delete Successfully' });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ status: "false", message: "Internal Server Error" });
//   }
// }
exports.view_customer = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await customer.findOne({
      where: { id },
      include: [{ model: bankAccount, as: "items" }],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "customer Not Found" });
    }
    return res
      .status(200)
      .json({
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
      include: [{ model: bankAccount, as: "items" }],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Customer Not Found" });
    }
    return res
      .status(200)
      .json({
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
