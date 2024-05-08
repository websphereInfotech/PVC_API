const product = require("../models/product");
const salesInvoice = require("../models/salesInvoice");
const salesInvoiceItem = require("../models/salesInvoiceitem");

exports.create_salesInvoice = async (req, res) => {
  try {
    const {
      email,
      mobileno,
      customer,
      book,
      seriesname,
      invoiceno,
      invoicedate,
      terms,
      duedate,
      ProFormaInvoice_no,
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

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field Of Items" });
    }

    let totalIgst = 0;
    let totalSgst = 0;
    let totalMrp = 0;

    // const itemGST = await Promise.all(
    //   items.map(async (item) => {
    //     const productData = await product.findOne({
    //       where: { productname: item.product },
    //     });
    //     if (!productData) {
    //       return res.status(404).json({
    //         status: "false",
    //         message: `Product Not Found:${item.product}`,
    //       });
    //     }

    //     const mrp = Number(item.qty) * Number(item.rate);
    //     totalMrp += mrp;
    //     const igstValue = (productData.IGST * mrp) / 100;
    //     const sgstvalue = productData.SGST ? productData.SGST / 2 : 0;
    //     const gstvalue = (sgstvalue * mrp) / 100;
    //     (totalIgst += igstValue), (totalSgst += gstvalue ? gstvalue * 2 : 0);

    //     return {
    //       ...item,
    //       mrp,
    //       sgst: sgstvalue,
    //       cgst: sgstvalue,
    //       igst: igstValue,
    //     };
    //   })
    // );
    const data = await salesInvoice.create({
      email,
      mobileno,
      customer,
      book,
      seriesname,
      invoiceno,
      invoicedate,
      terms,
      duedate,
      ProFormaInvoice_no,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal: totalIgst ? totalIgst + totalMrp : totalSgst + totalMrp,
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
      message: "SalesInvoice Create Successfully",
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
      include: [{ model: salesInvoiceItem, as: "items" }],
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
      include: [{ model: salesInvoiceItem, as: "items" }],
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
      email,
      mobileno,
      customer,
      book,
      seriesname,
      invoiceno,
      invoicedate,
      terms,
      duedate,
      ProFormaInvoice_no,
      items,
    } = req.body;

    const salesId = await salesInvoice.findByPk(id);

    if (!salesId) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    await salesInvoice.update(
      {
        email: email,
        mobileno: mobileno,
        customer: customer,
        book: book,
        seriesname: seriesname,
        invoiceno: invoiceno,
        invoicedate: invoicedate,
        terms: terms,
        duedate: duedate,
        ProFormaInvoice_no: ProFormaInvoice_no,
      },
      {
        where: { id: id },
      }
    );

    const existingItem = await salesInvoiceItem.findAll({
      where: { salesInvoiceId: id },
    });

    const updatedProducts = items.map((item) => item.product);
    const itemsToDelete = existingItem.filter(
      (item) => !updatedProducts.includes(item.product)
    );

    for (const item of itemsToDelete) {
      await item.destroy();
    }

    let totalMrp = 0;
    let totalIgst = 0;
    let totalSgst = 0;

    for (const item of items) {
      const existingItems = existingItem.find(
        (ei) => ei.product === item.product
      );
      const rate = item.rate;
      const qty = item.qty;
      const mrp = Number(item.rate) * Number(item.qty);

      if (existingItems) {
        await existingItems.update({
          qty,
          rate,
          mrp,
        });
      } else {
        await salesInvoiceItem.create({
          salesInvoiceId: id,
          product: item.product,
          qty,
          rate,
          mrp,
        });
      }
      totalMrp += mrp;

      const productData = await product.findOne({
        where: { productname: item.product},
      });

      if (productData) {
        totalIgst += (productData.IGST * mrp) / 100;
        totalSgst += (productData.SGST * mrp) / 100;
      }
    }
    await salesInvoice.update(
      {
        totalMrp,
        totalIgst,
        totalSgst,
        mainTotal: totalIgst ? totalIgst + totalMrp : totalSgst + totalMrp,
      },
      { where: { id } }
    );

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
exports.delete_salesInvoiceItem = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await salesInvoiceItem.destroy({ where: { id: id } });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    } else {
      return res
        .status(200)
        .json({ status: "true", message: "Sales Deleted Successfully" });
    }
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
      .json({ status: "false", message: "nternal Server Error" });
  }
};
exports.pdf_file = async (req,res) => {
  try {
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status:'false', message:'Internal Server Error'});
  }
}