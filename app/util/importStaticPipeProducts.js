"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const sequelize = require("../config/index");
const ItemType = require("../models/ItemType");
const ItemGroup = require("../models/ItemGroup");
const ItemCategory = require("../models/ItemCategory");
const ItemSubCategory = require("../models/ItemSubCategory");
const Product = require("../models/product");
const Stock = require("../models/stock");

const DEFAULT_SOURCE =
  "C:/Users/vraja/.codex/attachments/739ed0dc-4b54-4f52-86b7-1436b36b54d9/pasted-text.txt";

const sourcePath = process.argv.includes("--source")
  ? process.argv[process.argv.indexOf("--source") + 1]
  : DEFAULT_SOURCE;
const shouldApply = process.argv.includes("--apply");
const shouldVerify = process.argv.includes("--verify");
const shouldNormalize = process.argv.includes("--normalize");
const shouldSyncProductNames = process.argv.includes("--sync-product-names");
const shouldCleanupOld = process.argv.includes("--cleanup-old");
const showDuplicates = process.argv.includes("--show-duplicates");
const companyId = Number(process.argv.includes("--company-id") ? process.argv[process.argv.indexOf("--company-id") + 1] : 1);
const userId = Number(process.argv.includes("--user-id") ? process.argv[process.argv.indexOf("--user-id") + 1] : 1);

const SOURCE_HIERARCHY = {
  OSPRAY_PIPES_DB: { itemType: "Pipes", itemGroup: "AGRI Pipes", itemCategory: "Osprey" },
  GOLDFINCH_PIPES_DB: { itemType: "Pipes", itemGroup: "AGRI Pipes", itemCategory: "Gold Finch" },
  PEREGRINE_PIPES_DB: { itemType: "Pipes", itemGroup: "AGRI Pipes", itemCategory: "Peregrine" },
  PIPE_SWR_GOLDFINCH_3_DB: { itemType: "Pipes", itemGroup: "SWR Pipes", itemCategory: "Gold Finch 3" },
  PIPE_SWR_OSPREY_3_DB: { itemType: "Pipes", itemGroup: "SWR Pipes", itemCategory: "Osprey 3" },
  PIPE_SWR_PRO_PEREGRINE_3_DB: { itemType: "Pipes", itemGroup: "SWR Pipes", itemCategory: "Pro - Peregrine 3" },
  PIPE_SWR_PRO_TECZA_3_DB: { itemType: "Pipes", itemGroup: "SWR Pipes", itemCategory: "Pro Tecza 3" },
  PIPE_SWR_PLUS_PEREGRINE_3_DB: { itemType: "Pipes", itemGroup: "SWR Pipes", itemCategory: "Plus - Peregrine 3" },
  PIPE_SWR_PLUS_TECZA_3_DB: { itemType: "Pipes", itemGroup: "SWR Pipes", itemCategory: "Plus Tecza 3" },
  PIPE_UPVC_PERGRINE_3_6_DB: { itemType: "Pipes", itemGroup: "UPVC Pipes", itemCategory: "Peregrine 3-6" },
  PIPE_UPVC_GOLDFINCH_3_DB: { itemType: "Pipes", itemGroup: "UPVC Pipes", itemCategory: "Gold Finch 3" },
  PIPE_CPVC_PEREGRINE_3_6_DB: { itemType: "Pipes", itemGroup: "CPVC Pipes", itemCategory: "Peregrine 3-6" },
  PIPE_CASING_OSPREY_6_DB: { itemType: "Pipes", itemGroup: "Casing Pipes", itemCategory: "Gold Finch Casing" },
  PIPE_CASING_GOLDFINCH_6_DB: { itemType: "Pipes", itemGroup: "Casing Pipes", itemCategory: "Commercial Casing" },
  PIPE_THREADED_CS_DB: { itemType: "Pipes", itemGroup: "Threaded Casing Pipes", itemCategory: "CS" },
  PIPE_THREADED_CM_DB: { itemType: "Pipes", itemGroup: "Threaded Casing Pipes", itemCategory: "CM" },
  PIPE_THREADED_CD_DB: { itemType: "Pipes", itemGroup: "Threaded Casing Pipes", itemCategory: "CD" },
  PIPE_THREADED_RIBBED_DB: { itemType: "Pipes", itemGroup: "Threaded Casing Pipes", itemCategory: "Ribbed" },
  PIPE_THREADED_STRAINER_CHARGES_DB: { itemType: "Pipes", itemGroup: "Threaded Casing Pipes", itemCategory: "Strainer Charges" },
  PIPE_HALF_PEREGRINE_DB: { itemType: "Pipes", itemGroup: "Half Round Pipes", itemCategory: "Peregrine" },
  PIPE_HALF_OSPREY_DB: { itemType: "Pipes", itemGroup: "Half Round Pipes", itemCategory: "Osprey" },
  PIPE_HALF_GOLDFINCH_DB: { itemType: "Pipes", itemGroup: "Half Round Pipes", itemCategory: "Gold Finch" },
};

