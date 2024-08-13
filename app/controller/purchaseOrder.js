const PurchaseOrder = require("../models/PurchaseOrder");
const Account = require("../models/Account");
const product = require("../models/product");
const PurchaseOrderItem = require("../models/PurchaseOrderItem");

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
        const numberOf = await ProFormaInvoice.findOne({
            where: {
                ProFormaInvoice_no: purchaseOrder_no,
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
            InvoiceId: createdOrder.id,
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
