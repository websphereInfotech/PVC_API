const { email, password, mobileno, challanno, date, customer, serialno, mrp, qty, product, description, batchno, quotationno, expirydate, vendor, voucherno, gstin, billno, billdate, payment, expensse, taxable, account, paymentdate, refno, quotationref, pono, mode, paidfrom, amount, ProFormaInvoice_no, rate, discount, validtill, challendate, creditnote, creditdate, sr_no, batch_no, expiry_date, invoiceno, invoicedate, quantity, itemname, unit, accountname, shortname, contactpersonname, panno, creditperiod, address1, pincode, state, city, bankdetail, creditlimit, balance, label, value, itemtype, productname, itemgroup, itemcategory, openingstock, nagativeqty, lowstock, itemselected, purchaseprice, salesprice, gstrate, cess, group, remarks, category, unitname, terms, duedate, book, debitnote, debitdate, billaddress, shipaddress, refdate, reason, price, bill_no, bill_date, Cess, depositto, amountrecive, receiptdate, holdername, accountnumber, ifsccode, bankname, openingbalance, country, seriesname, username, salary, role, gstnumber, HSNcode
} = require("./validation")

module.exports.validation = function (method) {
    switch (method) {
        case "usersignup":
            return [email, password]
        case "userLogin":
            return [mobileno, password]
        case "create_deliverychallan":
            return [challanno, date, customer, mobileno, email]
        case "create_deliverychallanitem":
            return [ mrp, qty, product, description, batchno, quotationno, expirydate]
        case "create_expense":
            return [mobileno, customer, voucherno, date, gstin, mobileno, email, billno, billdate, payment,serialno, expensse, description, taxable, mrp]
        case "create_payment":
            return [voucherno, account, email, paymentdate, mode, paidfrom, refno, billno, amount]
        case "create_purchase":
            return [ProFormaInvoice_no, date, email, mobileno, quotationref, pono, customer]
        case "create_purchaseitem":
            return [serialno, rate, qty, product, discount, mrp]
        case "create_ProFormaInvoice":
            return [ProFormaInvoice_no, date, validtill,  customer,rate, qty, product]
        case "create_salesinvoice":
            return [email, mobileno, customer, book, invoiceno, invoicedate, duedate, ProFormaInvoice_no,  product, rate,  qty]
        case "create_salesReturn":
            return [customer, creditnote, creditdate, sr_no, batch_no, expiry_date, amount, invoiceno, invoicedate, quantity]
        case "create_stoke":
            return [itemname, unit, email,]
        case "create_customer":
            return [accountname,  contactpersonname, creditperiod,  address1, pincode, state, city, bankdetail, creditlimit, balance, country, gstnumber]
        // case "create_customfeild":
        //     return [label, value]
        case "create_product":
            return [itemtype, productname, unit, nagativeqty, lowstock, purchaseprice, salesprice, HSNcode]
        case "create_itemgroup":
            return [group, remarks]
        case "create_itemcategory":
            return [category, remarks]
        case "create_unit":
            return [shortname, unitname]
        case "create_purchasebill":
            return [vendor, mobileno, email, billno, billdate, terms, duedate, book, pono]
        case "create_purchasebill_item":
            return [product, qty, rate, mrp]
        case "create_purchaseReturn":
            return [vendor, debitnote, debitdate, refno, refdate]
        case "create_purchaseReturn_item":
            return [serialno, product, batchno, expirydate, mrp, bill_no, bill_date, qty, rate, taxable, price]
        case "create_receipt":
            return [voucherno, account, email, mode, refno, depositto, amountrecive, receiptdate]
        // case "create_bankaccount":
        //     return [accountname, shortname, email, mobileno, holdername, accountnumber, ifsccode, bankname, openingbalance]
        case "create_user" :
            return [username,email,mobileno,password,salary,role]
        case "create_vendor" :
            return [accountname, shortname, email, contactpersonname, mobileno, panno, creditperiod, mode, address1, pincode, state, city, bankdetail, creditlimit, balance, country, gstnumber]
        default:
            throw new Error('Invalid validation method')
    }
}