const ProFormaInvoice = require("../models/ProFormaInvoice");
const ProFormaInvoiceItem = require("../models/ProFormaInvoiceItem");
const product = require("../models/product");

exports.create_ProFormaInvoice = async (req, res) => {
  try {
    const { quotation_no, date, validtill, customer, items } = req.body;
    const numberOf = await ProFormaInvoice.findOne({
      where: { quotation_no: quotation_no },
    });

    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Quatation Number Already Exists" });
    }

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
    }
    let totalIgst = 0;
    let totalSgst = 0;
    let totalMrp = 0;

    const itemGST = await Promise.all(
      items.map(async (item) => {
 
        const productData = await product.findAll({
          where: { productname: item.product },
          // where: { id: item.product },
        });
       
        if (!productData) {
          return res.status(404).json({
            status: "false",
            message: `Product Not Found: ${item.product}`, 
          });
        }

        const mrp = Number(item.qty) * Number(item.rate);
        totalMrp += mrp;
        const igstValue = (productData.IGST * mrp) / 100 || 0;
        const sgstvalue = productData.SGST ? productData.SGST / 2 : 0;
        const gstvalue = (sgstvalue * mrp) / 100 || 0;
        totalIgst += igstValue;
        totalSgst += gstvalue ? gstvalue * 2 : 0;
console.log(totalIgst,'total?>>>>>>>>>>>>>>>>>>>>');
        return {
          ...item,
          mrp,
          sgst: sgstvalue,
          cgst: sgstvalue,
          igst: igstValue,
        };
      })
    );

    const createdInvoice = await ProFormaInvoice.create({
      quotation_no,
      date,
      validtill,
      customer,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal: totalIgst ? totalIgst + totalMrp : totalSgst + totalMrp,
    });

    const addToProduct = itemGST.map((item) => ({
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
// exports.create_quotation = async (req, res) => {
//   try {
//     const { quotation_no, date, validtill, email, mobileno, customer, items } =
//       req.body;
//     const numberOf = await quotation.findOne({ where:{quotation_no:quotation_no}});
//     if(numberOf) {
//       return res.status(400).json({ status:'false', message:'Quatation Number Already Exists'})
//     }
//       const createdQuotation = await quotation.create({
//         quotation_no,
//         date,
//         validtill,
//         email,
//         mobileno,
//         customer,
//       });
//       if (!items   || items.length === 0) {
//         return res
//           .status(400)
//           .json({ status: "false", message: "Required Field oF items" });
//       }
//       const addToProduct = items.map((item) => ({
//       quotationId: createdQuotation.id,
//       ...item,
//     }));
//      await quotationItem.bulkCreate(addToProduct);
//     const quotationWithItems = await quotation.findOne({
//       where: { id: createdQuotation.id },
//       include: [{ model: quotationItem, as:'items' }],
//     });
//     return res.status(200).json({
//       status: "true",
//       message: "Quotation created successfully",
//       data: quotationWithItems,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ status: "false", error: "Internal Server Error" });
//   }
// };
exports.get_all_ProFormaInvoice = async (req, res) => {
  try {
    const allInvoice = await ProFormaInvoice.findAll({
      include: [{ model: ProFormaInvoiceItem, as: "items" }],
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
      include: [{ model: ProFormaInvoiceItem, as: "items" }],
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
// exports.update_quotation = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const { quotationno, date, validtill, email, mobileno, customer, items } =
//       req.body;

//     const updateQuotation = await quotation.findByPk(id);
//     if (!updateQuotation) {
//       return res
//         .status(404)
//         .json({ status: "false", message: "Quotation Not Found" });
//     }
//     await quotation.update(
//       {
//         quotationno: quotationno,
//         date: date,
//         validtill: validtill,
//         email: email,
//         mobileno: mobileno,
//         customer: customer,
//       },
//       { where: { id: id } }
//     );

//     if (Array.isArray(items)) {
//       const existingItems = await quotationItem.findAll({
//         where: { quotationId: id },
//       });
//       for (let i = 0; i < existingItems.length && i < items.length; i++) {
//         const itemData = items[i];
//         const itemId = existingItems[i].id;
//         await quotationItem.update(
//           {
//             product: itemData.product,
//             qty: itemData.qty,
//             rate: itemData.rate,
//             mrp: itemData.qty * itemData.rate,
//           },
//           {
//             where: { id: itemId },
//           }
//         );
//       }

//       if (items.length > existingItems.length) {
//         console.log("items************",items);
//         for (let i = existingItems.length; i < items.length; i++) {
//           const itemData = items[i];
//           const itemGST = await Promise.all(
//             items.map(async (item) => {
//               const data = await product.findOne({
//                 where:{productname:item.product}
//               });
//               console.log("itemGST>>>>>>>>>>>>>>>>>>>",itemGST);
//               console.log("data@@@@@@@@@@@@@@@@@@@@@@2",data);
//             })
//           )
//           await quotationItem.create({
//             quotationId: id,
//             product: itemData.product,
//             qty: itemData.qty,
//             rate: itemData.rate,
//             mrp: itemData.qty * itemData.rate,
//           });
//         }
//       }
//     }
//     const data = await quotation.findOne({
//       where: { id },
//       include: [{ model: quotationItem, as: "items" }],
//     });

//     return res.status(200).json({
//       status: "true",
//       message: "Quotation Update Successfully",
//       data: data,
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res
//       .status(500)
//       .json({ status: "false", message: "Internal Server Error" });
//   }
// };
exports.update_ProFormaInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { quotationno, date, validtill, customer, items } = req.body;

    const existingInvoice = await ProFormaInvoice.findByPk(id);

    if (!existingInvoice) {
      return res.status(404).json({
        status: "false",
        message: "ProForma Invoice Not Found",
      });
    }

    await ProFormaInvoice.update(
      {
        quotationno,
        date,
        validtill,
        customer,
      },
      { where: { id } }
    );

    const existingItems = await ProFormaInvoiceItem.findAll({
      where: { InvoiceId: id },
    });
    console.log("existingItems",existingItems);
    const updatedProducts = items.map((item) => item.product.toLowerCase());
console.log("updatedProducts",updatedProducts);
    const itemsToDelete = existingItems.filter(
      (item) => !updatedProducts.includes(item.product.toLowerCase())
    );
console.log("itemsToDelete",itemsToDelete);
    for (const item of itemsToDelete) {
      await item.destroy();
    }

    let totalMrp = 0;
    let totalIgst = 0;
    let totalSgst = 0;

    for (const item of items) {
      const existingItem = existingItems.find(
        (ei) => ei.product.toLowerCase() === item.product.toLowerCase()
      );

      const rate = item.rate;
      const qty = item.qty;
      const mrp = Number(item.rate) * Number(item.qty);

      if (existingItem) {
        await existingItem.update({
          qty,
          rate,
          mrp,
        });
      } else {
        await ProFormaInvoiceItem.create({
          InvoiceId: id,
          product: item.product,
          qty,
          rate,
          mrp,
        });
      }
      totalMrp += mrp;

      const productData = await product.findOne({
        where: { productname: item.product },
      });
console.log("productData",productData);
      if (productData) {
        totalIgst += (productData.IGST * mrp) / 100;
        totalSgst += (productData.SGST * mrp) / 100;
      }
    }
    await ProFormaInvoice.update(
      {
        totalMrp,
        totalIgst,
        totalSgst,
        mainTotal: totalIgst ? totalMrp + totalIgst : totalSgst + totalMrp,
      },
      { where: { id } }
    );

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
