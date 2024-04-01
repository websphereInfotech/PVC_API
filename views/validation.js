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
    for (const item of items) {
        const { mrp } = item;
        const mrpSchema = Joi.string()

            .required()
            .messages({
                "string.empty": "MRP Cannot Be A Empty",
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
        const qtySchema = Joi.string()

            .required()
            .messages({
                "any.required": "Required Filed : QTY",
                "string.empty": "QTY Cannot Be A Empty"
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
    const billnoSchema = Joi.string()
        .required()
        .messages({
            "any.required": "Required Filed : Bill No.",
            "string.empty": "Bill No. Cannot Be A Empty"
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

    for(const item of items) {
        const { expensse } = item;
        
        const expensseSchema = Joi.string()
    
        .required()
        .messages({
            "any.required" : "Required Field: Expensse",
            "string.empty" : "Expensse Cannot Be Empty"
        });
        const { error } = expensseSchema.validate(expensse);
        if(error) {
            return res.status(400).json({ status:"False", message: error.message });
        }
    }
    next();
}
exports.taxable = function (req, res, next) {
    const { items } = req.body;

    for( const item of items) {
        const { taxable } = item;

    const taxableSchema = Joi.string()
    .required()
    .messages({
        "any.required" : "Required Field : TaxAble",
        "string.empty" : "TaxAble Cannot Be A Empty"
    });
    const { error } = taxableSchema.validate(taxable);
    if(error) {
        return res.status(400).json({ status:"False", message: error.message });
    }
    }
    next();
}
exports.account = function (req, res, next) {
    const { account } = req.body;

    const accountSchema = Joi.string()
    .required()
    .messages({
        "any.required" :"Required Field : Account",
        "string.empty" : "Account Cannot Be A Empty"
    });
    const { error } = accountSchema.validate(account);
    if(error) {
        return res.status(400).json({ status:"False", message : error.message });
    }
    next();
}
exports.paymentdate = function (req, res, next) {
    const { paymentdate } = req.body;

    const paymentdateSchema = Joi.string()
    .required
    .messages({
        "any.required" : "Required Field : Payment Date",
        "string.empty" : "Payment Date Cannot Be A Empty"
    });
    const { error } = paymentdateSchema.validate(paymentdate)
    if(error) {
        return res.status(400).json({ status:"False", message: error.message });
    }
    next();
}
exports.mode = function (req, res, next) {
    const { mode } = req.body;
    const modeSchema = Joi.string()

    .required()
    .messages({
        "any.required" : "Required Filed : Mode",
        "string.empty" : "Mode Cannot Be A Empty"
    });
    const { error } = modeSchema.validate(mode);
    if(error) {
        return res.status(400).json({ status:"False", message:error.message });
    }
    next();
}
exports.refno = function (req, res, next) {
    const { refno } = req.body;
    const refnoSchema = Joi.string()

    .required()
    .messages({
        "any.required" :"Required Filed : Ref Number",
        "string.empty" : "Ref Number Cannot Be A Empty"
    })
    const { error } = refnoSchema.validate(refno);
    if(error) {
        return res.status(400).json({ status:"False", message: error.message });
    }
    next();
}
exports.paidfrom = function (req, res, next) {
    const {paidfrom} = req.body;
    const paidfromSchema = Joi.string()

    .required()
    .messages({ 
        "any.required" : "Required Field : PaidFrom",
        "string.empty" : "PaidFrom Cannot Be A Empty"
    });
    const { error } = paidfromSchema.validate(paidfrom);
    if(error) {
        return res.status(400).json({ status:"False", message: error.message });
    }
    next();
}
exports.quotationref = function (req, res, next) {
    const { quotationref } = req.body;
    const quotationrefSchema = Joi.string()

    .required()
    .messages({
        "any.required" :"Required Field : Quotation Ref",
        "string.empty" : "Quotation Ref Cannot Be A Empty"
    });
    const { error } = quotationrefSchema.validate(quotationref);
    if(error) {
        return res.status(400).json({ status:"False", message: error.message });
    }
    next();
}
exports.pono = function (req, res, next) {
    const { pono } = req.body;

    const ponoSchema = Joi.string()
    .required()
    .messages({
        "any.required" :"Required Field : Pono",
        "string.empty" : "Pono Cannot Be A Empty"
    });
    const { error } = ponoSchema.validate(pono);
    if(error) {
        return res.status(400).json({ status:"False", message: error.message });
    }
    next();
}