const User= require("../models/admin");
const sequelize = require("../config/index");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userToken = require("../models/admintoken");
const quotation = require("../models/quotation");
const quotationItem = require("../models/quotationItem");
const salesInvoice = require("../models/salesInvoice");
const salesInvoiceItem = require("../models/salesInvoiceitem");
const deliverychallan = require("../models/deliverychallan");
const deliverychallanitem = require("../models/deliverychallanitem");
const purchase = require("../models/purchase");
const purchaseitem = require("../models/purchaseitem");


exports.admin_signup = async (req, res) => {
  // console.log("enter user");
  const { username, email,password,confirmpassword } = req.body;
// console.log("req",req.body);
  try {
    
    const existingUser = await User.findOne({ where:{email: email}});
    // console.log("existingUser",existingUser);
    if(existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    if(!confirmpassword) {
      return res.status(400).json({ error: 'Required feild: ConfirmPassword' });
    }
    if (password !== confirmpassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password,10);
    // console.log(hashedPassword);
    const user = await User.create({
        username:username,
        email:email,
        password: hashedPassword
    })
    // console.log(user);
      res.status(200).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.admin_login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
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

    return res.status(200).json({ message: 'User Login Successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Qutation ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

exports.create_quotationItem = async(req,res) => {
  try {
    const { quotationId, items } = req.body;

    await Promise.all(items.map(async item => {
      await quotationItem.create({
        ...item,
        quotationId
      });
    }));

    const createdItems = await quotationItem.findAll({ where: { quotationId } });

    return res.status(200).json({ message:"Quatations items Created Successfully",data:createdItems });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message:"Internal Server Error" });
  }
}
exports.create_quotation = async(req, res) => {
  try {
    const { quotationno, date, validtill, email, mobileno, customer, items } = req.body;
    // if(!data) {
    //   return res.status(400).json({ status:""})
    // }
    // const data = await quotation.findOne({ email: email });
    // Create the quotation
    const createdQuotation = await quotation.create({
      quotationno,
      date,
      validtill,
      email,
      mobileno,
      customer
    });

    // Extract items and link them to the created quotation
    if (items && items.length > 0) {
      await Promise.all(items.map(async item => {
        await quotationItem.create({
          ...item,
          quotationId: createdQuotation.id
        });
      }));
    }

    // Fetch the created quotation along with its items
    const quotationWithItems = await quotation.findOne({
      where: { id: createdQuotation.id },
      include: [{ model: quotationItem }]
    });

    return res.status(200).json({ message: 'Quotation created successfully', data: quotationWithItems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.get_all_quotation = async(req,res) => {
  try {
    const allQuotations = await quotation.findAll({
      include: [{ model: quotationItem }]
    });
    if(!allQuotations) {
      return res.status(404).json({ message:"Quotation Data not Found" });
    }
    return res.status(200).json({ data: allQuotations });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
exports.view_quotation = async(req,res) => {
  try {
    const { id } = req.params;

    const data = await quotation.findOne({
      where : { id },
      include : [{ model: quotationItem}] 
    })
    if(!data){
      return res.status(404).json({ message: 'Quotation not found' });
    }
    return res.status(200).json({ data: data });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error:"Internal Server Error" });
  }
}
exports.update_quotationItem = async(req,res) => {
  try {
      const { id } = req.params;
      const { rate, qty, product, amount } = req.body;

      const quotation = await quotationItem.findByPk(id);
      if(!quotation) {
        return res.status(404).json({ message:"Quotation Item not Found" });
      }
      await quotationItem.update({
        rate: rate,
        qty : qty,
        product : product,
        amount : amount
      }, {
        where: { id: id } 
      });
      const data = await quotationItem.findByPk(id);
      return res.status(200).json({ message:"Quotation Item Update Successfully" , data:data });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message:"Internal Server Error" });
  }
}
exports.update_quotation = async(req,res) => {
  try {
      const { id } = req.params;
      const {  quotationno, date, validtill, email, mobileno, customer, items } = req.body;

      const updateQuotation = await quotation.findByPk(id);

      if(!updateQuotation) {
        return res.status(404).json({ message:"Quotation Not Found" });
      }

       await quotation.update({
        quotationno : quotationno,
        date : date,
        validtill : validtill,
        email :email,
        mobileno : mobileno,
        customer : customer
      },{
        where:{id: id}
      });
      const  data = await quotation.findOne({
        where :{id :id},
        include: [{ model: quotationItem}]
      })
      return res.status(200).json({ message:"Quotation Update Successfully" , data: data });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message:"Internal Server Error" });
  }
}
exports.delete_quotationitem = async(req,res) => {
  try {
    const { id } = req.params;
    const data = await quotationItem.destroy({ where: {id: id}});

    if(!data) {
      return res.status(400).json({ message:"Quatation Item Not Found"});
    } else {
      return res.status(200).json({ message:'Quatation Item Delete Successfully' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message:"Internal Server Error" });
  }
}
exports.delete_quotation = async(req,res) => {
  try {
      const { id } = req.params;

      const data = await quotation.destroy({ where: { id:id }});

      if(!data) {
        return res.status(400).json({ message:"Quatation Not Found" });
      } else {
        return res.status(200).json({ message:"Quatation Delete Successfully" });
      }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message:"Internal Server Error" });
  }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ sales invoice +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.create_salesInvoiceItem = async(req,res) => {
  try {
      const { salesInvoiceId, items } = req.body;

      await Promise.all(items.map(async item => {
        await salesInvoiceItem.create({
          ...item,
          salesInvoiceId
        });
      }));

      const data = await salesInvoiceItem.findAll({ where: {salesInvoiceId}});

      return res.status(200).json({ message:"Sales Invoive Item Create Successfully" , data:data});
  } catch (error) {
      console.log(error);
      return res.status(500).json({ message:"Internal Server Error" });
  }
}
exports.create_salesInvoice = async(req,res) => {
  try {
      const { challenno, challendate, email, mobileno, customer, items} = req.body;

      const salesInvoiceData = await salesInvoice.create({
        challenno,
        challendate,
        email,
        mobileno,
        customer
      });

      // if(items && items.length > 0) {
      //   await Promise.all(items.map(async item => {
      //     await salesInvoice.create({
      //       ...item,
      //       salesInvoiceId : salesInvoiceData.id
      //     });
      //   }));
      // }

      // const data = await salesInvoice.findOne({
      //   where : { id: salesInvoiceData.id},
      //   include: [{ model: salesInvoiceItem }]
      // })
      return res.status(200).json({ message:"SalesInvoice Create Successfully" , data:salesInvoiceData });  
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message:"Internal Server Error" });
  }
}
exports.get_all_salesInvoice = async(req,res) => {
  try {
      const data = await salesInvoice.findAll({
          include : [{ model:salesInvoiceItem}]
      });
      if(!data) {
        return res.status(404).json({ message:"Sales Invoice Not Found"});
      }
      return res.status(200).json({ message:"Sales Invoice Data Fetch Successfully", data: data});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message:"Internal Server Error" });
  }
}
exports.view_salesInvoice = async(req,res) => {
  try {
    const { id } = req.params;
    
    const data = await salesInvoice.findOne({
      where: {id},
      include : [{ model: salesInvoiceItem}]
    });

    if(!data) {
      return res.status(404).json({ message:"Sales Invoice Not Found" });
    }
    return res.status(200).json({ data: data});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message:"Internal Server Error" });
  }
}

