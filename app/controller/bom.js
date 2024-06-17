const Bom = require('../models/bom')
const BomItem = require('../models/bomItem')
const Product = require("../models/product");
const User = require("../models/user");
const {Sequelize} = require("sequelize");

exports.create_bom = async (req, res) => {
    try {
        console.log(req.body,"Req.body")
        const {bomNo, date, description, items, productId, qty, unit} = req.body;
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
            unit,
            createdBy: userId,
            updatedBy: userId,
            companyId
        })

        console.log(createBOM,"Create Bom")
        for(const item of items){

            await BomItem.create({
                ...item,
                bomId: createBOM.id
            })
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
        const {bomNo, date, description, items, productId, qty, unit} = req.body;

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
        bomExist.bomNo = bomNo;
        bomExist.date = date;
        bomExist.description = description;
        bomExist.productId = productId;
        bomExist.qty = qty;
        bomExist.unit = unit;
        await bomExist.save();

        for(const item of items){
            const bomItem = await BomItem.findOne({
                where: {
                    id: item.id,
                    bomId : bomExist.id
                }
            })
            bomItem.productId = item.productId;
            bomItem.qty = item.qty;
            bomItem.unit = item.unit;
            bomItem.wastage = item.wastage;
            await bomItem.save()
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