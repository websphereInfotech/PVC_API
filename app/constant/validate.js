const {
  email,
  password,
  mobileno,
  challanno,
  date,
  mrp,
  qty,
  description,
  voucherno,
  billno,
  billdate,
  payment,
  expensse,
  taxable,
  account,
  paymentdate,
  refno,
  mode,
  amount,
  ProFormaInvoice_no,
  rate,
  validtill,
  creditdate,
  invoiceno,
  invoicedate,
  itemname,
  unit,
  accountname,
  contactpersonname,
  creditperiod,
  address1,
  pincode,
  state,
  city,
  bankdetail,
  creditlimit,
  balance,
  itemtype,
  productname,
  nagativeqty,
  lowstock,
  purchaseprice,
  salesprice,
  terms,
  duedate,
  debitdate,
  depositto,
  receiptdate,
  accountnumber,
  ifsccode,
  bankname,
  username,
  salary,
  role,
  gstnumber,
  HSNcode,
  companyname,
  proFormaNo,
  branch,
  debitnoteno,
  creditnoteNo,
  org_invoiceno,
  org_invoicedate,
  gstrate,
  purpose,
  referance,
  validateBankdetails,
  validateCredit,
  LoginPassword,
  purchaseinvoicedate,
  create_bom,
  update_productStock,
  weight,
  itemUnit, itemGroup, saleNo, purchaseNo, paymentNo, receiptNo, paymentType, supplyInvoiceNo, dutyTime
} = require("./validation");

module.exports.validation = function (method) {
  switch (method) {
    case "userLogin":
      return [mobileno, LoginPassword];
    case "check_user":
      return [email, mobileno];
    case "create_user":
      return [username, email, mobileno, password, salary, role, dutyTime];
    case "update_user":
      return [email, mobileno, salary, role, dutyTime];
    case "create_deliverychallan":
      return [challanno, date, qty, itemUnit];
    case "update_deliverychallan":
      return [challanno, date, qty, itemUnit];
    case "create_ProFormaInvoice":
      return [ProFormaInvoice_no, terms, date, validtill, qty, itemUnit, rate];
    case "update_ProFormaInvoice":
      return [ProFormaInvoice_no, terms, date, validtill, qty, itemUnit, rate];
    case "create_salesinvoice":
      return [invoiceno, terms, invoicedate, rate, qty, proFormaNo, itemUnit];
    case "update_salesinvoice":
      return [invoiceno, terms, invoicedate, rate, qty, proFormaNo, itemUnit];
    case "create_debitNote":
      return [debitnoteno, purchaseinvoicedate, debitdate, qty, mrp, rate, itemUnit];
    case "update_debitNote":
      return [debitnoteno, purchaseinvoicedate, debitdate, qty, mrp, rate, itemUnit];
    case "create_creditNote":
      return [ creditnoteNo, creditdate, org_invoiceno, org_invoicedate, rate, qty, itemUnit ];
    case "update_creditNote":
      return [ creditnoteNo, creditdate, org_invoiceno, org_invoicedate, rate, qty, itemUnit ];
    case "create_customer":
      return [ accountname, email, mobileno, contactpersonname, creditperiod, address1, pincode, state,
               city, bankdetail, creditlimit, balance, gstnumber,validateBankdetails,validateCredit ];
    case "update_customer":
      return [ accountname, email, mobileno, contactpersonname, creditperiod, address1, pincode, state,
               city, bankdetail, creditlimit, balance, gstnumber,validateBankdetails,validateCredit ];
    case "create_item":
      return [ itemtype, productname, itemGroup, unit, nagativeqty, gstrate, lowstock, salesprice, HSNcode,purchaseprice ];
    case "update_item":
      return [ itemtype, productname, itemGroup, unit, nagativeqty, gstrate, lowstock, salesprice, HSNcode,purchaseprice ];
    case "create_purchaseInvoice":
      return [duedate, voucherno, supplyInvoiceNo, invoicedate, qty,itemUnit, rate];
    case "update_purchaseInvoice":
      return [duedate, voucherno, supplyInvoiceNo, invoicedate, qty, itemUnit, rate];
    case "create_company":
      return [ companyname, gstnumber, email, mobileno, address1, pincode, state, city ];
    case "update_company":
      return [ companyname, gstnumber, email, mobileno, address1, pincode, state, city ];
    case "create_vendor":
      return [ accountname, email, contactpersonname, mobileno, creditperiod, address1, pincode, state,
               city, bankdetail, creditlimit, balance, gstnumber,validateBankdetails,validateCredit ];
    case "update_vendor":
      return [ accountname, email, contactpersonname, mobileno, creditperiod, address1, pincode, state,
               city, bankdetail, creditlimit, balance, gstnumber,validateBankdetails,validateCredit ];
    case "C_create_salesinvoice":
      return [date, saleNo, qty,itemUnit, rate];
    case "C_update_salesinvoice":
      return [date, saleNo,qty,itemUnit, rate];
    case "C_create_purchase_Cash":
      return [date, purchaseNo, qty, itemUnit, rate];
    case "C_update_purchase_Cash":
      return [date, purchaseNo, qty, itemUnit, rate];
    case "create_receiveCash":
      return [date, receiptNo, amount];
    case "update_receiveCash":
      return [date, receiptNo, amount];
    case "create_paymentCash":
      return [date, paymentNo, amount];
    case "update_paymentCash":
      return [date, paymentNo, amount];
    case "create_claim":
      return [amount, purpose];
    case "update_claim":
      return [amount, purpose];
    case "create_company_bankDetails":
      return [bankname, accountnumber, ifsccode, branch];
    case "update_company_bankDetails":
      return [bankname, accountnumber, ifsccode, branch];
    case "create_receive_bank":
      return [voucherno, paymentdate, paymentType, mode, amount];
    case "update_receive_bank":
      return [voucherno, paymentdate, paymentType, mode, amount];
    case "create_payment_bank":
      return [voucherno, paymentdate, paymentType, mode, amount];
    case "update_payment_bank":
      return [voucherno, paymentdate, mode, paymentType, amount];
    case "create_expense":
      return [ mobileno, voucherno, date, mobileno, email, billno, billdate, payment, expensse, description,
               taxable, mrp ];
    case "create_stoke":
        return [itemname, unit, email];
    case "create_receipt":
        return [voucherno, account, email, mode, refno, depositto, receiptdate];
    case "create_bom":
      return [create_bom];
    case "update_bom":
      return [create_bom];
    case "update_stock":
      return [update_productStock];
    case "create_raw_material":
      return [ itemtype, productname, unit, nagativeqty, gstrate, lowstock, salesprice, HSNcode,purchaseprice, weight ];
    case "update_raw_material":
      return [ itemtype, productname, unit, nagativeqty, gstrate, lowstock, salesprice, HSNcode,purchaseprice, weight ];
    case "add_user_bank_account":
      return [accountname, bankname, accountnumber, ifsccode, branch];
    default:
      throw new Error("Invalid validation method");
  }
};