// exports.delete_expenseItem = async (req,res) => {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Delivery challan +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.create_deliverychallanitem = async(req,res) => {
  try {
    const { deliverychallanId, items } = req.body;

    await Promise.all(items.map(async item => {
      await deliverychallanitem.create({
        ...item,
        deliverychallanId
      });
    }));

    const createdItems = await deliverychallanitem.findAll({ where: { deliverychallanId } });
    // console.log(createdItems,">>>>>>>>>>>>>>>>>>>>>>>");
    return res.status(200).json({ status:"true" , message:"Delivery challan items Created Successfully",data:createdItems });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status:"false" , message:"Internal Server Error" });
  }
}
exports.create_deliverychallan = async(req,res) => {
  try {
    const {email,date,challanno,mobileno,customer} = req.body
    // console.log("DATA>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.body);
    const data = await deliverychallan.create({
      email,
      mobileno,
      date,
      challanno,
      customer
    })
    return res.status(200).json({ status:"true" ,message: "delivery challan created successfully" , data :data})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"false" ,message:"Internal Server Error" });
  }
}
exports.update_deliverychallanitem = async(req,res) => {
  try {
      const { id } = req.params;
      const {expirydate,quotationno,batchno,description,product,qty,mrp,serialno} = req.body;

      const deliverychallan = await deliverychallanitem.findByPk(id);
      if(!deliverychallan) {
        return res.status(404).json({ message:"Delivery challan Item not Found" });
      }
      await deliverychallanitem.update({
        serialno: serialno,
        qty : qty,
        product : product,
        description : description,
        quotationno : quotationno,
        batchno : batchno,
        expirydate : expirydate,
        mrp : mrp
      }, {
        where: { id: id } 
      });

      return res.status(200).json({ status:"true",message:"Delivery challan Item Update Successfully"});
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({status:"false", message:"Internal Server Error" });
  }
}
exports.update_deliverychallan = async(req,res) => {
  try {
    const {id} = req.params
    const {email,mobileno, date,challanno,customer}=req.body

    const updatechallan = await deliverychallan.findByPk(id)

    if(!updatechallan) {
      return res.status(404).json({ status:"false" , message:"Delivery challan Not Found" });
    }

    const data = await deliverychallan.update({
      challanno : challanno,
      date : date,
      email :email,
      mobileno : mobileno,
      customer : customer
    },{
      where:{id: id}
    });
    return res.status(200).json({ status:"true" , message:"Delivery challan Update Successfully"});
  } catch (error) {
    console.log("ERROR",error)
    return res.status(500).json({ status:"false" ,message:"Internal server error"})
  }
}
exports.delete_deliverychallan = async(req,res) => {
  try {
      const { id } = req.params;

      const data = await deliverychallan.destroy({ where: { id:id }});

      if(!data) {
        return res.status(400).json({ status:"false" , message:"Delivery challan Not Found" });
      } else {
        return res.status(200).json({ status:"true" , message:"Delivery challan Delete Successfully" });
      }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"false" , message:"Internal Server Error" });
  }
}
exports.delete_deliverychallanitem = async(req,res) => {
  try {
    const { id } = req.params;
    const data = await deliverychallanitem.destroy({ where: {id: id}});

    if(!data) {
      return res.status(400).json({status:"false",message:"Delivery challan Item Not Found"});
    } else {
      return res.status(200).json({status:"true",message:'Delivery challan Item Delete Successfully' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:"false",message:"Internal Server Error" });
  }
}
exports.get_all_deliverychallan = async(req,res) => {
  try {
      const data = await deliverychallan.findAll({
        include : [{ model:deliverychallanitem}]
    });
      if(!data) {
        return res.status(404).json({ status:"false" , message:"Delivery challan Not Found"});
      }
      return res.status(200).json({ status:"true" , message:"Delivery challan Data Fetch Successfully", data: data});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"false" , message:"Internal Server Error" });
  }
}
exports.view_deliverychallan = async(req,res) => {
  try {
    const { id } = req.params;

    const data = await deliverychallan.findOne({
      where: {id},
      include : [{ model:deliverychallanitem}]
    });

    if(!data) {
      return res.status(404).json({ status:"false" , message:"Delivery challan Not Found" });
    }
    return res.status(200).json({ status:"true" ,message:"Fetch delivery challan data successfully" ,data: data});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"false" , message:"Internal Server Error" });
  }
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Purchase +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.create_purchase = async(req,res) => {
  try {
    const {email,date,quotationno,mobileno,vendor,pono,quotationref} = req.body
    console.log("DATA>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.body);
    const data = await purchase.create({
      email,
      mobileno,
      date,
      quotationno,
      vendor,
      quotationref,
      pono
    })
    return res.status(200).json({ status:"true" ,message: "Purchase created successfully" , data :data})
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"false" ,message:"Internal Server Error" });
  }
}
exports.create_purchaseitem= async(req,res) => {
  try {
    const { purchaseId, items } = req.body;

    await Promise.all(items.map(async item => {
      await purchaseitem.create({
        ...item,
        purchaseId
      });
    }));

    const createdItems = await purchaseitem.findAll({ where: { purchaseId } });
    // console.log(createdItems,">>>>>>>>>>>>>>>>>>>>>>>");
    return res.status(200).json({ status:"true" , message:"Purchase items Created Successfully",data:createdItems });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ status:"false" , message:"Internal Server Error" });
  }
}
exports.update_purchaseitem = async(req,res) => {
  try {
      const { id } = req.params;
      const {date,discount,product,qty,rate,serialno,amount} = req.body;

      const deliverychallan = await purchaseitem.findByPk(id);
      if(!deliverychallan) {
        return res.status(404).json({ message:"Purchase Item not Found" });
      }
      await purchaseitem.update({
        serialno: serialno,
        qty : qty,
        product : product,
        discount : discount,
        date : date,
        rate : rate,
        amount : amount
      }, {
        where: { id: id } 
      });

    return res.status(200).json({ status:"true",message:"Purchase Item Update Successfully"});
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({status:"false", message:"Internal Server Error" });
  }
}
exports.update_purchase = async(req,res) => {
  try {
    const {id} = req.params
    const {email,mobileno, date,pono,vendor,quotationno,quotationref}=req.body

    const updatechallan = await purchase.findByPk(id)

    if(!updatechallan) {
      return res.status(404).json({ status:"false" , message:"Purchase Not Found" });
    }

    await purchase.update({
      quotationno : quotationno,
      date : date,
      email :email,
      mobileno : mobileno,
      vendor : vendor,
      pono : pono,
      quotationref : quotationref

    },{
      where:{id: id}
    });
    return res.status(200).json({ status:"true" , message:"Purchase Updated Successfully"});
  } catch (error) {
    console.log("ERROR",error)
    return res.status(500).json({ status:"false" ,message:"Internal server error"})
  }
}
exports.delete_purchase = async(req,res) => {
  try {
      const { id } = req.params;

      const data = await purchase.destroy({ where: { id:id }});

      if(!data) {
        return res.status(400).json({ status:"false" , message:"Purchase Not Found" });
      } else {
        return res.status(200).json({ status:"true" , message:"Purchase Delete Successfully" });
      }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"false" , message:"Internal Server Error" });
  }
}
exports.delete_purchaseitem = async(req,res) => {
  try {
    const { id } = req.params;
    const data = await purchaseitem.destroy({ where: {id: id}});

    if(!data) {
      return res.status(400).json({status:"false",message:"Purchase Item Not Found"});
    } else {
      return res.status(200).json({status:"true",message:'Purchase Item Delete Successfully' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({status:"false",message:"Internal Server Error" });
  }
}
exports.get_all_purchase = async(req,res) => {
  try {
      const data = await purchase.findAll({
        include : [{ model:purchaseitem}]
    });
      if(!data) {
        return res.status(404).json({ status:"false" , message:"Purchase Not Found"});
      }
      return res.status(200).json({ status:"true" , message:"Purchase Data Fetch Successfully", data: data});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"false" , message:"Internal Server Error" });
  }
}
exports.view_purchase = async(req,res) => {
  try {
    const { id } = req.params;

    const data = await purchase.findOne({
      where: {id},
      include : [{ model:purchaseitem}]
    });

    if(!data) {
      return res.status(404).json({ status:"false" , message:"Purchase Not Found" });
    }
    return res.status(200).json({ status:"true" ,message:"Purchase data fetch successfully" ,data: data});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:"false" , message:"Internal Server Error" });
  }
}