const EXPECTED_SUMMARY = {
  products: 254,
  itemTypes: 1,
  itemGroups: 7,
  itemCategories: 22,
  itemSubCategories: 44,
};

const readProductExports = (filePath) => {
  const source = fs.readFileSync(filePath, "utf8");
  const exportNames = [...source.matchAll(/export const (\w+)\s*:\s*ProductData\[\]\s*=\s*\[/g)].map((match) => match[1]);
  const runnableSource = source.replace(/export const (\w+)\s*:\s*ProductData\[\]\s*=/g, "globalThis.$1 =");
  const context = {};

  vm.createContext(context);
  vm.runInContext(runnableSource, context, { filename: path.basename(filePath) });

  return exportNames.flatMap((exportName) => {
    const rows = Array.isArray(context[exportName]) ? context[exportName] : [];
    return rows.map((row) => ({ source: exportName, ...row }));
  });
};

const titleCaseToken = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());

const normalizeCategoryToken = (value) => {
  const normalized = String(value || "")
    .replace(/PERGRINE/g, "PEREGRINE")
    .replace(/OSPRA?Y/g, "OSPRAY");

  return titleCaseToken(normalized.replace(/_/g, " "));
};

const deriveHierarchyFromSource = (source, isPipe) => {
  if (SOURCE_HIERARCHY[source]) {
    return SOURCE_HIERARCHY[source];
  }

  const withoutSuffix = source.replace(/_DB$/, "");

  if (!withoutSuffix.startsWith("PIPE_")) {
    const brand = withoutSuffix.replace(/_PIPES$/, "");
    return {
      itemType: isPipe ? "Pipes" : "Pipe Accessories",
      itemGroup: "AGRI",
      itemCategory: normalizeCategoryToken(brand),
    };
  }

  const parts = withoutSuffix.replace(/^PIPE_/, "").split("_").filter(Boolean);
  const family = parts[0] || "GENERAL";
  const categoryParts = parts.slice(1).filter((part) => !/^\d+$/.test(part));

  return {
    itemType: isPipe ? "Pipes" : "Pipe Accessories",
    itemGroup: family,
    itemCategory: normalizeCategoryToken(categoryParts.join(" ") || family),
  };
};

const validateSummary = (summary) => {
  const mismatches = Object.entries(EXPECTED_SUMMARY).filter(([key, expected]) => summary[key] !== expected);

  if (mismatches.length) {
    const details = mismatches.map(([key, expected]) => `${key}: expected ${expected}, received ${summary[key]}`).join("; ");
    throw new Error(`Static pipe import preflight failed. ${details}`);
  }
};

const mapRow = (row) => {
  const { itemType, itemGroup, itemCategory } = deriveHierarchyFromSource(row.source, row.isPipe);
  const subCategoryName = row.group || "General";

  return {
    source: row.source,
    itemType,
    itemGroup,
    itemCategory,
    itemSubCategory: subCategoryName,
    productname: row.name,
    description: row.name,
    size: row.size,
    unit: row.isPipe ? "pcs." : "pcs.",
    weight: Number(row.weight || 0),
    purchaseprice: 0,
    salesprice: 0,
    gstrate: 18,
    HSNcode: 0,
    raw: row,
  };
};

