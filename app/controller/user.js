const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admintoken = require("../models/admintoken");
const companyUser = require("../models/companyUser");
const company = require("../models/company");
const C_userBalance = require("../models/C_userBalance");
const {Op} = require("sequelize");

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
    const data = await company.findAll({
      where: { id: companyId },

      include: {
        model: User,
        as: "users",
        through: { attributes: [] },
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
      include: [{ model: company, as: "companies", where: { id: companyId }, attributes: [] }],
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

    const { username, email, role, mobileno, salary } = req.body;
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

    await C_userBalance.create({
      userId: id,
      companyId: req.user.companyId,
      balance: 0,
    })
    if (!data) {
      await companyUser.create({ companyId: companyId, userId: id });
      return res
        .status(200)
        .json({ status: "true", message: "User Added Successfully" });
    } else {
      return res
        .status(400)
        .json({ status: "false", message: "User Already Exists" });
    }
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
        setDefault: false
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
