const Stock = require("../models/stock");
const C_Stock = require("../models/C_stock");
const Product = require("../models/product");
const C_Product = require("../models/C_product");
const User = require("../models/user");
const {PRODUCT_TYPE} = require("../constant/constant");

/*=============================================================================================================
                                          Without Typc C API
 ============================================================================================================ */

exports.view_all_product_stock =async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const productStock =  await Stock.findAll({
            include: [{model: Product, as: "productStock", where: {companyId: companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true}}, {model: User, as: "stockUpdateUser", attributes: ["username"]}],
        })
        return res.status(200).json({
            status: "true",
            message: "Product stock fetch successfully",
            data: productStock
        })
    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}

exports.view_product_stock = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const {id} = req.params;
        const productStock =  await Stock.findOne({
            where: {
                id,
            },
            include: [{model: Product, as: "productStock", where: {companyId: companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true}}, {model: User, as: "stockUpdateUser", attributes: ["username"]}],
        })
        if(!productStock){
            return res.status(404).json({
                status: "404",
                message: "Product not found",
            })
        }
        return res.status(200).json({
            status: "true",
            message: "Product stock fetch successfully",
            data: productStock
        })
    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}

exports.update_product_stock = async (req, res) => {
    try {
        const { id } = req.params;
        const {productId, qty} = req.body;
        const companyId = req.user.companyId;
        const productStockExists = await Stock.findOne({
            where: {id: id},
            include: [{model: Product, as: "productStock", where: {companyId: companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true}}],
        })
        if(!productStockExists){
            return res.status(404).json({
                status: "false",
                message: "Product stock not found",
            })
        }
        const productExists = await Product.findOne({
            where: {id: productId, companyId: companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true}
        })
        if(!productExists){
            return res.status(404).json({
                status: "false",
                message: "Product not found",
            })
        }

        productStockExists.productId = productId
        productStockExists.qty = qty
        productStockExists.updatedBy = req.user.userId
        await productStockExists.save();

        return res.status(200).json({
            status: "true",
            message: "Product Stock Successfully Updated.",
            data: productStockExists
        })

    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }

}


exports.view_all_raw_material_stock =async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const productStock =  await Stock.findAll({
            include: [{model: Product, as: "productStock", where: {companyId: companyId, productType: PRODUCT_TYPE.RAW_MATERIAL, isActive: true}}, {model: User, as: "stockUpdateUser", attributes: ["username"]}],
        })
        return res.status(200).json({
            status: "true",
            message: "Product stock fetch successfully",
            data: productStock
        })
    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}

exports.view_raw_material_stock = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const {id} = req.params;
        const productStock =  await Stock.findOne({
            where: {
                id,
            },
            include: [{model: Product, as: "productStock", where: {companyId: companyId, productType: PRODUCT_TYPE.RAW_MATERIAL, isActive: true}},{model: User, as: "stockUpdateUser", attributes: ["username"]}],
        })
        if(!productStock){
            return res.status(404).json({
                status: "404",
                message: "Product not found",
            })
        }
        return res.status(200).json({
            status: "true",
            message: "Product stock fetch successfully",
            data: productStock
        })
    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}

exports.update_raw_material_stock = async (req, res) => {
    try {
        const { id } = req.params;
        const {productId, qty} = req.body;
        const companyId = req.user.companyId;
        const productStockExists = await Stock.findOne({
            where: {id: id},
            include: [{model: Product, as: "productStock", where: {companyId: companyId, productType: PRODUCT_TYPE.RAW_MATERIAL, isActive: true}}],
        })
        if(!productStockExists){
            return res.status(404).json({
                status: "false",
                message: "Product stock not found",
            })
        }
        const productExists = await Product.findOne({
            where: {id: productId, companyId: companyId, productType: PRODUCT_TYPE.RAW_MATERIAL, isActive: true}
        })
        if(!productExists){
            return res.status(404).json({
                status: "false",
                message: "Product not found",
            })
        }

        productStockExists.productId = productId
        productStockExists.qty = qty
        productStockExists.updatedBy = req.user.userId
        await productStockExists.save();

        return res.status(200).json({
            status: "true",
            message: "Product Stock Successfully Updated.",
            data: productStockExists
        })

    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }

}


/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */


exports.C_view_all_product_stock = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const productCashStock =  await C_Stock.findAll({
            include: [{model: C_Product, as: "productCashStock", where: {companyId: companyId}}, {model: User, as: "stockUpdateUser", attributes: ["username"]}],
        })
        console.log(productCashStock,"Product Stock")
        return res.status(200).json({
            status: "true",
            message: "Product stock fetch successfully",
            data: productCashStock
        })
    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}

exports.C_view_product_stock = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const {id} = req.params;
        const productCashStock =  await C_Stock.findOne({
            where: {
                id,
            },
            include: [{model: C_Product, as: "productCashStock", where: {companyId: companyId}}],
        })
        if(!productCashStock){
            return res.status(404).json({
                status: "404",
                message: "Product not found",
            })
        }
        return res.status(200).json({
            status: "true",
            message: "Product stock fetch successfully",
            data: productCashStock
        })
    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}

exports.C_update_product_stock = async (req, res) => {
    try {
        const { id } = req.params;
        const {productId, qty} = req.body;
        const companyId = req.user.companyId;
        const productCashStockExists = await C_Stock.findOne({
            where: {id: id},
            include: [{model: C_Product, as: "productCashStock", where: {companyId: companyId}}],
        })
        if(!productCashStockExists){
            return res.status(404).json({
                status: "false",
                message: "Product stock not found",
            })
        }
        const productExists = await C_Product.findOne({
            where: {id: productId, companyId: companyId}
        })
        if(!productExists){
            return res.status(404).json({
                status: "false",
                message: "Product not found",
            })
        }

        productCashStockExists.productId = productId
        productCashStockExists.qty = qty
        await productCashStockExists.save();

        return res.status(200).json({
            status: "true",
            message: "Product Stock Successfully Updated.",
            data: productCashStockExists
        })
    }catch (e) {

    }
}