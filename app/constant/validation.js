const Joi = require("joi");

exports.email = function (req, res, next) {
  const { email } = req.body;
  // console.log("email",req.body.email);
  const emailSchema = Joi.string()
    .required()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
    .messages({
      "string.base": "Email Must Be A String",
      "string.email": "Invalid Email Format",
      "any.required": "Required field: Email",
      "string.empty": "Email Cannot be Empty",
    });
  const { error } = emailSchema.validate(email);

  if (error) {
    return res.status(400).json({
      status: "False",
      message: error.message,
    });
  }
  next();
};
exports.password = function (req, res, next) {
  const { password } = req.body;

  const passwordSchema = Joi.string()
  .pattern(new RegExp('^[^.]+$'))
  // .pattern(new RegExp('^[^.]*$|.*\.C$'))
  .required().messages({
    "string.empty": "Password Cannot Be Empty",
    "string.pattern.base": "Password cannot contain a dot (.)",
    "any.required": "Required feild : Password",
  });
  const { error } = passwordSchema.validate(password);

  if (error) {
    return res.status(400).json({
      status: "False",
      message: error.message,
    });
  }
  next();
};
exports.LoginPassword = function (req, res, next) {
  const { password } = req.body;

  const passwordSchema = Joi.string()
  // .pattern(new RegExp('^[^.]+$'))
  .pattern(new RegExp('^[^.]*$|.*\.C$'))
  .required().messages({
    "string.empty": "Password Cannot Be Empty",
    "any.required": "Required feild : Password",
  });
  const { error } = passwordSchema.validate(password);

  if (error) {
    return res.status(400).json({
      status: "False",
      message: error.message,
    });
  }
  next();
};

