const { Sequelize } = require("sequelize");
const creditNote = require("../models/creditNote");
const C_CreditNote = require("../models/C_CreditNote");
const creditNoteItem = require("../models/creditNoteItem");
const C_CreditNoteItems = require("../models/C_CreditNoteItems");
const product = require("../models/product");
const Account = require("../models/Account");
const User = require("../models/user");
const AccountDetail = require("../models/AccountDetail");
const Ledger = require("../models/Ledger");
const C_Ledger = require("../models/C_Ledger");
const htmlToPdf = require("html-pdf-node");
const { renderFile } = require("ejs");
const path = require("node:path");
const Company = require("../models/company");

exports.create_creditNote = async (req, res) => {
  try {
    const {
      accountId,
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
    const companyId = req.user.companyId;
    const userId = req.user.userId;

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
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    const creditData = await creditNote.create({
      accountId,
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
      companyId: companyId,
      createdBy: userId,
      updatedBy: userId,
    });

    const addToProduct = items.map((item) => ({
      creditId: creditData.id,
      ...item,
    }));
    await creditNoteItem.bulkCreate(addToProduct);

    await Ledger.create({
      accountId: accountId,
      companyId: companyId,
      creditNoId: creditData.id,
      date: creditdate,
    });

    const data = await creditNote.findOne({
      where: { id: creditData.id, companyId: companyId },
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
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const {
      accountId,
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
      where: { id: id, companyId: companyId },
    });

    if (!existingCredit) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }
    const numberOf = await creditNote.findOne({
      where: {
        creditnoteNo: creditnoteNo,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });
    if (numberOf) {
      return res.status(400).json({
        status: "false",
        message: "Credit Note Number Already Exists",
      });
    }

    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
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
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    await creditNote.update(
      {
        accountId,
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
        companyId: companyId,
        createdBy: existingCredit.createdBy,
        updatedBy: userId,
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
            unit: item.unit,
            productId: item.productId,
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
          unit: item.unit,
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

    await Ledger.update(
      {
        accountId: accountId,
        date: creditdate,
      },
      {
        where: {
          companyId: companyId,
          creditNoId: id,
        },
      }
    );
    const data = await creditNote.findOne({
      where: { id: id, companyId: companyId },
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
    const companyId = req.user.companyId;
    const data = await creditNote.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: creditNoteItem,
          as: "items",
          include: [{ model: product, as: "CreditProduct" }],
        },
        {
          model: Account,
          as: "accountCreditNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: User, as: "creditCreateUser", attributes: ["username"] },
        { model: User, as: "creditUpdateUser", attributes: ["username"] },
      ],
    });
    return res.status(200).json({
      status: "true",
      message: "Credit Note Data fetch successfully",
      data: data,
    });
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
    const companyId = req.user.companyId;
    const data = await creditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: creditNoteItem,
          as: "items",
          include: [{ model: product, as: "CreditProduct" }],
        },
        {
          model: Account,
          as: "accountCreditNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
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
    const { companyId } = req.user;
    const data = await creditNote.destroy({
      where: { id: id, companyId: companyId },
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

exports.creditNote_pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const companyData = await Company.findByPk(companyId);
    const data = await creditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: creditNoteItem,
          as: "items",
          include: [{ model: product, as: "CreditProduct" }],
        },
        {
          model: Account,
          as: "accountCreditNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/creditNote.ejs"),
      { data: { form: companyData, creditNote: data } }
    );
    htmlToPdf
      .generatePdf({ content: html }, { printBackground: true, format: "A4" })
      .then((pdf) => {
        const base64String = pdf.toString("base64");
        return res.status(200).json({
          status: "Success",
          message: "pdf create successFully",
          data: base64String,
        });
      });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};

/*=============================================================================================================
                                         Without Typc C API
 ============================================================================================================ */

exports.C_create_creditNote = async (req, res) => {
  try {
    const {
      accountId,
      creditnoteNo,
      creditdate,
      LL_RR_no,
      dispatchThrough,
      motorVehicleNo,
      destination,
      mainTotal,
      totalQty,
      items,
    } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.userId;

    const numberOf = await C_CreditNote.findOne({
      where: { creditnoteNo: creditnoteNo, companyId: companyId },
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
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    const creditData = await C_CreditNote.create({
      accountId,
      creditnoteNo,
      creditdate,
      LL_RR_no,
      dispatchThrough,
      destination,
      motorVehicleNo,
      totalQty,
      mainTotal,
      companyId: companyId,
      createdBy: userId,
      updatedBy: userId,
    });

    const addToProduct = items.map((item) => ({
      creditId: creditData.id,
      ...item,
    }));
    await C_CreditNoteItems.bulkCreate(addToProduct);

    await C_Ledger.create({
      accountId: accountId,
      companyId: companyId,
      creditNoId: creditData.id,
      date: creditdate,
    });

    const data = await C_CreditNote.findOne({
      where: { id: creditData.id, companyId: companyId },
      include: [{ model: C_CreditNoteItems, as: "cashCreditNoteItem" }],
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

exports.C_update_creditNote = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const {
      accountId,
      creditnoteNo,
      creditdate,
      LL_RR_no,
      dispatchThrough,
      motorVehicleNo,
      destination,
      mainTotal,
      totalQty,
      items,
    } = req.body;

    const existingCredit = await C_CreditNote.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!existingCredit) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }
    const numberOf = await C_CreditNote.findOne({
      where: {
        creditnoteNo: creditnoteNo,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });
    if (numberOf) {
      return res.status(400).json({
        status: "false",
        message: "Credit Note Number Already Exists",
      });
    }

    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
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
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    await C_CreditNote.update(
      {
        accountId,
        creditnoteNo,
        creditdate,
        LL_RR_no,
        dispatchThrough,
        motorVehicleNo,
        destination,
        totalQty,
        mainTotal,
        companyId: companyId,
        createdBy: existingCredit.createdBy,
        updatedBy: userId,
      },
      { where: { id } }
    );

    const existingItems = await C_CreditNoteItems.findAll({
      where: { creditId: id },
    });

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await C_CreditNoteItems.update(
          {
            qty: item.qty,
            rate: item.rate,
            mrp: item.mrp,
            unit: item.unit,
            productId: item.productId,
          },
          { where: { id: existingItem.id } }
        );
      } else {
        await C_CreditNoteItems.create({
          creditId: id,
          productId: item.productId,
          qty: item.qty,
          rate: item.rate,
          mrp: item.mrp,
          unit: item.unit,
        });
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      await C_CreditNoteItems.destroy({ where: { id: item.id } });
    }

    await C_Ledger.update(
      {
        accountId: accountId,
        date: creditdate,
      },
      {
        where: {
          companyId: companyId,
          creditNoId: id,
        },
      }
    );
    const data = await C_CreditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: C_CreditNoteItems, as: "cashCreditNoteItem" }],
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

exports.C_get_all_creditNote = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const data = await C_CreditNote.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: C_CreditNoteItems,
          as: "cashCreditNoteItem",
          include: [{ model: product, as: "CreditProductCash" }],
        },
        {
          model: Account,
          as: "accountCreditNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: User, as: "creditCreateUserCash", attributes: ["username"] },
        { model: User, as: "creditUpdateUserCash", attributes: ["username"] },
      ],
    });
    return res.status(200).json({
      status: "true",
      message: "Credit Note Data fetch successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_view_single_creditNote = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_CreditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_CreditNoteItems,
          as: "cashCreditNoteItem",
          include: [{ model: product, as: "CreditProductCash" }],
        },
        {
          model: Account,
          as: "accountCreditNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
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

exports.C_delete_creditNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    const data = await C_CreditNote.destroy({
      where: { id: id, companyId: companyId },
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

exports.C_creditNote_pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_CreditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_CreditNoteItems,
          as: "cashCreditNoteItem",
          include: [{ model: product, as: "CreditProductCash" }],
        },
        {
          model: Account,
          as: "accountCreditNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/creditNoteCash.ejs"),
      { data }
    );
    htmlToPdf
      .generatePdf({ content: html }, { printBackground: true, format: "A4" })
      .then((pdf) => {
        const base64String = pdf.toString("base64");
        return res.status(200).json({
          status: "Success",
          message: "pdf create successFully",
          data: base64String,
        });
      });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};
