const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const adminToken = require("../models/admintoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
// const permissions = require("../models/permission");
/* *************************************************************************************************
                                          ADMIN LOGIN
**************************************************************************************************/
exports.admin_login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({ status: "false", error: "User not found" });
    }

    // const matchPassword = await bcrypt.compare(password, user.password);
    // if (!matchPassword) {
    //   return res.status(401).json({ error: 'Invalid Password' });
    // }
    if (password !== admin.password && password !== admin.password + ".C") {
      return res
        .status(401)
        .json({ status: "false", error: "Invalid Password" });
    }
    const tokenType = password === admin.password + ".C" ? "C" : "";

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email, role: admin.role, type: tokenType },
      process.env.SECRET_KEY,
      {
        expiresIn: "6h",
      }
    );

    const existingUserToken = await adminToken.findOne({
      where: { adminId: admin.id },
    });
  
    if (existingUserToken) {
      await existingUserToken.update({ token });
    } else {
      await adminToken.create({ adminId: admin.id, token, userId: null });
    }

    return res
      .status(200)
      .json({ status: "true", message: "User Login Successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
/* *************************************************************************************************
                                          User SIGNUP
**************************************************************************************************/

// exports.user_login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ where: { email } });

//     if (!user) {
//       return res.status(404).json({ status: "false", error: "User not found" });
//     }

//     const matchPassword = await bcrypt.compare(password, user.password);
//     if (!matchPassword) {
//       return res.status(401).json({ error: "Invalid Password" });
//     }
//     const token = jwt.sign(
//       { userId: user.id, email: user.email, role: user.role },
//       process.env.SECRET_KEY,
//       {
//         expiresIn: "20h",
//       }
//     );

//     // const existingUserToken = await adminToken.findOne({ where: { userId: user.id } });
//     // if (existingUserToken) {
//     //   await existingUserToken.update({ token });
//     // } else {
//     //   await adminToken.create({ userId: user.id, token });
//     // }
//     const tokenSave = new adminToken({
//       userId: user.id,
//       token: token,
//     });
//     await tokenSave.save();
//     // console.log("token",token);
//     return res
//       .status(200)
//       .json({ status: "true", message: "User Login Successfully", token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