exports.mobileno = function (req, res, next) {
  const { mobileno } = req.body;
  // console.log("mo",mobileno);
  if ((mobileno === null || mobileno === undefined, mobileno === "")) {
    return res
      .status(400)
      .json({ status: "Fail", message: "Mobile Number Cannot Be Empty" });
  }
  const mobilenoSchema = Joi.number()
    .integer()
    .min(1000000000)
    .max(9999999999)
    .required()
    .messages({
      "number.base": "Moblie Number Must Be A Number",
      "number.min": "Moblie Number Must Have At Least 10 Digits",
      "number.max": "Mobile Number Cannot Have More Then 10 Digits",
      "any.required": "Required Filed: Moblie Number",
    });
  const { error } = mobilenoSchema.validate(mobileno);

  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.challanno = function (req, res, next) {
  const { challanno } = req.body;

  const challannoSchema = Joi.number().required().messages({
    "number.empty": "ChallanNo Cannot Be Empty",
    "any.required": "Required Field : ChallanNo",
    "number.base": "ChallanNo must be a number",
  });
  const valueToValidate = challanno === '' ? undefined : challanno;
  const { error } = challannoSchema.validate(valueToValidate);

  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.date = function (req, res, next) {
  const { date } = req.body;

  const dateSchema = Joi.string().required().messages({
    "string.empty": "Date Cannot Be Empty",
    "any.required": "Required Filed : Date",
    "string.base": "Date Must Be A String"
  });
  const { error } = dateSchema.validate(date);
  if (date === null) {
    return res.status(400).json({ status: "False", message: "Date Cannot Be Empty" });
  }
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};

exports.customerId = function (req, res, next) {
  const { customerId } = req.body;

  const customerSchema = Joi.number().required().messages({
    "number.empty": "Customer Cannot Be Empty",
    "any.required": "Required Filed : Customer",
  });
  const { error } = customerSchema.validate(customerId);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.mrp = function (req, res, next) {
  const { items } = req.body;
 
  for (const item of items) {
    const { mrp } = item;
    const mrpSchema = Joi.number()

      .required()
      .messages({
        "number.empty": "MRP Cannot Be Empty",
        "any.required": "Required Filed : MRP",
        "number.base": "Mrp must be a number",
      });
const valueToValidate = mrp === '' ? undefined : mrp;
    const { error } = mrpSchema.validate(valueToValidate);
    if (error) {
      return res.status(400).json({ status: "False", message: error.message });
    }
  }
  next();
};
exports.qty = function (req, res, next) {
  const { items } = req.body;
  for (const item of items) {
    const { qty } = item;
    // console.log("item",item);
    const qtySchema = Joi.number()

      .required()
      .messages({
        "any.required": "Required Filed : QTY",
        "number.empty": "QTY Cannot Be Empty",
        "number.base": "Qty must be a number",
      });
      const valueToValidate = qty === '' ? undefined : qty;
    const { error } = qtySchema.validate(valueToValidate);
    if (error) {
      return res.status(400).json({ status: "False", message: error.message });
    }
  }
  next();
};
exports.productId = function (req, res, next) {
  const { items } = req.body;

  for (const item of items) {
    const { productId } = item;
    const productSchema = Joi.number()

      .required()
      .messages({
        "any.required": "Required Filed : Product",
        "string.empty": "Product Cannot Be Empty",
      });

    const { error } = productSchema.validate(productId);

    if (error) {
      return res.status(400).json({ status: "False", message: error.message });
    }
  }
  next();
};
exports.description = function (req, res, next) {
  const { items } = req.body;
  for (const item of items) {
    const { description } = item;
    const descriptionSchema = Joi.string()

      .required()
      .messages({
        "any.required": "Required Filed : Description",
        "string.empty": "Description Cannot Be Empty",
      });
    const { error } = descriptionSchema.validate(description);

    if (error) {
      return res.status(400).json({ status: "False", message: error.message });
    }
  }
  next();
};
exports.batchno = function (req, res, next) {
  const { items } = req.body;
  for (const item of items) {
    const { batchno } = item;
    const batchnoSchema = Joi.string()

      .required()
      .messages({
        "any.required": "Required Filed : Batchno",
        "string.empty": "Batchno Cannot Be Empty",
      });
    const { error } = batchnoSchema.validate(batchno);

    if (error) {
      return res.status(400).json({ status: "False", message: error.message });
    }
  }
  next();
};
exports.quotationno = function (req, res, next) {
  const { items } = req.body;
  for (const item of items) {
    const { quotationno } = item;
    const quotationnoSchema = Joi.string()

      .required()
      .messages({
        "any.required": "Required Filed : Quotation Number",
        "string.empty": "Quotation Number Cannot Be Empty",
      });
    const { error } = quotationnoSchema.validate(quotationno);

    if (error) {
      return res.status(400).json({ status: "False", message: error.message });
    }
  }
  next();
};
exports.expirydate = function (req, res, next) {
  const { items } = req.body;
  for (const item of items) {
    const { expirydate } = item;
    const expirydateSchema = Joi.string()

      .required()
      .messages({
        "any.required": "Required Filed : Expiry Date",
        "string.empty": "Expiry Date Cannot Be Empty",
      });
    const { error } = expirydateSchema.validate(expirydate);

    if (error) {
      return res.status(400).json({ status: "False", message: error.message });
    }
  }
  next();
};
exports.vendor = function (req, res, next) {
  const { vendor } = req.body;
  // console.log(vendor);
  const vendorSchema = Joi.string().required().messages({
    "any.required": "Required Filed : Vendor",
    "string.empty": "Vendor Cannot Be Empty",
  });
  
  const { error } = vendorSchema.validate(vendor);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.voucherno = function (req, res, next) {
  const { voucherno } = req.body;
  const vouchernoSchema = Joi.number().required().messages({
    "any.required": "Required Filed : Voucher No",
    "number.empty": "Voucher No Cannot Be Empty",
  });
  const valueToValidate = voucherno === '' ? undefined : voucherno;
    const { error } = vouchernoSchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.gstrate = function (req, res, next) {
  const { gstrate } = req.body;
  const gstrateSchema = Joi.number().required().messages({
    "any.required": "Required Filed : GST Rate",
    "number.empty": "GST Rate Cannot Be Empty",
  });
  const valueToValidate = gstrate === '' ? undefined : gstrate;
  const { error } = gstrateSchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  
  next();
};
exports.billno = function (req, res, next) {
  const { billno } = req.body;
  // console.log("bill", billno);
  const billnoSchema = Joi.string().required().messages({
    "any.required": "Required Field: Bill No.",
    "string.empty": "Bill No. Cannot Be Empty",
  });
  const { error } = billnoSchema.validate(billno);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.billdate = function (req, res, next) {
  const { billdate } = req.body;
  const billdateSchema = Joi.string().required().messages({
    "any.required": "Required Filed : Bill Date",
    "string.empty": "Bill Date Cannot Be Empty",
  });
  const { error } = billdateSchema.validate(billdate);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.payment = function (req, res, next) {
  const { payment } = req.body;
  const paymentSchema = Joi.string().required().messages({
    "any.required": "Required Filed : Payment",
    "string.empty": "Payment Cannot Be Empty",
  });
  const { error } = paymentSchema.validate(payment);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.expensse = function (req, res, next) {
  const { items } = req.body;

  for (const item of items) {
    const { expensse } = item;

    const expensseSchema = Joi.string()

      .required()
      .messages({
        "any.required": "Required Field: Expensse",
        "string.empty": "Expensse Cannot Be Empty",
      });
    const { error } = expensseSchema.validate(expensse);
    if (error) {
      return res.status(400).json({ status: "False", message: error.message });
    }
  }
  next();
};
exports.taxable = function (req, res, next) {
  const { items } = req.body;

  for (const item of items) {
    const { taxable } = item;

    const taxableSchema = Joi.number().required().messages({
      "any.required": "Required Field : TaxAble",
      "string.empty": "TaxAble Cannot Be Empty",
      "number.base": "TaxAble must be a number",
    });
    const valueToValidate = taxable === '' ? undefined : taxable;
    const { error } = taxableSchema.validate(valueToValidate);
    if (error) {
      return res.status(400).json({ status: "False", message: error.message });
    }
  }
  next();
};
exports.account = function (req, res, next) {
  const { account } = req.body;

  const accountSchema = Joi.string().required().messages({
    "any.required": "Required Field : Account",
    "string.empty": "Account Cannot Be Empty",
  });
  const { error } = accountSchema.validate(account);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.paymentdate = function (req, res, next) {
  const { paymentdate } = req.body;

  const paymentdateSchema = Joi.string().required().messages({
    "any.required": "Required Field : Payment Date",
    "string.empty": "Payment Date Cannot Be Empty",
  });
  const { error } = paymentdateSchema.validate(paymentdate);
  if (paymentdate === null) {
    return res.status(400).json({ status: "False", message: "Payment Date Cannot Be Empty" });
  }
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.mode = function (req, res, next) {
  const { mode } = req.body;
  const modeSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Filed : Mode",
      "string.empty": "Mode Cannot Be Empty",
    });
  const { error } = modeSchema.validate(mode);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.refno = function (req, res, next) {
  const { refno } = req.body;
  const refnoSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Filed : Ref Number",
      "string.empty": "Ref Number Cannot Be Empty",
    });
  const { error } = refnoSchema.validate(refno);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.amount = function (req, res, next) {
  const { amount } = req.body;
  const amountSchema = Joi.number()
  .min(1)
  .required()
  .messages({
    "any.required": "Required Field : Amount",
    "number.empty": "Amount Cannot Be Empty",
    "number.min": "Please Enter Valid Amount"
  });
  const valueToValidate = amount === '' ? undefined :amount;
  const { error } = amountSchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.paidfrom = function (req, res, next) {
  const { paidfrom } = req.body;
  const paidfromSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : PaidFrom",
      "string.empty": "PaidFrom Cannot Be Empty",
    });
  const { error } = paidfromSchema.validate(paidfrom);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.quotationref = function (req, res, next) {
  const { quotationref } = req.body;
  const quotationrefSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Quotation Ref",
      "string.empty": "Quotation Ref Cannot Be Empty",
    });
  const { error } = quotationrefSchema.validate(quotationref);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.pono = function (req, res, next) {
  const { pono } = req.body;

  const ponoSchema = Joi.string().required().messages({
    "any.required": "Required Field : Pono",
    "string.empty": "Pono Cannot Be Empty",
  });
  const { error } = ponoSchema.validate(pono);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.ProFormaInvoice_no = function (req, res, next) {
  const { ProFormaInvoice_no } = req.body;
  const pattern = /^Q-\d+$/;

  const ProFormaInvoice_noSchema = Joi.string()
  .required()
  .pattern(pattern)
  .messages({
    "any.required": "Required Field : ProForma Invoice Number",
    "string.empty": "ProForma Invoice_No Cannot Be Empty",
    "string.pattern.base": "ProForma Invoice Number must start with 'Q' followed by a dash and then a number"
  });
  const { error } = ProFormaInvoice_noSchema.validate(ProFormaInvoice_no);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.rate = function (req, res, next) {
  const { items } = req.body;
  for (const item of items) {
    const { rate } = item;

    const rateSchema = Joi.number().required().messages({
      "any.required": "Required Field : Rate",
      "number.empty": "Rate Cannot Be Empty",
      "number.base": "Rate must be a number",
    });
    const valueToValidate = rate ==='' ? undefined : rate
    const { error } = rateSchema.validate(valueToValidate);
    if (error) {
      return res.status(400).json({ status: "False", message: error.message });
    }
  }
  next();
};
exports.discount = function (req, res, next) {
  const { items } = req.body;
  for (const item of items) {
    const { discount } = item;
    const discountSchema = Joi.string()

      .required()
      .messages({
        "any.required": "Required Field : Discount",
        "string.empty": "Discount Cannot Be Empty",
      });
    const { error } = discountSchema.validate(discount);
    if (error) {
      return res.status(400).json({ status: "False", message: error.message });
    }
  }
  next();
};
exports.validtill = function (req, res, next) {
  const { validtill } = req.body;
  const validtillSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Validtill",
      "string.empty": "validtill Cannot Be Empty",
      "string.base": "Validtill Date Must Be A String"
    });
  const { error } = validtillSchema.validate(validtill);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.creditnoteNo = function (req, res, next) {
  const { creditnoteNo } = req.body;
  const creditnoteNoSchema = Joi.number()

    .required()
    .messages({
      "number.base": "Credit Note must be a number",
      "any.required": "Required Field : Credit Note",
      "number.empty": "Credit Note Cannot Be Empty",
    });
    const valueToValidate = creditnoteNo === '' ? undefined : creditnoteNo;
  const { error } = creditnoteNoSchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.creditdate = function (req, res, next) {
  const { creditdate } = req.body;
  const creditdateSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Credit Date",
      "string.empty": "Credit Date Cannot Be Empty",
    });
  const { error } = creditdateSchema.validate(creditdate);
  if (creditdate === null) {
    return res.status(400).json({ status: "False", message: "Creadit Date Cannot Be Empty" });
  }
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.invoiceno = function (req, res, next) {
  const { invoiceno } = req.body;
  const invoicenoSchema = Joi.number()

    .required()
    .messages({
      "number.base": "Invoice Number must be a number",
      "any.required": "Required Field : Invoice Number",
      "number.empty": "Invoice Number Cannot Be Empty",
    });
    const valueToValidate = invoiceno === '' ? undefined : invoiceno;
  const { error } = invoicenoSchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.invoicedate = function (req, res, next) {
  const { invoicedate } = req.body;
  const invoicedateSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Invoice Date",
      "string.empty": "Invoice Date Cannot Be Empty",
      "string.base": "Invoice Date Must Be A String"
    });
  const { error } = invoicedateSchema.validate(invoicedate);
  if (invoicedate === null) {
    return res.status(400).json({ status: "False", message: "Invoice Date Cannot Be Empty" });
  }
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.purchaseinvoicedate = function (req, res, next) {
  const { invoicedate } = req.body;
  const invoicedateSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field :Purchase Invoice Date",
      "string.empty": "Purchase Invoice Date Cannot Be Empty",
      "string.base": "Purchase Invoice Date Must Be A String"
    });
  const { error } = invoicedateSchema.validate(invoicedate);
  if (invoicedate === null) {
    return res.status(400).json({ status: "False", message: "Purchase Invoice Cannot Be Empty" });
  }
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.itemname = function (req, res, next) {
  const { itemname } = req.body;
  const itemnameSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Item Name",
      "string.empty": "Item Name Cannot Be Empty",
    });
  const { error } = itemnameSchema.validate(itemname);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.unit = function (req, res, next) {
  const { unit } = req.body;
  const unitSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Unit",
      "string.empty": "Unit Cannot Be Empty",
      "string.base":" Unit Value Must be String"
    });
  const { error } = unitSchema.validate(unit);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.accountname = function (req, res, next) {
  const { accountname } = req.body;
  const accountnameSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Account Name",
      "string.empty": "Account Name Cannot Be Empty",
    });
  const { error } = accountnameSchema.validate(accountname);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.shortname = function (req, res, next) {
  const { shortname } = req.body;
  const shortnameSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Short Name",
      "string.empty": "Short Name Cannot Be Empty",
    });
  const { error } = shortnameSchema.validate(shortname);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.contactpersonname = function (req, res, next) {
  const { contactpersonname } = req.body;
  const contactpersonnameSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Contact Person Name",
      "string.empty": "ContactPerson Name Cannot Be Empty",
    });
  const { error } = contactpersonnameSchema.validate(contactpersonname);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.creditperiod = function (req, res, next) {
  const { creditperiod } = req.body;
  const creditperiodSchema = Joi.number()

    .required()
    .messages({
      "any.required": "Required Field : Default Credit Period",
      "number.base": "Default Credit Period must be a number",
      "number.empty": "Default Credit Period Cannot Be Empty",
    });
  // const { error } = creditperiodSchema.validate(creditperiod);
  const valueToValidate = creditperiod === "" ? undefined : creditperiod;

  const { error } = creditperiodSchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.address1 = function (req, res, next) {
  const { address1 } = req.body;
  const address1Schema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : address1",
      "string.empty": "address1 Cannot Be Empty",
    });
  const { error } = address1Schema.validate(address1);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.pincode = function (req, res, next) {
  const { pincode } = req.body;
  const pincodeSchema = Joi.number()

    .required()
    .min(100000)
    .max(999999)
    .messages({
      "number.base": "PinCode Must Be A Number",
      "any.required": "Required Field : PinCode",
      "number.empty": "PinCode Cannot Be Empty",
      "number.min":"Pincode Must Be At Least 6 Digits",
      "number.max":"Pincode Must Be At Most 6 Digits"
    });
    const valueToValidate = pincode === '' ? undefined : pincode
    const { error } = pincodeSchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.state = function (req, res, next) {
  const { state } = req.body;
  const stateSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : state",
      "string.empty": "state Cannot Be Empty",
    });
  const { error } = stateSchema.validate(state);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.city = function (req, res, next) {
  const { city } = req.body;
  const citySchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : City",
      "string.empty": "City Cannot Be Empty",
    });
  const { error } = citySchema.validate(city);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.bankdetail = function (req, res, next) {
  const { bankdetail } = req.body;
  const bankdetailSchema = Joi.boolean()

    .required()
    .messages({
      "any.required": "Required Field : Bank Detail",
      "boolean.empty": "Bank Detail Cannot Be Empty",
    });
  const { error } = bankdetailSchema.validate(bankdetail);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.creditlimit = function (req, res, next) {
  const { creditlimit } = req.body;
  const creditlimitSchema = Joi.boolean()

    .required()
    .messages({
      "any.required": "Required Feild : Credit Limit",
      "boolean.empty": "Credit Limit Cannot Be Empty",
    });
  const { error } = creditlimitSchema.validate(creditlimit);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.balance = function (req, res, next) {
  const { balance } = req.body;
  const balanceSchema = Joi.number()

    .required()
    .messages({
      "any.required": "Required Field : Balance",
      "number.empty": "Balance Cannot Be Empty",
      "number.base": "Balance must be a number",
    });
    const valueToValidate = balance === '' ? undefined : balance;
  const { error } = balanceSchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.itemtype = function (req, res, next) {
  const { itemtype } = req.body;
  const itemtypeSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Itemtype",
      "string.empty": "Itemtype Cannot Be Empty",
    });
  const { error } = itemtypeSchema.validate(itemtype);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.productname = function (req, res, next) {
  const { productname } = req.body;
  const productnameSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Product Name",
      "string.empty": "Product Name Cannot Be Empty",
    });
  const { error } = productnameSchema.validate(productname);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.nagativeqty = function (req, res, next) {
  const { nagativeqty } = req.body;
  const nagativeqtySchema = Joi.boolean()

    .required()
    .messages({
      "any.required": "Required Field : Nagative Qty",
      "boolean.empty": "Nagative Qty Cannot Be Empty",
    });
  const { error } = nagativeqtySchema.validate(nagativeqty);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.lowstock = function (req, res, next) {
  const { lowstock } = req.body;
  const lowstockSchema = Joi.boolean()

    .required()
    .messages({
      "any.required": "Required Field : lowStock",
      "boolean.empty": "lowStock Cannot Be Empty",
    });
  const { error } = lowstockSchema.validate(lowstock);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.purchaseprice = function (req, res, next) {
  const { purchaseprice } = req.body;
  const purchasepriceSchema = Joi.number()

    .required()
    .messages({
      "any.required": "Required Field :Purchase Price",
      "number.empty": "Purchase price Cannot Be Empty",
      "number.base": "Purchase Price must be a number",
    });
    const valueToValidate = purchaseprice === "" ? undefined : purchaseprice
  const { error } = purchasepriceSchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.salesprice = function (req, res, next) {
  const { salesprice } = req.body;
  const salespriceSchema = Joi.number()

    .required()
    .messages({
      "any.required": "Required Field : Sales Price",
      "number.empty": "Sales Price Cannot Be Empty",
      "number.base": "Sales Price must be a number",
    });
    const valueToValidate = salesprice === '' ? undefined : salesprice;
  const { error } = salespriceSchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.purchaseprice = function (req, res, next) {
  const { purchaseprice } = req.body;
  const purchasepriceSchema = Joi.number()

    .messages({
      "number.base": "Purchase Price must be a number",
    });
    const valueToValidate = purchaseprice === '' ? undefined : purchaseprice;
  const { error } = purchasepriceSchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.group = function (req, res, next) {
  const { group } = req.body;
  const groupSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Group",
      "string.empty": "Group Cannot Be Empty",
    });
  const { error } = groupSchema.validate(group);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.remarks = function (req, res, next) {
  const { remarks } = req.body;
  const remarksSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Remarks",
      "string.empty": "Remarks Cannot Be Empty",
    });
  const { error } = remarksSchema.validate(remarks);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.category = function (req, res, next) {
  const { category } = req.body;
  const categorySchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Category",
      "string.empty": "Category Cannot Be Empty",
    });
  const { error } = categorySchema.validate(category);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.unitname = function (req, res, next) {
  const { unitname } = req.body;
  const unitnameSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Unitname",
      "string.empty": "Unitname Cannot Be Empty",
    });
  const { error } = unitnameSchema.validate(unitname);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.terms = function (req, res, next) {
  const { terms } = req.body;
  const termsSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : terms",
      "string.empty": "terms Cannot Be Empty",
    });
   const {error} = termsSchema.validate(terms);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.duedate = function (req, res, next) {
  const { duedate } = req.body;
  const duedateSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : duedate",
      "string.empty": "Duedate Cannot Be Empty",
      "string.base": "Date Must Be A String",
    });
  const { error } = duedateSchema.validate(duedate);
  if (duedate === null) {
    return res.status(400).json({ status: "False", message: "Duedate Cannot Be Empty" });
  }
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.book = function (req, res, next) {
  const { book } = req.body;
  const bookSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Field : Book",
      "string.empty": "Book Cannot Be Empty",
    });
  const { error } = bookSchema.validate(book);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.debitnoteno = function (req, res, next) {
  const { debitnoteno } = req.body;
  const debitnotenoSchema = Joi.number().required().messages({
    "any.required": "Required Field : Debit Note Number",
    "number.empty": "Debit Note Cannot Be Empty",
    "number.base": "Debit Note must be a number",
  });
  const valueToValidate = debitnoteno === '' ? undefined : debitnoteno
  const { error } = debitnotenoSchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.debitdate = function (req, res, next) {
  const { debitdate } = req.body;
  const debitdateSchema = Joi.string().required().messages({
    "any.required": "Required Field : Debit Date",
    "string.empty": "Debit Date Cannot Be Empty",
  });
  const { error } = debitdateSchema.validate(debitdate);
  if (debitdate === null) {
    return res.status(400).json({ status: "False", message: "Debit Date Cannot Be Empty" });
  }
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.refdate = function (req, res, next) {
  const { refdate } = req.body;
  const refdateSchema = Joi.string().required().messages({
    "any.required": "Required Field : RefDate",
    "string.empty": "RefDate Cannot Be Empty",
  });
  const { error } = refdateSchema.validate(refdate);
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.price = function (req, res, next) {
  const { items } = req.body;
  for (const item of items) {
    const { price } = item;
    const priceSchema = Joi.number().required().messages({
      "any.required": "Required Field : Price",
      "number.empty": "Price Cannot Be Empty",
      "number.base": "Price must be a number",
    });
    const valueToValidate = price === ''? undefined :price
    const { error } = priceSchema.validate(valueToValidate);
    if (error) {
      return res.status(400).json({ status: "False", message: error.message });
    }
  }
  next();
};
exports.bill_no = function (req, res, next) {
  const { items } = req.body;

  for (const item of items) {
    const { bill_no } = item;

    const bill_noSchema = Joi.string()

      .required()
      .messages({
        "any.required": "Required Field: bill_no",
        "string.empty": "bill_no Cannot Be Empty",
      });
    const { error } = bill_noSchema.validate(bill_no);
    if (error) {
      return res.status(400).json({ status: "False", message: error.message });
    }
  }
  next();
};
exports.bill_date = function (req, res, next) {
  const { items } = req.body;

  for (const item of items) {
    const { bill_date } = item;

    const bill_dateSchema = Joi.string()

      .required()
      .messages({
        "any.required": "Required Field: Bill_date",
        "string.empty": "bill_date Cannot Be Empty",
      });
    const { error } = bill_dateSchema.validate(bill_date);
    if (error) {
      return res.status(400).json({ status: "False", message: error.message });
    }
  }
  next();
};
exports.receiptdate = function (req, res, next) {
  const { receiptdate } = req.body;
  const receiptdateSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required Filed: Receipt Date",
      "string.empty": "Receipt Date Cannot Be Empty",
    });
  const { error } = receiptdateSchema.validate(receiptdate);
  if (error) {
    return res.status(400).json({ status: "false", message: error.message });
  }
  next();
};
exports.depositto = function (req, res, next) {
  const { depositto } = req.body;
  const deposittoSchema = Joi.string().required().messages({
    "any.required": "Required Filed : Deposit To",
    "string.empty": "Deposit To Cannot Be Empty",
  });
  const { error } = deposittoSchema.validate(depositto);
  if (error) {
    return res.status(400).json({ status: "false", message: error.message });
  }
  next();
};
// exports.amountreceive = function (req, res, next) {
//   const { amountreceive } = req.body;
//   const amountreceiveSchema = Joi.number().required().messages({
//     "any.required": "Required filed : Amount Receive",
//     "number.empty": "Amount Receive Cannot Be Empty",
//     "number.base": "Amount Receive must be a number",
//   });

//   const { error } = amountreceiveSchema.validate(amountreceive);
//   if (error) {
//     return res.status(400).json({ status: "false", message: error.message });
//   }
//   next();
// };
exports.accountnumber = function (req, res, next) {
  const { accountnumber } = req.body;
  const accountnumberSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required filed : Account Number",
      "string.empty": "Account Number Cannot Be Empty",
    });
  const { error } = accountnumberSchema.validate(accountnumber);
  if (error) {
    return res.status(400).json({ status: "false", message: error.message });
  }
  next();
};
exports.ifsccode = function (req, res, next) {
  const { ifsccode } = req.body;
  // console.log("ifsc",ifsccode);
  const ifsccodeSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required filed : IFSC Code",
      "string.empty": "IFSC Code Cannot Be Empty",
    });
  const { error } = ifsccodeSchema.validate(ifsccode);
  if (error) {
    return res.status(400).json({ status: "false", message: error.message });
  }
  next();
};
exports.bankname = function (req, res, next) {
  const { bankname } = req.body;
  const banknameSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required filed : BankName",
      "string.empty": "BankName Cannot Be Empty",
    });
  const { error } = banknameSchema.validate(bankname);
  if (error) {
    return res.status(400).json({ status: "false", message: error.message });
  }
  next();
};
exports.branch = function (req, res, next) {
  const { branch } = req.body;

  const branchSchema = Joi.string()
    .required()
    .messages({
      "any.required": "Required Feild: Branch",
      "string.empty": "Branch Name Cannot Be Empty"
    });
  const { error } = branchSchema.validate(branch);
  if (error) {
    return res.status(400).json({ status: 'false', message: error.message });
  }
  next();
}
exports.country = function (req, res, next) {
  const { country } = req.body;
  const countrySchema = Joi.string().required().messages({
    "any.required": "Required filed : Country",
    "string.empty": "Country Cannot Be Empty",
  });
  const { error } = countrySchema.validate(country);
  if (error) {
    return res.status(400).json({ status: "false", message: error.message });
  }
  next();
};
exports.username = function (req, res, next) {
  const { username } = req.body;
  const usernameSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required filed : User Name",
      "string.empty": "User Name Cannot Be Empty",
    });
  const { error } = usernameSchema.validate(username);
  if (error) {
    return res.status(400).json({ status: "false", message: error.message });
  }
  next();
};
exports.salary = function (req, res, next) {
  const { salary } = req.body;
  const salarySchema = Joi.number()

    .required()
    .messages({
      "any.required": "Required filed : Salary",
      "string.empty": "Salary Cannot Be Empty",
      "number.base": "Salary must be a number",
    });
    const valueToValidate = salary === '' ? undefined: salary;
  const { error } = salarySchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: "false", message: error.message });
  }
  next();
};
exports.role = function (req, res, next) {
  const { role } = req.body;
  const roleSchema = Joi.string()

    .required()
    .messages({
      "any.required": "Required field : Role",
      "string.empty": "Role Cannot Be Empty",
    });
  const { error } = roleSchema.validate(role);
  if (error) {
    return res.status(400).json({ status: "false", message: error.message });
  }
  next();
};
exports.gstnumber = function (req, res, next) {
  const { gstnumber } = req.body;
  const gstnumberSchema = Joi.string()

    .length(15)
    .required()
    .messages({
      "any.required": " Required field : GST Number",
      "string.empty": "GST Number Cannot Be Empty",
      "string.length": "GST Number must be exactly 15 characters long",
    });
  const { error } = gstnumberSchema.validate(gstnumber);
  if (error) {
    return res.status(400).json({ status: "false", message: error.message });
  }
  next();
};
exports.HSNcode = function (req, res, next) {
  const { HSNcode } = req.body;

  const HSNcodeSchema = Joi.number()

    .integer()
    .max(999999)
    .required()
    .messages({
      "any.required": "Required Filed : HSN Code",
      "number.base": "HSN Code must be a number",
      "number.empty": "HSN Code Cannot Be Empty",
      "number.max": "HSN Code Cannot Have More Then 6 Digits",
    });
    const valueToValidate = HSNcode === '' ? undefined : HSNcode;
  const { error } = HSNcodeSchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: 'false', message: error.message });
  }
  next();
}
exports.companyname = function (req, res, next) {
  const { companyname } = req.body

  const companynameSchema = Joi.string()
    .required()
    .messages({
      "any.required": 'Required field : Company Name',
      "string.empty": "Company Cannot Be Empty"
    });

  const { error } = companynameSchema.validate(companyname);
  if (error) {
    return res.status(400).json({ status: 'false', message: error.message });
  }
  next();
}
exports.org_invoiceno = function (req, res, next) {
  const { org_invoiceno } = req.body

  const org_invoicenoSchema = Joi.number()
    .required()
    .messages({
      "number.base": "Org. Invoice Number must be a number",
      "any.required": "Required feild: Org. Invoice Number",
      "number.empty": "Org. Invoice Number Cannot Be Empty"
    })
const valueToValidate = org_invoiceno === '' ? undefined : org_invoiceno;
  const { error } = org_invoicenoSchema.validate(valueToValidate);
  if (error) {
    return res.status(400).json({ status: 'false', message: error.message });
  }
  next();
}
exports.org_invoicedate = function (req, res, next) {
  const { org_invoicedate } = req.body;

  const org_invoicedateSchema = Joi.string().required().messages({
    "string.empty": "Org. Invoice Date Cannot Be Empty",
    "any.required": "Required Filed : Org. Invoice Date",
  });
  const { error } = org_invoicedateSchema.validate(org_invoicedate);
  if (org_invoicedate === null) {
    return res.status(400).json({ status: "False", message: "Org Invoice Date Cannot Be Empty" });
  }
  if (error) {
    return res.status(400).json({ status: "False", message: error.message });
  }
  next();
};
exports.referance = function (req, res, next) {
  const { referance } = req.body

  const referanceSchema = Joi.string()
    .required()
    .messages({
      "any.required": 'Required field : Referance',
      "string.empty": "Referance Cannot Be Empty"
    });

  const { error } = referanceSchema.validate(referance);
  if (error) {
    return res.status(400).json({ status: 'false', message: error.message });
  }
  next();
}
exports.purpose = function (req, res, next) {
  const { purpose } = req.body

  const purposeSchema = Joi.string()
    .required()
    .messages({
      "any.required": 'Required field : Purpose',
      "string.empty": "Purpose Cannot Be Empty"
    });

  const { error } = purposeSchema.validate(purpose);
  if (error) {
    return res.status(400).json({ status: 'false', message: error.message });
  }
  next();
}
exports.validateBankdetails = function(req,res,next) {
  const {bankdetail,bankdetails} = req.body;

  if(bankdetail === true) {
      const bankdetailsSchema = Joi.object({
        bankname: Joi.string().required().messages({
          'any.required': 'Required field : Bank name',
          'string.empty': 'Bank name cannot be empty'
        }),
        ifsccode: Joi.string().required().messages({
          'any.required': 'Required field : IFSC code',
          'string.empty': 'IFSC code cannot be empty'
        }),
        accounttype: Joi.string().required().messages({
          'any.required': 'Required field : Account type',
          'string.empty': 'Account type cannot be empty'
        }),
        accountnumber: Joi.string().required().messages({
          'any.required': 'Required field : Account number',
          'string.empty': 'Account number cannot be empty'
        })
      });

      const {error} = bankdetailsSchema.validate(bankdetails);
      if(error) {
        return res.status(400).json({status:'false', message:error.details[0].message});
      }
  }
  next();
}
exports.validateCredit = function(req, res, next) {
  const { creditlimit, totalcreadit } = req.body;

  if (creditlimit === true) {
    const schema = Joi.object({
      totalcreadit: Joi.number().required().messages({
        'any.required': 'Required field: totalcreadit',
        'number.base': 'totalcreadit must be a number'
      })
    });

    const { error } = schema.validate({ totalcreadit });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  }

  next();
}