const summarize = (mappedRows) => {
  const unique = (selector) => new Set(mappedRows.map(selector).filter(Boolean));
  const productKeys = mappedRows.map(
    (row) => `${row.itemType}|${row.itemGroup}|${row.itemCategory}|${row.itemSubCategory}|${row.productname}|${row.size}|${row.weight}`
  );
  const globalProductNames = mappedRows.map((row) => row.productname);
  const duplicateProducts = productKeys.length - new Set(productKeys).size;
  const duplicateProductNames = globalProductNames.length - new Set(globalProductNames).size;

  return {
    products: mappedRows.length,
    itemTypes: unique((row) => row.itemType).size,
    itemGroups: unique((row) => `${row.itemType}|${row.itemGroup}`).size,
    itemCategories: unique((row) => `${row.itemType}|${row.itemGroup}|${row.itemCategory}`).size,
    itemSubCategories: unique((row) => `${row.itemType}|${row.itemGroup}|${row.itemCategory}|${row.itemSubCategory}`).size,
    duplicateProducts,
    duplicateProductNames,
    sources: [...unique((row) => row.source)].sort(),
  };
};

const findOrCreate = async (model, where, defaults, transaction) => {
  const [record] = await model.findOrCreate({
    where,
    defaults: { ...where, ...defaults },
    transaction,
  });

  if (record.name && where.name && record.name !== where.name) {
    await record.update({ name: where.name, updatedBy: defaults.updatedBy }, { transaction });
  }

  return record;
};

const ensureStaticProductColumns = async () => {
  const tableName = "P_products";
  const schemaName = process.env.DB_NAME;
  const columns = [
    { name: "size", definition: "VARCHAR(255) NULL" },
  ];

  for (const column of columns) {
    const [existing] = await sequelize.query(
      "SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?",
      { replacements: [schemaName, tableName, column.name] }
    );

    if (!existing[0].count) {
      await sequelize.query(`ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.definition}`);
      console.log(`Added ${tableName}.${column.name}`);
    }
  }

  await sequelize.query("CREATE TABLE IF NOT EXISTS SequelizeMeta (name VARCHAR(255) NOT NULL PRIMARY KEY)");
  await sequelize.query("INSERT IGNORE INTO SequelizeMeta (name) VALUES (?)", {
    replacements: ["20260707002000-add-static-costing-fields-to-products.js"],
  });
};

const quoteIdentifier = (value) => `\`${String(value).replace(/`/g, "``")}\``;

const applyImport = async (mappedRows) => {
  await ensureStaticProductColumns();

  return sequelize.transaction(async (transaction) => {
    await Product.update(
      { isActive: false, updatedBy: userId },
      {
        where: { companyId, isActive: true },
        transaction,
      }
    );

    const itemTypeCache = new Map();
    const itemGroupCache = new Map();
    const itemCategoryCache = new Map();
    const itemSubCategoryCache = new Map();
    let createdProducts = 0;

    for (const row of mappedRows) {
      const typeKey = row.itemType;
      if (!itemTypeCache.has(typeKey)) {
        const itemType = await findOrCreate(
          ItemType,
          { name: row.itemType, companyId },
          { createdBy: userId, updatedBy: userId },
          transaction
        );
        itemTypeCache.set(typeKey, itemType);
      }
      const itemType = itemTypeCache.get(typeKey);

      const groupKey = `${itemType.id}|${row.itemGroup}`;
      if (!itemGroupCache.has(groupKey)) {
        const itemGroup = await findOrCreate(
          ItemGroup,
          { name: row.itemGroup, itemTypeId: itemType.id, companyId },
          { createdBy: userId, updatedBy: userId },
          transaction
        );
        itemGroupCache.set(groupKey, itemGroup);
      }
      const itemGroup = itemGroupCache.get(groupKey);

      const categoryKey = `${itemGroup.id}|${row.itemCategory}`;
      if (!itemCategoryCache.has(categoryKey)) {
        const itemCategory = await findOrCreate(
          ItemCategory,
          { name: row.itemCategory, itemGroupId: itemGroup.id, companyId },
          { createdBy: userId, updatedBy: userId },
          transaction
        );
        itemCategoryCache.set(categoryKey, itemCategory);
      }
      const itemCategory = itemCategoryCache.get(categoryKey);

      const subCategoryKey = `${itemCategory.id}|${row.itemSubCategory}`;
      if (!itemSubCategoryCache.has(subCategoryKey)) {
        const itemSubCategory = await findOrCreate(
          ItemSubCategory,
          { name: row.itemSubCategory, itemCategoryId: itemCategory.id, companyId },
          { createdBy: userId, updatedBy: userId },
          transaction
        );
        itemSubCategoryCache.set(subCategoryKey, itemSubCategory);
      }
      const itemSubCategory = itemSubCategoryCache.get(subCategoryKey);

      const product = await Product.create(
        {
          itemTypeId: itemType.id,
          productname: row.productname,
          description: row.description,
          size: row.size,
          itemGroupId: itemGroup.id,
          itemCategoryId: itemCategory.id,
          itemSubCategoryId: itemSubCategory.id,
          unit: row.unit,
          openingstock: true,
          nagativeqty: false,
          lowstock: false,
          lowStockQty: null,
          salesprice: row.salesprice,
          purchaseprice: row.purchaseprice,
          gstrate: row.gstrate,
          HSNcode: row.HSNcode,
          cess: false,
          wastage: false,
          finished_goods: true,
          raw_material: false,
          spare: false,
          weight: row.weight,
          companyId,
          createdBy: userId,
          updatedBy: userId,
        },
        { transaction }
      );

      await Stock.create(
        {
          productId: product.id,
          qty: 0,
          updatedBy: userId,
        },
        { transaction }
      );

      createdProducts += 1;
    }

    return {
      itemTypes: itemTypeCache.size,
      itemGroups: itemGroupCache.size,
      itemCategories: itemCategoryCache.size,
      itemSubCategories: itemSubCategoryCache.size,
      products: createdProducts,
    };
  });
};

