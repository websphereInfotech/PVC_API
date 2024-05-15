const ProFormaInvoice = require("../models/ProFormaInvoice");
const customer = require("../models/customer");
const product = require("../models/product");
const salesInvoice = require("../models/salesInvoice");
const salesInvoiceItem = require("../models/salesInvoiceitem");

exports.create_salesInvoice = async (req, res) => {
  try {
    const {
      customerId,
      invoiceno,
      invoicedate,
      dispatchThrough,
      dispatchno,
      deliverydate,
      destination,
      LL_RR_no,
      motorVehicleNo,
      terms,
      duedate,
      proFormaId,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
    } = req.body;

    const numberOf = await salesInvoice.findOne({
      where: { invoiceno: invoiceno },
    });

    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Invoice Number Already Exists" });
    }
    const customerData = await customer.findByPk(customerId);
    if(!customerData) {
      return res.status(404).json({status:'false', message:'Customer Not Found'});
    }
    const proFormaItem = await ProFormaInvoice.findByPk(proFormaId);
    if(!proFormaItem) {
      return res.status(404).json({status:'false', message:'proForma Invoice Not Found'});
    }
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field Of Items" });
    }
    for(const item of items) {
      const productname = await product.findByPk(item.productId)
      if(!productname) {
        return res.status(404).json({ status:'false', message:'Product Not Found'});
      }
    }
   
    const data = await salesInvoice.create({
      customerId,
      dispatchThrough,
      dispatchno,
      destination,
      deliverydate,
      LL_RR_no,
      motorVehicleNo,
      invoiceno,
      invoicedate,
      terms,
      duedate,
      proFormaId,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty
    });
    const addToItem = items.map((item) => ({
      salesInvoiceId: data.id,
      ...item,
    }));

    await salesInvoiceItem.bulkCreate(addToItem);

    const salesInvoiceData = await salesInvoice.findOne({
      where: { id: data.id },
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
      include: [{ model: salesInvoiceItem, as: "items", include:[{model:product, as:'InvoiceProduct'}]},{model:customer, as:'InvioceCustomer'}],
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
      where: { id },
      include: [{ model: salesInvoiceItem, as: "items",include:[{model:product, as:'InvoiceProduct'}] },{ model:customer, as:'InvioceCustomer'},{model: ProFormaInvoice, as:'proFormaItem'}], 
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
      invoicedate,
      terms,
      duedate,
      proFormaId,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items
    } = req.body;

    const salesId = await salesInvoice.findByPk(id);

    if (!salesId) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    const customerData = await customer.findByPk(customerId);
    if(!customerData) {
      return res.status(404).json({status:'false', message:'Customer Not Found'});
    }
    const proFormaItem = await ProFormaInvoice.findByPk(proFormaId);
    if(!proFormaItem) {
      return res.status(404).json({status:'false', message:'proForma Invoice Not Found'});
    }
    for(const item of items) {
      const productname = await product.findByPk(item.productId)
      if(!productname) {
        return res.status(404).json({ status:'false', message:'Product Not Found'});
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
        motorVehicleNo,
        invoiceno,
        invoicedate,
        terms,
        duedate,
        proFormaId,
        totalIgst,
        totalSgst,
        totalMrp,
        mainTotal,
        totalQty
      },
      {
        where: { id: id },
      }
    );

    const existingItem = await salesInvoiceItem.findAll({
      where: { salesInvoiceId: id },
    });

    const mergedItems = []; 

    items.forEach((item) => {
      let existingItem = mergedItems.find((i) => i.productId === item.productId && i.rate === item.rate);
      if(existingItem) {
        existingItem.qty +=item.qty;
      } else {
        mergedItems.push(item);
      }
    });
    for (const item of mergedItems) {
      const existingItems = existingItem.find(
        (ei) => ei.productId === item.productId && ei.rate === item.rate
      );

      if (existingItems) {
          existingItems.qty = item.qty,
          await existingItems.save();
      } else {
          await salesInvoiceItem.create({
          salesInvoiceId: id,
          productId:item.productId,
          qty : item.qty,
          rate:item.rate,
          mrp:item.mrp,
        });
      }
    }
    const updatedProducts = items.map((item) =>({productId: item.productId, rate: item.rate}));
    const itemsToDelete = existingItem.filter(
      (item) => !updatedProducts.some((updatedItem) => updatedItem.productId === item.productId && updatedItem.rate === item.rate)
    );

    for (const item of itemsToDelete) {
      await item.destroy();
    }

    const data = await salesInvoice.findOne({
      where: { id },
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
    const data = await salesInvoice.destroy({ where: { id: id } });
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