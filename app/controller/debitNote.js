const { Sequelize } = require("sequelize");
const debitNote = require("../models/debitNote");
const C_DebitNote = require("../models/C_DebitNote");
const debitNoteItem = require("../models/debitNoteItem");
const C_DebitNoteItems = require("../models/C_DebitNoteItems");
const product = require("../models/product");
const purchaseInvoice = require("../models/purchaseInvoice");
const C_purchaseCash = require("../models/C_purchaseCash");
const User = require("../models/user");
const AccountDetail = require("../models/AccountDetail");
const Account = require("../models/Account");
const Ledger = require("../models/Ledger");
const C_Ledger = require("../models/C_Ledger");
const htmlToPdf = require("html-pdf-node");
const { renderFile } = require("ejs");
const path = require("node:path");
const Company = require("../models/company");

exports.create_debitNote = async (req, res) => {
  try {
    const { companyId, userId } = req.user;
    const {
      accountId,
      debitnoteno,
      debitdate,
      invoicedate,
      invoiceId,
      totalQty,
      items,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
    } = req.body;
    const existingCredit = await debitNote.findOne({
      where: { debitnoteno: debitnoteno, companyId: companyId },
    });

    if (existingCredit) {
      return res
        .status(400)
        .json({ status: "false", message: "Debit Note Number Already Exists" });
    }

    if (!invoiceId || invoiceId === "" || invoiceId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Invoice Number" });
    }
    const invoiceData = await purchaseInvoice.findOne({
      where: { id: invoiceId, companyId: companyId },
    });
    if (!invoiceData) {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Invoice Not Found" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
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
    const debitNoteData = await debitNote.create({
      accountId,
      debitnoteno,
      debitdate,
      invoicedate,
      invoiceId,
      totalQty,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      companyId: companyId,
      createdBy: userId,
      updatedBy: userId,
    });

    const addToProduct = items.map((item) => ({
      DebitId: debitNoteData.id,
      ...item,
    }));

    await debitNoteItem.bulkCreate(addToProduct);

    await Ledger.create({
      accountId: accountId,
      companyId: companyId,
      debitNoId: debitNoteData.id,
      date: debitdate,
    });

    const data = await debitNote.findOne({
      where: { id: debitNoteData.id, companyId: companyId },
      include: [{ model: debitNoteItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Debit Note Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_debitNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, companyId } = req.user;
    const {
      accountId,
      debitnoteno,
      debitdate,
      invoicedate,
      invoiceId,
      totalQty,
      items,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
    } = req.body;

    const existingDebit = await debitNote.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!existingDebit) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
    const existingDebitNo = await debitNote.findOne({
      where: {
        debitnoteno: debitnoteno,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });

    if (existingDebitNo) {
      return res
        .status(400)
        .json({ status: "false", message: "Debit Note Number Already Exists" });
    }
    if (!invoiceId || invoiceId === "" || invoiceId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Invoice Number" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
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
    await debitNote.update(
      {
        accountId,
        debitnoteno,
        invoiceId,
        invoicedate,
        debitdate,
        totalQty,
        totalIgst,
        totalSgst,
        totalMrp,
        mainTotal,
        companyId: companyId,
        createdBy: existingDebit.createdBy,
        updatedBy: userId,
      },
      { where: { id } }
    );

    const existingItems = await debitNoteItem.findAll({
      where: { DebitId: id },
    });

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await debitNoteItem.update(
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
        await debitNoteItem.create({
          DebitId: id,
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
      await debitNoteItem.destroy({ where: { id: item.id } });
    }
    await Ledger.update(
      {
        accountId: accountId,
        date: debitdate,
      },
      {
        where: {
          companyId: companyId,
          debitNoId: id,
        },
      }
    );
    const data = await debitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: debitNoteItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Debit Note Update Successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "false",
      message: "Internal Server Error",
    });
  }
};
exports.get_all_debitNote = async (req, res) => {
  try {
    const { companyId } = req.user;
    const data = await debitNote.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: debitNoteItem,
          as: "items",
          include: [{ model: product, as: "DebitProduct" }],
        },
        {
          model: Account,
          as: "accountDebitNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: User, as: "debitCreateUser", attributes: ["username"] },
        { model: User, as: "debitUpdateUser", attributes: ["username"] },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Debit Note Data Fetch Successfully",
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_single_debitNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const data = await debitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: debitNoteItem,
          as: "items",
          include: [{ model: product, as: "DebitProduct" }],
        },
        {
          model: Account,
          as: "accountDebitNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: purchaseInvoice, as: "purchaseData" },
      ],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Debit Note Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_debitNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const data = await debitNote.destroy({
      where: { id: id, companyId: companyId },
    });
    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Debit Note Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.debitNote_pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const companyData = await Company.findByPk(companyId)

    const data = await debitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: debitNoteItem,
          as: "items",
          include: [{ model: product, as: "DebitProduct" }],
        },
        {
          model: Account,
          as: "accountDebitNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: purchaseInvoice, as: "purchaseData" },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/debitNote.ejs"),
      { data: { form: companyData, debitNote: data } }
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
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

/*=============================================================================================================
                                         With Type C API
 ============================================================================================================ */

exports.C_create_debitNote = async (req, res) => {
  try {
    const { companyId, userId } = req.user;
    const {
      accountId,
      debitnoteno,
      debitdate,
      purchaseDate,
      purchaseId,
      totalQty,
      items,
      mainTotal,
    } = req.body;
    const existingCredit = await C_DebitNote.findOne({
      where: { debitnoteno: debitnoteno, companyId: companyId },
    });

    if (existingCredit) {
      return res
        .status(400)
        .json({ status: "false", message: "Debit Note Number Already Exists" });
    }
    if (purchaseId) {
      const purchaseData = await C_purchaseCash.findOne({
        where: { id: purchaseId, companyId: companyId },
      });
      if (!purchaseData) {
        return res
          .status(404)
          .json({ status: "false", message: "Purchase Not Found" });
      }
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
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
    const debitNoteData = await C_DebitNote.create({
      accountId,
      debitnoteno,
      debitdate,
      purchaseDate,
      purchaseId,
      totalQty,
      mainTotal,
      companyId: companyId,
      createdBy: userId,
      updatedBy: userId,
    });

    const addToProduct = items.map((item) => ({
      DebitId: debitNoteData.id,
      ...item,
    }));

    await C_DebitNoteItems.bulkCreate(addToProduct);

    await C_Ledger.create({
      accountId: accountId,
      companyId: companyId,
      debitNoId: debitNote.id,
      date: debitdate,
    });

    const data = await C_DebitNote.findOne({
      where: { id: debitNoteData.id, companyId: companyId },
      include: [{ model: C_DebitNoteItems, as: "cashDebitNoteItem" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Debit Note Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_update_debitNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, companyId } = req.user;
    const {
      accountId,
      debitnoteno,
      debitdate,
      purchaseDate,
      purchaseId,
      totalQty,
      items,
      mainTotal,
    } = req.body;

    const existingDebit = await C_DebitNote.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!existingDebit) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
    const existingDebitNo = await C_DebitNote.findOne({
      where: {
        debitnoteno: debitnoteno,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });

    if (existingDebitNo) {
      return res
        .status(400)
        .json({ status: "false", message: "Debit Note Number Already Exists" });
    }
    if (purchaseId) {
      const purchaseData = await C_purchaseCash.findOne({
        where: { id: purchaseId, companyId: companyId },
      });
      if (!purchaseData) {
        return res
          .status(404)
          .json({ status: "false", message: "Purchase Not Found" });
      }
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
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
    await C_DebitNote.update(
      {
        accountId,
        debitnoteno,
        purchaseId,
        purchaseDate,
        debitdate,
        totalQty,
        mainTotal,
        companyId: companyId,
        createdBy: existingDebit.createdBy,
        updatedBy: userId,
      },
      { where: { id } }
    );

    const existingItems = await C_DebitNoteItems.findAll({
      where: { DebitId: id },
    });

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await C_DebitNoteItems.update(
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
        await C_DebitNoteItems.create({
          DebitId: id,
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
      await C_DebitNoteItems.destroy({ where: { id: item.id } });
    }

    await C_Ledger.update(
      {
        accountId: accountId,
        date: debitdate,
      },
      {
        where: {
          companyId: companyId,
          debitNoId: id,
        },
      }
    );
    const data = await C_DebitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: C_DebitNoteItems, as: "cashDebitNoteItem" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Debit Note Update Successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "false",
      message: "Internal Server Error",
    });
  }
};

exports.C_get_all_debitNote = async (req, res) => {
  try {
    const { companyId } = req.user;
    const data = await C_DebitNote.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: C_DebitNoteItems,
          as: "cashDebitNoteItem",
          include: [{ model: product, as: "DebitProductCash" }],
        },
        {
          model: Account,
          as: "accountDebitNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: User, as: "debitCreateUserCash", attributes: ["username"] },
        { model: User, as: "debitUpdateUserCash", attributes: ["username"] },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Debit Note Data Fetch Successfully",
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_view_single_debitNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const data = await C_DebitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_DebitNoteItems,
          as: "cashDebitNoteItem",
          include: [{ model: product, as: "DebitProductCash" }],
        },
        {
          model: Account,
          as: "accountDebitNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: C_purchaseCash, as: "purchaseDataCash" },
      ],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Debit Note Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_delete_debitNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const data = await C_DebitNote.destroy({
      where: { id: id, companyId: companyId },
    });
    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Debit Note Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_debitNote_pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const data = await C_DebitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_DebitNoteItems,
          as: "cashDebitNoteItem",
          include: [{ model: product, as: "DebitProductCash" }],
        },
        {
          model: Account,
          as: "accountDebitNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: C_purchaseCash, as: "purchaseDataCash" },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/debitNoteCash.ejs"),
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
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
