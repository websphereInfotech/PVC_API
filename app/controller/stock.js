const Stock = require("../models/stock");
const Product = require("../models/product");
const User = require("../models/user");
const {ITEM_GROUP_TYPE} = require("../constant/constant");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

exports.view_all_product_stock =async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const productStock =  await Stock.findAll({
            include: [{model: Product, as: "productStock", where: {companyId: companyId, isActive: true}}, {model: User, as: "stockUpdateUser", attributes: ["username"]}],
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
            include: [{model: Product, as: "productStock", where: {companyId: companyId, isActive: true}}, {model: User, as: "stockUpdateUser", attributes: ["username"]}],
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
            include: [{model: Product, as: "productStock", where: {companyId: companyId, isActive: true}}],
        })
        if(!productStockExists){
            return res.status(404).json({
                status: "false",
                message: "Product stock not found",
            })
        }
        const productExists = await Product.findOne({
            where: {id: productId, companyId: companyId, isActive: true}
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
            include: [{model: Product, as: "productStock", where: {companyId: companyId, isActive: true, itemgroup: ITEM_GROUP_TYPE.RAW_MATERIAL}}, {model: User, as: "stockUpdateUser", attributes: ["username"]}],
        })
        return res.status(200).json({
            status: "true",
            message: "Raw Material stock fetch successfully",
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
            include: [{model: Product, as: "productStock", where: {companyId: companyId, isActive: true}},{model: User, as: "stockUpdateUser", attributes: ["username"]}],
        })
        if(!productStock){
            return res.status(404).json({
                status: "404",
                message: "Raw Material not found",
            })
        }
        return res.status(200).json({
            status: "true",
            message: "Raw Material stock fetch successfully",
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
            include: [{model: Product, as: "productStock", where: {companyId: companyId, isActive: true}},{model: User, as: "stockUpdateUser", attributes: ["username"]}],
        })
        if(!productStockExists){
            return res.status(404).json({
                status: "false",
                message: "Raw Material stock not found",
            })
        }
        const productExists = await Product.findOne({
            where: {id: productId, companyId: companyId, isActive: true}
        })
        if(!productExists){
            return res.status(404).json({
                status: "false",
                message: "Raw Material not found",
            })
        }

        productStockExists.productId = productId
        productStockExists.qty = qty
        productStockExists.updatedBy = req.user.userId
        await productStockExists.save();

        return res.status(200).json({
            status: "true",
            message: "Raw Material Stock Successfully Updated.",
            data: productStockExists
        })

    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }

}