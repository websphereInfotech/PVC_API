const CostingSetting = require("../models/costingSetting");
const Recipe = require("../models/recipe");
const ItemType = require("../models/ItemType");
const ItemGroup = require("../models/ItemGroup");
const ItemCategory = require("../models/ItemCategory");
const ItemSubCategory = require("../models/ItemSubCategory");
const Product = require("../models/product");
const { Op } = require("sequelize");

const getUserId = (req) => req.user.userId || req.user.id;
const getCompanyId = (req) => req.user.companyId;

const includeRecipe = [
  {
    model: Recipe,
    as: "recipeDetail",
    attributes: ["id", "name", "total_usage", "total_amount", "final_value", "items"],
  },
  { model: ItemType, as: "itemType", attributes: ["id", "name"] },
  { model: ItemGroup, as: "itemGroup", attributes: ["id", "name"] },
  { model: ItemCategory, as: "itemCategory", attributes: ["id", "name"] },
  { model: ItemSubCategory, as: "itemSubCategory", attributes: ["id", "name"] },
];

const nullableNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  return Number(value);
};

const numberValue = (value) => Number(value || 0);
const withMargin = (value, margin) => value * (1 + numberValue(margin) / 100);
const percentageAmount = (value, margin) => value * (numberValue(margin) / 100);
const roundCurrency = (value) => Number(numberValue(value).toFixed(2));

const buildScopeWhere = (source, companyId) => ({
  companyId,
  itemTypeId: nullableNumber(source.itemTypeId),
  itemGroupId: nullableNumber(source.itemGroupId),
  itemCategoryId: nullableNumber(source.itemCategoryId),
  itemSubCategoryId: null,
});

const normalizePayload = (body) => {
  const payload = { ...body };

  if (payload.business_id && !payload.companyId) {
    payload.companyId = payload.business_id;
  }

  if (payload.tierMargins) {
    payload.starMargin = payload.tierMargins.star;
    payload.goldMargin = payload.tierMargins.gold;
    payload.silverMargin = payload.tierMargins.silver;
  }

  payload.itemTypeId = nullableNumber(payload.itemTypeId);
  payload.itemGroupId = nullableNumber(payload.itemGroupId);
  payload.itemCategoryId = nullableNumber(payload.itemCategoryId);
  payload.itemSubCategoryId = null;
  payload.recipeId = nullableNumber(payload.recipeId);

  delete payload.business_id;
  delete payload.tierMargins;
  delete payload.id;
  delete payload.createdBy;
  delete payload.updatedBy;

  return payload;
};

const formatSetting = (setting) => {
  if (!setting) return null;

  return {
    id: setting.id,
    resinRate: setting.resinRate,
    brassRate: setting.brassRate,
    profitMargin: setting.profitMargin,
    multiplier: setting.multiplier,
    tierMargins: {
      star: setting.starMargin,
      gold: setting.goldMargin,
      silver: setting.silverMargin,
    },
    refMargin: setting.refMargin,
    cdMargin: setting.cdMargin,
    todMargin: setting.todMargin,
    discountBaseColumn: setting.discountBaseColumn || "net",
    companyId: setting.companyId,
    business_id: setting.companyId,
    itemTypeId: setting.itemTypeId,
    itemGroupId: setting.itemGroupId,
    itemCategoryId: setting.itemCategoryId,
    itemSubCategoryId: setting.itemSubCategoryId,
    itemType: setting.itemType || null,
    itemGroup: setting.itemGroup || null,
    itemCategory: setting.itemCategory || null,
    itemSubCategory: setting.itemSubCategory || null,
    recipeId: setting.recipeId,
    recipeDetail: setting.recipeDetail || null,
    createdBy: setting.createdBy,
    updatedBy: setting.updatedBy,
    createdAt: setting.createdAt,
    updatedAt: setting.updatedAt,
  };
};

const getSettingScopeKey = (source) => [
  source.itemTypeId || "",
  source.itemGroupId || "",
  source.itemCategoryId || "",
].join("|");

