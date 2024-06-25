const Bom = require('../models/bom')
const BomItem = require('../models/bomItem')
const Product = require("../models/product");
const User = require("../models/user");
const {Sequelize} = require("sequelize");
const C_Stock = require("../models/C_stock");
const C_Product = require("../models/C_product");
const Stock = require("../models/stock");
const {splitQuantity, lowStockWaring} = require("../constant/common");
const {PRODUCT_TYPE} = require("../constant/constant");

exports.create_bom = async (req, res) => {
    try {
        const {bomNo, date, unit, weight, items, productId, qty} = req.body;
        const userId = req.user.userId;
        const companyId = req.user.companyId;
        const checkBomNo = await Bom.findOne({where: {bomNo: bomNo, companyId: companyId}});

        if(checkBomNo){
            return res.status(400).json({
                status: "false",
                message: "Bom No Already Exists.",
            })
        }
        const productExist = await Product.findOne({where: {
            id: productId,
                companyId: companyId,
                productType: PRODUCT_TYPE.PRODUCT,
                isActive: true
            }});
        if(!productExist){
            return res.status(404).json({
                status: "false",
                message: "Product Not Found.",
            })
        }

        for(const item of items){
            const productExist = await Product.findOne({where: {
                    id: item.productId,
                    companyId: companyId,
                    productType: PRODUCT_TYPE.RAW_MATERIAL,
                    isActive: true
                }});
            if(!productExist){
                return res.status(404).json({
                    status: "false",
                    message: "Raw Material Not Found.",
                })
            }
            // const productId = productExist.id;
            //
            // const qtys = items.reduce((acc, item) => {
            //     if (item.productId === productId) {
            //         return acc + item.qty;
            //     }
            //     return acc;
            // }, 0);
            //
            // const cashProduct = await C_Product.findOne({
            //     id: item.productId,
            //     companyId: companyId,
            //     productType: PRODUCT_TYPE.RAW_MATERIAL,
            //     isActive: true
            // })
            //
            // const {cashQty, productQty} = splitQuantity(qtys)
            // const productStock = await Stock.findOne({where: {productId: item.productId}})
            // const totalProductQty = productStock?.qty ?? 0;
            // const isLawStock = await lowStockWaring(productExist.lowstock, productExist.lowStockQty, productQty, totalProductQty, productExist.nagativeqty)
            // const productCashStock = await C_Stock.findOne({where: {productId: item.productId}})
            // const totalProductCashQty = productCashStock?.qty ?? 0;
            // const isLawStockCash = await lowStockWaring(cashProduct.lowstock, cashProduct.lowStockQty, cashQty, totalProductCashQty, cashProduct.nagativeqty)
            // if(isLawStock || isLawStockCash) return res.status(400).json({status: "false", message: `Low Stock in ${productExist.productname} Product`});
        }

        const createBOM = await Bom.create({
            bomNo: bomNo,
            date: date,
            weight: weight,
            productId,
            qty,
            createdBy: userId,
            updatedBy: userId,
            companyId,
            unit: unit
        })
        const productStock = await Stock.findOne({
            where: {productId}
        })
        const productCashStock = await C_Stock.findOne({
            where: {productId}
        })
        const {cashQty, productQty} = splitQuantity(qty)
        if(productStock){
            await productStock.increment('qty',{by: productQty})
        }
        if(productCashStock){
            await productCashStock.increment('qty',{by: cashQty})
        }

        for(const item of items){

            await BomItem.create({
                ...item,
                bomId: createBOM.id
            })

            const productStock = await Stock.findOne({
                where: {productId: item.productId},
            })
            const productCashStock = await C_Stock.findOne({
                where: {productId: item.productId},
            })
            const {cashQty, productQty} = splitQuantity(qty)
            if(productStock){
                await productStock.decrement('qty',{by: productQty})
            }
            if(productCashStock){
                await productCashStock.decrement('qty',{by: cashQty})
            }
        }

        return res.status(200).json({
            status: "true",
            message: "Bom created successfully.",
        })
    }catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error.",
        })
    }
}

