const ProFormaInvoice = require("../models/ProFormaInvoice");
const ProFormaInvoiceItem = require("../models/ProFormaInvoiceItem");
const customer = require("../models/customer");
const product = require("../models/product");

exports.create_ProFormaInvoice = async (req, res) => {
  try {
    const { ProFormaInvoice_no, date, validtill, customerId,totalIgst,totalSgst,totalMrp,mainTotal,items } = req.body;
    const numberOf = await ProFormaInvoice.findOne({
      where: { ProFormaInvoice_no: ProFormaInvoice_no },
    });
    if (numberOf) {
      return res
      .status(400)
      .json({ status: "false", message: "ProForma Invoice Number Already Exists" });
    }
    const customerData = await customer.findByPk(customerId);
    if(!customerData) {
      return res.status(404).json({status:'false', message:'Customer Not Found'});
    }

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
    }
  
    for(const item of items) {
      const productname = await product.findByPk(item.productId)
      if(!productname) {
        return res.status(404).json({ status:'false', message:'Product Not Found'});
      }
    }
    const createdInvoice = await ProFormaInvoice.create({
      ProFormaInvoice_no,
      date,
      validtill,
      customerId,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
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
    const allInvoice = await ProFormaInvoice.findAll({
      include: [{ model: ProFormaInvoiceItem, as: "items", include:[{model:product,as:'product'}] },{model:customer, as:'customer'}],
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

    const data = await ProFormaInvoice.findOne({
      where: { id },
      include: [{ model: ProFormaInvoiceItem, as: "items", include:[{model:product,as:'product'}] },{model:customer, as:'customer'}],
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
    const { id } = req.params;
    const { ProFormaInvoice_no, date, validtill, customerId, items ,totalIgst,totalSgst,totalMrp,mainTotal} = req.body;

    const existingInvoice = await ProFormaInvoice.findByPk(id);

    if (!existingInvoice) {
      return res.status(404).json({
        status: "false",
        message: "ProForma Invoice Not Found",
      });
    }
    const customerData = await customer.findByPk(customerId);
    if(!customerData) {
      return res.status(404).json({status:'false', message:'Customer Not Found'});
    }
    for(const item of items) {
      const productname = await product.findByPk(item.productId)
      if(!productname) {
        return res.status(404).json({ status:'false', message:'Product Not Found'});
      }
    }
    await ProFormaInvoice.update(
      {
        ProFormaInvoice_no,
        date,
        validtill,
        customerId,
        totalIgst,totalSgst,totalMrp,mainTotal
      },
      { where: { id } }
    );

    const existingItems = await ProFormaInvoiceItem.findAll({
      where: { InvoiceId: id },
    });

    const updatedProducts = items.map((item) => item.productId);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProducts.includes(item.productId)
    );

    for (const item of itemsToDelete) {
      await item.destroy();
    }

    // let totalMrp = 0;
    // let totalIgst = 0;
    // let totalSgst = 0;

    for (const item of items) {
      const existingItem = existingItems.find(
        (ei) => ei.productId === item.productId
      );
      if (existingItem) {
        await existingItem.update({
          qty : item.qty,
          rate:item.rate,
          mrp:item.mrp,
        });
      } else {
        await ProFormaInvoiceItem.create({
          InvoiceId: id,
          productId:item.productId,
          qty : item.qty,
          rate:item.rate,
          mrp:item.mrp,
        });
      }
      // totalMrp += mrp;

      // const productData = await product.findOne({
      //   where: { productname: item.productId },
      // });

      // if (productData) {
      //   totalIgst += (productData.IGST * mrp) / 100;
      //   totalSgst += (productData.SGST * mrp) / 100;
      // }
    }
    // await ProFormaInvoice.update(
    //   {
    //     totalMrp,
    //     totalIgst,
    //     totalSgst,
    //     mainTotal: totalIgst ? totalMrp + totalIgst : totalSgst + totalMrp,
    //   },
    //   { where: { id } }
    // );

    const updatedInvoice = await ProFormaInvoice.findOne({
      where: { id },
      include: [{ model: ProFormaInvoiceItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "ProForma Invoice Updated Successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "false",
      message: "Internal Server Error",
    });
  }
};

exports.delete_ProFormaInvoiceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ProFormaInvoiceItem.destroy({ where: { id: id } });

    if (!data) {
      return res
        .status(400)
        .json({ status: "false", message: "ProForma Invoice Item Not Found" });
    } else {
      return res
        .status(200)
        .json({ status: "true", message: "ProForma Invoice delete Successfully" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_ProFormaInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await ProFormaInvoice.destroy({ where: { id: id } });

    if (!data) {
      return res
        .status(400)
        .json({ status: "false", message: "ProForma Invoice Item Not Found" });
    }
    return res
      .status(200)
      .json({ status: "true", message: "ProForma Invoice Item Delete Successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
