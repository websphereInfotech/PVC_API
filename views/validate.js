const { email, password,  mobileno, challanno, date, customer, serialno, mrp, qty, product, description, batchno, quotationno, expirydate, vendor, voucherno, gstin, billno, billdate, payment, expensse, taxable, account, paymentdate, refno, quotationref, pono, mode, paidfrom, amount, quotation_no, rate, discount, validtill, challendate, creditnote, creditdate, sr_no, batch_no, expiry_date, invoiceno, invoicedate, quantity
 } = require("./validation")

module.exports.validation = function(method) {
    switch (method) {
        case "usersignup": 
            return [ email,password ]
        case "userLogin" :
            return [ email, password ]
        case "create_deliverychallan" :
            return [ challanno, date, customer, mobileno, email ]
        case "create_deliverychallanitem" :
            return [ serialno, mrp, qty, product, description, batchno, quotationno, expirydate ]
        case "create_expense" :
            return [ mobileno, vendor, voucherno, date, gstin, mobileno, email, billno, billdate, payment ]
        case "create_expenseItem" : 
            return [ serialno, expensse, description,taxable, mrp ]
        case "create_payment" : 
            return [ voucherno, account, email, paymentdate, mode, paidfrom, refno, billno, amount ]
        case "create_purchase" :
            return [ quotation_no, date, email, mobileno, quotationref, pono, vendor ]
        case "create_purchaseitem" :
            return [ serialno, rate, qty, product, discount, mrp ]
        case "create_quotation" :
            return [ quotation_no, date, validtill, email, mobileno, customer]
        case "create_quotationitem" :
            return [ rate, qty, product, mrp]
        case "create_salesinvoice" :
            return [ challanno, challendate, email, mobileno, customer ]
        case "create_salesinvoiceitem" :
            return [ serialno, quotationno, product, batchno, expirydate, mrp, qty]
        case "create_salesReturn" :
            return [ customer, creditnote, creditdate, sr_no, batch_no, expiry_date, amount, invoiceno, invoicedate, quantity]
        default :
        throw new Error('Invalid validation method')
    }
}