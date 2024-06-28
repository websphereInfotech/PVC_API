const Stock = require("../models/stock");
const C_Stock = require("../models/C_stock");
const Product = require("../models/product");
const C_Product = require("../models/C_product");
const User = require("../models/user");
const {PRODUCT_TYPE} = require("../constant/constant");

/*=============================================================================================================
                                          Without Type C API
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
        console.log(productStockExists,"Product Stock")
        const productExists = await Product.findOne({
            where: {id: productId, companyId: companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true}
        })
        console.log(productExists,"Product Exsit")
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
            include: [{model: Product, as: "productStock", where: {companyId: companyId, productType: PRODUCT_TYPE.RAW_MATERIAL, isActive: true}},{model: User, as: "stockUpdateUser", attributes: ["username"]}],
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
            include: [{model: Product, as: "productStock", where: {companyId: companyId, productType: PRODUCT_TYPE.RAW_MATERIAL, isActive: true}},{model: User, as: "stockUpdateUser", attributes: ["username"]}],
        })
        if(!productStockExists){
            return res.status(404).json({
                status: "false",
                message: "Raw Material stock not found",
            })
        }
        const productExists = await Product.findOne({
            where: {id: productId, companyId: companyId, productType: PRODUCT_TYPE.RAW_MATERIAL, isActive: true}
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


/*=============================================================================================================
                                           Type C API
 ============================================================================================================ */


exports.C_view_all_product_stock = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const productCashStock =  await C_Stock.findAll({
            include: [{model: C_Product, as: "productCashStock", where: {companyId: companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true}}, {model: User, as: "cashStockUpdateUser", attributes: ["username"]}],
        })
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
            include: [{model: C_Product, as: "productCashStock", where: {companyId: companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true}}, {model: User, as: "cashStockUpdateUser", attributes: ["username"]}],
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
            include: [{model: C_Product, as: "productCashStock", where: {companyId: companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true}}, {model: User, as: "cashStockUpdateUser", attributes: ["username"]}],
        })
        if(!productCashStockExists){
            return res.status(404).json({
                status: "false",
                message: "Product stock not found",
            })
        }
        const productExists = await C_Product.findOne({
            where: {id: productId, companyId: companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true}
        })
        if(!productExists){
            return res.status(404).json({
                status: "false",
                message: "Product not found",
            })
        }

        productCashStockExists.productId = productId
        productCashStockExists.qty = qty
        productCashStockExists.updatedBy = req.user.userId
        await productCashStockExists.save();

        return res.status(200).json({
            status: "true",
            message: "Product Stock Successfully Updated.",
            data: productCashStockExists
        })
    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}

exports.C_view_all_raw_material_cash_stock = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const productCashStock =  await C_Stock.findAll({
            include: [{model: C_Product, as: "productCashStock", where: {companyId: companyId, productType: PRODUCT_TYPE.RAW_MATERIAL, isActive: true}}, {model: User, as: "cashStockUpdateUser", attributes: ["username"]}],
        })
        return res.status(200).json({
            status: "true",
            message: "Raw Material stock fetch successfully",
            data: productCashStock
        })
    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}

exports.C_view_raw_material_cash_stock = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const {id} = req.params;
        const productCashStock =  await C_Stock.findOne({
            where: {
                id,
            },
            include: [{model: C_Product, as: "productCashStock", where: {companyId: companyId, productType: PRODUCT_TYPE.RAW_MATERIAL, isActive: true}},{model: User, as: "cashStockUpdateUser", attributes: ["username"]}],
        })
        if(!productCashStock){
            return res.status(404).json({
                status: "404",
                message: "Raw Material not found",
            })
        }
        return res.status(200).json({
            status: "true",
            message: "Raw Material stock fetch successfully",
            data: productCashStock
        })
    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}

