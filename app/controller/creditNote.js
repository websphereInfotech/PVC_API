const creditNote = require("../models/creditNote");
const creditNoteItem = require("../models/creditNoteItem");
const customer = require("../models/customer");
const product = require("../models/product");


exports.create_creditNote = async (req, res) => {
    try {
        const { customerId, creditnoteNo, creditdate, org_invoicedate, org_invoiceno, LL_RR_no, dispatchThrough, motorVehicleNo, destination, totalIgst, totalSgst, totalMrp, mainTotal, totalQty, items } = req.body;

        const numberOf = await creditNote.findOne({ where: { creditnoteNo: creditnoteNo } });
        if (numberOf) {
            return res.status(400).json({ status: 'false', message: 'Credit Note Number Already Exists' });
        }

        const customerData = await customer.findByPk(customerId);
        if (!customerData) {
            return res
            .status(404)
            .json({ status: "false", message: "Customer Not Found" });
        }
        if (!items || items.length === 0) {
            return res
                .status(400)
                .json({ status: "false", message: "Required Field oF items" });
        }
        for (const item of items) {
            const productname = await product.findByPk(item.productId);
            if (!productname) {
                return res
                    .status(404)
                    .json({ status: "false", message: "Product Not Found" });
            }
        }
        const creditData = await creditNote.create({
            customerId, creditnoteNo, creditdate, org_invoiceno, org_invoicedate, LL_RR_no, dispatchThrough, destination, motorVehicleNo, totalIgst, totalSgst, totalMrp, totalQty, mainTotal
        });

        const addToProduct = items.map((item) => ({
            creditId : creditData.id,
            ...item
        }));
        await creditNoteItem.bulkCreate(addToProduct);

        const data = await creditNote.findOne({ where: {id: creditData.id}, include:[{model:creditNoteItem, as:'items'}]});
        return res.status(200).json({ status:'true', message:'Credit Note Create Successfully', data: data});
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}
exports.update_creditNote = async (req, res) => {
    try {
        const { id } = req.params;

        const { customerId, creditnoteNo, creditdate, org_invoicedate, org_invoiceno, LL_RR_no, dispatchThrough, motorVehicleNo, destination, totalIgst, totalSgst, totalMrp, mainTotal, totalQty, items } = req.body;

        const existingCredit = await creditNote.findByPk(id);

        if(!existingCredit) {
            return res.status(404).json({ status:'false', message:'Credit Note Not Found'});
        }
        const customerData = await customer.findByPk(customerId);
        if (!customerData) {
          return res
            .status(404)
            .json({ status: "false", message: "Customer Not Found" });
        }
        for (const item of items) {
          const productname = await product.findByPk(item.productId);
          if (!productname) {
            return res
              .status(404)
              .json({ status: "false", message: "Product Not Found" });
          }
        }
        await creditNote.update({
            customerId,
            creditnoteNo,
            creditdate,
            org_invoiceno,
            org_invoicedate,
            LL_RR_no,
            dispatchThrough,
            motorVehicleNo,
            destination,
            totalIgst,
            totalSgst,
            totalMrp,
            totalQty,
            mainTotal
        }, {where: {id}});

        const existingItems = await creditNoteItem.findAll({ where:{ creditId:id },
        });

        const mergedItems = [];

        items.forEach((item) => {
            let existingItem = mergedItems.find((i) => i.productId === item.productId && i.rate === item.rate);
            if(existingItem) {
                existingItem.qty += item.qty
            } else {
                mergedItems.push(item);
            }
        });
        for(const item of mergedItems) {
            const existingItem = existingItems.find((ei) => ei.productId === item.productId && ei.rate === item.rate);
            if(existingItem) {
                existingItem.qty = item.qty;
                await existingItem.save(); 
            } else {
                await creditNoteItem.create({
                    creditId: id,
                    productId: item.productId,
                    qty: item.qty,
                    rate: item.rate,
                    mrp: item.mrp
                });
            }
        }
        const updatedProducts = items.map((item) => ({ productId: item.productId, rate: item.rate}));

        const itemsToDelete = existingItems.filter((item) => !updatedProducts.some((updatedItem) => updatedItem.productId === item.productId && updatedItem.rate === item.rate));

        for(const item of itemsToDelete) {
            await item.destroy();
        }
        const data = await creditNote.findOne({
            where: { id },
            include: [{ model: creditNoteItem, as: "items" }],
          });
      
          return res
            .status(200)
            .json({
              status: "true",
              message: "Debit Note Update Successfully",
              data: data,
            });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}
exports.get_all_creditNote = async (req,res) => {
    try {
        const data = await creditNote.findAll({  include: [
            {
              model: creditNoteItem,
              as: "items",
              include: [{ model: product, as: "CreditProduct" }],
            },
            { model: customer, as: "CreditCustomer" },
          ],})
          if(data) {
            return res.status(200).json({
                status: "true",
                message: "Credit Note Data fetch successfully",
                data: data,
              });
          } else {
            return res.status(404).json({
                status: "true",
                message: "Credit Note Not Found",
              });
          }
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}
exports.view_single_creditNote = async (req, res) => {
    try {
      const { id } = req.params;
  
      const data = await creditNote.findOne({
        where: { id },
        include: [
          {
            model: creditNoteItem,
            as: "items",
            include: [{ model: product, as: "CreditProduct" }],
          },
          { model: customer, as: "CreditCustomer" },
        ],
      });
      if (!data) {
        return res
          .status(404)
          .json({ status: "false",  message: "Credit Note Not Found", });
      }
      return res.status(200).json({
        status: "true",
        message: "Credit Note Data fetch successfully",
        data: data,
      });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ status: "false", error: "Internal Server Error" });
    }
  };

  exports.delete_creditNote = async (req,res) => {
    try {
        const { id } = req.params;
        const data = await creditNote.destroy({ where: {id}});

        if(data) {
            return res.status(200).json({ status:'true', message:'Credit Note Deleted Successfully'});
        } else {
            return res.status(404).json({status:'false', message:'Credit Note Not Found'});
        }
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
  }