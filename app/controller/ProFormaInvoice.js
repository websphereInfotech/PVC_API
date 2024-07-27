const { Sequelize } = require("sequelize");
const ProFormaInvoice = require("../models/ProFormaInvoice");
const ProFormaInvoiceItem = require("../models/ProFormaInvoiceItem");
const Account = require("../models/Account");
const product = require("../models/product");
const User = require("../models/user");

exports.create_ProFormaInvoice = async (req, res) => {
  try {
    const user = req.user.userId;
    const companyId = req.user.companyId
    const {
      ProFormaInvoice_no,
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
        ProFormaInvoice_no: ProFormaInvoice_no,
        companyId: companyId,
      },
    });
    if (numberOf) {
      return res.status(400).json({
        status: "false",
        message: "ProForma Invoice Number Already Exists",
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
    const createdInvoice = await ProFormaInvoice.create({
      ProFormaInvoice_no,
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
      InvoiceId: createdInvoice.id,
      ...item,
    }));
    await ProFormaInvoiceItem.bulkCreate(addToProduct);

    const quotationWithItems = await ProFormaInvoice.findOne({
      where: { id: createdInvoice.id },
      include: [{ model: ProFormaInvoiceItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "ProForma Invoice created successfully",
      data: quotationWithItems,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};

exports.get_all_ProFormaInvoice = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const allInvoice = await ProFormaInvoice.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: ProFormaInvoiceItem,
          as: "items",
          include: [{ model: product, as: "product" }],
        },
        { model: Account, as: "accountProForma" },
        { model: User, as: "proCreateUser", attributes: ["username"] },
        { model: User, as: "proUpdateUser", attributes: ["username"] },
      ],
    });

    if (!allInvoice) {
      return res
        .status(404)
        .json({ status: "false", message: "ProForma Invoice Data not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "ProForma Invoice data fetch successfully",
      data: allInvoice,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};
exports.view_ProFormaInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId

    const data = await ProFormaInvoice.findOne({
      where: { id, companyId: companyId },
      include: [
        {
          model: ProFormaInvoiceItem,
          as: "items",
          include: [{ model: product, as: "product" }],
        },
        { model: Account, as: "accountProForma" },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "ProForma Invoice not found" });
    }
    return res.status(200).json({
      status: "true",
      message: "ProForma Invoice data fetch successfully",
      data: data,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};
exports.update_ProFormaInvoice = async (req, res) => {
  try {
    const user = req.user.userId;
    const { id } = req.params;
    const companyId = req.user.companyId;
    const {
      ProFormaInvoice_no,
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

    const existingInvoice = await ProFormaInvoice.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!existingInvoice) {
      return res.status(404).json({
        status: false,
        message: "ProForma Invoice Not Found",
      });
    }

    const numberOf = await ProFormaInvoice.findOne({
      where: {
        ProFormaInvoice_no: ProFormaInvoice_no,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });

    if (numberOf) {
      return res.status(400).json({
        status: false,
        message: "ProForma Invoice Number Already Exists",
      });
    }

    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId },
    });

    if (!accountExist) {
      return res.status(404).json({ status: false, message: "Account Not Found" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ status: false, message: "Required Field of items" });
    }

    const existingItems = await ProFormaInvoiceItem.findAll({
      where: { InvoiceId: id },
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

    await ProFormaInvoice.update(
      {
        ProFormaInvoice_no,
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
        await ProFormaInvoiceItem.update(
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
        await ProFormaInvoiceItem.create({
          InvoiceId: id,
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
      await ProFormaInvoiceItem.destroy({ where: { id: item.id } });
    }
    const updatedInvoice = await ProFormaInvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: ProFormaInvoiceItem, as: "items" }],
    });

    return res.status(200).json({
      status: true,
      message: "ProForma Invoice Updated Successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.delete_ProFormaInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId

    const data = await ProFormaInvoice.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!data) {
      return res
        .status(400)
        .json({ status: "false", message: "ProForma Invoice Item Not Found" });
    }

    await data.destroy()

    return res.status(200).json({
      status: "true",
      message: "ProForma Invoice Delete Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