const normalizeHierarchyNames = async (mappedRows) => {
  return sequelize.transaction(async (transaction) => {
    const itemTypeCache = new Map();
    const itemGroupCache = new Map();
    const itemCategoryCache = new Map();
    const itemSubCategoryCache = new Map();
    let updatedRecords = 0;

    const updateName = async (record, desiredName) => {
      if (record && record.name !== desiredName) {
        await record.update({ name: desiredName, updatedBy: userId }, { transaction });
        updatedRecords += 1;
      }
    };

    for (const row of mappedRows) {
      const typeKey = row.itemType;
      if (!itemTypeCache.has(typeKey)) {
        const itemType = await ItemType.findOne({
          where: { name: row.itemType, companyId },
          transaction,
        });
        await updateName(itemType, row.itemType);
        itemTypeCache.set(typeKey, itemType);
      }
      const itemType = itemTypeCache.get(typeKey);
      if (!itemType) continue;

      const groupKey = `${itemType.id}|${row.itemGroup}`;
      if (!itemGroupCache.has(groupKey)) {
        const itemGroup = await ItemGroup.findOne({
          where: { name: row.itemGroup, itemTypeId: itemType.id, companyId },
          transaction,
        });
        await updateName(itemGroup, row.itemGroup);
        itemGroupCache.set(groupKey, itemGroup);
      }
      const itemGroup = itemGroupCache.get(groupKey);
      if (!itemGroup) continue;

      const categoryKey = `${itemGroup.id}|${row.itemCategory}`;
      if (!itemCategoryCache.has(categoryKey)) {
        const itemCategory = await ItemCategory.findOne({
          where: { name: row.itemCategory, itemGroupId: itemGroup.id, companyId },
          transaction,
        });
        await updateName(itemCategory, row.itemCategory);
        itemCategoryCache.set(categoryKey, itemCategory);
      }
      const itemCategory = itemCategoryCache.get(categoryKey);
      if (!itemCategory) continue;

      const subCategoryKey = `${itemCategory.id}|${row.itemSubCategory}`;
      if (!itemSubCategoryCache.has(subCategoryKey)) {
        const itemSubCategory = await ItemSubCategory.findOne({
          where: { name: row.itemSubCategory, itemCategoryId: itemCategory.id, companyId },
          transaction,
        });
        await updateName(itemSubCategory, row.itemSubCategory);
        itemSubCategoryCache.set(subCategoryKey, itemSubCategory);
      }
    }

    return { updatedRecords };
  });
};

const syncActiveProductNames = async () => {
  const [result] = await sequelize.query(
    "UPDATE P_products SET productname = description, updatedBy = ? WHERE companyId = ? AND isActive = true AND COALESCE(productname, '') <> COALESCE(description, '')",
    { replacements: [userId, companyId] }
  );

  return { updatedProducts: result.affectedRows || 0 };
};

