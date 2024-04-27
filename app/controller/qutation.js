const product = require("../models/product");
const quotation = require("../models/quotation");
const quotationItem = require("../models/quotationItem");

// exports.create_quotation = async (req, res) => {
//   try {
//     const { quotation_no, date, validtill, email, mobileno, customer, items } =
//       req.body;
//     const numberOf = await quotation.findOne({
//       where: { quotation_no: quotation_no },
//     });

//     if (numberOf) {
//       return res
//         .status(400)
//         .json({ status: "false", message: "Quatation Number Already Exists" });
//     }
//     for (const item of items) {
//       const existingItem = await quotationItem.findOne({
//         where: { srNo: item.srNo },
//       });
//       if (existingItem) {
//         return res
//           .status(400)
//           .json({ status: "false", message: "Serial Number Already Exists" });
//       }
//     }

//     if (!items || items.length === 0) {
//       return res
//         .status(400)
//         .json({ status: "false", message: "Required Field oF items" });
//     }
//     let totalIgst = 0;
//     let totalSgst = 0;
//     let totalMrp = 0;

//     const itemGST = await Promise.all(
//       items.map(async (item) => {
//         // console.log("items**********8",items)
//         // console.log("item*@@@@@@@@@@@@@*********8",item)
//         const productData = await product.findOne({
//           where: { productname: item.product },
//         });
//         if (!productData) {
//           return res
//             .status(404)
//             .json({
//               status: "false",
//               message: `Product Not Found: ${item.product}`,
//             });
//         }

//         const mrp = Number(item.qty) * Number(item.rate);
//         totalMrp += mrp;
//         const igstValue = (productData.igst * mrp) / 100;
//         const sgstvalue = productData.sgst ? productData.sgst / 2 : null;
//         const gstvalue = (sgstvalue * mrp) / 100;
//         totalIgst += igstValue;
//         totalSgst += gstvalue ? gstvalue * 2 : 0;

//         // console.log("mrp@@@@@@@@@@@@",mrp);
//         // console.log("TOTALMRP****************",totalMrp)
//         // console.log("MAINTOTAL######################",mainTotal);
//         return {
//           ...item,
//           mrp,
//           sgst: sgstvalue,
//           cgst: sgstvalue,
//           igst: igstValue,
//         };
//       })
//     );

//     const createdQuotation = await quotation.create({
//       quotation_no,
//       date,
//       validtill,
//       email,
//       mobileno,
//       customer,
//       totalIgst,
//       totalSgst,
//       totalMrp,
//       mainTotal: totalIgst ? totalIgst + totalMrp : totalSgst + totalMrp,
//     });
//     // console.log("TOTALIGST........",totalIgst);
//     // console.log("TOTALSGST.>>>>>>>>>>>>>>>>>>.......",totalSgst);

//     // console.log("item>>>>>>>>>>>>>>>>>>>>>",itemGST);
//     const addToProduct = itemGST.map((item) => ({
//       quotationId: createdQuotation.id,
//       ...item,
//     }));

//     await quotationItem.bulkCreate(addToProduct);

//     const quotationWithItems = await quotation.findOne({
//       where: { id: createdQuotation.id },
//       include: [{ model: quotationItem, as: "items" }],
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
exports.create_quotation = async (req, res) => {
  try {
    const { quotation_no, date, validtill, email, mobileno, customer, items } =
      req.body;
    const numberOf = await quotation.findOne({ where:{quotation_no:quotation_no}});
    if(numberOf) {
      return res.status(400).json({ status:'false', message:'Quatation Number Already Exists'})
    }
      const createdQuotation = await quotation.create({
        quotation_no,
        date,
        validtill,
        email,
        mobileno,
        customer,
      });
      if (!items   || items.length === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Required Field oF items" });
      }
      const addToProduct = items.map((item) => ({
      quotationId: createdQuotation.id,
      ...item,
    }));
     await quotationItem.bulkCreate(addToProduct);
    const quotationWithItems = await quotation.findOne({
      where: { id: createdQuotation.id },
      include: [{ model: quotationItem, as:'items' }],
    });
    return res.status(200).json({
      status: "true",
      message: "Quotation created successfully",
      data: quotationWithItems,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};
exports.get_all_quotation = async (req, res) => {
  try {
    const allQuotations = await quotation.findAll({
      include: [{ model: quotationItem, as: "items" }],
    });

    if (!allQuotations) {
      return res
        .status(404)
        .json({ status: "false", message: "Quotation Data not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Quotation data fetch successfully",
      data: allQuotations,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};
exports.view_quotation = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await quotation.findOne({
      where: { id },
      include: [{ model: quotationItem, as: "items" }],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Quotation not found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Quotation data fetch successfully",
      data: data,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};
exports.update_quotation = async (req, res) => {
  try {
    const { id } = req.params;

    const { quotationno, date, validtill, email, mobileno, customer, items } =
      req.body;

    const updateQuotation = await quotation.findByPk(id);

    if (!updateQuotation) {
      return res
        .status(404)
        .json({ status: "false", message: "Quotation Not Found" });
    }
    await quotation.update(
      {
        quotationno: quotationno,
        date: date,
        validtill: validtill,
        email: email,
        mobileno: mobileno,
        customer: customer,
      },
      { where: { id: id } }
    );

    if (Array.isArray(items)) {
      const existingItems = await quotationItem.findAll({
        where: { quotationId: id },
      });

      for (let i = 0; i < existingItems.length && i < items.length; i++) {
        const itemData = items[i];
        const itemId = existingItems[i].id;
        await quotationItem.update(
          {
            srNo: itemData.srNo,
            product: itemData.product,
            qty: itemData.qty,
            mrp: itemData.mrp,
            rate: itemData.mrp,
          },
          {
            where: { id: itemId },
          }
        );
      }

      if (items.length > existingItems.length) {
        for (let i = existingItems.length; i < items.length; i++) {
          const itemData = items[i];
          await quotationItem.create({
            quotationId: id,
            srNo: itemData.srNo,
            product: itemData.product,
            qty: itemData.qty,
            mrp: itemData.mrp,
            rate: itemData.mrp,
          });
        }
      }
    }
    const data = await quotation.findOne({
      where: { id },
      include: [{ model: quotationItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Quotation Update Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_quotationitem = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await quotationItem.destroy({ where: { id: id } });

    if (!data) {
      return res
        .status(400)
        .json({ status: "false", message: "Quatation Item Not Found" });
    } else {
      return res
        .status(200)
        .json({ status: "true", message: "Qutation delete Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_quotation = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await quotation.destroy({ where: { id: id } });

    if (!data) {
      return res
        .status(400)
        .json({ status: "false", message: "Quatation Not Found" });
    }
    return res
      .status(200)
      .json({ status: "true", message: "Quatation Delete Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
