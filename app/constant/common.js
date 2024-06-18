const {CASHPRODUCTRATIO} = require("../constant/constant");
const Product = require("../models/product");
const Stock = require("../models/stock");

exports.splitQuantity = (qty)=>{
    const productRatio = 100 - CASHPRODUCTRATIO;
    const cashQty = Math.round((qty * CASHPRODUCTRATIO) /100);
    const productQty = Math.round((qty * productRatio) /100);

    return {
        cashQty: cashQty,
        productQty: productQty
    };
};

exports.lowStockWaring = async (productId, qty, totalQty)=>{
    const findProduct = await Product.findByPk(productId);
    if(findProduct){
        const isLowStock = findProduct.lowstock
        const tempStock = totalQty - qty;
        if(isLowStock){
            const lowStockQty = findProduct.lowStockQty;
            if(tempStock <= lowStockQty){
                return true;
            }
        }
    }
    return false;
}