const calculateProductPricing = (product, setting) => {
  if (!setting) {
    return {
      pricingAvailable: false,
      costingSettingId: null,
      message: "Costing setting not found for product category scope",
    };
  }

  const basePerKg = numberValue(setting.recipeDetail?.final_value ?? setting.resinRate);
  const landed = numberValue(product.weight) * basePerKg;
  const tierValues = {
    net: withMargin(landed, setting.profitMargin),
    star: withMargin(landed, setting.starMargin),
    gold: withMargin(landed, setting.goldMargin),
    silver: withMargin(landed, setting.silverMargin),
  };
  const discountBaseColumn = Object.prototype.hasOwnProperty.call(
    tierValues,
    setting.discountBaseColumn
  )
    ? setting.discountBaseColumn
    : "net";
  const selectedTierValue = tierValues[discountBaseColumn];
  const refValue = percentageAmount(selectedTierValue, setting.refMargin);
  const cdValue = percentageAmount(selectedTierValue, setting.cdMargin);
  const todValue = percentageAmount(selectedTierValue, setting.todMargin);
  const finalValue = selectedTierValue + refValue + cdValue + todValue;
  const priceList = numberValue(product.weight) * numberValue(setting.multiplier);
  const discountPercent = priceList ? ((priceList - finalValue) / priceList) * 100 : 0;

  return {
    pricingAvailable: true,
    costingSettingId: setting.id,
    recipeId: setting.recipeId,
    recipeName: setting.recipeDetail?.name || null,
    basePerKg: roundCurrency(basePerKg),
    weight: numberValue(product.weight),
    landed: roundCurrency(landed),
    discountBaseColumn,
    tierValues: {
      net: roundCurrency(tierValues.net),
      star: roundCurrency(tierValues.star),
      gold: roundCurrency(tierValues.gold),
      silver: roundCurrency(tierValues.silver),
    },
    selectedTierValue: roundCurrency(selectedTierValue),
    refValue: roundCurrency(refValue),
    cdValue: roundCurrency(cdValue),
    todValue: roundCurrency(todValue),
    finalValue: roundCurrency(finalValue),
    priceList: roundCurrency(priceList),
    discountPercent: roundCurrency(discountPercent),
    margins: {
      net: numberValue(setting.profitMargin),
      star: numberValue(setting.starMargin),
      gold: numberValue(setting.goldMargin),
      silver: numberValue(setting.silverMargin),
      ref: numberValue(setting.refMargin),
      cd: numberValue(setting.cdMargin),
      tod: numberValue(setting.todMargin),
    },
    multiplier: numberValue(setting.multiplier),
  };
};

const formatProductPricing = (product, setting) => ({
  productId: product.id,
  productName: product.productname,
  description: product.description,
  size: product.size,
  unit: product.unit,
  weight: product.weight,
  hsnCode: product.HSNcode,
  gstRate: product.gstrate,
  companyId: product.companyId,
  itemTypeId: product.itemTypeId,
  itemGroupId: product.itemGroupId,
  itemCategoryId: product.itemCategoryId,
  itemSubCategoryId: product.itemSubCategoryId,
  itemType: product.itemType ? { id: product.itemType.id, name: product.itemType.name } : null,
  itemGroup: product.itemGroup ? { id: product.itemGroup.id, name: product.itemGroup.name } : null,
  itemCategory: product.itemCategory
    ? { id: product.itemCategory.id, name: product.itemCategory.name }
    : null,
  itemSubCategory: product.itemSubCategory
    ? { id: product.itemSubCategory.id, name: product.itemSubCategory.name }
    : null,
  pricing: calculateProductPricing(product, setting),
});

exports.getAllByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const companyId = getCompanyId(req) || businessId;
    const data = await CostingSetting.findAll({
      where: { companyId },
      include: includeRecipe,
      order: [["updatedAt", "DESC"]],
    });

    return res.json({ status: "true", data: data.map(formatSetting) });
  } catch (e) {
    return res.status(400).json({ status: "false", message: e.message });
  }
};