exports.create_bom = function(req, res, next) {
  const payload = req.body;

  const schema = Joi.object({
    bomNo: Joi.number().required().messages({
      'any.required': 'The bomNo field is required.',
      'number.base': 'The bomNo must be a number.'
    }),
    date: Joi.date().required().messages({
      'any.required': 'The date field is required.',
      'date.base': 'The date must be a valid date.'
    }),
    description: Joi.string().required().messages({
      'any.required': 'The description field is required.',
      'string.base': 'The description must be a string.'
    }),
    productId: Joi.number().required().messages({
      'any.required': 'The productId field is required.',
      'number.base': 'The productId must be a number.'
    }),
    qty: Joi.number().required().messages({
      'any.required': 'The qty field is required.',
      'number.base': 'The qty must be a number.'
    }),
    items: Joi.array().items(
        Joi.object({
          productId: Joi.number().required().messages({
            'any.required': 'The productId field is required.',
            'number.base': 'The productId must be a number.'
          }),
          qty: Joi.number().required().messages({
            'any.required': 'The qty field is required.',
            'number.base': 'The qty must be a number.'
          }),
          wastage: Joi.number().messages({
            'number.base': 'The wastage must be a number.'
          }),
        })
    ).min(1).required().messages({
      'any.required': 'The items field is required.',
      'array.base': 'The items must be an array of objects.',
      'array.min': 'The items array must contain at least one item.'
    })
  });

  const { error, value } = schema.validate(payload);
  if (error) {
    return res.status(400).json({
      status: "false",
      message: error.message
    })
  } else {
    next();
  }
}

