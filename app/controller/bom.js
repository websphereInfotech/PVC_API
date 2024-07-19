const Bom = require('../models/bom')
const BomItem = require('../models/bomItem')
const Product = require("../models/product");
const User = require("../models/user");
const {Sequelize} = require("sequelize");
const Stock = require("../models/stock");

exports.create_bom = async (req, res) => {
    try {
        const {bomNo, date, unit, weight, items, productId, qty, totalQty} = req.body;
        const userId = req.user.userId;
        const companyId = req.user.companyId;
        const checkBomNo = await Bom.findOne({where: {bomNo: bomNo, companyId: companyId}});

        if(checkBomNo){
            return res.status(400).json({
                status: "false",
                message: "Production No Already Exists.",
            })
        }
        const productExist = await Product.findOne({where: {
            id: productId,
                companyId: companyId,
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
                    isActive: true
                }});
            if(!productExist){
                return res.status(404).json({
                    status: "false",
                    message: "Raw Material Not Found.",
                })
            }
        }
        const totalWeight = qty * weight;
        const dividedWeight = Math.round((totalWeight / totalQty) * 100) / 100;

        const createBOM = await Bom.create({
            bomNo: bomNo,
            date: date,
            weight: weight,
            productId,
            qty,
            totalQty,
            createdBy: userId,
            updatedBy: userId,
            companyId,
            unit: unit
        })

        const productStock = await Stock.findOne({
            where: {productId}
        })
        if(productStock){
            await productStock.increment('qty',{by: qty})
        }

        for(const item of items){
            const totalQty = item.qty * dividedWeight;
            await BomItem.create({
                ...item,
                bomId: createBOM.id
            })

            const productStock = await Stock.findOne({
                where: {productId: item.productId},
            })
            if(productStock){
                await productStock.decrement('qty',{by: totalQty})
            }
        }

        return res.status(200).json({
            status: "true",
            message: "Production created successfully.",
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
        const {bomNo, date, unit, weight, items, productId, qty, totalQty} = req.body;

        const bomExist = await Bom.findOne({where: {id: bomId, companyId: companyId}})
        if(!bomExist){
            return res.status(404).json({
                status: "false",
                message: "Production Not Found."
            })
        }

        const numberOf = await Bom.findOne({
            where: { bomNo: bomNo, companyId: companyId, id: { [Sequelize.Op.ne]: bomId },},
        });

        if (numberOf) {
            return res
                .status(400)
                .json({ status: "false", message: "Production Number Already Exists" });
        }
        const productExist = await Product.findOne({where: {
                id: productId,
                companyId: companyId,
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

        for(const item of items){
            const productExist = await Product.findOne({where: {
                    id: item.productId,
                    companyId: companyId,
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
                        message: "Production Item Not Found.",
                    })
                }
            }
        }
        const totalWeight = qty * weight;

        const dividedWeight = Math.round((totalWeight / totalQty) * 100) / 100;

        const oldTotalWeight = bomExist.qty * bomExist.weight;
        const oldTotalRecipeWeight = bomExist?.totalQty ?? 0;
        const oldDividedWeight = Math.round((oldTotalWeight / oldTotalRecipeWeight) * 100) / 100;


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
        if(productStock){
            await productStock.decrement('qty',{by: bomExist?.qty ?? 0})
            await productStock.increment('qty',{by: qty})
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
            const exitingQty = existingItem?.qty ?? 0
            const oldTotalQty = exitingQty * oldDividedWeight;
            const totalQty = item.qty * dividedWeight;

            const productStock = await Stock.findOne({
                where: {productId: item.productId},
            })
            if(productStock){
                await productStock.increment('qty',{by: oldTotalQty})
                await productStock.decrement('qty',{by: totalQty})
            }
        }

        const updatedProductIds = items.map((item) => item.id);
        const itemsToDelete = existingItems.filter(
            (item) => !updatedProductIds.includes(item.id)
        );
        for (const item of itemsToDelete) {
            const oldTotalQty = item.qty * oldDividedWeight;
            const productStock = await Stock.findOne({
                where: {productId: item.productId},
            })
            if(productStock){
                await productStock.increment('qty',{by: oldTotalQty})
            }
            await BomItem.destroy({ where: { id: item.id } });
        }

        return res.status(200).json({
            status: "true",
            message: "Production updated successfully.",
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
            message: "Production fetched successfully.",
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
                message: "Production Not Found."
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
            message: "Production fetched successfully.",
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
                message: "Production Not Found."
            })
        }

        const existingItems = await BomItem.findAll({
            where: { bomId: bomExist.id },
        });

        const oldTotalWeight = bomExist.qty * bomExist.weight;
        const oldTotalRecipeWeight = bomExist.totalQty;
        const oldDividedWeight = Math.round((oldTotalWeight / oldTotalRecipeWeight) * 100) / 100;
        const productStock = await Stock.findOne({
            where: {productId: bomExist.productId},
        })

        for(const item of existingItems){
            const exitingQty = item?.qty ?? 0
            const oldTotalQty = exitingQty * oldDividedWeight;
            const productStock = await Stock.findOne({
                where: {productId: item.productId},
            })
            if(productStock){
                await productStock.increment('qty',{by: oldTotalQty})
            }
        }

        if(productStock){
            await productStock.decrement('qty',{by: bomExist?.qty ?? 0})
        }
        await bomExist.destroy()
        return res.status(200).json({
            status: "true",
            message: "Production delete successfully.",
        })
    }catch (e) {
        console.log(e);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error.",
        })
    }
}