exports.update_bom = async (req, res) => {
    try{
        const companyId = req.user.companyId;
        const {bomId} = req.params;
        const {bomNo, date, unit, weight, items, productId, qty} = req.body;

        const bomExist = await Bom.findOne({where: {id: bomId, companyId: companyId}})
        if(!bomExist){
            return res.status(404).json({
                status: "false",
                message: "Bom Not Found."
            })
        }

        const numberOf = await Bom.findOne({
            where: { bomNo: bomNo, companyId: companyId, id: { [Sequelize.Op.ne]: bomId },},
        });

        if (numberOf) {
            return res
                .status(400)
                .json({ status: "false", message: "Bom Number Already Exists" });
        }
        const productExist = await Product.findOne({where: {
                id: productId,
                companyId: companyId,
                productType: PRODUCT_TYPE.PRODUCT,
                isActive: true
            }});
        if(!productExist){
            return res.status(404).json({
                status: "false",
                message: "Product Not Found.",
            })
        }
        const existingItems = await BomItem.findAll({
            where: { bomId: bomExist.id },
        });

        // const filteredExistingItems = existingItems.filter(existingItem =>
        //     items.some(insertItem => insertItem.id === existingItem.id)
        // );

        for(const item of items){
            const productExist = await Product.findOne({where: {
                    id: item.productId,
                    companyId: companyId,
                    productType: PRODUCT_TYPE.RAW_MATERIAL,
                    isActive: true
                }});
            if(!productExist){
                return res.status(404).json({
                    status: "false",
                    message: "Raw Material Not Found.",
                })
            }
            if(item.id){
                const bomItemExist = await BomItem.findOne({
                    where: {
                        id: item.id,
                        bomId: bomId
                    }
                })
                if(!bomItemExist){
                    return res.status(404).json({
                        status: "false",
                        message: "Bom Item Not Found.",
                    })
                }
            }
            // const productId = productExist.id;
            //
            // const qtys = items.reduce((acc, item) => {
            //     if (item.productId === productId) {
            //         return acc + item.qty;
            //     }
            //     return acc;
            // }, 0);
            //
            // const existingItemsQty = filteredExistingItems.reduce((acc, item) => {
            //     if (item.productId === productId) {
            //         return acc + item.qty;
            //     }
            //     return acc;
            // }, 0);
            //
            // const cashProduct = await C_Product.findOne({
            //     id: item.productId,
            //     companyId: companyId,
            //     productType: PRODUCT_TYPE.RAW_MATERIAL,
            //     isActive: true
            // })
            // const tempQty = qtys - existingItemsQty;
            // const {cashQty, productQty} = splitQuantity(tempQty)
            // const productStock = await Stock.findOne({where: {productId: item.productId}})
            // const totalProductQty = productStock?.qty ?? 0;
            // const isLawStock = await lowStockWaring(productExist.lowstock, productExist.lowStockQty, productQty, totalProductQty, productExist.nagativeqty)
            // const productCashStock = await C_Stock.findOne({where: {productId: item.productId}})
            // const totalProductCashQty = productCashStock?.qty ?? 0;
            // const isLawStockCash = await lowStockWaring(cashProduct.lowstock, cashProduct.lowStockQty, cashQty, totalProductCashQty, cashProduct.nagativeqty)
            // if(isLawStock || isLawStockCash) return res.status(400).json({status: "false", message: `Low Stock in ${productExist.productname} Product`});
        }

        await  Bom.update(
            {
                bomNo,
                date,
                weight,
                productId,
                qty,
                unit,
                updatedBy: req.user.userId
            },
            {
                where: {
                    id: bomExist.id
                }
            }
        );

        const productStock = await Stock.findOne({
            where: {productId: productId},
        })
        const productCashStock = await C_Stock.findOne({
            where: {productId: productId},
        })
        const {cashQty:newCashQty, productQty:newProductQty} = splitQuantity(qty)
        const {cashQty:previousCashQty, productQty:previousProductQty} = splitQuantity(bomExist?.qty ?? 0)
        if(productStock){
            await productStock.decrement('qty',{by: previousProductQty})
            await productStock.increment('qty',{by: newProductQty})
        }
        if(productCashStock){
            await productCashStock.decrement('qty',{by: previousCashQty})
            await productCashStock.increment('qty',{by: newCashQty})
        }

        for(const item of items){
            const existingItem = existingItems.find((ei) => ei.id === item.id);
            if(existingItem){
                BomItem.update(
                    {
                        productId : item.productId,
                        qty: item.qty,
                        unit: item.unit
                    },
                    {
                        where: {
                            id: item.id,
                            bomId: bomExist.id
                        }
                    }
                );

            }else{
                await BomItem.create({
                    ...item,
                    bomId: bomExist.id
                })
            }
            const productStock = await Stock.findOne({
                where: {productId: item.productId},
            })
            const productCashStock = await C_Stock.findOne({
                where: {productId: item.productId},
            })
            console.log(item.qty,"Item QTY")
            const {cashQty:newCashQty, productQty:newProductQty} = splitQuantity(item.qty)
            const {cashQty:previousCashQty, productQty:previousProductQty} = splitQuantity(existingItem?.qty ?? 0)
            console.log(previousCashQty, "Previous", newCashQty,"New Cash")
            if(productStock){
                await productStock.increment('qty',{by: previousProductQty})
                await productStock.decrement('qty',{by: newProductQty})
            }
            if(productCashStock){
                await productCashStock.increment('qty',{by: previousCashQty})
                await productCashStock.decrement('qty',{by: newCashQty})
            }
        }

        const updatedProductIds = items.map((item) => item.id);
        const itemsToDelete = existingItems.filter(
            (item) => !updatedProductIds.includes(item.id)
        );
        for (const item of itemsToDelete) {
            const productStock = await Stock.findOne({
                where: {productId: item.productId},
            })
            const productCashStock = await C_Stock.findOne({
                where: {productId: item.productId},
            })
            const {cashQty:previousCashQty, productQty:previousProductQty} = splitQuantity(item?.qty ?? 0)
            if(productStock){
                await productStock.increment('qty',{by: previousProductQty})
            }
            if(productCashStock){
                await productCashStock.increment('qty',{by: previousCashQty})
            }
            await BomItem.destroy({ where: { id: item.id } });
        }

        return res.status(200).json({
            status: "true",
            message: "Bom updated successfully.",
        })
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error.",
        })
    }
}

