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

exports.lowStockWaring = async (lowstock, lowStockQty, qty, totalQty, negativeQty)=>{
    const tempStock = totalQty - qty;
    console.log(tempStock,"Temp Qty");
    if (!negativeQty && tempStock < 0) {
        console.log("Inside the negative Qty");
        return true;
    }
    if (negativeQty) {
        return false;
    }

    if (lowstock && tempStock <= lowStockQty) {
        return true;
    }

    return false;
}