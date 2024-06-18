const Bom = require('../models/bom')
const BomItem = require('../models/bomItem')
const Product = require("../models/product");
const User = require("../models/user");
const {Sequelize} = require("sequelize");
const C_Stock = require("../models/C_stock");
const Stock = require("../models/stock");
const {splitQuantity} = require("../util/splitQuantity");

exports.create_bom = async (req, res) => {
    try {
        console.log(req.body,"Req.body")
        const {bomNo, date, description, items, productId, qty} = req.body;
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
                }});
            if(!productExist){
                return res.status(404).json({
                    status: "false",
                    message: "Product Not Found.",
                })
            }
        }

        const createBOM = await Bom.create({
            bomNo: bomNo,
            date: date,
            description: description,
            productId,
            qty,
            createdBy: userId,
            updatedBy: userId,
            companyId
        })
        const productStock = await Stock.findOne({
            where: {productId}
        })
        const productCashStock = await C_Stock.findOne({
            where: {productId}
        })
        console.log(splitQuantity(qty), "Split Qty")
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
            console.log(splitQuantity(qty), "Split Qty")
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
        const userId = req.user.userId;
        const {bomNo, date, description, items, productId, qty} = req.body;

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

        for(const item of items){
            const productExist = await Product.findOne({where: {
                    id: item.productId,
                    companyId: companyId,
                }});
            if(!productExist){
                return res.status(404).json({
                    status: "false",
                    message: "Product Not Found.",
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
        }

        await  Bom.update(
            {
                bomNo,
                date,
                description,
                productId,
                qty,
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
                        wastage: item.wastage,
                        productId : item.productId,
                        qty: item.qty
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
        const productStock = await Stock.findOne({
            where: {productId: bomExist.productId},
        })
        const productCashStock = await C_Stock.findOne({
            where: {productId: bomExist.productId},
        })
        const {cashQty:previousCashQty, productQty:previousProductQty} = splitQuantity(bomExist?.qty ?? 0)
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