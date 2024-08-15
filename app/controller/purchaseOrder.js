const PurchaseOrder = require("../models/PurchaseOrder");
const Account = require("../models/Account");
const product = require("../models/product");
const PurchaseOrderItem = require("../models/PurchaseOrderItem");
const {Sequelize} = require("sequelize");
const AccountDetail = require("../models/AccountDetail");
const User = require("../models/user");

exports.create_purchaseOrder = async (req, res) => {
    try {
        const user = req.user.userId;
        const companyId = req.user.companyId
        const {
            purchaseOrder_no,
            date,
            validtill,
            accountId,
            termsOfDelivery,
            dispatchThrough,
            destination,
            LL_RR_no,
            terms,
            motorVehicleNo,
            dispatchno,
            totalIgst,
            totalSgst,
            totalMrp,
            mainTotal,
            totalQty,
            items,
        } = req.body;

        if (!items || items.length === 0) {
            return res
                .status(400)
                .json({ status: "false", message: "Required Field oF items" });
        }
        const numberOf = await PurchaseOrder.findOne({
            where: {
                purchaseOrder_no: purchaseOrder_no,
                companyId: companyId,
            },
        });
        if (numberOf) {
            return res.status(400).json({
                status: "false",
                message: "Purchase Order Number Already Exists",
            });
        }
        const accountExist = await Account.findOne({
            where: { id: accountId, companyId: companyId, isActive: true },
        });
        if (!accountExist) {
            return res
                .status(404)
                .json({ status: "false", message: "Account Not Found" });
        }
        for (const item of items) {
            if (!item.productId || item.productId === "") {
                return res
                    .status(400)
                    .json({ status: "false", message: "Required filed :Product Item" });
            }
            if (item.qty === 0) {
                return res
                    .status(400)
                    .json({ status: "false", message: "Qty Value Invalid" });
            }
            if (item.rate === 0) {
                return res
                    .status(400)
                    .json({ status: "false", message: "Rate Value Invalid" });
            }

            const productname = await product.findOne({
                where: { id: item.productId, companyId: companyId, isActive: true },
            });
            if (!productname) {
                return res
                    .status(404)
                    .json({ status: "false", message: "Product Item Not Found" });
            }
        }
        const createdOrder = await PurchaseOrder.create({
            purchaseOrder_no,
            date,
            validtill,
            accountId,
            termsOfDelivery,
            dispatchThrough,
            destination,
            LL_RR_no,
            terms,
            motorVehicleNo,
            dispatchno,
            totalIgst,
            totalSgst,
            totalMrp,
            mainTotal,
            totalQty,
            createdBy: user,
            updatedBy: user,
            companyId: companyId,
        });

        const addToProduct = items.map((item) => ({
            purchaseOrderId: createdOrder.id,
            ...item,
        }));
        await PurchaseOrderItem.bulkCreate(addToProduct);

        const orderItems = await PurchaseOrder.findOne({
            where: { id: createdOrder.id },
            include: [{ model: PurchaseOrderItem, as: "purchaseOrderItem" }],
        });

        return res.status(200).json({
            status: "true",
            message: "Purchase Order created successfully",
            data: orderItems,
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", error: "Internal Server Error" });
    }
};

exports.update_purchaseOrder = async (req, res)=>{
    try {
        const user = req.user.userId;
        const { id } = req.params;
        const companyId = req.user.companyId;
        const {
            purchaseOrder_no,
            date,
            validtill,
            accountId,
            termsOfDelivery,
            dispatchThrough,
            destination,
            LL_RR_no,
            terms,
            motorVehicleNo,
            dispatchno,
            items,
            totalIgst,
            totalSgst,
            totalMrp,
            mainTotal,
            totalQty,
        } = req.body;

        const existingOrder = await PurchaseOrder.findOne({
            where: { id: id, companyId: companyId },
        });

        if (!existingOrder) {
            return res.status(404).json({
                status: false,
                message: "Purchase Order Not Found",
            });
        }

        const numberOf = await PurchaseOrder.findOne({
            where: {
                purchaseOrder_no: purchaseOrder_no,
                companyId: companyId,
                id: { [Sequelize.Op.ne]: id },
            },
        });

        if (numberOf) {
            return res.status(400).json({
                status: false,
                message: "Purchase Order Number Already Exists",
            });
        }

        const accountExist = await Account.findOne({
            where: { id: accountId, companyId: companyId, isActive: true },
        });

        if (!accountExist) {
            return res.status(404).json({ status: false, message: "Account Not Found" });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ status: false, message: "Required Field of items" });
        }

        const existingItems = await PurchaseOrderItem.findAll({
            where: { purchaseOrderId: id },
        });

        for (const item of items) {
            if (!item.productId || item.productId === "") {
                return res.status(400).json({ status: false, message: "Required field: Product Item" });
            }
            if (item.qty === 0) {
                return res.status(400).json({ status: false, message: "Qty Value Invalid" });
            }
            if (item.rate === 0) {
                return res.status(400).json({ status: false, message: "Rate Value Invalid" });
            }
            const productname = await product.findOne({
                where: { id: item.productId, companyId: companyId, isActive: true },
            });
            if (!productname) {
                return res.status(404).json({ status: false, message: "Product Item Not Found" });
            }
        }

        await PurchaseOrder.update(
            {
                purchaseOrder_no,
                date,
                validtill,
                accountId,
                termsOfDelivery,
                dispatchThrough,
                destination,
                LL_RR_no,
                terms,
                motorVehicleNo,
                dispatchno,
                totalIgst,
                totalSgst,
                totalMrp,
                mainTotal,
                totalQty,
                companyId: companyId,
                updatedBy: user,
            },
            { where: { id } }
        );

        for (const item of items) {
            const existingItem = existingItems.find((ei) => ei.id === item.id);

            if (existingItem) {
                await PurchaseOrderItem.update(
                    {
                        productId: item.productId,
                        qty: item.qty,
                        rate: item.rate,
                        mrp: item.mrp,
                        unit: item.unit
                    },
                    { where: { id: existingItem.id } }
                );
            } else {
                await PurchaseOrderItem.create({
                    purchaseOrderId: id,
                    productId: item.productId,
                    qty: item.qty,
                    rate: item.rate,
                    mrp: item.mrp,
                    unit: item.unit
                });
            }
        }
        const updatedProductIds = items.map((item) => item.id);

        const itemsToDelete = existingItems.filter(
            (item) => !updatedProductIds.includes(item.id)
        );

        for (const item of itemsToDelete) {
            await PurchaseOrderItem.destroy({ where: { id: item.id } });
        }
        const updatedOrder = await PurchaseOrder.findOne({
            where: { id: id, companyId: companyId },
            include: [{ model: PurchaseOrderItem, as: "purchaseOrderItem" }],
        });

        return res.status(200).json({
            status: true,
            message: "Purchase Order Updated Successfully",
            data: updatedOrder,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
}

exports.delete_purchaseOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId

        const data = await PurchaseOrder.findOne({
            where: { id: id, companyId: companyId },
        });

        if (!data) {
            return res
                .status(400)
                .json({ status: "false", message: "Purchase Order Not Found" });
        }

        await data.destroy()

        return res.status(200).json({
            status: "true",
            message: "Purchase Order Delete Successfully",
        });
    } catch (error) {
        console.log(error.message);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

exports.view_purchaseOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId

        const data = await PurchaseOrder.findOne({
            where: { id, companyId: companyId },
            include: [
                {
                    model: PurchaseOrderItem,
                    as: "purchaseOrderItem",
                    include: [{ model: product, as: "purchaseOrderProduct" }],
                },
                { model: Account, as: "accountPurchaseOrder", include: {model: AccountDetail, as: "accountDetail"} },
            ],
        });
        if (!data) {
            return res
                .status(404)
                .json({ status: "false", message: "Purchase order not found" });
        }
        return res.status(200).json({
            status: "true",
            message: "Purchase order data fetch successfully",
            data: data,
        });
    } catch (error) {
        console.log(error.message);
        return res
            .status(500)
            .json({ status: "false", error: "Internal Server Error" });
    }
};


exports.get_all_purchaseOrder = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const allInvoice = await PurchaseOrder.findAll({
            where: { companyId: companyId },
            include: [
                {
                    model: PurchaseOrderItem,
                    as: "purchaseOrderItem",
                    include: [{ model: product, as: "purchaseOrderProduct" }],
                },
                { model: Account, as: "accountPurchaseOrder", include: {model: AccountDetail, as: "accountDetail"} },
                { model: User, as: "orderCreateUser", attributes: ["username"] },
                { model: User, as: "orderUpdateUser", attributes: ["username"] },
            ],
        });
        return res.status(200).json({
            status: "true",
            message: "Purchase Order data fetch successfully",
            data: allInvoice,
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ status: "false", error: "Internal Server Error" });
    }
};