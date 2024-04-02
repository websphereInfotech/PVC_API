const express = require("express");
// const { admin_login, create_quotation, create_quotationItem, admin_signup, get_all_quotation,
//     view_quotation, update_quotationItem, update_quotation, delete_quotationitem,
//     delete_quotation, create_salesInvoice, create_salesInvoiceItem,
//     get_all_salesInvoice, view_salesInvoice,} = require("../controller/admincontroller");
const { admin_login, create_quotation, create_quotationItem, admin_signup,
     get_all_quotation, view_quotation, update_quotationItem, update_quotation,
     delete_quotationitem, delete_quotation, create_salesInvoice, create_salesInvoiceItem,
     get_all_salesInvoice, view_salesInvoice, update_salesInvoiceItem, update_salesInvoice,
     delete_salesInvoiceItem, delete_salesInvoice, create_salesReturn, get_all_salesReturn,
     create_expense, create_expenseItem, get_all_expense, view_expense, update_expense,
     update_expenseItem, delete_expense, delete_expenseItem, create_deliverychallan, update_deliverychallan,
     delete_deliverychallan, get_all_deliverychallan, view_deliverychallan, create_deliverychallanitem,
     update_deliverychallanitem, delete_deliverychallanitem, create_purchase, create_purchaseitem,
     update_purchaseitem, update_purchase, delete_purchase, delete_purchaseitem, get_all_purchase,
     view_purchase, create_payment, update_payment, delete_payment, view_payment, get_all_payment,
     create_stockitem, get_all_stock, create_customer, update_customer, create_customfeild, delete_customfeild,
     update_customfeild, view_customer, get_all_customer, delete_customer, create_product, update_product,
     delete_product, get_all_product, view_product, create_itemgroup, update_itemgroup, view_itemgroup,
     create_itemcategory, update_itemcategory, view_itemcategory, create_unit,view_unit,update_unit } = require("../controller/admincontroller");
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const adminRoutes = express.Router();

// adminRoutes.post('/admin_signup', validation('usersignup'), admin_signup);
adminRoutes.post('/admin_login', validation('userLogin'), admin_login);

adminRoutes.post('/create_quotation', validation('create_quotation'), adminAuth, create_quotation);
adminRoutes.post('/create_quatationItem', validation('create_quotationitem'), adminAuth, create_quotationItem);
adminRoutes.get('/get_all_quotation', adminAuth, get_all_quotation);
adminRoutes.get('/view_quotation/:id', adminAuth, view_quotation);
adminRoutes.put('/update_quotationItem/:id', adminAuth, update_quotationItem);
adminRoutes.put('/update_quotation/:id', adminAuth, update_quotation);
adminRoutes.delete('/delete_quotationitem/:id', adminAuth, delete_quotationitem);
adminRoutes.delete('/delete_quotation/:id', adminAuth, delete_quotation);

adminRoutes.post('/create_deliverychallan', validation('create_deliverychallan'), adminAuth, create_deliverychallan);
adminRoutes.post('/create_deliverychallanitem', validation('create_deliverychallanitem'), adminAuth, create_deliverychallanitem);
adminRoutes.put('/update_deliverychallan/:id', adminAuth, update_deliverychallan);
adminRoutes.delete('/delete_deliverychallan/:id', adminAuth, delete_deliverychallan);
adminRoutes.delete('/delete_deliverychallanitem/:id', adminAuth, delete_deliverychallanitem);
adminRoutes.get('/get_all_deliverychallan', adminAuth, get_all_deliverychallan);
adminRoutes.get('/view_deliverychallan/:id', adminAuth, view_deliverychallan);
adminRoutes.put('/update_deliverychallanitem/:id', adminAuth, update_deliverychallanitem);

adminRoutes.post('/create_purchase', validation('create_purchase'), adminAuth, create_purchase);
adminRoutes.post('/create_purchaseitem', validation('create_purchaseitem'), adminAuth, create_purchaseitem);
adminRoutes.put('/update_purchaseitem/:id', adminAuth, update_purchaseitem);
adminRoutes.put('/update_purchase/:id', adminAuth, update_purchase);
adminRoutes.delete('/delete_purchase/:id', adminAuth, delete_purchase);
adminRoutes.delete('/delete_purchaseitem/:id', adminAuth, delete_purchaseitem);
adminRoutes.get('/get_all_purchase', adminAuth, get_all_purchase);
adminRoutes.get('/view_purchase/:id', adminAuth, view_purchase);

