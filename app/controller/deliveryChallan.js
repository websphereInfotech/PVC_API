const customer = require("../models/customer");
const deliverychallan = require("../models/deliverychallan");
const deliverychallanitem = require("../models/deliverychallanitem");
const product = require("../models/product");

exports.create_deliverychallan = async (req, res) => {
  try {
    const { email, date, challanno, mobileno, customerId, items ,totalIgst,totalSgst,totalMrp,mainTotal} = req.body;
    const numberOf = await deliverychallan.findOne({
      where: { challanno: challanno },
    });
    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Challan Number Already Exists" });
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
    const data = await deliverychallan.create({
      email,
      mobileno,
      date,
      challanno,
      customerId,
      totalSgst,
      totalIgst,
      totalMrp,
      mainTotal,
    });
    const addToItem = items.map((item) => ({
      deliverychallanId: data.id,
      ...item,
    }));

    await deliverychallanitem.bulkCreate(addToItem);

    const deliveryChallan = await deliverychallan.findOne({
      where: { id: data.id },
      include: [{ model: deliverychallanitem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "delivery challan created successfully",
      data: deliveryChallan,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_deliverychallan = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, mobileno, date, challanno, customer, items,totalIgst,totalSgst,totalMrp,mainTotal } = req.body;

    const updatechallan = await deliverychallan.findByPk(id);

    if (!updatechallan) {
      return res
        .status(404)
        .json({ status: "false", message: "Delivery challan Not Found" });
    }

    await deliverychallan.update(
      {
        challanno,
        date,
        email,
        mobileno,
        customer,
        totalIgst,totalSgst,totalMrp,mainTotal
      },
      {
        where: { id: id },
      }
    );

    const existingItems = await deliverychallanitem.findAll({
      where: { deliverychallanId: id },
    });
    const updatedProducts = items.map((item) => item.productId);
    const itemsToDelete = existingItems.filter(
      (item) => !updatedProducts.includes(item.productId)
    );

    for (const item of itemsToDelete) {
      await item.destroy();
    }

    // let totalMrp = 0;
    // let totalSgst = 0;
    // let totalIgst = 0;

    for (const item of items) {
      const existingItem = existingItems.find(
        (ei) => ei.productId === item.productId
      );

      if (existingItem) {
        await existingItem.update({
          qty:item.qty,
          mrp: item.mrp,
          quotationno: item.quotationno,
          description:item.description,
          batchno: item.batchno,
          expirydate: item.expirydate
        });
      } else {
        await deliverychallanitem.create({
          deliverychallanId: id,
          productId: id,
          qty:item.qty,
          mrp: item.mrp,
          quotationno: item.quotationno,
          description:item.description,
          batchno: item.batchno,
          expirydate: item.expirydate
        });
      }
      // totalMrp += mrp;

      // const productData = await product.findOne({
      //   where: { productname: item.product },
      // });

      // if (productData) {
      //   totalIgst += (productData.IGST * mrp) / 100;
      //   totalSgst += (productData.SGST * mrp) / 100;
      // }
    }
    // await deliverychallan.update(
    //   {
    //     totalMrp,
    //     totalIgst,
    //     totalSgst,
    //     mainTotal: totalIgst ? totalIgst + totalMrp : totalSgst + totalMrp,
    //   },
    //   { where: { id } }
    // );

    const data = await deliverychallan.findOne({
      where: { id },
      include: [{ model: deliverychallanitem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Delivery challan Update Successfully",
      data: data,
    });
  } catch (error) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal server error" });
  }
};
exports.delete_deliverychallan = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await deliverychallan.destroy({ where: { id: id } });

    if (!data) {
      return res
        .status(400)
        .json({ status: "false", message: "Delivery challan Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Delivery challan Delete Successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_deliverychallanitem = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await deliverychallanitem.destroy({ where: { id: id } });

    if (!data) {
      return res
        .status(400)
        .json({ status: "false", message: "Delivery challan Item Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Delivery challan Item Delete Successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_deliverychallan = async (req, res) => {
  try {
    const data = await deliverychallan.findAll({
      include: [{ model: deliverychallanitem, as: "items",include:[{model:product, as:'DeliveryProduct'}] },{model:customer, as:'DeliveryCustomer'}],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Delivery challan Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Delivery challan Data Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_deliverychallan = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await deliverychallan.findOne({
      where: { id },
      include: [{ model: deliverychallanitem, as: "items",include:[{model:product, as:'DeliveryProduct'}] },{
        model:customer,as:'DeliveryCustomer'
      }],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Delivery challan Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Fetch delivery challan data successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
