const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admintoken = require("../models/admintoken");
const companyUser = require("../models/companyUser");
const company = require("../models/company");
const C_userBalance = require("../models/C_userBalance");
const {Op, Sequelize} = require("sequelize");
const UserBankAccount = require("../models/userBankAccount");
const C_WalletLedger = require("../models/C_WalletLedger");
const C_Cashbook = require("../models/C_Cashbook");
const C_UserBalance = require("../models/C_userBalance");
const C_Payment = require("../models/C_Payment");

exports.create_user = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmpassword,
      role,
      mobileno,
      salary,
      exitTime,
      entryTime
    } = req.body;

    const existingEmail = await User.findOne({ where: { email: email } });

    if (existingEmail) {
      return res
        .status(400)
        .json({ status: "false", message: "Email Already Exists" });
    }
    const existingMobile = await User.findOne({ where: { mobileno: mobileno } });

    if (existingMobile) {
      return res
        .status(400)
        .json({ status: "false", message: "Mobile Number Already Exists" });
    }

    if (!confirmpassword) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed: ConfirmPassword" });
    }
    if (password !== confirmpassword) {
      return res
        .status(400)
        .json({ status: "false", message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const companyData = await companyUser.findOne({
      where: {
        companyId: req.user.companyId,
        userId: req.user.userId,
        setDefault: true,
      },
    });

    if (!companyData) {
      return res
        .status(404)
        .json({ status: "false", message: "Company Not Found" });
    }
    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: role,
      mobileno: mobileno,
      salary: salary,
      exitTime: exitTime,
      entryTime: entryTime
    });

    await companyUser.create({
      userId: user.id,
      companyId: req.user.companyId,
      setDefault: true,
    });
     await C_userBalance.create({
      userId: user.id,
      companyId: req.user.companyId,
      balance: 0,
    });
    return res
      .status(200)
      .json({ status: "true", message: "User created successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.get_all_user = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { search } = req.query;
    const whereClause = {role: { [Op.ne]: "Super Admin" } };

    if (search) {
      whereClause.username = { [Op.like]: `%${search}%` };
    }
    const data = await company.findAll({
      where: { id: companyId },

      include: {
        model: User,
        as: "users",
        through: { attributes: [] },
        where: whereClause
      },
      attributes: [],
    });

    if (data) {
      return res.status(200).json({
        status: "true",
        message: "User Data Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "User Data Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_company_user = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { search } = req.query;
    const whereClause = {};

    if (search) {
      whereClause.username = { [Op.like]: `%${search}%` };
    }
    const data = await company.findAll({
      where: { id: companyId },

      include: {
        model: User,
        as: "users",
        through: { attributes: [] },
        where: whereClause
      },
      attributes: [],
    });

    if (data) {
      return res.status(200).json({
        status: "true",
        message: "User Data Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "User Data Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_user = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const { id } = req.params;

    const data = await User.findOne({
      where: { id: id },
      include: [{ model: company, as: "companies", where: { id: companyId }, attributes: [] }, {model: UserBankAccount, as: "userBankAccount"}],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "User Data Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "User Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_user = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.destroy({ where: { id } });
    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "User Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "User Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal sever Error" });
  }
};
exports.update_user = async (req, res) => {
  try {
    const { id } = req.params;

    const { username, email, role, mobileno, salary, exitTime, entryTime } = req.body;
    const FindID = await User.findByPk(id);
    if (!FindID) {
      return res
        .status(404)
        .json({ status: "false", message: "User Not Found" });
    }
    if (FindID.email !== email) {
      const existingEmail = await User.findOne({ where: { email: email } });
      if (existingEmail) {
        return res.status(400).json({ status: "false", message: "Email Already Exists" });
      }
    }

    if (FindID.mobileno !== mobileno) {
      const existingMobile = await User.findOne({ where: { mobileno: mobileno } });
      if(existingMobile) {
        return res
      .status(400)
    .json({ status: "false", message: "Mobile Number Already Exists" });
  }
  }
    const companyData = await companyUser.findOne({
      where: { companyId: req.user.companyId },
    });

    if (!companyData) {
      return res
        .status(404)
        .json({ status: "false", message: "Company Not Found" });
    } else {
      await User.update(
        {
          username: username,
          email: email,
          role: role,
          mobileno: mobileno,
          salary: salary,
          exitTime: exitTime, entryTime: entryTime
        },
        { where: { id: id } }
      );
    }

    const data = await User.findByPk(id);
    return res.status(200).json({
      status: "true",
      message: "User Update Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.reset_password = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldpassword, newpassword, confirmpassword } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "false", message: "User Not Found" });
    }
    const isMatch = await bcrypt.compare(oldpassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "false", message: "Old Password Is Incorrent" });
    }
    if (newpassword !== confirmpassword) {
      return res
        .status(400)
        .json({ status: "false", message: "Password Do Not Match" });
    }
    const hashedPassword = await bcrypt.hash(newpassword, 10);

    await User.update({ password: hashedPassword }, { where: { id: id } });

    return res
      .status(200)
      .json({ status: "true", message: "Password Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.user_login = async (req, res) => {
  try {
    const { mobileno, password } = req.body;
    const user = await User.findOne({ where: { mobileno } });
    if (!user) {
      return res
        .status(404)
        .json({ status: "false", message: "User Not Found" });
    }
    const basePassword = password.replace(".C", "");
    const isPasswordCorrect = await bcrypt.compare(basePassword, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ status: "false", message: "Invalid Password" });
    }
    const isSpecialLogin = password.endsWith(".C");
    const tokenType = isSpecialLogin ? "C" : "";

    const data = await companyUser.findOne({
      where: { userId: user.id, setDefault: true },
    });

    if (!data || !data.companyId) {
      return res
        .status(400)
        .json({ status: "false", message: "User With Company Not Connected" });
    }
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        type: tokenType,
        username: user.username,
        companyId: data.companyId,
      },
      process.env.SECRET_KEY,
      { expiresIn: "10h" }
    );

    const existingToken = await admintoken.findOne({
      where: { userId: user.id },
    });

    if (existingToken) {
      await existingToken.update({ token });
    } else {
      await admintoken.create({ userId: user.id, token });
    }

    return res.status(200).json({
      status: "true",
      message: "User Logged In Successfully",
      token,
    });
  } catch (error) {
    console.error("Error during user login:", error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.user_logout = async (req, res) => {
  try {
    const userId = req.user.userId;

    const existingToken = await admintoken.findOne({ where: { userId } });

    if (!existingToken) {
      return res
        .status(404)
        .json({ status: "false", message: "Token not Found" });
    }

    await existingToken.destroy();

    return res
      .status(200)
      .json({ status: "true", message: "User Log Out Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.check_user = async (req, res) => {
  try {
    const { email, mobileno } = req.body;

    const data = await User.findOne({
      where: { email: email, mobileno: mobileno },
      attributes: { exclude: ["password"] },
    });
if(data) {
  return res.status(200).json({
    status: "true",
    message: "User Data Fetch Successfully",
    data: data,
  });
} else {
  return res.status(404).json({
    status: "false",
    message: "User Not Found",
  });
}
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.add_user = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "false", message: "User Not Found" });
    }
    const data = await companyUser.findOne({
      where: { companyId: companyId, userId: id },
    });

    const findCompany = await companyUser.findOne({
      where: {
        userId: id,
        setDefault: true
      }
    });

    await C_userBalance.create({
      userId: id,
      companyId: req.user.companyId,
      balance: 0,
    })
    if (data) {
      return res
        .status(400)
        .json({ status: "false", message: "User Already Exists" });
    }

    if(findCompany){
        await companyUser.create({ companyId: companyId, userId: id });
    }else{
      await companyUser.create({ companyId: companyId, userId: id, setDefault: true });
    }
    return res
        .status(200)
        .json({ status: "true", message: "User Added Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_all_userTOComapny = async (req, res) => {
  try {
    const userId = req.user.userId;

    const data = await companyUser.findAll({
      where:{userId:userId},
      include: [{ model: company, as: "companies" }],
    });
    if (data) {
      return res
        .status(200)
        .json({
          status: "true",
          message: "User To Comapny Fetch Successfully",
          data: data,
        });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "User conneted Company Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.remove_company = async (req,res)=>{
  try {
    const companyId = req.user.companyId;
    const {id} = req.params;

    const findUser = await User.findByPk(id);

    if(!findUser){
      return res.status(404).json({
        status: "false",
        message: "User Not Found"
      })
    }

    const findAllCompany = await companyUser.findAll({
      where: {
        userId: id,
        companyId: { [Op.ne]: companyId },
      }
    });

    const currentCompany = await companyUser.findOne({
      where: {
        userId: id,
        companyId: companyId,
      }
    })
    if(!currentCompany){
      return res.status(404).json({
        status: "false",
        message: "Current Company Not Found."
      })
    }

    if(currentCompany.setDefault){
      if(findAllCompany.length){
        const firstCompany = findAllCompany[0];
        firstCompany.setDefault = true;
        await firstCompany.save();
      }
      await currentCompany.destroy();
    }else{
      await currentCompany.destroy();
    }

    return res.status(200).json({
      status: "true",
      message: "Successfully remove user in company."
    })

  }catch (e) {
    console.error(e)
    return res.status(500).json({
      status: "false",
      message: "Internal Server Error."
    })
  }

}
exports.add_user_bank_account = async (req,res)=>{
  try {
    const {
      accountname,
      bankname,
      accountnumber,
      ifsccode,
      branch,
      userId
    } = req.body;
    const userData = await User.findByPk(userId);
    if(!userData){
      return res.status(404).json({
        status: "false",
        message: "User Not Found."
      })
    }
    const existingAccount = await UserBankAccount.findOne({
      where: { accountnumber: accountnumber },
    });
    if (existingAccount) {
      return res
          .status(400)
          .json({ status: "false", message: "Account Number already Exists" });
    }
    const existingIfsc = await UserBankAccount.findOne({
      where: { ifsccode: ifsccode },
    });
    if (existingIfsc) {
      return res
          .status(400)
          .json({ status: "false", message: "IFSC Code already Exists" });
    }
    const data = await UserBankAccount.create({
      userId,
      accountname,
      bankname,
      accountnumber,
      ifsccode,
      branch,
    });
    return res.status(200).json({
      status: "true",
      message: "Bank Details Create Successfully",
      data: data,
    });
  }catch (e) {
    console.log(e);
    return res
        .status(500)
        .json({ status: "false", message: "Internal Server Error" });
  }
}
exports.edit_user_bank_account = async (req, res)=>{
 try {
   const { accountId } = req.params;
   const {
     userId,
     accountname,
     bankname,
     accountnumber,
     ifsccode,
     branch,
   } = req.body;
   const bankData = await UserBankAccount.findOne({
     where: {
       id: accountId,
       userId: userId
     }
   });
   if(!bankData){
     return res
         .status(404)
         .json({ status: "false", message: "Bank Details Not Found" });
   }
   const userData = await User.findByPk(userId);
   if(!userData){
     return res.status(404).json({status: "false", message: "User Not Found."})
   }
   const existingAccount = await UserBankAccount.findOne({
     where: { accountnumber: accountnumber, id: { [Sequelize.Op.ne]: accountId }, },
   })
   if (existingAccount) {
     return res
         .status(400)
         .json({ status: "false", message: "Account Number already Exists" });
   }
   const existingIfsc = await UserBankAccount.findOne({
     where: { ifsccode: ifsccode, id: { [Sequelize.Op.ne]: accountId } },
   });
   if (existingIfsc) {
     return res
         .status(400)
         .json({ status: "false", message: "IFSC Code already Exists" });
   }
   const data = await UserBankAccount.update(
       {
         userId,
         accountname,
         bankname,
         accountnumber,
         ifsccode,
         branch,
       },
       {
         where: { id: accountId },
         returning: true,
       }
   );
   return res.status(200).json({
     status: "true",
     message: "Bank Details Updated Successfully",
     data: data,
   });
 }catch (e) {
   console.log(error);
   return res
       .status(500)
       .json({ status: "false", message: "Internal Server Error" });
 }
}
exports.delete_user_bank_account = async (req, res)=>{
  try {
    const { accountId } = req.params;
    const bankData = await UserBankAccount.findByPk(accountId);
    if(!bankData) return res.status(404).json({status: "false", message: "Bank Account Not Found."});

    await UserBankAccount.destroy({
      where: {id: accountId}
    })
    return res.status(200).json({status: "true", message: "Bank Account Deleted Successfully." });
  }catch (e) {
    console.log(e);
    return res.status(500).json({status: "false", message: "Internal Server Error"});
  }
}
exports.view_user_bank_account = async (req, res)=>{
  try {
    const { accountId } = req.params;
    const bankData = await UserBankAccount.findByPk(accountId);
    if(!bankData){
      return res.status(404).json({status: "false", message: "Bank Account Not Found."});
    }
    return res.status(200).json({status: "true", message: "Bank Account Fetch Successfully.", data: bankData });
  }catch (e) {
    console.log(e);
    return res.status(500).json({status: "false", message: "Internal Server Error"});
  }
}
exports.view_all_user_bank_account = async (req, res)=>{
  try {
    const {userId} = req.params;
    const userData = await User.findByPk(userId);
    if(!userData) return res.status(404).json({status: "false", message: "User Not Found."});
    const data = await UserBankAccount.findAll({
      where: {
        userId: userId,
      }
    });
    return res.status(200).json({status: "true", message: "Bank Account Fetch Successfully.", data: data})
  }catch (e) {
    console.log(e);
    return res.status(500).json({status: "false", message: "Internal Server Error."})
  }
}

exports.wallet_approve = async (req, res)=>{
  try{
    const {id} = req.params;
    const {companyId} = req.user;
    const existWalletLedger = await C_WalletLedger.findOne({
      where: {
        id: id,
        companyId: companyId,
      }
    })
    if(!existWalletLedger){
      return res.status(404).json({
        status: "false",
        message: "Wallet Entry Not Found."
      })
    }
    if(existWalletLedger.isApprove){
      return res.status(400).json({
        status: "false",
        message: "Wallet Entry Already Approved."
      })
    }
    existWalletLedger.isApprove = true;
    existWalletLedger.approveDate = new Date();
    await existWalletLedger.save();
    await C_Cashbook.create({
      C_paymentId: existWalletLedger.paymentId,
      C_receiptId: existWalletLedger.receiptId,
      companyId: companyId,
      date: new Date()
    })
    if(existWalletLedger.paymentId){
      const paymentData = await C_Payment.findOne({
        where: {
          id: existWalletLedger.paymentId,
          companyId: companyId
        }
      });
      const paymentAmount = paymentData.amount;
      const userBalance = await C_UserBalance.findOne({
        where: {
          userId: existWalletLedger.userId,
          companyId: companyId
        }
      });
      await userBalance.decrement('incomes', {by: paymentAmount})
    }
    
    return res.status(200).json({
      status: "true",
      message: "Wallet Entry Approved Successfully.",
    })
  }catch (e) {
    console.log(e);
    return res
        .status(500)
        .json({ status: "false", message: "Internal Server Error" });
  }
}