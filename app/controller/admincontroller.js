const User = require("../models/admin");
const jwt = require('jsonwebtoken');
const userToken = require("../models/admintoken");
const salesInvoice = require("../models/salesInvoice");
const salesInvoiceItem = require("../models/salesInvoiceitem");
const deliverychallan = require("../models/deliverychallan");
const deliverychallanitem = require("../models/deliverychallanitem");
const purchase = require("../models/purchase");
const purchaseitem = require("../models/purchaseitem");
const expenseItem = require("../models/expenseItem");
const payment = require("../models/payment");
const expense = require("../models/expense");
const stock = require("../models/stoke");
const customer = require("../models/customer");
const customfeild = require("../models/customfeild");
const product = require("../models/product");
const itemgroup = require("../models/itemgroup");
const itemcategory = require("../models/itemcategory");
const unit = require("../models/unit");
const purchasebill = require("../models/purchasebill");
const purchasebillItem = require("../models/purchasebill_item");
const purchaseReturn = require("../models/purchasereturn");
const purchaseReturnItem = require("../models/purchasereturnitem");
const receipt = require("../models/receipt");
const bankAccount = require("../models/bankAccount");


// exports.admin_signup = async (req, res) => {
//   // console.log("enter user");
//   const { username, email,password,confirmpassword } = req.body;
// // console.log("req",req.body);
//   try {

//     const existingUser = await User.findOne({ where:{email: email}});
//     // console.log("existingUser",existingUser);
//     if(existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     if(!confirmpassword) {
//       return res.status(400).json({ error: 'Required feild: ConfirmPassword' });
//     }
//     if (password !== confirmpassword) {
//       return res.status(400).json({ error: 'Passwords do not match' });
//     }

//     const hashedPassword = await bcrypt.hash(password,10);
//     // console.log(hashedPassword);
//     const user = await User.create({
//         username:username,
//         email:email,
//         password: hashedPassword
//     })
//     // console.log(user);
//       res.status(200).json({ message: 'User created successfully', user });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

/* *************************************************************************************************
                                          ADMIN LOGIN
**************************************************************************************************/
exports.admin_login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ status:'false',error: 'User not found' });
    }

    // const matchPassword = await bcrypt.compare(password, user.password);
    // if (!matchPassword) {
    //   return res.status(401).json({ error: 'Invalid Password' });
    // }
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid Password' });
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SECRET_KEY, {
      expiresIn: '6h'
    });

    const existingUserToken = await userToken.findOne({ where: { userId: user.id } });
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