exports.C_update_raw_material_cash_stock = async (req, res) => {
    try {
        const { id } = req.params;
        const {productId, qty} = req.body;
        const companyId = req.user.companyId;
        const productCashStockExists = await C_Stock.findOne({
            where: {id: id},
            include: [{model: C_Product, as: "productCashStock", where: {companyId: companyId, productType: PRODUCT_TYPE.RAW_MATERIAL, isActive: true}}, {model: User, as: "cashStockUpdateUser", attributes: ["username"]}],
        })
        if(!productCashStockExists){
            return res.status(404).json({
                status: "false",
                message: "Raw Material stock not found",
            })
        }
        const productExists = await C_Product.findOne({
            where: {id: productId, companyId: companyId, productType: PRODUCT_TYPE.RAW_MATERIAL, isActive: true}
        })
        if(!productExists){
            return res.status(404).json({
                status: "false",
                message: "Raw Material not found",
            })
        }

        productCashStockExists.productId = productId
        productCashStockExists.qty = qty
        productCashStockExists.updatedBy = req.user.userId
        await productCashStockExists.save();

        return res.status(200).json({
            status: "true",
            message: "Raw Material Stock Successfully Updated.",
            data: productCashStockExists
        })
    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}

exports.C_view_total_product_stock = async (req,res)=>{
    try {
        const companyId = req.user.companyId;
        const productStocks = await Stock.findAll({
            include: [{model: Product, as: "productStock", where: {companyId: companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true}}, {model: User, as: "stockUpdateUser", attributes: ["username"]}],
        })
        const productCashStock =  await C_Stock.findAll({
            include: [{model: C_Product, as: "productCashStock", where: {companyId: companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true}}, {model: User, as: "cashStockUpdateUser", attributes: ["username"]}],
        })
            const mergedData = {};

            productStocks.forEach(item => {
                const productId = item.productId;
                const productName = item.productStock.productname;

                if (!mergedData[productId]) {
                    mergedData[productId] = {
                        productId: productId,
                        productName: productName,
                        totalQty: item.qty
                    };
                } else {
                    mergedData[productId].totalQty += item.qty;
                }
            });

            productCashStock.forEach(item => {
                const productId = item.productId;
                const productName = item.productCashStock.productname;

                if (!mergedData[productId]) {
                    mergedData[productId] = {
                        productId: productId,
                        productName: productName,
                        totalQty: item.qty
                    };
                } else {
                    mergedData[productId].totalQty += item.qty;
                }
            });

            const mergedItem =  Object.values(mergedData);

        return res.status(200).json({
            status: "true",
            message: "Total Product Stock Fetch Successfully.",
            data:  mergedItem
        })
    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}

exports.C_view_total_material_stock = async (req,res)=>{
    try {
        const companyId = req.user.companyId;
        const productStocks = await Stock.findAll({
            include: [{model: Product, as: "productStock", where: {companyId: companyId, productType: PRODUCT_TYPE.RAW_MATERIAL, isActive: true}}, {model: User, as: "stockUpdateUser", attributes: ["username"]}],
        })
        const productCashStock =  await C_Stock.findAll({
            include: [{model: C_Product, as: "productCashStock", where: {companyId: companyId, productType: PRODUCT_TYPE.RAW_MATERIAL, isActive: true}}, {model: User, as: "cashStockUpdateUser", attributes: ["username"]}],
        })
            const mergedData = {};

            productStocks.forEach(item => {
                const productId = item.productId;
                const productName = item.productStock.productname;

                if (!mergedData[productId]) {
                    mergedData[productId] = {
                        productId: productId,
                        productName: productName,
                        totalQty: item.qty
                    };
                } else {
                    mergedData[productId].totalQty += item.qty;
                }
            });

            productCashStock.forEach(item => {
                const productId = item.productId;
                const productName = item.productCashStock.productname;

                if (!mergedData[productId]) {
                    mergedData[productId] = {
                        productId: productId,
                        productName: productName,
                        totalQty: item.qty
                    };
                } else {
                    mergedData[productId].totalQty += item.qty;
                }
            });

            const mergedItem =  Object.values(mergedData);

        return res.status(200).json({
            status: "true",
            message: "Total Raw Material Stock Fetch Successfully.",
            data:  mergedItem
        })
    }catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}