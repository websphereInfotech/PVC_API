const { email, password,  mobileno, challanno, date, customer, serialno, mrp, qty, product, description, batchno, quotationno, expirydate, vendor, voucherno, gstin, billno, billdate, payment, expensse, taxable, account, paymentdate, refno, quotationref, pono
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
            return [ voucherno, account, email, paymentdate, refno,mrp,billno ]
        case "create_purchase" :
            return [ quotationno, date, email, mobileno, quotationref, pono, vendor ]
        default :
        throw new Error('Invalid validation method')
    }
}