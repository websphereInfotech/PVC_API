const express = require("express");
const {  admin_login, create_quotation, create_quotationItem, admin_signup, get_all_quotation, view_quotation, update_quotationItem, update_quotation, delete_quotationitem, delete_quotation, create_salesInvoice, create_salesInvoiceItem, get_all_salesInvoice, view_salesInvoice, update_salesInvoiceItem, update_salesInvoice, delete_salesInvoiceItem, delete_salesInvoice, create_salesReturn, get_all_salesReturn, create_expense, create_expenseItem, get_all_expense, view_expense, update_expense, update_expenseItem, delete_expense, delete_expenseItem} = require("../controller/admincontroller");
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const adminRoutes = express.Router();

// adminRoutes.post('/admin_signup',validation('usersignup'),admin_signup);
adminRoutes.post('/admin_login',validation('userLogin'),admin_login);

adminRoutes.post('/create_quotation',adminAuth,create_quotation);
adminRoutes.post('/create_quatationItem',adminAuth,create_quotationItem);
adminRoutes.get('/get_all_quotation',adminAuth,get_all_quotation);
adminRoutes.get('/view_quotation/:id',adminAuth,view_quotation);
adminRoutes.put('/update_quotationItem/:id',adminAuth,update_quotationItem);
adminRoutes.put('/update_quotation/:id',adminAuth,update_quotation);
adminRoutes.delete('/delete_quotationitem/:id',adminAuth,delete_quotationitem);
adminRoutes.delete('/delete_quotation/:id',adminAuth,delete_quotation);

adminRoutes.post('/create_salesinvoice',adminAuth,create_salesInvoice);
adminRoutes.post('/create_salesinvoice_item',adminAuth,create_salesInvoiceItem);
adminRoutes.get('/get_all_salesInvoice',adminAuth,get_all_salesInvoice);
adminRoutes.get('/view_salesInvoice/:id',adminAuth,view_salesInvoice);
adminRoutes.put('/update_salesInvoiceItem/:id',adminAuth,update_salesInvoiceItem);
adminRoutes.put('/update_salesInvoice/:id',adminAuth,update_salesInvoice);
adminRoutes.delete('/delete_salesInvoiceItem/:id',adminAuth,delete_salesInvoiceItem);
adminRoutes.delete('/delete_salesInvoice/:id',adminAuth,delete_salesInvoice);

adminRoutes.post('/create_salesReturn',adminAuth,create_salesReturn);
adminRoutes.get('/get_all_salesReturn',adminAuth,get_all_salesReturn);

adminRoutes.post('/create_expense',adminAuth,create_expense);
adminRoutes.post('/create_expenseItem',adminAuth,create_expenseItem);
adminRoutes.get('/get_all_expense',adminAuth,get_all_expense);
adminRoutes.get('/view_expense/:id',adminAuth,view_expense);
adminRoutes.put('/update_expense/:id',adminAuth,update_expense);
adminRoutes.put('/update_expenseItem/:id',adminAuth,update_expenseItem);
adminRoutes.delete('/delete_expense/:id',adminAuth,delete_expense);
adminRoutes.delete('/delete_expenseItem/:id',adminAuth,delete_expenseItem);

module.exports = adminRoutes;