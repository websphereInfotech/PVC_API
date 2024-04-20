const Admin = require("../models/admin");
const jwt = require('jsonwebtoken');
const adminToken = require("../models/admintoken");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const userToken = require("../models/userToken");
// const permissions = require("../models/permission");
/* *************************************************************************************************
                                          ADMIN LOGIN
**************************************************************************************************/
exports.admin_login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ status:'false',error: 'User not found' });
    }

    // const matchPassword = await bcrypt.compare(password, user.password);
    // if (!matchPassword) {
    //   return res.status(401).json({ error: 'Invalid Password' });
    // }
    if(password !== user.password && password !== user.password + '.C'){
      return res.status(401).json({ status:'false', error:'Invalid Password' })
    }
    const token = jwt.sign({ userId: user.id, email: user.email,role: user.role }, process.env.SECRET_KEY, {
      expiresIn: '6h'
    });

    const existingUserToken = await adminToken.findOne({ where: { userId: user.id } });
    if (existingUserToken) {
      await existingUserToken.update({ token });
    } else {
      await adminToken.create({ userId: user.id, token });
    }

    return res.status(200).json({ status:'true' ,message: 'User Login Successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
/* *************************************************************************************************
                                          User SIGNUP
**************************************************************************************************/
exports.create_user = async (req, res) => {
  console.log("enter user");
  try {
    const { username, email,password,confirmpassword,role } = req.body;
  // console.log("req",req.body);

    const existingUser = await User.findOne({ where:{email: email}});
    // console.log("existingUser",existingUser);
    if(existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    if(!confirmpassword) {
      return res.status(400).json({ error: 'Required filed: ConfirmPassword' });
    }
    if (password !== confirmpassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password,10);
    // console.log(hashedPassword);
    const user = await User.create({
        username:username,
        email:email,
        password: hashedPassword,
        role:role
    })
  
    console.log(user);
      res.status(200).json({status:'true', message: 'User created successfully', user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.user_login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ status:'false',error: 'User not found' });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({ error: 'Invalid Password' });
    }
    const token = jwt.sign({ userId: user.id, email: user.email,role:user.role }, process.env.SECRET_KEY, {
      expiresIn: '20h'
    });

    const existingUserToken = await adminToken.findOne({ where: { userId: user.id } });
    if (existingUserToken) {
      await existingUserToken.update({ token });
    } else {
      await userToken.create({ userId: user.id, token });
    }

    return res.status(200).json({ status:'true' ,message: 'User Login Successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};