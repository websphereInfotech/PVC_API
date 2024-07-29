const { Sequelize } = require("sequelize");
const C_purchaseCash = require("../models/C_purchaseCash");
const C_purchaseCashItem = require("../models/C_purchseCashItem");
const product = require("../models/product");
const Account = require("../models/Account");
const AccountDetail = require("../models/AccountDetail");
const Ledger = require("../models/Ledger");
const purchaseInvoice = require("../models/purchaseInvoice");
const purchaseInvoiceItem = require("../models/purchaseInvoiceItem");
const User = require("../models/user");
const Stock = require("../models/stock");
const {renderFile} = require("ejs");
const path = require("node:path");
const htmlToPdf = require("html-pdf-node");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

exports.create_purchaseInvoice = async (req, res) => {
  try {
    const user = req.user.userId;
    const companyId = req.user.companyId;
    const {
      accountId,
      duedate,
      invoicedate,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
      supplyInvoiceNo,
      voucherno
    } = req.body;

    const numberOf = await purchaseInvoice.findOne({
      where: { voucherno: voucherno, companyId: companyId },
    });
    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Voucher Number Already Exists" });
    }
    const supplyInvoiceNoExist = await purchaseInvoice.findOne({
      where: { supplyInvoiceNo: supplyInvoiceNo, companyId: companyId },
    })
    if (supplyInvoiceNoExist) {
      return res
          .status(400)
          .json({ status: "false", message: "Supply Number Already Exists" });
    }

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field Of Items" });
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
          .json({ status: "false", message: "Required filed :Product" });
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
      const productData = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Item Not Found" });
      }
    }
    const purchseData = await purchaseInvoice.create({
      accountId,
      duedate,
      invoicedate,
      totalIgst,
      totalSgst,
      totalMrp,
      totalQty,
      mainTotal,
      voucherno,
      supplyInvoiceNo,
      createdBy: user,
      updatedBy: user,
      companyId: companyId,
    });

    await Ledger.create({
      accountId: accountId,
      companyId: companyId,
      purchaseInvId: purchseData.id,
      date: invoicedate
    })
    const addToItem = items.map((item) => ({
      purchasebillId: purchseData.id,
      ...item,
    }));

    await purchaseInvoiceItem.bulkCreate(addToItem);

    for(const item of items){
        const productId = item.productId;
        const qty = item.qty;
        const itemStock = await Stock.findOne({
          where: {productId}
        })
      if(itemStock){
        await itemStock.increment('qty',{by: qty})
      }
    }

    const data = await purchaseInvoice.findOne({
      where: { id: purchseData.id, companyId: companyId },
      include: [{ model: purchaseInvoiceItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Purchase Invoice Created Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_purchaseInvoice = async (req, res) => {
  try {
    const user = req.user.userId;
    const { id } = req.params;
    const companyId = req.user.companyId;
    const {
      accountId,
      duedate,
      invoicedate,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
      supplyInvoiceNo,
      voucherno
    } = req.body;

    const existingPurchase = await purchaseInvoice.findOne({
      where: { id: id, companyId: companyId },
    });
    if (!existingPurchase) {
      return res.status(404).json({
        status: "false",
        message: "Purchase Invoice Not Found",
      });
    }
    const numberOf = await purchaseInvoice.findOne({
      where: {
        voucherno: voucherno,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });
    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Voucher Number Already Exists" });
    }

    const supplyInvoiceNoExist = await purchaseInvoice.findOne({
      where: {
        supplyInvoiceNo: supplyInvoiceNo,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });
    if (supplyInvoiceNoExist) {
      return res
          .status(400)
          .json({ status: "false", message: "Supply Number Already Exists" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
    }
    for (const item of items) {
      if (!item.productId || item.productId === "") {
        return res
          .status(400)
          .json({ status: "false", message: "Required filed :Product" });
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
      const productData = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Item Not Found" });
      }
    }
    await purchaseInvoice.update(
      {
        accountId,
        duedate,
        invoicedate,
        totalIgst,
        totalSgst,
        totalMrp,
        totalQty,
        mainTotal,
        supplyInvoiceNo,
        voucherno,
        companyId: companyId,
        createdBy: existingPurchase.createdBy,
        updatedBy: user,
      },
      { where: { id } }
    );

    await Ledger.update({
      accountId: accountId,
      purchaseInvId: id,
      date: invoicedate
    }, {
      where: {
        purchaseInvId: id,
        companyId: companyId,
      }
    })
    const existingItems = await purchaseInvoiceItem.findAll({
      where: { purchasebillId: id },
    });

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await purchaseInvoiceItem.update(
          {
            qty: item.qty,
            rate: item.rate,
            mrp: item.mrp,
            unit: item.unit,
            productId: item.productId
          },
          { where: { id: existingItem.id } }
        );
      } else {
        await purchaseInvoiceItem.create({
          purchasebillId: id,
          productId: item.productId,
          qty: item.qty,
          rate: item.rate,
          mrp: item.mrp,
          unit: item.unit
        });
      }
      const productId = item.productId;
      const previousQty = existingItem?.qty ?? 0;
      const newQty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock){
        await itemStock.decrement('qty',{by: previousQty})
        await itemStock.increment('qty',{by: newQty})
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock) await itemStock.decrement('qty',{by: qty})
      await purchaseInvoiceItem.destroy({ where: { id: item.id } });
    }
    const data = await purchaseInvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: purchaseInvoiceItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Purchase Invoice Updated Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_purchaseInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const billId = await purchaseInvoice.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!billId) {
      return res.status(404).json({
        status: "false",
        message: "Purchase Invoice Not Found",
      });
    }
    const findItems = await purchaseInvoiceItem.findAll({
      where: { purchasebillId: billId.id },
    })
    for(const item of findItems){
      const productname = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if(!productname){
        return res.status(404).json({
          status: "false",
          message: `Product Not Found`,
        })
      }
    }
    // }
    for(const item of findItems){
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock) await itemStock.decrement('qty',{by: qty})
    }
    await purchaseInvoiceItem.destroy({ where: { purchasebillId: id } })
    await billId.destroy()
    return res.status(200).json({
      status: "true",
      message: "Purchase Invoice Successfully delete"
    })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_purchaseInvoice = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const data = await purchaseInvoice.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: purchaseInvoiceItem,
          as: "items",
          include: [{ model: product, as: "purchseProduct" }],
        },
        { model: Account, as: "accountPurchaseInv" },
        { model: User, as: "salesCreateUser", attributes: ["username"] },
        { model: User, as: "salesUpdateUser", attributes: ["username"] },
      ],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "All Purchase Invoice show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Invoice Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_purchaseInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await purchaseInvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: purchaseInvoiceItem,
          as: "items",
          include: [{ model: product, as: "purchseProduct" }],
        },
        { model: Account, as: "accountPurchaseInv", include: {model: AccountDetail, as: "accountDetail"} },
      ],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Purchase Invoice show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Invoice Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