const buildInactiveUnreferencedWhere = async () => {
  const [referenceTables] = await sequelize.query(
    `SELECT TABLE_NAME AS tableName
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ?
      AND COLUMN_NAME = 'productId'
      AND TABLE_NAME NOT IN ('P_products', 'P_stocks')`,
    { replacements: [process.env.DB_NAME] }
  );
  const referenceChecks = referenceTables.map(
    (row) => `EXISTS (SELECT 1 FROM ${quoteIdentifier(row.tableName)} ref WHERE ref.productId = p.id)`
  );
  const referenceClause = referenceChecks.length ? `AND NOT (${referenceChecks.join(" OR ")})` : "";

  return {
    referenceTables: referenceTables.map((row) => row.tableName),
    sql: `p.companyId = ? AND p.isActive = false ${referenceClause}`,
  };
};

const cleanupOldInactiveData = async () => {
  const inactiveWhere = await buildInactiveUnreferencedWhere();

  return sequelize.transaction(async (transaction) => {
    const [inactiveProducts] = await sequelize.query(
      "SELECT COUNT(*) AS count FROM P_products p WHERE p.companyId = ? AND p.isActive = false",
      { replacements: [companyId], transaction }
    );
    const [deletableProducts] = await sequelize.query(
      `SELECT COUNT(*) AS count FROM P_products p WHERE ${inactiveWhere.sql}`,
      { replacements: [companyId], transaction }
    );

    const [deletedStocks] = await sequelize.query(
      `DELETE s FROM P_stocks s INNER JOIN P_products p ON p.id = s.productId WHERE ${inactiveWhere.sql}`,
      { replacements: [companyId], transaction }
    );
    const [deletedProducts] = await sequelize.query(
      `DELETE p FROM P_products p WHERE ${inactiveWhere.sql}`,
      { replacements: [companyId], transaction }
    );

    const [deletedSubCategories] = await sequelize.query(
      `DELETE isc FROM P_ItemSubCategories isc
      LEFT JOIN P_products p ON p.itemSubCategoryId = isc.id AND p.companyId = isc.companyId
      WHERE isc.companyId = ? AND p.id IS NULL`,
      { replacements: [companyId], transaction }
    );
    const [deletedCategories] = await sequelize.query(
      `DELETE ic FROM P_ItemCategories ic
      LEFT JOIN P_ItemSubCategories isc ON isc.itemCategoryId = ic.id AND isc.companyId = ic.companyId
      LEFT JOIN P_products p ON p.itemCategoryId = ic.id AND p.companyId = ic.companyId
      WHERE ic.companyId = ? AND isc.id IS NULL AND p.id IS NULL`,
      { replacements: [companyId], transaction }
    );
    const [deletedGroups] = await sequelize.query(
      `DELETE ig FROM P_ItemGroups ig
      LEFT JOIN P_ItemCategories ic ON ic.itemGroupId = ig.id AND ic.companyId = ig.companyId
      LEFT JOIN P_products p ON p.itemGroupId = ig.id AND p.companyId = ig.companyId
      WHERE ig.companyId = ? AND ic.id IS NULL AND p.id IS NULL`,
      { replacements: [companyId], transaction }
    );
    const [deletedTypes] = await sequelize.query(
      `DELETE it FROM P_ItemTypes it
      LEFT JOIN P_ItemGroups ig ON ig.itemTypeId = it.id AND ig.companyId = it.companyId
      LEFT JOIN P_products p ON p.itemTypeId = it.id AND p.companyId = it.companyId
      WHERE it.companyId = ? AND ig.id IS NULL AND p.id IS NULL`,
      { replacements: [companyId], transaction }
    );

    return {
      referenceTablesChecked: inactiveWhere.referenceTables,
      inactiveProducts: inactiveProducts[0].count,
      deletableProducts: deletableProducts[0].count,
      skippedReferencedProducts: inactiveProducts[0].count - deletableProducts[0].count,
      deletedStocks: deletedStocks.affectedRows || 0,
      deletedProducts: deletedProducts.affectedRows || 0,
      deletedSubCategories: deletedSubCategories.affectedRows || 0,
      deletedCategories: deletedCategories.affectedRows || 0,
      deletedGroups: deletedGroups.affectedRows || 0,
      deletedTypes: deletedTypes.affectedRows || 0,
    };
  });
};

