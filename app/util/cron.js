const cron = require('node-cron');
const Stock = require('../models/stock');
const C_Stock = require('../models/C_stock');
const Product = require('../models/product');
const C_Product = require('../models/C_product');
const Notification = require('../models/notification');

exports.lowStockNotification = cron.schedule('0 0 * * *', async () => {
    const productStocks = await Stock.findAll({
        include: {model: Product, as: "productStock"}
    })
    // console.log(productStocks,"Product Stock");
    for(const product of productStocks){
        const stock = product.qty;
        const isLowStock = product.productStock.lowstock;
        const lowStockQty = product.productStock.lowStockQty;
        const productName = product.productStock.productname;
        const companyId = product.productStock.companyId
        if (isLowStock && stock <= lowStockQty) {
            console.log("Hello this is one of use................", product.id);
            await Notification.create({
                notification: `${productName} product is below the low stock threshold. Current stock: ${stock}`,
                companyId: companyId
            })
        }
    }


    // For Cash
    const productCashStocks = await C_Stock.findAll({
        include: {model: C_Product, as: "productCashStock"}
    })
    for(const product of productCashStocks){
        const stock = product.qty;
        const isLowStock = product.productCashStock.lowstock;
        const lowStockQty = product.productCashStock.lowStockQty;
        const productName = product.productCashStock.productname;
        const companyId = product.productCashStock.companyId
        if (isLowStock && stock <= lowStockQty) {
            console.log("Hello this is one of use................", product.id);
            await Notification.create({
                notification: `${productName} cash product is below the low stock threshold. Current stock: ${stock}`,
                type: "C",
                companyId: companyId
            })
        }
    }
});
