const Stock = require("../models/stock");
const Product = require("../models/product");

exports.view_product_stock =async (req, res) => {
    console.log(req.body,"Req.Body");
    try {
        const companyId = req.user.companyId;
        const {productId} = req.params;
        const findProduct = await Product.findOne({
            companyId: companyId,
            productId: productId,
        })
        const productStock =  await Stock.findOne({
            where: {
                productId: productId,
            }
        })
    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}