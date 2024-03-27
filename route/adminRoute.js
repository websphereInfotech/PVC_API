const express = require("express");
const {  admin_login, create_quotation, create_quotationItem, admin_signup, get_all_quotation, view_quotation, update_quotationItem, update_quotation, delete_quotationitem, delete_quotation, create_salesInvoice, create_salesInvoiceItem, get_all_salesInvoice, view_salesInvoice} = require("../controller/admincontroller");
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

module.exports = adminRoutes;