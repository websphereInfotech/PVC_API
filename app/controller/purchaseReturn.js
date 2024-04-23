const purchaseReturn = require("../models/purchasereturn");
const purchaseReturnItem = require("../models/purchasereturnitem");

exports.create_purchaseReturn = async (req, res) => {
  try {
    const { vendor, debitnote, debitdate, refno, refdate } = req.body;

    const data = await purchaseReturn.create({
      vendor,
      debitnote,
      debitdate,
      refno,
      refdate,
    });
    return res
      .status(200)
      .json({
        status: "true",
        message: "purchase return create successfully",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.create_purchaseReturn_item = async (req, res) => {
  try {
    const { purchaseReturnId, items } = req.body;
    // console.log("req", req.body);
    await Promise.all(
      items.map(async (item) => {
        await purchaseReturnItem.create({
          ...item,
          purchaseReturnId: purchaseReturnId,
        });
      })
    );

    const data = await purchaseReturnItem.findAll({
      where: { purchaseReturnId },
    });
    return res
      .status(200)
      .json({
        status: "true",
        message: "Purchase Retuen item create Successfully",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_purchaseReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vendor,
      debitnote,
      debitdate,
      billaddress,
      state,
      shipaddress,
      refno,
      refdate,
      reason,
    } = req.body;

    const returnId = await purchaseReturn.findByPk(id);

    if (!returnId) {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Return Not found" });
    }

    await purchaseReturn.update(
      {
        vendor: vendor,
        debitnote: debitnote,
        debitdate: debitdate,
        billaddress: billaddress,
        state: state,
        shipaddress: shipaddress,
        refno: refno,
        refdate: refdate,
        reason: reason,
      },
      {
        where: { id: id },
      }
    );
    const data = await purchaseReturn.findByPk(id);
    return res
      .status(200)
      .json({
        status: "true",
        message: "Purchase Return update successfully",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_purchaseReturn_item = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      serialno,
      product,
      batchno,
      expirydate,
      mrp,
      bill_no,
      bill_date,
      qty,
      rate,
      taxable,
      Cess,
      price,
    } = req.body;

    const returnId = await purchaseReturnItem.findByPk(id);
    if (!returnId) {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Return Item not found" });
    }
    await purchaseReturnItem.update(
      {
        serialno: serialno,
        product: product,
        batchno: batchno,
        expirydate: expirydate,
        mrp: mrp,
        bill_no: bill_no,
        bill_date: bill_date,
        qty: qty,
        rate: rate,
        taxable: taxable,
        Cess: Cess,
        price: price,
      },
      { where: { id: id } }
    );

    const data = await purchaseReturnItem.findByPk(id);
    return res
      .status(200)
      .json({
        status: "true",
        message: "Purchase return Item Update Successfully",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_purchasereturn = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await purchaseReturn.destroy({ where: { id: id } });

    if (data) {
      return res
        .status(200)
        .json({
          status: "success",
          message: "Purchase Return  Delete Successfully",
        });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Return  Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_purchaseReturn_item = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await purchaseReturnItem.destroy({ where: { id: id } });
    if (data) {
      return res
        .status(200)
        .json({
          status: "success",
          message: "Purchase Return Item Delete Successfully",
        });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Return Item Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_purchaseReturn = async (req, res) => {
  try {
    const data = await purchaseReturn.findAll({
      include: [{ model: purchaseReturnItem }],
    });
    if (data) {
      return res
        .status(200)
        .json({
          status: "success",
          message: "Purchase Return Show Successfully",
          data: data,
        });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Return Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_purchaseReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await purchaseReturn.findOne({
      where: { id: id },
      include: [{ model: purchaseReturnItem }],
    });
    if (data) {
      return res
        .status(200)
        .json({
          status: "success",
          message: "Purchase Return  Delete Successfully",
          data: data,
        });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Return  Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
