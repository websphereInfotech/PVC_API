const {CASHPRODUCTRATIO} = require("../constant/constant");


function splitQuantity(qty) {
    const productRatio = 100 - CASHPRODUCTRATIO;
    const cashQty = Math.round((qty * CASHPRODUCTRATIO) /100);
    const productQty = Math.round((qty * productRatio) /100);

    return {
        cashQty: cashQty,
        productQty: productQty
    };
}

exports.splitQuantity = splitQuantity;