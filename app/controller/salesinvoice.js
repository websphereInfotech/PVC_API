const { Sequelize } = require("sequelize");
const C_customer = require("../models/C_customer");
const C_customerLedger = require("../models/C_customerLedger");
const C_product = require("../models/C_product");
const C_salesinvoice = require("../models/C_salesinvoice");
const C_salesinvoiceItem = require("../models/C_salesinvoiceItem");
const ProFormaInvoice = require("../models/ProFormaInvoice");
const customer = require("../models/customer");
const customerLedger = require("../models/customerLedger");
const product = require("../models/product");
const salesInvoice = require("../models/salesInvoice");
const salesInvoiceItem = require("../models/salesInvoiceitem");
const User = require("../models/user");

/*=============================================================================================================
                                          Without Typc C API
 ============================================================================================================ */
exports.create_salesInvoice = async (req, res) => {
  try {
    const userID = req.user.userId;
    const {
      customerId,
      invoiceno,
      invoicedate,
      proFormaId,
      dispatchThrough,
      dispatchno,
      deliverydate,
      destination,
      LL_RR_no,
      terms,
      motorVehicleNo,
      termsOfDelivery,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
    } = req.body;

    const proformaData = await ProFormaInvoice.findOne({
      where: { id: proFormaId, companyId: req.user.companyId },
    });
    if (!proformaData) {
      return res
        .status(404)
        .json({ status: "false", message: "ProFrorma Not Found" });
    }
    if (proFormaId === "" || proFormaId === undefined || proFormaId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field: ProForma Invoice" });
    }
    // for (const item of items) {
    //   const mrp = item.qty * item.rate;
    //   if (item.mrp !== mrp) {
    //     return res.status(400).json({
    //       status: "false",
    //       message: `MRP for item ${item.productId} does not match the calculated value`,
    //     });
    //   }
    // }
    // const totalMrpFromItems = items.reduce((total, item) => {
    //   return total + (item.qty * item.rate);
    // }, 0);

    // if (totalMrp !== totalMrpFromItems) {
    //   return res.status(400).json({
    //     status: "false",
    //     message: "Total MRP Not Match",
    //   });
    // }
    const numberOf = await salesInvoice.findOne({
      where: { invoiceno: invoiceno, companyId: req.user.companyId },
    });

    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Invoice Number Already Exists" });
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
        .json({ status: "false", message: "Required Field Of Items" });
    }
    for (const item of items) {
      const productname = await product.findOne({
        where: {
          id: item.productId,
          companyId: req.user.companyId,
        },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }

    const data = await salesInvoice.create({
      customerId,
      dispatchThrough,
      dispatchno,
      destination,
      deliverydate,
      LL_RR_no,
      terms,
      motorVehicleNo,
      invoiceno,
      invoicedate,
      termsOfDelivery,
      proFormaId,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      createdBy: userID,
      updatedBy: userID,
      companyId: req.user.companyId,
    });
    await customerLedger.create({
      customerId,
      companyId: req.user.companyId,
      creditId: data.id,
      date: invoicedate,
    });
    const addToItem = items.map((item) => ({
      salesInvoiceId: data.id,
      ...item,
    }));

    await salesInvoiceItem.bulkCreate(addToItem);

    const salesInvoiceData = await salesInvoice.findOne({
      where: { id: data.id, companyId: req.user.companyId },
      include: [{ model: salesInvoiceItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Sales Invoice Create Successfully",
      data: salesInvoiceData,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_salesInvoice = async (req, res) => {
  try {
    const data = await salesInvoice.findAll({
      where: { companyId: req.user.companyId },
      include: [
        {
          model: salesInvoiceItem,
          as: "items",
          include: [{ model: product, as: "InvoiceProduct" }],
        },
        { model: customer, as: "InvioceCustomer" },
        { model: User, as: "createUser", attributes: ["username"] },
        { model: User, as: "updateUser", attributes: ["username"] },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Sales Invoice Data Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_salesInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await salesInvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
      include: [
        {
          model: salesInvoiceItem,
          as: "items",
          include: [{ model: product, as: "InvoiceProduct" }],
        },
        { model: customer, as: "InvioceCustomer" },
        { model: ProFormaInvoice, as: "proFormaItem" },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    return res.status(200).json({
      status: "ture",
      message: "Sales Invoice Data Fetch SUccessfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_salesInvoice = async (req, res) => {
  try {
    const userID = req.user.userId;

    const { id } = req.params;
    const {
      customerId,
      dispatchThrough,
      dispatchno,
      destination,
      deliverydate,
      LL_RR_no,
      motorVehicleNo,
      invoiceno,
      terms,
      invoicedate,
      termsOfDelivery,
      proFormaId,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
    } = req.body;

    const salesId = await salesInvoice.findOne({
      where: { id, companyId: req.user.companyId },
    });

    if (!salesId) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    const numberOf = await salesInvoice.findOne({
      where: {
        invoiceno: invoiceno,
        companyId: req.user.companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });

    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Invoice Number Already Exists" });
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
    const proFormaItem = await ProFormaInvoice.findOne({
      where: { id: proFormaId, companyId: req.user.companyId },
    });
    if (!proFormaItem) {
      return res
        .status(404)
        .json({ status: "false", message: "proForma Invoice Not Found" });
    }
    for (const item of items) {
      if (!item.productId || item.productId === "") {
        return res
          .status(400)
          .json({ status: "false", message: "Required filed :Product" });
      }
      const productname = await product.findOne({
        where: { id: item.productId, companyId: req.user.companyId },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    await salesInvoice.update(
      {
        customerId,
        dispatchThrough,
        dispatchno,
        destination,
        deliverydate,
        LL_RR_no,
        terms,
        motorVehicleNo,
        invoiceno,
        invoicedate,
        termsOfDelivery,
        proFormaId,
        totalIgst,
        totalSgst,
        totalMrp,
        mainTotal,
        totalQty,
        companyId: req.user.companyId,
        createdBy: salesId.createdBy,
        updatedBy: userID,
      },
      {
        where: { id: id },
      }
    );

    await customerLedger.update(
      {
        customerId,
        companyId: req.user.companyId,
        date: invoicedate,
      },
      { where: { creditId: id } }
    );
    const existingItem = await salesInvoiceItem.findAll({
      where: { salesInvoiceId: id },
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
      const existingItems = existingItem.find(
        (ei) => ei.productId === item.productId && ei.rate === item.rate
      );

      if (existingItems) {
        (existingItems.qty = item.qty), await existingItems.save();
      } else {
        await salesInvoiceItem.create({
          salesInvoiceId: id,
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
    const itemsToDelete = existingItem.filter(
      (item) =>
        !updatedProducts.some(
          (updatedItem) =>
            updatedItem.productId === item.productId &&
            updatedItem.rate === item.rate
        )
    );

    for (const item of itemsToDelete) {
      await item.destroy();
    }

    const data = await salesInvoice.findOne({
      where: { id, companyId: req.user.companyId },
      include: [{ model: salesInvoiceItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Sales Invoice Update Successfuly",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_salesInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await salesInvoice.destroy({
      where: { id: id, companyId: req.user.companyId },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Sales Invoice Deleted Successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
// exports.pdf_file = async (req,res) => {
//   try {
//       const {id} = req.params;

//       const data = await salesInvoice.findByPk(id);
//       console.log("data",data);
//       return res.status(200).json({ status:'true', message:'message'})
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ status:'false', message:'Internal Server Error'});
//   }
// }

/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */

exports.C_create_salesinvoice = async (req, res) => {
  try {
    const user = req.user.userId;
    const { customerId, date, totalMrp, items } = req.body;

    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Customer" });
    }
    const customerData = await C_customer.findOne({
      where: { id: customerId, companyId: req.user.companyId },
    });

    if (!customerData) {
      return res
        .status(404)
        .json({ status: "false", message: "Cusomer Not Found" });
    }
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field of items" });
    }
    for (const item of items) {
      const productData = await C_product.findOne({
        where: { id: item.productId, companyId: req.user.companyId },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    const salesInvoiceData = await C_salesinvoice.create({
      customerId,
      date,
      totalMrp,
      companyId: req.user.companyId,
      createdBy: user,
      updatedBy: user,
    });

    await C_customerLedger.create({
      customerId,
      companyId: req.user.companyId,
      creditId: salesInvoiceData.id,
      date,
    });

    const addToProduct = await items.map((item) => ({
      invoiceId: salesInvoiceData.id,
      ...item,
    }));
    await C_salesinvoiceItem.bulkCreate(addToProduct);

    const data = await C_salesinvoice.findOne({
      where: { id: salesInvoiceData.id, companyId: req.user.companyId },
      include: [{ model: C_salesinvoiceItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Sales Invoice Created Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_update_salesinvoice = async (req, res) => {
  try {
    const user = req.user.userId;

    const { id } = req.params;
    const { customerId, date, totalMrp, items } = req.body;

    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Customer" });
    }
    const existingInvoice = await C_salesinvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
    });
    if (!existingInvoice) {
      return res.status(404).json({
        status: "false",
        message: "Sales Invoice Not Found",
      });
    }
    const customerData = await C_customer.findOne({
      where: { id: customerId, companyId: req.user.companyId },
    });

    if (!customerData) {
      return res
        .status(404)
        .json({ status: "false", message: "Cusomer Not Found" });
    }
    for (const item of items) {
      const productData = await C_product.findOne({
        where: { id: item.productId, companyId: req.user.companyId },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    await C_salesinvoice.update(
      {
        customerId,
        date,
        totalMrp,
        companyId: req.user.companyId,
        createdBy: existingInvoice.createdBy,
        updatedBy: user,
      },
      { where: { id } }
    );

    const existingItems = await C_salesinvoiceItem.findAll({
      where: { invoiceId: id },
    });

    const creditId = existingInvoice.id;

    await C_customerLedger.update(
      {
        companyId: req.user.companyId,
        customerId,
        date,
      },
      { where: { creditId } }
    );
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
        await C_salesinvoiceItem.create({
          invoiceId: id,
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
          (updatedItem) =>
            updatedItem.productId === item.productId &&
            updatedItem.rate === item.rate
        )
    );

    for (const item of itemsToDelete) {
      await item.destroy();
    }
    const updatedInvoice = await C_salesinvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
      include: [{ model: C_salesinvoiceItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Sales Invoice Updated Successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_get_all_salesInvoice = async (req, res) => {
  try {
    const data = await C_salesinvoice.findAll({
      where: { companyId: req.user.companyId },
      include: [
        {
          model: C_salesinvoiceItem,
          as: "items",
          include: [{ model: C_product, as: "CashProduct" }],
        },
        { model: C_customer, as: "CashCustomer" },
        { model: User, as: "salesInvoiceCreate", attributes: ["username"] },
        { model: User, as: "salesInvoiceUpdate", attributes: ["username"] },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Sales Invoice Data Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_view_salesInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await C_salesinvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
      include: [
        {
          model: C_salesinvoiceItem,
          as: "items",
          include: [{ model: C_product, as: "CashProduct" }],
        },
        { model: C_customer, as: "CashCustomer" },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    return res.status(200).json({
      status: "ture",
      message: "Sales Invoice Data Fetch SUccessfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_delete_salesInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await C_salesinvoice.destroy({
      where: { id: id, companyId: req.user.companyId },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Sales Invoice Deleted Successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