/*=============================================================================================================
                                           Type C API
 ============================================================================================================ */

exports.C_create_purchaseCash = async (req, res) => {
  try {
    const user = req.user.userId;
    const { accountId,purchaseNo, date, totalMrp, items } = req.body;
    const companyId = req.user.companyId;


    const purchaseNoExist = await C_purchaseCash.findOne({
      where: {
        purchaseNo: purchaseNo,
        companyId: companyId
      }
    })
    if (purchaseNoExist) {
      return res
          .status(400)
          .json({ status: "false", message: "Purchase Number Already Exists" });
    }

    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field Of Items" });
    }

    for (const item of items) {
      if (!item.productId || item.productId === "") {
        return res
          .status(400)
          .json({ status: "false", message: "Required filed :Product" });
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
      const productData = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Item Not Found" });
      }
    }
    const purchseData = await C_purchaseCash.create({
      accountId,
      date,
      totalMrp,
      purchaseNo: purchaseNo,
      companyId: companyId,
      createdBy: user,
      updatedBy: user,
    });

    // await C_vendorLedger.create({
    //   vendorId,
    //   companyId: req.user.companyId,
    //   debitId: purchseData.id,
    //   date,
    // });

    const addToItem = items.map((item) => ({
      PurchaseId: purchseData.id,
      ...item,
    }));

    await C_purchaseCashItem.bulkCreate(addToItem);
    for(const item of items){
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock){
        await itemStock.increment('qty',{by: qty})
      }
    }

    const data = await C_purchaseCash.findOne({
      where: { id: purchseData.id },
      include: [{ model: C_purchaseCashItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Purchase Cash Created Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_update_purchaseCash = async (req, res) => {
  try {
    const user = req.user.userId
    const companyId = req.user.companyId;

    const { id } = req.params;

    const { accountId,purchaseNo, date, totalMrp, items } = req.body;

    const existingPurchase = await C_purchaseCash.findOne({
      where: { id: id, companyId: companyId },
    });
    if (!existingPurchase) {
      return res.status(404).json({
        status: "false",
        message: "Purchase Invoice Not Found",
      });
    }

    const purchaseNoExist = await C_purchaseCash.findOne({
      where: {
        purchaseNo: purchaseNo,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      }
    })
    if (purchaseNoExist) {
      return res
          .status(400)
          .json({ status: "false", message: "Purchase Number Already Exists" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
    }
    for (const item of items) {
      if (!item.productId || item.productId === "") {
        return res
          .status(400)
          .json({ status: "false", message: "Required filed :Product" });
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
      const productData = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Item Not Found" });
      }
    }
    await C_purchaseCash.update(
      {
        accountId,
        date,
        totalMrp,
        purchaseNo: purchaseNo,
        companyId: companyId,
        createdBy: existingPurchase.createdBy,
        updatedBy: user,
      },
      { where: { id } }
    );
    const existingItems = await C_purchaseCashItem.findAll({
      where: { PurchaseId: id },
    });
    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);
      if (existingItem) {
        await C_purchaseCashItem.update(
          {
            qty: item.qty,
            rate: item.rate,
            mrp: item.mrp,
            unit: item.unit,
            productId: item.productId
          },
          { where: { id: existingItem.id } }
        );
      } else {
        await C_purchaseCashItem.create({
          PurchaseId: id,
          productId: item.productId,
          qty: item.qty,
          rate: item.rate,
          mrp: item.mrp,
          unit: item.unit
        });
      }
      const productId = item.productId;
      const previousQty = existingItem?.qty ?? 0;
      const newQty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock){
        await itemStock.decrement('qty',{by: previousQty})
        await itemStock.increment('qty',{by: newQty})
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock){
      await itemStock.decrement('qty',{by: qty})
      }
      await C_purchaseCashItem.destroy({ where: { id: item.id } });
    }
    // await C_vendorLedger.update(
    //   {
    //     companyId: req.user.companyId,
    //     vendorId,
    //     date,
    //   },
    //   { where: { debitId:id } }
    // );

    const data = await C_purchaseCash.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: C_purchaseCashItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Purchase Cash Updated Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_delete_purchaseCash = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const billId = await C_purchaseCash.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!billId) {
      return res.status(404).json({
        status: "false",
        message: "Purchase Invoice Not Found",
      });
    }

    const findItems = await C_purchaseCashItem.findAll({
      where: { PurchaseId: billId.id },
    })

    for(const item of findItems){
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock){
        await itemStock.decrement('qty',{by: qty})
      }
    }

    await billId.destroy()
      return res
        .status(200)
        .json({ status: "true", message: "Purchase Cash Delete Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_get_all_purchaseCash = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const data = await C_purchaseCash.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: C_purchaseCashItem,
          as: "items",
          include: [{ model: product, as: "ProductPurchase" }],
        },
        { model: Account, as: "accountPurchaseCash" },
        { model: User, as: "purchaseCreateUser", attributes: ["username"] },
        { model: User, as: "purchaseUpdateUser", attributes: ["username"] },
      ],
    });

      return res.status(200).json({
        status: "true",
        message: "All Purchase Cash show Successfully",
        data: data,
      });

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_view_purchaseCash = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_purchaseCash.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_purchaseCashItem,
          as: "items",
          include: [{ model: product, as: "ProductPurchase" }],
        },
        { model: Account, as: "accountPurchaseCash" },
      ],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Purchase Cash show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Cash Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_view_purchaseCash_pdf = async (req, res)=>{
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_purchaseCash.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_purchaseCashItem,
          as: "items",
          include: [{ model: product, as: "ProductPurchase" }],
        },
        { model: Account, as: "accountPurchaseCash" },
      ],
    });
    if (!data) {
      return res
          .status(404)
          .json({ status: "false", message: "Purchase Cash Not Found" });
    }
    const html = await renderFile(path.join(__dirname, "../views/purchaseCash.ejs"),{data})
    htmlToPdf.generatePdf({content: html},{printBackground: true, format: 'A4'}).then((pdf) => {
      const base64String = pdf.toString("base64");
      return res.status(200).json({
        status: "Success",
        message: "pdf create successFully",
        data: base64String,
      });
    })
  }catch (e) {
    console.error(e);
    return res.status(500).json({status: "false", message: "Internal Server Error."})
  }
}