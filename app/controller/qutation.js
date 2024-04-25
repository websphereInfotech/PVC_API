const quotation = require("../models/quotation");
const quotationItem = require("../models/quotationItem");

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
      include: [{ model: quotationItem, as: 'items' }],
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
      include: [{ model: quotationItem,as:'items' }],
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
      },{ where:{id:id}}
    );
   
    if (Array.isArray(items)) {
      const existingItems  = await quotationItem.findAll({
        where: {quotationId:id},
      });
    
      for(const item of items) {
        const existingItem = existingItems.find((i) => i.srNo === item.srNo);
    
        if(existingItem) {
          await existingItem.update({
            product: item.product,
            qty : item.qty,
            mrp: item.mrp,
            rate:item.rate
          });
        } else {
          await quotationItem.create({
            quotationId:id,
            ...item
          })
        }
      }
    };
    const data = await quotation.findOne({
      where: { id },
      include: [{ model: quotationItem,as:'items' }],
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
