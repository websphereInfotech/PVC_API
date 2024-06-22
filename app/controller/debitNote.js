const { Sequelize } = require("sequelize");
const customer = require("../models/customer");
const debitNote = require("../models/debitNote");
const debitNoteItem = require("../models/debitNoteItem");
const product = require("../models/product");
const purchaseInvoice = require("../models/purchaseInvoice");
const User = require("../models/user");
const {PRODUCT_TYPE} = require("../constant/constant");

exports.create_debitNote = async (req, res) => {
  try {
    const {
      customerId,
      debitnoteno,
      debitdate,
      invoicedate,
      invoiceId,
      totalQty,
      items,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
    } = req.body;
    const existingCredit = await debitNote.findOne({
      where: { debitnoteno: debitnoteno, companyId: req.user.companyId },
    });

    if (existingCredit) {
      return res
        .status(400)
        .json({ status: "false", message: "Debit Note Number Already Exists" });
    }

    if (!invoiceId || invoiceId === "" || invoiceId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Invoice Number" });
    }
    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Customer" });
    }
    const invoiceData = await purchaseInvoice.findOne({
      where: { id: invoiceId, companyId: req.user.companyId },
    });
    if (!invoiceData) {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Invoice Not Found" });
    }
    const customerData = await customer.findOne({
      where: { id: customerId, companyId: req.user.companyId },
    });
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
      const productname = await product.findOne({
        where: { id: item.productId, companyId: req.user.companyId, productType: PRODUCT_TYPE.PRODUCT },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    const debitNoteData = await debitNote.create({
      customerId,
      debitnoteno,
      debitdate,
      invoicedate,
      invoiceId,
      totalQty,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      companyId: req.user.companyId,
      createdBy: req.user.userId,
      updatedBy: req.user.userId,
    });

    const addToProduct = items.map((item) => ({
      DebitId: debitNoteData.id,
      ...item,
    }));

    await debitNoteItem.bulkCreate(addToProduct);

    const data = await debitNote.findOne({
      where: { id: debitNoteData.id, companyId: req.user.companyId },
      include: [{ model: debitNoteItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Debit Note Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_debitNote = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      customerId,
      debitnoteno,
      debitdate,
      invoicedate,
      invoiceId,
      totalQty,
      items,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
    } = req.body;

    const existingDebit = await debitNote.findOne({
      where: { id: id, companyId: req.user.companyId },
    });

    if (!existingDebit) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
    const existingDebitNo = await debitNote.findOne({
      where: {
        debitnoteno: debitnoteno,
        companyId: req.user.companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });

    if (existingDebitNo) {
      return res
        .status(400)
        .json({ status: "false", message: "Debit Note Number Already Exists" });
    }
    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Customer" });
    }
    if (!invoiceId || invoiceId === "" || invoiceId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Invoice Number" });
    }
    const customerData = await customer.findOne({
      where: { id: customerId, companyId: req.user.companyId },
    });
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
      const productname = await product.findOne({
        where: { id: item.productId, companyId: req.user.companyId, productType: PRODUCT_TYPE.PRODUCT },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    await debitNote.update(
      {
        customerId,
        debitnoteno,
        invoiceId,
        invoicedate,
        debitdate,
        totalQty,
        totalIgst,
        totalSgst,
        totalMrp,
        mainTotal,
        companyId: req.user.companyId,
        createdBy: existingDebit.id,
        updatedBy: req.user.userId,
      },
      { where: { id } }
    );

    const existingItems = await debitNoteItem.findAll({
      where: { DebitId: id },
    });

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await debitNoteItem.update(
          {
            qty: item.qty,
            rate: item.rate,
            mrp: item.mrp,
          },
          { where: { id: existingItem.id } }
        );
      } else {
        await debitNoteItem.create({
          DebitId: id,
          productId: item.productId,
          qty: item.qty,
          rate: item.rate,
          mrp: item.mrp,
        });
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      await debitNoteItem.destroy({ where: { id: item.id } });
    }
    const data = await debitNote.findOne({
      where: { id: id, companyId: req.user.companyId },
      include: [{ model: debitNoteItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Debit Note Update Successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "false",
      message: "Internal Server Error",
    });
  }
};
exports.get_all_debitNote = async (req, res) => {
  try {
    const data = await debitNote.findAll({
      where: { companyId: req.user.companyId },
      include: [
        {
          model: debitNoteItem,
          as: "items",
          include: [{ model: product, as: "DebitProduct" }],
        },
        { model: customer, as: "DebitCustomer" },
        { model: User, as: "debitCreateUser", attributes: ["username"] },
        { model: User, as: "debitUpdateUser", attributes: ["username"] },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Debit Note Data Fetch Successfully",
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_single_debitNote = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await debitNote.findOne({
      where: { id: id, companyId: req.user.companyId },
      include: [
        {
          model: debitNoteItem,
          as: "items",
          include: [{ model: product, as: "DebitProduct" }],
        },
        { model: customer, as: "DebitCustomer" },
        { model: purchaseInvoice, as: "purchaseData" },
      ],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Debit Note Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_debitNote = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await debitNote.destroy({
      where: { id: id, companyId: req.user.companyId },
    });
    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Debit Note Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
