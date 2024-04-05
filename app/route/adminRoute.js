
const loginRoute = require('./loginRoute');
const quotationRoute = require('./quotationRoute');
const salesreturnRoute = require('./salesreturnRoute');
const expenseRoute = require('./expenseRoute');
const salesinvoiceRoute = require('./salesinvoiceRoute');
const deliverychallanRoute = require('./DeliveryChallanRoute');
const purchaseRoute = require('./purchaseOrderRoute');
const paymentRoute = require('./paymentRoute');
const stockRoute = require('./stockRoute');
const customerRoute = require('./customer');
const productRoute = require('./product');
const itemgroupRoute = require('./itemgroup'); 
const itemcategoryRoute = require('./itemcategory');
const unitRoute = require('./unit');
const purchaseBill = require('./purchasebill');


// adminRoutes.post('/create_purchaseReturn', adminAuth, validation('create_purchaseReturn'), create_purchaseReturn);
// adminRoutes.post('/create_purchaseReturn_item', adminAuth, validation('create_purchaseReturn_item'), create_purchaseReturn_item);
// adminRoutes.put('/update_purchaseReturn/:id', adminAuth, update_purchaseReturn);
// adminRoutes.put('/update_purchaseReturn_item/:id', adminAuth, update_purchaseReturn_item);
// adminRoutes.delete('/delete_purchasereturn/:id', adminAuth, delete_purchasereturn);
// adminRoutes.delete('/delete_purchaseReturn_item/:id', adminAuth, delete_purchaseReturn_item);
// adminRoutes.get('/get_all_purchaseReturn', adminAuth, get_all_purchaseReturn);
// adminRoutes.get('/view_purchaseReturn/:id', adminAuth, view_purchaseReturn);

// adminRoutes.post('/create_receipt', adminAuth, validation('create_receipt'), create_receipt);
// adminRoutes.put('/update_receipt/:id', adminAuth, update_receipt);
// adminRoutes.get('/get_all_receipt', adminAuth, get_all_receipt);
// adminRoutes.get('/view_receipt/:id', adminAuth, view_receipt);
// adminRoutes.delete('/delete_receipt/:id', adminAuth, delete_receipt);

// module.exports = adminRoutes;

module.exports = {
     loginRoute,
     quotationRoute,
     salesreturnRoute,
     expenseRoute,
     salesinvoiceRoute,
     deliverychallanRoute,
     purchaseRoute,
     paymentRoute,
     stockRoute,
     customerRoute,
     productRoute,
     itemgroupRoute,
     itemcategoryRoute,
     unitRoute,
     purchaseBill
}