exports.update_bom = function(req, res, next) {
  const payload = req.body;

  const schema = Joi.object({
    bomNo: Joi.number().required().messages({
      'any.required': 'The bomNo field is required.',
      'number.base': 'The bomNo must be a number.'
    }),
    date: Joi.date().required().messages({
      'any.required': 'The date field is required.',
      'date.base': 'The date must be a valid date.'
    }),
    description: Joi.string().required().messages({
      'any.required': 'The description field is required.',
      'string.base': 'The description must be a string.'
    }),
    productId: Joi.number().required().messages({
      'any.required': 'The productId field is required.',
      'number.base': 'The productId must be a number.'
    }),
    qty: Joi.number().required().messages({
      'any.required': 'The qty field is required.',
      'number.base': 'The qty must be a number.'
    }),
    items: Joi.array().items(
        Joi.object({
          productId: Joi.number().required().messages({
            'any.required': 'The productId field is required.',
            'number.base': 'The productId must be a number.'
          }),
          qty: Joi.number().required().messages({
            'any.required': 'The qty field is required.',
            'number.base': 'The qty must be a number.'
          }),
          wastage: Joi.number().messages({
            'number.base': 'The wastage must be a number.'
          }),
          id: Joi.number().required().messages({
            'any.required': 'The unit field is required.',
            'number.base': 'The wastage must be a number.'
          })
        })
    ).min(1).required().messages({
      'any.required': 'The items field is required.',
      'array.base': 'The items must be an array of objects.',
      'array.min': 'The items array must contain at least one item.'
    })
  });

  const { error, value } = schema.validate(payload);
  if (error) {
    return res.status(400).json({
      status: "false",
      message: error.message
    })
  } else {
    next();
  }
}