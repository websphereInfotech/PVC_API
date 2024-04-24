const quotation = require("../models/quotation");
const quotationItem = require("../models/quotationItem");

exports.create_quotationItem = async (req, res) => {
  try {
    const { quotationId, items } = req.body;

    await Promise.all(
      items.map(async (item) => {
        await quotationItem.create({
          ...item,
          quotationId,
        });
      })
    );

    const createdItems = await quotationItem.findAll({
      where: { quotationId },
    });

    return res
      .status(200)
      .json({
        status: "true",
        message: "Quatations items Created Successfully",
        data: createdItems,
      });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.create_quotation = async (req, res) => {
  try {
    const { quotation_no, date, validtill, email, mobileno, customer } =
      req.body;

    const createdQuotation = await quotation.create({
      quotation_no,
      date,
      validtill,
      email,
      mobileno,
      customer,
    });
    const quotationWithItems = await quotation.findOne({
      where: { id: createdQuotation.id },
    });

    return res
      .status(200)
      .json({
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
      include: [{ model: quotationItem }],
    });
    if (!allQuotations) {
      return res
        .status(404)
        .json({ status: "false", message: "Quotation Data not Found" });
    }
    return res
      .status(200)
      .json({
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
      include: [{ model: quotationItem }],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Quotation not found" });
    }
    return res
      .status(200)
      .json({
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
    const { quotationno, date, validtill, email, mobileno, customer } =
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
      {
        where: { id: id },
        include: [{ model: quotationItem }]
      })
  
      return res.status(200).json({ status: "true", message: "Quotation Update Successfully", data: data });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.update_quotationItem = async (req, res) => {
    try {
      const { id } = req.params;
      const { srNo,rate, product, qty, mrp } = req.body;
  
      const salesId = await quotationItem.findByPk(id);
  
      if (!salesId) {
        return res.status(404).json({ status: "false", message: "Quotation Item not Found" });
      }
      await quotationItem.update({
        srNo: srNo,
        rate: rate,
        qty: qty,
        product: product,
        mrp: mrp,
      }, {
        where: { id: id }
      }
    );
    const data = await quotation.findOne({
      where: { id: id },
      include: [{ model: quotationItem }],
    });

    return res
      .status(200)
      .json({
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
    } else {
      return res
        .status(200)
        .json({ status: "true", message: "Quatation Delete Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