exports.getByScope = async (req, res) => {
  try {
    const companyId = getCompanyId(req) || req.query.companyId || req.query.business_id;
    const data = await CostingSetting.findOne({
      where: buildScopeWhere(req.query, companyId),
      include: includeRecipe,
      order: [["updatedAt", "DESC"]],
    });

    return res.json({ status: "true", data: formatSetting(data) });
  } catch (e) {
    return res.status(400).json({ status: "false", message: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = getCompanyId(req);
    const data = await CostingSetting.findOne({
      where: { id, companyId },
      include: includeRecipe,
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Costing setting not found" });
    }

    return res.json({ status: "true", data: formatSetting(data) });
  } catch (e) {
    return res.status(400).json({ status: "false", message: e.message });
  }
};

exports.getProductPricing = async (req, res) => {
  try {
    const companyId = nullableNumber(req.query.companyId || req.query.business_id);
    const productId = nullableNumber(req.query.productId);
    const search = req.query.search || req.query.productName || req.query.name;

    if (!companyId) {
      return res
        .status(400)
        .json({ status: "false", message: "companyId or business_id is required" });
    }

    const productWhere = {
      companyId,
      isActive: true,
    };

    if (productId) {
      productWhere.id = productId;
    }

    if (search) {
      productWhere[Op.or] = [
        { productname: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const products = await Product.findAll({
      where: productWhere,
      include: [
        { model: ItemType, as: "itemType", attributes: ["id", "name"] },
        { model: ItemGroup, as: "itemGroup", attributes: ["id", "name"] },
        { model: ItemCategory, as: "itemCategory", attributes: ["id", "name"] },
        { model: ItemSubCategory, as: "itemSubCategory", attributes: ["id", "name"] },
      ],
      order: [["productname", "ASC"], ["size", "ASC"], ["id", "ASC"]],
    });

    if (productId && !products.length) {
      return res
        .status(404)
        .json({ status: "false", message: "Product not found" });
    }

    const costingSettings = await CostingSetting.findAll({
      where: { companyId, itemSubCategoryId: null },
      include: includeRecipe,
      order: [["updatedAt", "DESC"]],
    });
    const settingByScope = new Map();

    costingSettings.forEach((setting) => {
      const key = getSettingScopeKey(setting);
      if (!settingByScope.has(key)) {
        settingByScope.set(key, setting);
      }
    });

    const data = products.map((product) =>
      formatProductPricing(product, settingByScope.get(getSettingScopeKey(product)))
    );

    return res.json({
      status: "true",
      data,
      count: data.length,
      pricedCount: data.filter((item) => item.pricing.pricingAvailable).length,
    });
  } catch (e) {
    return res.status(400).json({ status: "false", message: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const userId = getUserId(req);
    const companyId = getCompanyId(req) || req.body.companyId || req.body.business_id;
    const payload = normalizePayload(req.body);

    const data = await CostingSetting.create({
      ...payload,
      companyId,
      createdBy: userId,
      updatedBy: userId,
    });

    const setting = await CostingSetting.findByPk(data.id, {
      include: includeRecipe,
    });

    return res.json({
      status: "true",
      message: "Costing setting created successfully",
      data: formatSetting(setting),
    });
  } catch (e) {
    return res.status(400).json({ status: "false", message: e.message });
  }
};

exports.saveByScope = async (req, res) => {
  try {
    const userId = getUserId(req);
    const companyId = getCompanyId(req) || req.body.companyId || req.body.business_id;
    const payload = normalizePayload(req.body);
    const scopeWhere = buildScopeWhere(payload, companyId);

    let setting = await CostingSetting.findOne({ where: scopeWhere });

    if (setting) {
      await setting.update({
        ...payload,
        companyId,
        updatedBy: userId,
      });
    } else {
      setting = await CostingSetting.create({
        ...payload,
        companyId,
        createdBy: userId,
        updatedBy: userId,
      });
    }

    const data = await CostingSetting.findByPk(setting.id, {
      include: includeRecipe,
    });

    return res.json({
      status: "true",
      message: "Costing setting saved successfully",
      data: formatSetting(data),
    });
  } catch (e) {
    return res.status(400).json({ status: "false", message: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const companyId = getCompanyId(req);
    const payload = normalizePayload(req.body);

    delete payload.companyId;

    const setting = await CostingSetting.findOne({ where: { id, companyId } });
    if (!setting) {
      return res
        .status(404)
        .json({ status: "false", message: "Costing setting not found" });
    }

    await setting.update({
      ...payload,
      updatedBy: userId,
    });

    const data = await CostingSetting.findOne({
      where: { id, companyId },
      include: includeRecipe,
    });

    return res.json({
      status: "true",
      message: "Costing setting updated successfully",
      data: formatSetting(data),
    });
  } catch (e) {
    return res.status(400).json({ status: "false", message: e.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = getCompanyId(req);
    const deleted = await CostingSetting.destroy({
      where: { id, companyId },
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ status: "false", message: "Costing setting not found" });
    }

    return res.json({
      status: "true",
      message: "Costing setting deleted successfully",
    });
  } catch (e) {
    return res.status(400).json({ status: "false", message: e.message });
  }
};
