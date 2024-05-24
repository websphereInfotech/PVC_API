const { email, password, mobileno, challanno, date, customerId,  mrp, qty, productId, description, batchno, quotationno, expirydate, vendor, voucherno, gstin, billno, billdate, payment, expensse, taxable, account, paymentdate, refno, quotationref, pono, mode, paidfrom, amount, ProFormaInvoice_no, rate, discount, validtill, creditnote, creditdate, invoiceno, invoicedate, itemname, unit, accountname, shortname, contactpersonname, panno, creditperiod, address1, pincode, state, city, bankdetail, creditlimit, balance, itemtype, productname, nagativeqty, lowstock, purchaseprice, salesprice, group, remarks, category, unitname, terms, duedate, book, debitnote, debitdate, refdate, price, bill_no, bill_date, depositto,  receiptdate, accountnumber, ifsccode, bankname, country, username, salary, role, gstnumber, HSNcode, companyname, proFormaId, branch, debitnoteno, creditnoteNo, org_invoiceno, org_invoicedate, gstrate
} = require("./validation")

module.exports.validation = function (method) {
    switch (method) {
        case "userLogin":
            return [mobileno, password]
        case "create_user":
            return [username, email, mobileno, password, salary, role]
        case "update_user":
            return [email, mobileno]
        case "create_deliverychallan":
            return [challanno, date, customerId,qty, productId]
        case "create_expense":
            return [mobileno, customerId, voucherno, date, mobileno, email, billno, billdate, payment, expensse, description, taxable, mrp]
        case "create_payment":
            return [voucherno, account, email, paymentdate, mode, paidfrom, refno, billno, amount]
        case "create_purchase":
            return [ProFormaInvoice_no, date, email, mobileno, quotationref, pono, customerId]
        case "create_purchaseitem":
            return [ rate, qty, productId, discount, mrp]
        case "create_ProFormaInvoice":
            return [ProFormaInvoice_no, date, validtill, customerId, rate, qty, productId]
        case "create_salesinvoice":
            return [customerId, invoiceno, invoicedate, duedate, productId, rate, qty]
        case "create_debitNote":
            return [customerId, debitdate, debitnoteno, productId, qty,mrp,rate]
        case "create_creditNote":
            return [customerId,creditnoteNo,creditdate,org_invoiceno,org_invoicedate, productId,rate,qty]
        case "create_stoke":
            return [itemname, unit, email,]
        case "create_customer":
            return [accountname,email,mobileno, contactpersonname, creditperiod, address1, pincode, state, city, bankdetail, creditlimit, balance, gstnumber]
        case "update_customer":
            return [email, mobileno]
        case "create_product":
            return [itemtype, productname, unit, nagativeqty,gstrate, lowstock, salesprice, HSNcode]
        case "create_itemgroup":
            return [group, remarks]
        case "create_itemcategory":
            return [category, remarks]
        case "create_unit":
            return [shortname, unitname]
        case "create_purchaseInvoice":
            return [date,invoiceno, invoicedate,terms, duedate,productId, qty, rate]
        case "create_receipt":
            return [voucherno, account, email, mode, refno, depositto, receiptdate]
        case "create_company":
            return [companyname, gstnumber, email, mobileno, address1, pincode, state, city, accountname, bankname, accountnumber, ifsccode, branch]
        case "create_vendor":
            return [accountname, email, contactpersonname, mobileno, creditperiod, address1, pincode, state, city, bankdetail, creditlimit, balance, gstnumber]
        case "update_vendor": 
            return [email,mobileno]
        case "C_create_salesinvoice": 
            return [date,qty,rate]
        case "C_create_purchase_Cash":
            return [date,qty,rate]
        case "create_receiveCash" : 
            return [date,amount]
        case "create_paymentCash" :
            return [date,amount]
        case "create_claim":
            return [amount]
        default:
            throw new Error('Invalid validation method')
    }
}