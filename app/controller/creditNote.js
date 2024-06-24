const { Sequelize } = require("sequelize");
const creditNote = require("../models/creditNote");
const creditNoteItem = require("../models/creditNoteItem");
const customer = require("../models/customer");
const product = require("../models/product");
const User = require("../models/user");
const {PRODUCT_TYPE} = require("../constant/constant");

exports.create_creditNote = async (req, res) => {
  try {
    const {
      customerId,
      creditnoteNo,
      creditdate,
      org_invoicedate,
      org_invoiceno,
      LL_RR_no,
      dispatchThrough,
      motorVehicleNo,
      destination,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
    } = req.body;
    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Customer" });
    }
    // for (const item of items) {
    //     const mrp = item.qty * item.rate;
    //     if (item.mrp !== mrp) {
    //       return res.status(400).json({
    //         status: "false",
    //         message: `MRP for item ${item.productId} does not match the calculated value`,
    //       });
    //     }
    //   }
    //   const totalMrpFromItems = items.reduce((total, item) => {
    //     return total + (item.qty * item.rate);
    //   }, 0);

    //   if (totalMrp !== totalMrpFromItems) {
    //     return res.status(400).json({
    //       status: "false",
    //       message: "Total MRP Not Match",
    //     });
    //   }
    const numberOf = await creditNote.findOne({
      where: { creditnoteNo: creditnoteNo, companyId: req.user.companyId },
    });
    if (numberOf) {
      return res.status(400).json({
        status: "false",
        message: "Credit Note Number Already Exists",
      });
    }

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
    }
    const customerData = await customer.findOne({
      where: { id: customerId, companyId: req.user.companyId },
    });
    if (!customerData) {
      return res
        .status(404)
        .json({ status: "false", message: "Customer Not Found" });
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
          .json({ status: "false", message: "Qty And Rate Value Invalid" });
      }
      if (item.rate === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Rate Value Invalid" });
      }
      const productname = await product.findOne({
        where: { id: item.productId, companyId: req.user.companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    const creditData = await creditNote.create({
      customerId,
      creditnoteNo,
      creditdate,
      org_invoiceno,
      org_invoicedate,
      LL_RR_no,
      dispatchThrough,
      destination,
      motorVehicleNo,
      totalIgst,
      totalSgst,
      totalMrp,
      totalQty,
      mainTotal,
      companyId: req.user.companyId,
      createdBy: req.user.userId,
      updatedBy: req.user.userId,
    });

    const addToProduct = items.map((item) => ({
      creditId: creditData.id,
      ...item,
    }));
    await creditNoteItem.bulkCreate(addToProduct);

    const data = await creditNote.findOne({
      where: { id: creditData.id, companyId: req.user.companyId },
      include: [{ model: creditNoteItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Credit Note Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_creditNote = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      customerId,
      creditnoteNo,
      creditdate,
      org_invoicedate,
      org_invoiceno,
      LL_RR_no,
      dispatchThrough,
      motorVehicleNo,
      destination,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
    } = req.body;

    const existingCredit = await creditNote.findOne({
      where: { id: id, companyId: req.user.companyId },
    });

    if (!existingCredit) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }
    const numberOf = await creditNote.findOne({
      where: {
        creditnoteNo: creditnoteNo,
        companyId: req.user.companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });
    if (numberOf) {
      return res.status(400).json({
        status: "false",
        message: "Credit Note Number Already Exists",
      });
    }

    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Customer" });
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
        where: { id: item.productId, companyId: req.user.companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    await creditNote.update(
      {
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
        mainTotal,
        companyId: req.user.companyId,
        createdBy: existingCredit.createdBy,
        updatedBy: req.user.userId,
      },
      { where: { id } }
    );

    const existingItems = await creditNoteItem.findAll({
      where: { creditId: id },
    });

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await creditNoteItem.update(
          {
            qty: item.qty,
            rate: item.rate,
            mrp: item.mrp,
          },
          { where: { id: existingItem.id } }
        );
      } else {
        await creditNoteItem.create({
          creditId: id,
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
      await creditNoteItem.destroy({ where: { id: item.id } });
    }
    const data = await creditNote.findOne({
      where: { id: id, companyId: req.user.companyId },
      include: [{ model: creditNoteItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Credit Note Update Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_creditNote = async (req, res) => {
  try {
    const data = await creditNote.findAll({
      where: { companyId: req.user.companyId },
      include: [
        {
          model: creditNoteItem,
          as: "items",
          include: [{ model: product, as: "CreditProduct" }],
        },
        { model: customer, as: "CreditCustomer" },
        { model: User, as: "creditCreateUser", attributes: ["username"] },
        { model: User, as: "creditUpdateUser", attributes: ["username"] },
      ],
    });
    if (data) {
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
};
exports.view_single_creditNote = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await creditNote.findOne({
      where: { id: id, companyId: req.user.companyId },
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
        .json({ status: "false", message: "Credit Note Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Credit Note Data fetch successfully",
        data: data,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};

exports.delete_creditNote = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await creditNote.destroy({
      where: { id: id, companyId: req.user.companyId },
    });

    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Credit Note Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
