const customer = require("../models/customer");
const debitNote = require("../models/debitNote");
const debitNoteItem = require("../models/debitNoteItem");
const product = require("../models/product");

exports.create_debitNote = async (req, res) => {
  try {
    const { customerId, debitnoteno, debitdate, totalQty, items, totalIgst, totalSgst, totalMrp, mainTotal } = req.body;
    const existingCredit = await debitNote.findOne({
      where: { debitnoteno: debitnoteno },
    });
    for (const item of items) {
      const mrp = item.qty * item.rate;
      if (item.mrp !== mrp) {
        return res.status(400).json({
          status: "false",
          message: `MRP for item ${item.productId} does not match the calculated value`,
        });
      }
    }
    const totalMrpFromItems = items.reduce((total, item) => {
      return total + (item.qty * item.rate);
    }, 0);

    if (totalMrp !== totalMrpFromItems) {
      return res.status(400).json({
        status: "false",
        message: "Total MRP Not Match",
      });
    }
    if (existingCredit) {
      return res
        .status(400)
        .json({ status: "false", message: "Debit Note Number Already Exists" });
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
    const debitNoteData = await debitNote.create({
      customerId,
      debitnoteno,
      debitdate,
      totalQty,
      totalIgst, totalSgst, totalMrp, mainTotal
    });
    const addToProduct = items.map((item) => ({
      DebitId: debitNoteData.id,
      ...item,
    }));

    await debitNoteItem.bulkCreate(addToProduct);

    const data = await debitNote.findOne({
      where: { id: debitNoteData.id },
      include: [{ model: debitNoteItem, as: "items" }],
    });

    return res
      .status(200)
      .json({
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

    const { customerId, debitnoteno, debitdate, totalQty, items, totalIgst, totalSgst, totalMrp, mainTotal } = req.body;

    const existingDebit = await debitNote.findByPk(id);

    if (!existingDebit) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
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
    await debitNote.update(
      {
        customerId,
        debitnoteno,
        debitdate,
        totalQty,
        totalIgst, totalSgst, totalMrp, mainTotal
      },
      { where: { id } }
    );

    const existingItems = await debitNoteItem.findAll({
      where: { DebitId: id },
    });

    const mergedItems = [];

    items.forEach((item) => {
      let existingItem = mergedItems.find(
        (i) => i.productId === item.productId && i.rate === item.rate
      );

      if (existingItem) {
        existingItem.qty += item.qty;
      } else {
        mergedItems.push(item);
      }
    });

    for (const item of mergedItems) {
      const existingItem = existingItems.find(
        (ei) => ei.productId === item.productId && ei.rate === item.rate
      );
      if (existingItem) {
        existingItem.qty = item.qty;
        await existingItem.save();
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

    const updatedProducts = items.map((item) => ({
      productId: item.productId,
      rate: item.rate,
    }));

    const itemsToDelete = existingItems.filter(
      (item) =>
        !updatedProducts.some(
          (updetedItem) =>
            updetedItem.productId === item.productId &&
            updetedItem.rate === item.rate
        )
    );

    for (const item of itemsToDelete) {
      await item.destroy();
    }

    const data = await debitNote.findOne({
      where: { id },
      include: [{ model: debitNoteItem, as: "items" }],
    });

    return res
      .status(200)
      .json({
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
      include: [
        {
          model: debitNoteItem,
          as: "items",
          include: [{ model: product, as: "DebitProduct" }],
        },
        { model: customer, as: "DebitCustomer" },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    } else {
      return res
        .status(200)
        .json({
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
      where: { id },
      include: [
        {
          model: debitNoteItem,
          as: "items",
          include: [{ model: product, as: "DebitProduct" }],
        },
        { model: customer, as: "DebitCustomer" },
      ],
    });
    if (data) {
      return res
        .status(200)
        .json({
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

    const data = await debitNote.destroy({ where: { id } });
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
