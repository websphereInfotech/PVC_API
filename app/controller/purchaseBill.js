const C_product = require("../models/C_product");
const C_purchasebill = require("../models/C_purchasebill");
const C_vendor = require("../models/C_vendor");
const product = require("../models/product");
const purchasebill = require("../models/purchasebill");
const purchasebillItem = require("../models/purchasebill_item");
const vendor = require("../models/vendor");

/*=============================================================================================================
                                          Without Typc C API
 ============================================================================================================ */

exports.create_purchasebill = async (req, res) => {
    try {
      const { vendorId,date, invoiceno, invoicedate, terms, duedate,totalIgst,totalSgst,totalMrp,mainTotal,totalQty,items } = req.body;
      
      const vendorData = await vendor.findByPk(vendorId);
      if(!vendorData) {
        return res.status(404).json({ status:'false', message:'Vendor Not Found'});
      }
      if(!items || items.length === 0) {
        return res.status(400).json({ status:'false', message:'Required Field Of Items'});
      }

      for(const item of items) {
        const productData = await product.findByPk(item.productId);
        if(!productData) {
          return res.status(404).json({ status:'false', message:'Product Not Found'});
        }
      }
      const purchseData = await purchasebill.create({
        vendorId,
        date,
        invoiceno,
        invoicedate,
        terms,
        duedate,
        totalIgst,
        totalSgst,
        totalMrp,
        totalQty,
        mainTotal
      });

    const addToItem = items.map((item) => ({
      purchasebillId:purchseData.id,
      ...item,
    }));

    await purchasebillItem.bulkCreate(addToItem);

    const data = await purchasebill.findOne({
      where:{id: purchseData.id},
      include:[{model:purchasebillItem, as:'items'}]
    });
      return res.status(200).json({ status: "true", message: "Purchase Bill Created Successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
exports.update_purchasebill = async (req, res) => {
    try {
      const { id } = req.params;
      const { vendorId,date, invoiceno, invoicedate, terms, duedate,totalIgst,totalSgst,totalMrp,mainTotal,totalQty,items } = req.body;
  
    const existingPurchase = await purchasebill.findByPk(id);
    if(!existingPurchase) {
      return res.status(404).json({
        status:'false',
        message:'Purchase Bill Not Found'
      });
    }
  const vendorData = await vendor.findByPk(vendorId);
  if(!vendorData) {
    return res.status(404).json({status:'false', message:'Vendor Not Found'})
  }
  for(const item of items) {
    const productData = await product.findByPk(item.productId);
    if(!productData) {
      return res.status(404).json({ status:'false', message:'Product Not Found'});
    }
  }
      await purchasebill.update({
        vendorId,
        date,
        terms,
        duedate,
        invoiceno,
        invoicedate,
        terms,
        duedate,
        totalIgst,
        totalSgst,
        totalMrp,
        totalQty,
        mainTotal
      }, { where: { id } });
  const existingItems = await purchasebillItem.findAll({ where:{ purchasebillId :id}});

  const mergedItems =[];
  items.forEach((item) => {
    let existingItem = mergedItems.find((i) => i.productId === item.productId && i.rate === item.rate);

    if(existingItem){
      existingItem.qty += item.qty
    } else {
      mergedItems.push(item)
    }
  });
  for(const item of mergedItems) {
    const existingItem = existingItems.find((ei) => ei.productId === item.productId && ei.rate === item.rate);

    if(existingItem) {
        existingItem.qty = item.qty;
        await existingItem.save();
    } else {
      await purchasebillItem.create({
        purchasebillId :id,
        productId: item.productId,
        qty: item.qty,
        rate: item.rate,
        mrp: item.mrp
      });
    }
  }
  const updatedProducts = items.map((item) => ({ productId: item.productId, rate: item.rate }));
    
    const itemsToDelete = existingItems.filter(
      (item) => !updatedProducts.some((updatedItem) => updatedItem.productId === item.productId && updatedItem.rate === item.rate)
    );
    
    for (const item of itemsToDelete) {
      await item.destroy();
    }
      const data = await purchasebill.findOne({
        where:{id},
        include:[{model:purchasebillItem, as:'items'}]
      });
      return res.status(200).json({ status: 'true', message: "Purchase Bill Updated Successfully", data: data });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.delete_purchasebill = async (req, res) => {
    try {
      const { id } = req.params;
      const billId = await purchasebill.destroy({ where: { id: id } });
  
      if (billId) {
        return res.status(200).json({ status: "true", message: "Purchase Bill Delete Successfully" });
      } else {
        return res.status(404).json({ status: "False", message: "Purchase Bill Not Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.get_all_purchasebill = async (req, res) => {
    try {
      const data = await purchasebill.findAll({
        include: [{ model: purchasebillItem,as:'items',include:[{model:product, as:'purchseProduct'}]}, {model: vendor, as:'purchseVendor'}]
      });
  
      if (data) {
        return res.status(200).json({ status: "true", message: "All Purchase data show Successfully", data: data });
      } else {
        return res.status(404).json({ status: "false", message: "Purchase Bill Not Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.view_purchasebill = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await purchasebill.findOne({
        where: { id },
        include: [{ model: purchasebillItem,as:'items',include:[{model:product,as:'purchseProduct'}] }, {model:vendor, as:'purchseVendor'}]
      });
      if (data) {
        return res.status(200).json({ status: "true", message: "Purchase data show Successfully", data: data });
      } else {
        return res.status(404).json({ status: "false", message: "Purchase Bill Not Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }

/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */

  exports.C_create_purchasebill = async (req, res) => {
    try {
      const { vendorId,date,totalMrp,items } = req.body;
      
      const vendorData = await C_vendor.findByPk(vendorId);
      if(!vendorData) {
        return res.status(404).json({ status:'false', message:'Vendor Not Found'});
      }
      if(!items || items.length === 0) {
        return res.status(400).json({ status:'false', message:'Required Field Of Items'});
      }

      for(const item of items) {
        const productData = await C_product.findByPk(item.productId);
        if(!productData) {
          return res.status(404).json({ status:'false', message:'Product Not Found'});
        }
      }
      const purchseData = await C_purchasebill.create({
        vendorId,
        date,
        totalMrp,
      });

    const addToItem = items.map((item) => ({
      PurchaseId:purchseData.id,
      ...item,
    }));

    await C_purchaseBillItem.bulkCreate(addToItem);

    const data = await C_purchasebill.findOne({
      where:{id: purchseData.id},
      include:[{model:C_purchaseBillItem, as:'items'}]
    });
      return res.status(200).json({ status: "true", message: "Purchase Bill Created Successfully", data: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.C_update_purchasebill = async (req, res) => {
    try {
      const { id } = req.params;

      console.log("id>>>>>>>>>>>>",id);
      const { vendorId,date,totalMrp,items } = req.body;
  
    const existingPurchase = await C_purchasebill.findByPk(id);
    if(!existingPurchase) {
      return res.status(404).json({
        status:'false',
        message:'Purchase Bill Not Found'
      });
    }
  const vendorData = await C_vendor.findByPk(vendorId);
  if(!vendorData) {
    return res.status(404).json({status:'false', message:'Vendor Not Found'})
  }
  for(const item of items) {
    const productData = await C_product.findByPk(item.productId);
    if(!productData) {
      return res.status(404).json({ status:'false', message:'Product Not Found'});
    }
  }
      await C_purchasebill.update({
        vendorId,
        date,
        totalMrp,
      }, { where: { id } });
  const existingItems = await C_purchaseBillItem.findAll({ where:{ PurchaseId :id}});

  const mergedItems =[];
  items.forEach((item) => {
    let existingItem = mergedItems.find((i) => i.productId === item.productId && i.rate === item.rate);

    if(existingItem){
      existingItem.qty += item.qty
    } else {
      mergedItems.push(item)
    }
  });
  for(const item of mergedItems) {
    const existingItem = existingItems.find((ei) => ei.productId === item.productId && ei.rate === item.rate);

    if(existingItem) {
        existingItem.qty = item.qty;
        await existingItem.save();
    } else {
      await C_purchaseBillItem.create({
        PurchaseId :id,
        productId: item.productId,
        qty: item.qty,
        rate: item.rate,
        mrp: item.mrp
      });
    }
  }
  const updatedProducts = items.map((item) => ({ productId: item.productId, rate: item.rate }));
    
    const itemsToDelete = existingItems.filter(
      (item) => !updatedProducts.some((updatedItem) => updatedItem.productId === item.productId && updatedItem.rate === item.rate)
    );
    
    for (const item of itemsToDelete) {
      await item.destroy();
    }
      const data = await C_purchasebill.findOne({
        where:{id},
        include:[{model:C_purchaseBillItem, as:'items'}]
      });
      return res.status(200).json({ status: 'true', message: "Purchase Bill Updated Successfully", data: data });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.C_delete_purchasebill = async (req, res) => {
    try {
      const { id } = req.params;
      const billId = await C_purchasebill.destroy({ where: { id: id } });
  
      if (billId) {
        return res.status(200).json({ status: "true", message: "Purchase Bill Delete Successfully" });
      } else {
        return res.status(404).json({ status: "False", message: "Purchase Bill Not Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.C_get_all_purchasebill = async (req, res) => {
    try {
      const data = await C_purchasebill.findAll({
        include: [{ model: C_purchaseBillItem, as: "items",include:[{model:C_product, as:'ProductPurchase'}] },{ model:C_vendor, as:'VendorPurchase'}]
      });
  
      if (data) {
        return res.status(200).json({ status: "true", message: "All Purchase data show Successfully", data: data });
      } else {
        return res.status(404).json({ status: "false", message: "Purchase Bill Not Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }
  exports.C_view_purchasebill = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await C_purchasebill.findOne({
        where: { id },
        include: [{ model: C_purchaseBillItem, as: "items",include:[{model:C_product, as:'ProductPurchase'}] },{ model:C_vendor, as:'VendorPurchase'}], 
      });
      if (data) {
        return res.status(200).json({ status: "true", message: "Purchase data show Successfully", data: data });
      } else {
        return res.status(404).json({ status: "false", message: "Purchase Bill Not Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "false", message: "Internal Server Error" });
    }
  }