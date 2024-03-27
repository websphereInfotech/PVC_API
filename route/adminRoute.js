const express = require("express");
const { admin_login, create_quotation, create_quotationItem, admin_signup, get_all_quotation,
    view_quotation, update_quotationItem, update_quotation, delete_quotationitem,
    delete_quotation, create_salesInvoice, create_salesInvoiceItem,
    get_all_salesInvoice, view_salesInvoice, create_deliverychallan, update_deliverychallan,
    delete_deliverychallan, get_all_deliverychallan, view_deliverychallan, create_deliverychallanitem,
    update_deliverychallanitem, delete_deliverychallanitem, create_purchase, create_purchaseitem,
    update_purchaseitem, update_purchase, delete_purchase, delete_purchaseitem, get_all_purchase,
    view_purchase } = require("../controller/admincontroller");
const { validation } = require('../views/validate');
const adminAuth = require('../middleware/adminAuth');
const adminRoutes = express.Router();

adminRoutes.post('/admin_signup', validation('usersignup'), admin_signup);
adminRoutes.post('/admin_login', validation('userLogin'), admin_login);

adminRoutes.post('/create_quotation', adminAuth, create_quotation);
adminRoutes.post('/create_quatationItem', adminAuth, create_quotationItem);
adminRoutes.get('/get_all_quotation', adminAuth, get_all_quotation);
adminRoutes.get('/view_quotation/:id', adminAuth, view_quotation);
adminRoutes.put('/update_quotationItem/:id', adminAuth, update_quotationItem);
adminRoutes.put('/update_quotation/:id', adminAuth, update_quotation);
adminRoutes.delete('/delete_quotationitem/:id', adminAuth, delete_quotationitem);
adminRoutes.delete('/delete_quotation/:id', adminAuth, delete_quotation);

adminRoutes.post('/create_salesinvoice', adminAuth, create_salesInvoice);
adminRoutes.post('/create_salesinvoice_item', adminAuth, create_salesInvoiceItem);
adminRoutes.get('/get_all_salesInvoice', adminAuth, get_all_salesInvoice);
adminRoutes.get('/view_salesInvoice/:id', adminAuth, view_salesInvoice);

adminRoutes.post('/create_deliverychallan', adminAuth, create_deliverychallan)
adminRoutes.post('/create_deliverychallanitem', adminAuth, create_deliverychallanitem)
adminRoutes.put('/update_deliverychallan/:id', adminAuth, update_deliverychallan)
adminRoutes.delete('/delete_deliverychallan/:id', adminAuth, delete_deliverychallan)
adminRoutes.delete('/delete_deliverychallanitem/:id', adminAuth, delete_deliverychallanitem)
adminRoutes.get('/get_all_deliverychallan', adminAuth, get_all_deliverychallan)
adminRoutes.get('/view_deliverychallan/:id', adminAuth, view_deliverychallan)
adminRoutes.put('/update_deliverychallanitem/:id', adminAuth, update_deliverychallanitem)

adminRoutes.post('/create_purchase', adminAuth, create_purchase)
adminRoutes.post('/create_purchaseitem', adminAuth, create_purchaseitem)
adminRoutes.put('/update_purchaseitem/:id', adminAuth, update_purchaseitem)
adminRoutes.put('/update_purchase/:id', adminAuth, update_purchase)
adminRoutes.delete('/delete_purchase/:id', adminAuth, delete_purchase)
adminRoutes.delete('/delete_purchaseitem/:id', adminAuth, delete_purchaseitem)
adminRoutes.get('/get_all_purchase', adminAuth, get_all_purchase)
adminRoutes.get('/view_purchase/:id', adminAuth, view_purchase)


module.exports = adminRoutes;