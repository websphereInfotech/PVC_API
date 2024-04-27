const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admintoken = require("../models/admintoken");

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

    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "false", message: "User already exists" });
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

    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: role,
      mobileno: mobileno,
      salary: salary,
    });

    res
      .status(200)
      .json({ status: "true", message: "User created successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.get_all_user = async (req, res) => {
  try {
    const data = await User.findAll({
      attributes: { exclude: ["password"] },
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
    const { id } = req.params;
    const data = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (data) {
      return res
        .status(200)
        .json({
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
    const dataRole = req.user.role;

    const { username, email, role, mobileno, salary, password } = req.body;

    const FindID = await User.findByPk(id);
    if (!FindID) {
      return res
        .status(404)
        .json({ status: "false", message: "User Not Found" });
    }
    // await User.update(
    //   {
    //     username: username,
    //     email: email,
    //     role: role,
    //     mobileno: mobileno,
    //     salary: salary,
    //   },
    //   { where: { id: id } }
    // );

    const userData = {
      username: username,
      email: email,
      role: role,
      mobileno: mobileno,
      salary: salary,
    };
    if (dataRole !== "Super Admin") {
      userData.password = password;
    } else {
      if (password) {
        return res.status(400).json({
          status: "false",
          message: "Password update is not allowed for Super Admin.",
        });
      }
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

    const user = await User.findOne({ where: { mobileno: mobileno } });

    if (!user) {
      return res
        .status(404)
        .json({ status: "false", message: "User Not Found" });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res
        .status(401)
        .json({ status: "false", message: "Invalid Password" });
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.SECRET_KEY
    );

    // const tokenSave = new admintoken({
    //   userId : user.id,
    //   token : token
    // });
    // await tokenSave.save();
    const existingUser = await admintoken.findOne({ userId: user.id });
    if (existingUser) {
      await existingUser.update({ token });
    } else {
      await existingUser.create({ userId: user.id });
    }
    return res.status(200).json({
      status: "true",
      message: "User Login Successfully",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