const verifyImport = async () => {
  const [productsByActive] = await sequelize.query(
    "SELECT isActive, COUNT(*) AS count FROM P_products WHERE companyId = ? GROUP BY isActive ORDER BY isActive",
    { replacements: [companyId] }
  );
  const [activeHierarchy] = await sequelize.query(
    `SELECT
      COUNT(DISTINCT p.id) AS products,
      COUNT(DISTINCT it.id) AS itemTypes,
      COUNT(DISTINCT ig.id) AS itemGroups,
      COUNT(DISTINCT ic.id) AS itemCategories,
      COUNT(DISTINCT isc.id) AS itemSubCategories
    FROM P_products p
    LEFT JOIN P_ItemTypes it ON it.id = p.itemTypeId
    LEFT JOIN P_ItemGroups ig ON ig.id = p.itemGroupId
    LEFT JOIN P_ItemCategories ic ON ic.id = p.itemCategoryId
    LEFT JOIN P_ItemSubCategories isc ON isc.id = p.itemSubCategoryId
    WHERE p.companyId = ? AND p.isActive = true`,
    { replacements: [companyId] }
  );
  const [groups] = await sequelize.query(
    `SELECT ig.name, COUNT(DISTINCT p.id) AS products
    FROM P_ItemGroups ig
    LEFT JOIN P_products p ON p.itemGroupId = ig.id AND p.companyId = ig.companyId AND p.isActive = true
    WHERE ig.companyId = ?
    GROUP BY ig.id, ig.name
    HAVING products > 0
    ORDER BY ig.name`,
    { replacements: [companyId] }
  );
  const [productNameMismatches] = await sequelize.query(
    "SELECT COUNT(*) AS count FROM P_products WHERE companyId = ? AND isActive = true AND COALESCE(productname, '') <> COALESCE(description, '')",
    { replacements: [companyId] }
  );

  return {
    productsByActive,
    activeHierarchy: activeHierarchy[0],
    activeGroups: groups,
    activeProductNameMismatches: productNameMismatches[0].count,
  };
};

const main = async () => {
  const rows = readProductExports(sourcePath);
  const mappedRows = rows.map(mapRow);
  const summary = summarize(mappedRows);

  console.log(JSON.stringify({ mode: shouldApply ? "apply" : "dry-run", companyId, userId, summary }, null, 2));

  if (showDuplicates) {
    const duplicates = Object.values(
      mappedRows.reduce((acc, row) => {
        acc[row.productname] = acc[row.productname] || [];
        acc[row.productname].push({
          source: row.source,
          itemType: row.itemType,
          itemGroup: row.itemGroup,
          itemCategory: row.itemCategory,
          itemSubCategory: row.itemSubCategory,
          productname: row.productname,
        });
        return acc;
      }, {})
    ).filter((items) => items.length > 1);
    console.log(JSON.stringify({ duplicates }, null, 2));
  }

  if (shouldSyncProductNames || shouldCleanupOld || shouldNormalize) {
    validateSummary(summary);
    const syncedProductNames = shouldSyncProductNames ? await syncActiveProductNames() : undefined;
    const cleanedOldData = shouldCleanupOld ? await cleanupOldInactiveData() : undefined;
    const normalized = shouldNormalize ? await normalizeHierarchyNames(mappedRows) : undefined;
    const verification = await verifyImport();
    console.log(JSON.stringify({ syncedProductNames, cleanedOldData, normalized, verification }, null, 2));
    await sequelize.close();
    return;
  }

  if (!shouldApply) {
    if (shouldVerify) {
      const verification = await verifyImport();
      console.log(JSON.stringify({ verification }, null, 2));
    }

    await sequelize.close();
    return;
  }

  validateSummary(summary);

  const result = await applyImport(mappedRows);
  const verification = await verifyImport();
  console.log(JSON.stringify({ imported: result, verification }, null, 2));
  await sequelize.close();
};

if (require.main === module) {
  main().catch(async (error) => {
    console.error(error);
    await sequelize.close();
    process.exit(1);
  });
}