exports.view_all_bom = async (req,res)=>{
    try {
        const companyId = req.user.companyId;

        const boms = await Bom.findAll({
            where: {
                companyId: companyId
            },
            include: [
                {
                    model: BomItem,
                    as: "bomItems",
                    include: [{ model: Product, as: "bomItemsProduct" }],
                },
                {
                    model: Product,
                    as: "bomProduct"
                },
                {
                    model: User,
                    as: "bomUpdatedUser",
                    attributes: ['username']
                },
                {
                    model: User,
                    as: "bomCreatedUser",
                    attributes: ['username']
                }
            ]
        })
        return res.status(200).json({
            status: "true",
            message: "Bom fetched successfully.",
            data: boms
        })
    }catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error.",
        })
    }
}

exports.view_bom = async (req,res)=>{
    try {
        const companyId = req.user.companyId;
        const {bomId} = req.params;

        const bomExist = await Bom.findOne({where: {id: bomId, companyId: companyId}})
        if(!bomExist){
            return res.status(404).json({
                status: "false",
                message: "Bom Not Found."
            })
        }

        const bom = await Bom.findOne({
            where: {
                companyId: companyId,
                id: bomId
            },
            include: [
                {
                    model: BomItem,
                    as: "bomItems",
                    include: [{ model: Product, as: "bomItemsProduct" }],
                },
                {
                    model: Product,
                    as: "bomProduct"
                },
                {
                    model: User,
                    as: "bomUpdatedUser",
                    attributes: ['username']
                },
                {
                    model: User,
                    as: "bomCreatedUser",
                    attributes: ['username']
                }
            ]
        })
        return res.status(200).json({
            status: "true",
            message: "Bom fetched successfully.",
            data: bom
        })
    }catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error.",
        })
    }
}

exports.delete_bom = async (req,res)=>{
    try {
        const companyId = req.user.companyId;
        const {bomId} = req.params;

        const bomExist = await Bom.findOne({where: {id: bomId, companyId: companyId}})
        if(!bomExist){
            return res.status(404).json({
                status: "false",
                message: "Bom Not Found."
            })
        }
        // const bomProduct = await Product.findOne({
        //     where: {
        //         id: bomExist.productId,
        //         companyId: companyId,
        //         productType: PRODUCT_TYPE.PRODUCT,
        //         isActive: true
        //     }
        // })
        // const bomProductCash = await C_Product.findOne({
        //     where: {
        //         id: bomExist.productId,
        //         companyId: companyId,
        //         productType: PRODUCT_TYPE.PRODUCT,
        //         isActive: true
        //     }
        // })
        const productStock = await Stock.findOne({
            where: {productId: bomExist.productId},
        })
        const productCashStock = await C_Stock.findOne({
            where: {productId: bomExist.productId},
        })
        const {cashQty:previousCashQty, productQty:previousProductQty} = splitQuantity(bomExist?.qty ?? 0)

        // const totalProductQty = productStock?.qty ?? 0;
        // const totalProductCashQty = productCashStock?.qty ?? 0;
        //
        //
        //
        // const isLawStock = await lowStockWaring(bomProduct.lowstock, bomProduct.lowStockQty, previousProductQty, totalProductQty, bomProduct.nagativeqty)
        // const isLawStockCash = await lowStockWaring(bomProductCash.lowstock, bomProductCash.lowStockQty, previousCashQty, totalProductCashQty, bomProductCash.nagativeqty)
        //
        // if(isLawStock || isLawStockCash) return res.status(400).json({status: "false", message: `Low Stock in ${bomProduct.productname} Product`});

        const existingItems = await BomItem.findAll({
            where: { bomId: bomExist.id },
        });
        for(const item of existingItems){
            const productStock = await Stock.findOne({
                where: {productId: item.productId},
            })
            const productCashStock = await C_Stock.findOne({
                where: {productId: item.productId},
            })
            const {cashQty:previousCashQty, productQty:previousProductQty} = splitQuantity(item?.qty ?? 0)
            if(productStock){
                await productStock.increment('qty',{by: previousProductQty})
            }
            if(productCashStock){
                await productCashStock.increment('qty',{by: previousCashQty})
            }
        }

        if(productStock){
            await productStock.decrement('qty',{by: previousProductQty})
        }
        if(productCashStock){
            await productCashStock.decrement('qty',{by: previousCashQty})
        }
        await bomExist.destroy()
        return res.status(200).json({
            status: "true",
            message: "Bom delete successfully.",
        })
    }catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error.",
        })
    }
}