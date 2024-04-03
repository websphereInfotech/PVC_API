const Joi = require('joi');

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
            "string.empty": "Email Cannot be Empty"
        });
    const { error } = emailSchema.validate(email);

    if (error) {
        return res.status(400).json({
            status: "False", message: error.message,
        });
    };
    next();
};
exports.password = function (req, res, next) {
    const { password } = req.body;

    const passwordSchema = Joi.string()
        .required()
        .messages({
            "string.empty": "Password Cannot Be A Empty",
            "any.required": "Required feild : Password"
        });
    const { error } = passwordSchema.validate(password);

    if (error) {
        return res.status(400).json({
            status: "False", message: error.message,
        })
    }
    next();
}
exports.mobileno = function (req, res, next) {
    const { mobileno } = req.body;
    // console.log("mo",mobileno);
    if (mobileno === null || mobileno === undefined, mobileno === '') {
        return res.status(400).json({ status: "Fail", message: "Mobile Number Cannot Be Empty" });
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
            "any.required": "Required Filed: Moblie Number"
        });
    const { error } = mobilenoSchema.validate(mobileno);

    if (error) {
        return res.status(400).json({ status: 'False', message: error.message });
    }
    next();
}
exports.challanno = function (req, res, next) {
    const { challanno } = req.body;

    const challannoSchema = Joi.string()
        .required()
        .messages({
            "string.empty": "ChallanNo Cannot Be A Empty",
            "any.required": "Required Field : ChallanNo"
        });
    const { error } = challannoSchema.validate(challanno);

    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.date = function (req, res, next) {
    const { date } = req.body;

    const dateSchema = Joi.string()
        .required()
        .messages({
            "string.empty": "Date Cannot Be A Empty",
            "any.required": "Required Filed : Date"
        });
    const { error } = dateSchema.validate(date);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.customer = function (req, res, next) {
    const { customer } = req.body;

    const customerSchema = Joi.string()
        .required()
        .messages({
            "string.empty": "Customer Cannot Be A Empty",
            "any.required": "Required Filed : Customer"
        });
    const { error } = customerSchema.validate(customer);
    if (error) {
        return res.status(400).json({ status: 'False', message: error.message });
    }
    next();
}
exports.serialno = function (req, res, next) {
    const { items } = req.body;
    // console.log("itmes",items);
    for (const item of items) {
        const { serialno } = item;

        const serialnoSchema = Joi.string()
            .required()
            .messages({
                "string.empty": "SerialNo Cannot Be Empty",
                "any.required": "Required Field: Serial Number"
            });
        const { error } = serialnoSchema.validate(serialno);

        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.mrp = function (req, res, next) {
    const { items } = req.body;
    // console.log("items",items);
    for (const item of items) {
        const { mrp } = item;
        const mrpSchema = Joi.number()

            .required()
            .messages({
                "number.empty": "MRP Cannot Be A Empty",
                "any.required": "Required Filed : MRP"
            });

        const { error } = mrpSchema.validate(mrp);
        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.qty = function (req, res, next) {
    const { items } = req.body;
    for (const item of items) {
        const { qty } = item;
        // console.log("item",item);
        const qtySchema = Joi.number()

            .required()
            .messages({
                "any.required": "Required Filed : QTY",
                "number.empty": "QTY Cannot Be A Empty"
            });
        const { error } = qtySchema.validate(qty);
        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.product = function (req, res, next) {
    const { items } = req.body;

    for (const item of items) {
        const { product } = item;
        const productSchema = Joi.string()

            .required()
            .messages({
                "any.required": "Required Filed : Product",
                "string.empty": "Product Cannot Be A Empty"
            });

        const { error } = productSchema.validate(product);

        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.description = function (req, res, next) {
    const { items } = req.body;
    for (const item of items) {
        const { description } = item;
        const descriptionSchema = Joi.string()

            .required()
            .messages({
                "any.required": "Required Filed : Description",
                "string.empty": "Description Cannot Be A Empty"
            });
        const { error } = descriptionSchema.validate(description);

        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.batchno = function (req, res, next) {
    const { items } = req.body;
    for (const item of items) {
        const { batchno } = item;
        const batchnoSchema = Joi.string()

            .required()
            .messages({
                "any.required": "Required Filed : Batchno",
                "string.empty": "Batchno Cannot Be A Empty"
            });
        const { error } = batchnoSchema.validate(batchno);

        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.quotationno = function (req, res, next) {
    const { items } = req.body;
    for (const item of items) {
        const { quotationno } = item;
        const quotationnoSchema = Joi.string()

            .required()
            .messages({
                "any.required": "Required Filed : Quotation Number",
                "string.empty": "Quotation Number Cannot Be A Empty"
            });
        const { error } = quotationnoSchema.validate(quotationno);

        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.expirydate = function (req, res, next) {
    const { items } = req.body;
    for (const item of items) {
        const { expirydate } = item;
        const expirydateSchema = Joi.string()

            .required()
            .messages({
                "any.required": "Required Filed : Expiry Date",
                "string.empty": "Expiry Date Cannot Be A Empty"
            });
        const { error } = expirydateSchema.validate(expirydate);

        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.vendor = function (req, res, next) {
    const { vendor } = req.body;
    // console.log(vendor);
    const vendorSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Filed : Vendor",
            "string.empty": "Vendor Cannot Be A Empty"
        });
    const { error } = vendorSchema.validate(vendor);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.voucherno = function (req, res, next) {
    const { voucherno } = req.body;
    const vouchernoSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Filed : Voucher No",
            "string.empty": "Voucher No Cannot Be A Empty"
        });
    const { error } = vouchernoSchema.validate(voucherno);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.gstin = function (req, res, next) {
    const { gstin } = req.body;
    const gstinSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Filed : GSTIN",
            "string.empty": "GSTIN Cannot Be A Empty"
        });
    const { error } = gstinSchema.validate(gstin);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.billno = function (req, res, next) {
    const { billno } = req.body;
    console.log("bill", billno);
    const billnoSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Field: Bill No.",
            "string.empty": "Bill No. Cannot Be Empty",
        });
    const { error } = billnoSchema.validate(billno);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.billdate = function (req, res, next) {
    const { billdate } = req.body;
    const billdateSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Filed : Bill Date",
            "string.empty": "Bill Date Cannot Be A Empty"
        });
    const { error } = billdateSchema.validate(billdate);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.payment = function (req, res, next) {
    const { payment } = req.body;
    const paymentSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Filed : Payment",
            "string.empty": "Payment Cannot Be A Empty"
        });
    const { error } = paymentSchema.validate(payment);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.expensse = function (req, res, next) {
    const { items } = req.body;

    for (const item of items) {
        const { expensse } = item;

        const expensseSchema = Joi.string()

            .required()
            .messages({
                "any.required": "Required Field: Expensse",
                "string.empty": "Expensse Cannot Be Empty"
            });
        const { error } = expensseSchema.validate(expensse);
        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.taxable = function (req, res, next) {
    const { items } = req.body;

    for (const item of items) {
        const { taxable } = item;

        const taxableSchema = Joi.string()
            .required()
            .messages({
                "any.required": "Required Field : TaxAble",
                "string.empty": "TaxAble Cannot Be A Empty"
            });
        const { error } = taxableSchema.validate(taxable);
        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.account = function (req, res, next) {
    const { account } = req.body;

    const accountSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Field : Account",
            "string.empty": "Account Cannot Be A Empty"
        });
    const { error } = accountSchema.validate(account);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.paymentdate = function (req, res, next) {
    const { paymentdate } = req.body;

    const paymentdateSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Field : Payment Date",
            "string.empty": "Payment Date Cannot Be A Empty"
        });
    const { error } = paymentdateSchema.validate(paymentdate)
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.mode = function (req, res, next) {
    const { mode } = req.body;
    const modeSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Filed : Mode",
            "string.empty": "Mode Cannot Be A Empty"
        });
    const { error } = modeSchema.validate(mode);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.refno = function (req, res, next) {
    const { refno } = req.body;
    const refnoSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Filed : Ref Number",
            "string.empty": "Ref Number Cannot Be A Empty"
        })
    const { error } = refnoSchema.validate(refno);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.amount = function (req, res, next) {
    const { amount } = req.body;
    const amountSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Field : Amount",
            "string.empty": "Amount Cannot Be A Empty"
        });
    const { error } = amountSchema.validate(amount);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.paidfrom = function (req, res, next) {
    const { paidfrom } = req.body;
    const paidfromSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : PaidFrom",
            "string.empty": "PaidFrom Cannot Be A Empty"
        });
    const { error } = paidfromSchema.validate(paidfrom);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.quotationref = function (req, res, next) {
    const { quotationref } = req.body;
    const quotationrefSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Quotation Ref",
            "string.empty": "Quotation Ref Cannot Be A Empty"
        });
    const { error } = quotationrefSchema.validate(quotationref);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.pono = function (req, res, next) {
    const { pono } = req.body;

    const ponoSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Field : Pono",
            "string.empty": "Pono Cannot Be A Empty"
        });
    const { error } = ponoSchema.validate(pono);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.quotation_no = function (req, res, next) {
    const { quotation_no } = req.body;
    const quotation_noSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Field : Quotation_No",
            "string.empty": "Quotation_No Cannot Be A Empty"
        });
    const { error } = quotation_noSchema.validate(quotation_no);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.rate = function (req, res, next) {
    const { items } = req.body;
    for (const item of items) {
        const { rate } = item;

        const rateSchema = Joi.number()
            .required()
            .messages({
                "any.required": "Required Field : Rate",
                "number.empty": "Rate Cannot Be A Empty"
            });
        const { error } = rateSchema.validate(rate);
        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.discount = function (req, res, next) {
    const { items } = req.body;
    for (const item of items) {
        const { discount } = item;
        const discountSchema = Joi.string()

            .required()
            .messages({
                "any.required": "Required Field : Discount",
                "string.empty": "Discount Cannot Be A Empty"
            });
        const { error } = discountSchema.validate(discount);
        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.validtill = function (req, res, next) {
    const { validtill } = req.body;
    const validtillSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Validtill",
            "string.empty": "validtill Cannot Be A Empty"
        });
    const { error } = validtillSchema.validate(validtill);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.challendate = function (req, res, next) {
    const { challendate } = req.body;
    const challendateSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Field : Challen Date",
            "string.empty": "Challen Date Cannot Be A Empty"
        });
    const { error } = challendateSchema.validate(challendate);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.creditnote = function (req, res, next) {
    const { creditnote } = req.body;
    const creditnoteSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Credit Note",
            "string.empty": "Credit Note Cannot Be A Empty"
        });
    const { error } = creditnoteSchema.validate(creditnote);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.creditdate = function (req, res, next) {
    const { creditdate } = req.body;
    const creditdateSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Credit Date",
            "string.empty": "Credit Date Cannot Be A Empty"
        });
    const { error } = creditdateSchema.validate(creditdate)
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.sr_no = function (req, res, next) {
    const { sr_no } = req.body;
    const sr_noSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Serial Number",
            "string.empty": "Serial Number Cannot Be A Empty"
        });
    const { error } = sr_noSchema.validate(sr_no);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.batch_no = function (req, res, next) {
    const { batch_no } = req.body;
    const batch_noSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Batch No",
            "string.empty": "Batch No Cannot Be A Empty"
        });
    const { error } = batch_noSchema.validate(batch_no);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.expiry_date = function (req, res, next) {
    const { expiry_date } = req.body;
    const expiry_dateSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Expiry Date",
            "string.empty": "Expiry_Date Cannot Be A Empty"
        });
    const { error } = expiry_dateSchema.validate(expiry_date);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.invoiceno = function (req, res, next) {
    const { invoiceno } = req.body;
    const invoicenoSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Invoice Number",
            "string.empty": "Invoice Number Cannot Be A Empty"
        });
    const { error } = invoicenoSchema.validate(invoiceno);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.invoicedate = function (req, res, next) {
    const { invoicedate } = req.body;
    const invoicedateSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Invoice Date",
            "string.empty": "Invoice Date Cannot Be A Empty"
        });
    const { error } = invoicedateSchema.validate(invoicedate);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.quantity = function (req, res, next) {
    const { quantity } = req.body;
    const quantitySchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Quantity",
            "string.empty": "Quantity Cannot Be A Empty"
        });
    const { error } = quantitySchema.validate(quantity);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.itemname = function (req, res, next) {
    const { itemname } = req.body;
    const itemnameSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Item Name",
            "string.empty": "Item Name Cannot Be A Empty"
        });
    const { error } = itemnameSchema.validate(itemname);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.unit = function (req, res, next) {
    const { unit } = req.body;
    const unitSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Unit",
            "string.empty": "Unit Cannot Be A Empty"
        });
    const { error } = unitSchema.validate(unit);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.accountname = function (req, res, next) {
    const { accountname } = req.body;
    const accountnameSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Account Name",
            "string.empty": "Account Name Cannot Be A Empty"
        });
    const { error } = accountnameSchema.validate(accountname);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.shortname = function (req, res, next) {
    const { shortname } = req.body;
    const shortnameSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Short Name",
            "string.empty": "Short Name Cannot Be A Empty"
        });
    const { error } = shortnameSchema.validate(shortname);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.contactpersonname = function (req, res, next) {
    const { contactpersonname } = req.body;
    const contactpersonnameSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Contact Person Name",
            "string.empty": "ContactPerson Name Cannot Be A Empty"
        });
    const { error } = contactpersonnameSchema.validate(contactpersonname);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.panno = function (req, res, next) {
    const { panno } = req.body;
    const pannoSchema = Joi.number()

        .required()
        .messages({
            "any.required": "Required Field : Pan No",
            "number.empty": "Pan No Cannot Be A Empty"
        });
    const { error } = pannoSchema.validate(panno);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.creditperiod = function (req, res, next) {
    const { creditperiod } = req.body;
    const creditperiodSchema = Joi.number()

        .required()
        .messages({
            "any.required": "Required Field : creditperiod",
            "number.empty": "creditperiod Cannot Be A Empty"
        });
    const { error } = creditperiodSchema.validate(creditperiod);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.address1 = function (req, res, next) {
    const { address1 } = req.body;
    const address1Schema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : address1",
            "string.empty": "address1 Cannot Be A Empty"
        });
    const { error } = address1Schema.validate(address1);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.pincode = function (req, res, next) {
    const { pincode } = req.body;
    const pincodeSchema = Joi.number()

        .required()
        .messages({
            "any.required": "Required Field : PinCode",
            "number.empty": "PanCode Cannot Be A Empty"
        });
    const { error } = pincodeSchema.validate(pincode);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.state = function (req, res, next) {
    const { state } = req.body;
    const stateSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : state",
            "string.empty": "state Cannot Be A Empty"
        });
    const { error } = stateSchema.validate(state);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.city = function (req, res, next) {
    const { city } = req.body;
    const citySchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : City",
            "string.empty": "City Cannot Be A Empty"
        });
    const { error } = citySchema.validate(city);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.bankdetail = function (req, res, next) {
    const { bankdetail } = req.body;
    const bankdetailSchema = Joi.boolean()

        .required()
        .messages({
            "any.required": "Required Field : Bank Detail",
            "boolean.empty": "Bank Detail Cannot Be A Empty"
        });
    const { error } = bankdetailSchema.validate(bankdetail);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.creditlimit = function (req, res, next) {
    const { creditlimit } = req.body;
    const creditlimitSchema = Joi.boolean()

        .required()
        .messages({
            "any.required": "Required Feild : Credit Limit",
            "boolean.empty": "Credit Limit Cannot Be A Empty"
        });
    const { error } = creditlimitSchema.validate(creditlimit);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.balance = function (req, res, next) {
    const { balance } = req.body;
    const balanceSchema = Joi.number()

        .required()
        .messages({
            "any.required": "Required Field : Balance",
            "number.empty": "Balance Cannot Be A Empty"
        });
    const { error } = balanceSchema.validate(balance);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.label = function (req, res, next) {
    const { items } = req.body;
    // console.log("itmes",items);
    for (const item of items) {
        const { label } = item;

        const labelSchema = Joi.string()
            .required()
            .messages({
                "string.empty": "label Cannot Be Empty",
                "any.required": "Required Field: label"
            });
        const { error } = labelSchema.validate(label);

        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.value = function (req, res, next) {
    const { items } = req.body;
    // console.log("itmes",items);
    for (const item of items) {
        const { value } = item;

        const valueSchema = Joi.string()
            .required()
            .messages({
                "string.empty": "value Cannot Be Empty",
                "any.required": "Required Field: value"
            });
        const { error } = valueSchema.validate(value);

        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.itemtype = function (req, res, next) {
    const { itemtype } = req.body;
    const itemtypeSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Itemtype",
            "string.empty": "Itemtype Cannot Be A Empty"
        });
    const { error } = itemtypeSchema.validate(itemtype);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.productname = function (req, res, next) {
    const { productname } = req.body;
    const productnameSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Product Name",
            "string.empty": "Product Name Cannot Be A Empty"
        });
    const { error } = productnameSchema.validate(productname);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.itemgroup = function (req, res, next) {
    const { itemgroup } = req.body;
    const itemgroupSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : itemGroup",
            "string.empty": "itemGroup Cannot Be A Empty"
        });
    const { error } = itemgroupSchema.validate(itemgroup);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.itemcategory = function (req, res, next) {
    const { itemcategory } = req.body;
    const itemcategorySchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : itemCategory",
            "string.empty": "itemCategory Cannot Be A Empty"
        });
    const { error } = itemcategorySchema.validate(itemcategory);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.openingstock = function (req, res, next) {
    const { openingstock } = req.body;
    const openingstockSchema = Joi.boolean()

        .required()
        .messages({
            "any.required": "Required Field : Opening Stock",
            "boolean.empty": "Opening Stock Cannot Be A Empty"
        });
    const { error } = openingstockSchema.validate(openingstock);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.nagativeqty = function (req, res, next) {
    const { nagativeqty } = req.body;
    const nagativeqtySchema = Joi.boolean()

        .required()
        .messages({
            "any.required": "Required Field : Nagative Qty",
            "boolean.empty": "Nagative Qty Cannot Be A Empty"
        });
    const { error } = nagativeqtySchema.validate(nagativeqty);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.lowstock = function (req, res, next) {
    const { lowstock } = req.body;
    const lowstockSchema = Joi.boolean()

        .required()
        .messages({
            "any.required": "Required Field : lowStock",
            "boolean.empty": "lowStock Cannot Be A Empty"
        });
    const { error } = lowstockSchema.validate(lowstock);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.itemselected = function (req, res, next) {
    const { itemselected } = req.body;
    const itemselectedSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Item Selected",
            "string.empty": "Item Selected Cannot Be A Empty"
        });
    const { error } = itemselectedSchema.validate(itemselected);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.purchaseprice = function (req, res, next) {
    const { purchaseprice } = req.body;
    const purchasepriceSchema = Joi.number()

        .required()
        .messages({
            "any.required": "Required Field :purchaseprice",
            "number.empty": "purchaseprice Cannot Be A Empty"
        });
    const { error } = purchasepriceSchema.validate(purchaseprice);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.salesprice = function (req, res, next) {
    const { salesprice } = req.body;
    const salespriceSchema = Joi.number()

        .required()
        .messages({
            "any.required": "Required Field : salesprice",
            "number.empty": "salesprice Cannot Be A Empty"
        });
    const { error } = salespriceSchema.validate(salesprice);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.gstrate = function (req, res, next) {
    const { gstrate } = req.body;
    const gstrateSchema = Joi.number()

        .required()
        .messages({
            "any.required": "Required Field : Gstrate",
            "number.empty": "gstrate Cannot Be A Empty"
        });
    const { error } = gstrateSchema.validate(gstrate);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.cess = function (req, res, next) {
    const { cess } = req.body;
    const cessSchema = Joi.boolean()

        .required()
        .messages({
            "any.required": "Required Field : Cess",
            "boolean.empty": "Cess Cannot Be A Empty"
        });
    const { error } = cessSchema.validate(cess);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.group = function (req, res, next) {
    const { group } = req.body;
    const groupSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Group",
            "string.empty": "Group Cannot Be A Empty"
        });
    const { error } = groupSchema.validate(group);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.remarks = function (req, res, next) {
    const { remarks } = req.body;
    const remarksSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Remarks",
            "string.empty": "Remarks Cannot Be A Empty"
        });
    const { error } = remarksSchema.validate(remarks);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.category = function (req, res, next) {
    const { category } = req.body;
    const categorySchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Category",
            "string.empty": "Category Cannot Be A Empty"
        });
    const { error } = categorySchema.validate(category);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.unitname = function (req, res, next) {
    const { unitname } = req.body;
    const unitnameSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Unitname",
            "string.empty": "Unitname Cannot Be A Empty"
        });
    const { error } = unitnameSchema.validate(unitname);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.terms = function (req, res, next) {
    const { terms } = req.body;
    const termsSchema = Joi.number()

        .required()
        .messages({
            "any.required": "Required Field : terms",
            "number.empty": "terms Cannot Be A Empty"
        });
    const { error } = termsSchema.validate(terms);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.duedate = function (req, res, next) {
    const { duedate } = req.body;
    const duedateSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : duedate",
            "string.empty": "duedate Cannot Be A Empty"
        });
    const { error } = duedateSchema.validate(duedate);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.book = function (req, res, next) {
    const { book } = req.body;
    const bookSchema = Joi.string()

        .required()
        .messages({
            "any.required": "Required Field : Book",
            "string.empty": "Book Cannot Be A Empty"
        });
    const { error } = bookSchema.validate(book);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.debitnote = function (req, res, next) {
    const { debitnote } = req.body;
    const debitnoteSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Field : Debit Note",
            "string.empty": "Debit Note Cannot Be A Empty"
        });
    const { error } = debitnoteSchema.validate(debitnote);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.debitdate = function (req, res, next) {
    const { debitdate } = req.body;
    const debitdateSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Field : Debit Date",
            "string.empty": "Debit Date Cannot Be A Empty"
        });
    const { error } = debitdateSchema.validate(debitdate);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.billaddress = function (req, res, next) {
    const { billaddress } = req.body;
    const billaddressSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Field : Bill Address",
            "string.empty": "Bill Address Cannot Be A Empty"
        });
    const { error } = billaddressSchema.validate(billaddress);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.shipaddress = function (req, res, next) {
    const { shipaddress } = req.body;
    const shipaddressSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Field : ShipAddress",
            "string.empty": "ShipAddress Cannot Be A Empty"
        });
    const { error } = shipaddressSchema.validate(shipaddress);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.refdate = function (req, res, next) {
    const { refdate } = req.body;
    const refdateSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Field : RefDate",
            "string.empty": "RefDate Cannot Be A Empty"
        });
    const { error } = refdateSchema.validate(refdate);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.reason = function (req, res, next) {
    const { reason } = req.body;
    const reasonSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Field : Reason",
            "string.empty": "Reason Cannot Be A Empty"
        });
    const { error } = reasonSchema.validate(reason);
    if (error) {
        return res.status(400).json({ status: "False", message: error.message });
    }
    next();
}
exports.price = function (req, res, next) {
    const { items } = req.body;
    for (const item of items) {
        const {price} = item;
        const priceSchema = Joi.number()
        .required()
        .messages({
            "any.required": "Required Field : Price",
            "number.empty": "Price Cannot Be A Empty"
        });
        const { error } = priceSchema.validate(price);
        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.bill_no = function (req, res, next) {
    const { items } = req.body;

    for (const item of items) {
        const { bill_no } = item;

        const bill_noSchema = Joi.string()

            .required()
            .messages({
                "any.required": "Required Field: bill_no",
                "string.empty": "bill_no Cannot Be Empty"
            });
        const { error } = bill_noSchema.validate(bill_no);
        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
exports.bill_date = function (req, res, next) {
    const { items } = req.body;

    for (const item of items) {
        const { bill_date } = item;

        const bill_dateSchema = Joi.string()

            .required()
            .messages({
                "any.required": "Required Field: Bill_date",
                "string.empty": "bill_date Cannot Be Empty"
            });
        const { error } = bill_dateSchema.validate(bill_date);
        if (error) {
            return res.status(400).json({ status: "False", message: error.message });
        }
    }
    next();
}