adminRoutes.post('/create_salesinvoice', validation('create_salesinvoice'), adminAuth, create_salesInvoice);
adminRoutes.post('/create_salesinvoice_item', adminAuth, create_salesInvoiceItem);
adminRoutes.get('/get_all_salesInvoice', adminAuth, get_all_salesInvoice);
adminRoutes.get('/view_salesInvoice/:id', adminAuth, view_salesInvoice);
adminRoutes.put('/update_salesInvoiceItem/:id', adminAuth, update_salesInvoiceItem);
adminRoutes.put('/update_salesInvoice/:id', adminAuth, update_salesInvoice);
adminRoutes.delete('/delete_salesInvoiceItem/:id', adminAuth, delete_salesInvoiceItem);
adminRoutes.delete('/delete_salesInvoice/:id', adminAuth, delete_salesInvoice);

adminRoutes.post('/create_salesReturn', validation('create_salesReturn'), adminAuth, create_salesReturn);
adminRoutes.get('/get_all_salesReturn', adminAuth, get_all_salesReturn);

adminRoutes.post('/create_expense', validation('create_expense'), adminAuth, create_expense);
adminRoutes.post('/create_expenseItem', adminAuth, validation('create_expenseItem'), create_expenseItem);
adminRoutes.get('/get_all_expense', adminAuth, get_all_expense);
adminRoutes.get('/view_expense/:id', adminAuth, view_expense);
adminRoutes.put('/update_expense/:id', adminAuth, update_expense);
adminRoutes.put('/update_expenseItem/:id', adminAuth, update_expenseItem);
adminRoutes.delete('/delete_expense/:id', adminAuth, delete_expense);
adminRoutes.delete('/delete_expenseItem/:id', adminAuth, delete_expenseItem);

adminRoutes.post('/create_payment', validation('create_payment'), adminAuth, create_payment);
adminRoutes.put('/update_payment/:id', adminAuth, update_payment);
adminRoutes.delete('/delete_payment/:id', adminAuth, delete_payment);
adminRoutes.get('/view_payment/:id', adminAuth, view_payment);
adminRoutes.get('/get_all_payment', adminAuth, get_all_payment);

adminRoutes.post('/create_stockitem', adminAuth,validation('create_stoke'), create_stockitem);
adminRoutes.get('/get_all_stock', adminAuth, get_all_stock);

adminRoutes.post('/create_customer', adminAuth, validation('create_customer'),create_customer);
adminRoutes.put('/update_customer/:id', adminAuth, update_customer);
adminRoutes.delete('/delete_customer/:id', adminAuth, delete_customer);
adminRoutes.post('/create_customfeild', adminAuth, validation('create_customfeild'),create_customfeild);
adminRoutes.put('/update_customfeild/:id', adminAuth, update_customfeild);
adminRoutes.delete('/delete_customfeild/:id', adminAuth, delete_customfeild);
adminRoutes.get('/view_customer/:id', adminAuth, view_customer);
adminRoutes.get('/get_all_customer', adminAuth, get_all_customer);

adminRoutes.post('/create_product', adminAuth,validation('create_product'),create_product);
adminRoutes.put('/update_product/:id', adminAuth, update_product);
adminRoutes.delete('/delete_product/:id', adminAuth, delete_product);
adminRoutes.get('/view_product/:id', adminAuth, view_product);
adminRoutes.get('/get_all_product', adminAuth, get_all_product);

adminRoutes.post('/create_itemgroup', adminAuth, validation('create_itemgroup') ,create_itemgroup);
adminRoutes.put('/update_itemgroup/:id', adminAuth, update_itemgroup);
adminRoutes.get('/view_itemgroup/:id', adminAuth, view_itemgroup);

adminRoutes.post('/create_itemcategory', adminAuth, validation('create_itemcategory') ,create_itemcategory);
adminRoutes.put('/update_itemcategory/:id', adminAuth, update_itemcategory);
adminRoutes.get('/view_itemcategory/:id', adminAuth, view_itemcategory);

adminRoutes.post('/create_unit', adminAuth, validation('create_unit') ,create_unit);
adminRoutes.put('/update_unit/:id', adminAuth, update_unit);
adminRoutes.get('/view_unit/:id', adminAuth, view_unit);

module.exports = adminRoutes;