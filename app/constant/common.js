const {CASHPRODUCTRATIO} = require("../constant/constant");
const moment = require("moment");

exports.splitQuantity = (qty)=>{
    const productRatio = 100 - CASHPRODUCTRATIO;
    const cashQty = (qty * CASHPRODUCTRATIO) /100
    const productQty = (qty * productRatio) /100

    return {
        cashQty: Math.round(cashQty * 100) / 100,
        productQty: Math.round(productQty * 100) / 100
    };
};

exports.lowStockWaring = async (lowstock, lowStockQty, qty, totalQty, negativeQty)=>{
    const tempStock = totalQty - qty;
    if (!negativeQty && tempStock < 0) {
        return true;
    }
    if (negativeQty) {
        return false;
    }

    return lowstock && tempStock <= lowStockQty;

}

exports.isLastDayOfMonth = async () => {
    const date = new Date();
    const lastDayOfMonth = moment().daysInMonth()
    return date.getDate() === lastDayOfMonth;
}