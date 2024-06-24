const {
  email,
  password,
  mobileno,
  challanno,
  date,
  customerId,
  mrp,
  qty,
  productId,
  description,
  batchno,
  quotationno,
  expirydate,
  vendor,
  voucherno,
  gstin,
  billno,
  billdate,
  payment,
  expensse,
  taxable,
  account,
  paymentdate,
  refno,
  quotationref,
  pono,
  mode,
  paidfrom,
  amount,
  ProFormaInvoice_no,
  rate,
  discount,
  validtill,
  creditnote,
  creditdate,
  invoiceno,
  invoicedate,
  itemname,
  unit,
  accountname,
  shortname,
  contactpersonname,
  panno,
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
  group,
  remarks,
  category,
  unitname,
  terms,
  duedate,
  book,
  debitnote,
  debitdate,
  refdate,
  price,
  bill_no,
  bill_date,
  depositto,
  receiptdate,
  accountnumber,
  ifsccode,
  bankname,
  country,
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
  itemUnit
} = require("./validation");

module.exports.validation = function (method) {
  switch (method) {
    case "userLogin":
      return [mobileno, LoginPassword];
    case "check_user":
      return [email, mobileno];
    case "create_user":
      return [username, email, mobileno, password, salary, role];
    case "update_user":
      return [email, mobileno, salary, role];
    case "create_deliverychallan":
      return [challanno, date, qty];
    case "update_deliverychallan":
      return [challanno, date, qty];
    case "create_ProFormaInvoice":
      return [ProFormaInvoice_no, terms, date, validtill, qty, itemUnit, rate];
    case "update_ProFormaInvoice":
      return [ProFormaInvoice_no, terms, date, validtill, qty, itemUnit, rate];
    case "create_salesinvoice":
      return [invoiceno, terms, invoicedate, rate, qty, proFormaNo];
    case "update_salesinvoice":
      return [invoiceno, terms, invoicedate, rate, qty, proFormaNo];
    case "create_debitNote":
      return [debitnoteno, purchaseinvoicedate, debitdate, qty, mrp, rate];
    case "update_debitNote":
      return [debitnoteno, purchaseinvoicedate, debitdate, qty, mrp, rate];
    case "create_creditNote":
      return [ creditnoteNo, creditdate, org_invoiceno, org_invoicedate, rate, qty ];
    case "update_creditNote":
      return [ creditnoteNo, creditdate, org_invoiceno, org_invoicedate, rate, qty ];
    case "create_customer":
      return [ accountname, email, mobileno, contactpersonname, creditperiod, address1, pincode, state,
               city, bankdetail, creditlimit, balance, gstnumber,validateBankdetails,validateCredit ];
    case "update_customer":
      return [ accountname, email, mobileno, contactpersonname, creditperiod, address1, pincode, state,
               city, bankdetail, creditlimit, balance, gstnumber,validateBankdetails,validateCredit ];
    case "create_product":
      return [ itemtype, productname, unit, nagativeqty, gstrate, lowstock, salesprice, HSNcode,purchaseprice, weight ];
    case "update_product":
      return [ itemtype, productname, unit, nagativeqty, gstrate, lowstock, salesprice, HSNcode,purchaseprice, weight ];
    case "create_purchaseInvoice":
      return [duedate, invoiceno, invoicedate, qty, rate];
    case "update_purchaseInvoice":
      return [duedate, invoiceno, invoicedate, qty, rate];
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
      return [date, qty, rate];
    case "C_update_salesinvoice":
      return [date, qty, rate];
    case "C_create_purchase_Cash":
      return [date, qty, rate];
    case "C_update_purchase_Cash":
      return [date, qty, rate];
    case "create_receiveCash":
      return [date, amount];
    case "update_receiveCash":
      return [date, amount];
    case "create_paymentCash":
      return [date, amount];
    case "update_paymentCash":
      return [date, amount];
    case "create_claim":
      return [amount, purpose];
    case "update_claim":
      return [amount, purpose];
    case "create_company_bankDetails":
      return [bankname, accountnumber, ifsccode, branch];
    case "update_company_bankDetails":
      return [bankname, accountnumber, ifsccode, branch];
    case "create_receive_bank":
      return [voucherno, paymentdate, mode, referance, amount];
    case "update_receive_bank":
      return [voucherno, paymentdate, mode, referance, amount];
    case "create_payment_bank":
      return [voucherno, paymentdate, mode, referance, amount];
    case "update_payment_bank":
      return [voucherno, paymentdate, mode, referance, amount];
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
    default:
      throw new Error("Invalid validation method");
  }
};
