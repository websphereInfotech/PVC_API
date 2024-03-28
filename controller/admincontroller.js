const User = require("../models/admin");
const sequelize = require("../config/index");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userToken = require("../models/admintoken");
const quotation = require("../models/quotation");
const quotationItem = require("../models/quotationItem");
const salesInvoice = require("../models/salesInvoice");
const salesInvoiceItem = require("../models/salesInvoiceitem");
const salesReturn = require("../models/salesreturn");
const expense = require("../models/expense");
const expenseItem = require("../models/expenseItem");
const { json } = require("sequelize");


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

exports.admin_login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ status: "false", error: 'User not found' });
    }
    const matchPassword = await User.findOne({ password: password });
    if (!matchPassword) {
      return res.status(401).json({ status: "false", error: 'Invalid Password' });
    }
    // const matchPassword = await bcrypt.compare(password, user.password);
    // if (!matchPassword) {
    //   return res.status(401).json({ error: 'Invalid Password' });
    // }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.SECRET_KEY, {
      expiresIn: '6h'
    });

    const existingUserToken = await userToken.findOne({ where: { userId: user.id } });
    if (existingUserToken) {
      await existingUserToken.update({ token });
    } else {
      await userToken.create({ userId: user.id, token });
    }

    return res.status(200).json({ status: "true", message: 'User Login Successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "false", error: 'Internal Server Error' });
  }
};
/*========================================== Quotation Api  =========================================== */
exports.create_quotationItem = async (req, res) => {
  try {
    const { quotationId, items } = req.body;

    await Promise.all(items.map(async item => {
      await quotationItem.create({
        ...item,
        quotationId
      });
    }));

    const createdItems = await quotationItem.findAll({ where: { quotationId } });

    return res.status(200).json({ status: "true", message: "Quatations items Created Successfully", data: createdItems });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
}
exports.create_quotation = async (req, res) => {
  try {
    const { quotationno, date, validtill, email, mobileno, customer, items } = req.body;

    const data = await quotation.create({
      quotationno,
      date,
      validtill,
      email,
      mobileno,
      customer
    });

    // Extract items and link them to the created quotation
    // if (items && items.length > 0) {
    //   await Promise.all(items.map(async item => {
    //     await quotationItem.create({
    //       ...item,
    //       quotationId: createdQuotation.id
    //     });
    //   }));
    // }

    // // Fetch the created quotation along with its items
    // const quotationWithItems = await quotation.findOne({
    //   where: { id: createdQuotation.id },
    //   include: [{ model: quotationItem }]
    // });

    return res.status(200).json({ status: "true", message: 'Quotation created successfully', data: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "false", error: 'Internal Server Error' });
  }
}
exports.get_all_quotation = async (req, res) => {
  try {
    const allQuotations = await quotation.findAll({
      include: [{ model: quotationItem }]
    });
    if (!allQuotations) {
      return res.status(404).json({ status: "false", message: "Quotation Data not Found" });
    }
    return res.status(200).json({ status: "false", message: "All Quatations Data Fetch Successfully", data: allQuotations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "false", error: 'Internal Server Error' });
  }
}
exports.view_quotation = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await quotation.findOne({
      where: { id },
      include: [{ model: quotationItem }]
    })
    if (!data) {
      return res.status(404).json({ status: "false", message: 'Quotation not found' });
    }
    return res.status(200).json({ status: "true", message: "Quotation Data Fetch Successfully", data: data });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: "false", error: "Internal Server Error" });
  }
}
exports.update_quotationItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { rate, qty, product, amount } = req.body;

    const quotation = await quotationItem.findByPk(id);
    if (!quotation) {
      return res.status(404).json({ status: "false", message: "Quotation Item not Found" });
    }
    await quotationItem.update({
      rate: rate,
      qty: qty,
      product: product,
      amount: amount
    }, {
      where: { id: id }
    });
    const data = await quotationItem.findByPk(id);
    return res.status(200).json({ status: "true", message: "Quotation Item Update Successfully", data: data });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
}
exports.update_quotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotationno, date, validtill, email, mobileno, customer, items } = req.body;

    const updateQuotation = await quotation.findByPk(id);

    if (!updateQuotation) {
      return res.status(404).json({ status: "false", message: "Quotation Not Found" });
    }

    await quotation.update({
      quotationno: quotationno,
      date: date,
      validtill: validtill,
      email: email,
      mobileno: mobileno,
      customer: customer
    }, {
      where: { id: id }
    });
    const data = await quotation.findOne({
      where: { id: id },
      // include: [{ model: quotationItem }]
    })
    return res.status(200).json({ status: "true", message: "Quotation Update Successfully", data: data });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
}
exports.delete_quotationitem = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await quotationItem.destroy({ where: { id: id } });

    if (!data) {
      return res.status(400).json({ status: "false", message: "Quatation Item Not Found" });
    } else {
      return res.status(200).json({ status: "true", message: 'Quatation Item Delete Successfully' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
}
exports.delete_quotation = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await quotation.destroy({ where: { id: id } });

    if (!data) {
      return res.status(400).json({ status: "false", message: "Quatation Not Found" });
    } else {
      return res.status(200).json({ status: "true", message: "Quatation Delete Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
exports.create_salesInvoiceItem = async (req, res) => {
  try {
    const { salesInvoiceId, items } = req.body;

    await Promise.all(items.map(async item => {
      await salesInvoiceItem.create({
        ...item,
        salesInvoiceId
      });
    }));

    const data = await salesInvoiceItem.findAll({ where: { salesInvoiceId } });

    return res.status(200).json({ status: "true", message: "Sales Invoive Item Create Successfully", data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
}
exports.create_salesInvoice = async (req, res) => {
  try {
    const { challenno, challendate, email, mobileno, customer, items } = req.body;

    const salesInvoiceData = await salesInvoice.create({
      challenno,
      challendate,
      email,
      mobileno,
      customer
    });

    if (items && items.length > 0) {
      await Promise.all(items.map(async item => {
        await salesInvoice.create({
          ...item,
          salesInvoiceId: salesInvoiceData.id
        });
      }));
    }

    const data = await salesInvoice.findOne({
      where: { id: salesInvoiceData.id },
      include: [{ model: salesInvoiceItem }]
    })
    return res.status(200).json({ status: "true", message: "SalesInvoice Create Successfully", data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
}
exports.get_all_salesInvoice = async (req, res) => {
  try {
    const data = await salesInvoice.findAll({
      include: [{ model: salesInvoiceItem }]
    });
    if (!data) {
      return res.status(404).json({ status: "false", message: "Sales Invoice Not Found" });
    }
    return res.status(200).json({ status: "true", message: "Sales Invoice Data Fetch Successfully", data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
}
exports.view_salesInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await salesInvoice.findOne({
      where: { id },
      include: [{ model: salesInvoiceItem }]
    });

    if (!data) {
      return res.status(404).json({ status: "false", message: "Sales Invoice Not Found" });
    }
    return res.status(200).json({ status: "false", message: "Sales Invoice Data Fetch SUccessfully", data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
}
exports.update_salesInvoiceItem = async (req, res) => {
  try {

    const { id } = req.params;
    const { serialno, quotationno, product, batchno, expirydate, price, quantity } = req.body;

    const salesId = await salesInvoiceItem.findByPk(id);

    if (!salesId) {
      return res.status(404).json({ status: "false", message: "Sales Invoice Item not Found" });
    }
    await salesInvoiceItem.update({
      serialno: serialno,
      quotationno: quotationno,
      product: product,
      batchno: batchno,
      expirydate: expirydate,
      price: price,
      quantity: quantity
    }, {
      where: { id: id }
    });

    const data = await salesInvoiceItem.findByPk(id);

    return res.status(200).json({ status: "true", message: "Sales Invoice Item Update Successfully", data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
}
exports.update_salesInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { challenno, challendate, email, mobileno, customer } = req.body;

    const salesId = await salesInvoice.findByPk(id);

    if (!salesId) {
      return res.status(404).json({ status: "false", message: "Sales Invoice Not Found" });
    }
    await salesInvoice.update({
      challenno: challenno,
      challendate: challendate,
      email: email,
      mobileno: mobileno,
      customer: customer
    }, {
      where: { id: id }
    });
    const data = await salesInvoice.findOne({
      where: { id: id },
      // include: [{ model: salesInvoiceItem }]
    });

    return res.status(200).json({ status: "true", message: "Sales Invoice Update Successfuly", data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
}
exports.delete_salesInvoiceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await salesInvoiceItem.destroy({ where: { id: id } });

    if (!data) {
      return res.status(404).json({ status: "false", message: "Sales Invoice Not Found" });
    } else {
      return res.status(200).json({ status: "true", message: "Sales Deleted Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
}
exports.delete_salesInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await salesInvoice.destroy({ where: { id: id } });
    if (!data) {
      return res.status(404).json({ status: "false", message: "Sales Invoice Not Found" });
    } else {
      return res.status(200).json({ status: "true", message: "Sales Invoice Deleted Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "nternal Server Error" });
  }
}

/*========================================== Sales Return Api  =========================================== */

exports.create_salesReturn = async(req,res) => {
  try {
    const { customer, creditnote, creditdate, serialno, batchno, expirydate, price, invoiceno, invoicedate, quantity} = req.body;

    const data = await salesReturn.create({
        customer: customer,
        creditnote : creditnote,
        creditdate : creditdate,
        serialno : serialno,
        batchno : batchno,
        expirydate : expirydate,
        price : price,
        invoiceno : invoiceno,
        invoicedate : invoicedate,
        quantity : quantity
    });
    return res.status(200).json({ status:"true", message:"Sales Return Create Successfully", data: data })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"False", message:"Internal Server Error" });
  }
}
exports.get_all_salesReturn = async (req,res) => {
  try {
      const data = await salesReturn.findAll();

      if(!data) {
        return res.status(404).json({ status:"False", message:"Sales Return Not Found" });
      } else {
        return res.status(200).json({ status:"True", message:"Sales Return Data Fetch Successfully", data :data });
      }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"False", message:"Internal Server Error" });
  }
}

/*========================================== Expense Api  =========================================== */

exports.create_expense = async(req,res) => {
  try {
      const { vendor, voucherno, date, gstin, mobileno, email, billno, billdate, payment } = req.body;

      const data = await expense.create({
        vendor : vendor,
        voucherno : voucherno,
        date : date,
        gstin : gstin,
        mobileno : mobileno,
        email : email,
        billno : billno,
        billdate : billdate,
        payment : payment
      })
      return res.status(200).json({ status:"True", message:"Expense Create Successfully", data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"False", message:"Internal Server Error" });
  }
}
exports.create_expenseItem = async(req,res) => {
  try {
      const { expenseId, items } = req.body;

      await Promise.all(items.map(async item => {
          await expenseItem.create({
            ...item,
            expenseId : expenseId
          });
      }));
      const data = await expenseItem.findAll({ where:{expenseId}});

      return res.status(200).json({ status:"Success", message:"Expense Item Create Successfully", data: data});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"False", message:"Internal Server Error" });
  }
}
exports.get_all_expense = async (req,res) => {
  try {
    const data = await expense.findAll({
      include: [{model: expenseItem}]
    });
    if(!data) {
      return res.status(404).json({ status:"Fail", message:"Expense Data Not Found" });
    } else {
      return res.status(200).json({ status:"True", message:"Expense Data Fetch Successfully", data:data });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"Fail", message:"Internal Server Error" });
  }
}
exports.view_expense = async(req,res) => {
  try {
    const { id } = req.params;
    const data =  await expense.findOne({
      where :{id},
      include : [{model: expenseItem}]
    });
    if(!data) {
      return res.status(404).json({ status:"Fail", message:"Expense Data Not Found" });
    } else {
      return res.status(200).json({ status:"True", message:"Expense Data Fetch Successfully", data:data });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"Fail", message:"Internal Server Error" });
  }
}
exports.update_expense = async(req,res) => {
  try {
      const { id } = req.params;
      const { vendor, voucherno, date, gstin, mobileno, email, billno, billdate, payment } = req.body;

      const expenseId = await expense.findByPk(id);
      if(!expenseId) {
        return res.status(404).json({ status:"Fail", message:"Expense Not Found" });
      }
      await expense.update({
        vendor : vendor,
        voucherno : voucherno,
        date : date,
        gstin : gstin,
        mobileno : mobileno,
        email : email,
        billno : billno,
        billdate : billdate,
        payment : payment
      },{
        where:{id:id}
      });
      const data = await expense.findOne({
        where : { id:id },
        // include : [{ model:expenseItem }]
      })
      return res.status(200).json({ status:"True", message:"Expense Update Successfully", data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"Fail", message:"Internal Server Error" });
  }
}
exports.update_expenseItem = async(req,res) => {
  try {
    const { id } = req.params;
    const { serialno, expensse, description, taxable, price } = req.body;
    const expenseId = await expenseItem.findByPk(id);

    if(!expenseId) {
      return res.status(404).json({ status:"Fail", message:"Expense Not Found" });
    }
    await expenseItem.update({
      serialno : serialno,
      expensse : expensse,
      description :description,
      taxable : taxable,
      price : price
    }, { where :{id:id}});
    const data = await expenseItem.findByPk(id);
    return res.status(200).json({ status:"True", message:"Expense Update Successfully", data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"Fail", message:"Internal Server Error" });
  }
}
exports.delete_expense = async (req,res) => {
  try {
    const { id } = req.params;
    const data = await expense.destroy({ where :{id: id}});
    if (!data) {
      return res.status(404).json({ status: "false", message: "Expense Not Found" });
    } else {
      return res.status(200).json({ status: "true", message: "Expense Deleted Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"Fail", message:"Internal Server Error" });
  }
}


exports.delete_expenseItem = async (req,res) => {
  try {
    const { id } = req.params;
    const data = await expenseItem.destroy({ where :{id: id}});
    if (!data) {
      return res.status(404).json({ status: "false", message: "Expense Item Not Found" });
    } else {
      return res.status(200).json({ status: "true", message: "Expense Item Deleted Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"Fail", message:"Internal Server Error" });
  }
}