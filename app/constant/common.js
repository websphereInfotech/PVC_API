const {CASHPRODUCTRATIO} = require("../constant/constant");
const moment = require("moment");

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