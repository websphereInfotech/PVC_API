const RawMaterial = require("../models/RawMaterial");
const Recipe = require("../models/recipe");

const getUserId = (req) => req.user.userId || req.user.id;
const getCompanyId = (req) => req.user.companyId;

exports.getAllByBusiness = async (req, res) => {
    try {
        const { businessId } = req.params;
        const companyId = getCompanyId(req) || businessId;
        const data = await RawMaterial.findAll({
            where: { companyId },
            order: [["id", "DESC"]]
        });
        res.json({ status: "true", data });
    } catch (e) {
        res.status(400).json({ status: "false", message: e.message });
    }
};

exports.view = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = getCompanyId(req);
        const data = await RawMaterial.findOne({ where: { id, companyId } });

        if (!data) {
            return res.status(404).json({ status: "false", message: "Raw Material not found" });
        }

        res.json({ status: "true", data });
    } catch (e) {
        res.status(400).json({ status: "false", message: e.message });
    }
};

exports.create = async (req, res) => {
    try {
        const userId = getUserId(req);
        const companyId = getCompanyId(req) || req.body.companyId;
        const data = await RawMaterial.create({ ...req.body, companyId, createdBy: userId });
        res.json({ status: "true", message: "Raw Material created", data });
    } catch (e) {
        res.status(400).json({ status: "false", message: e.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { rate_per_kg } = req.body;
        const userId = getUserId(req);
        const companyId = getCompanyId(req);
        const previousRawMaterial = await RawMaterial.findOne({ where: { id, companyId } });

        const [updated] = await RawMaterial.update(
            { ...req.body, updatedBy: userId },
            { where: { id, companyId } }
        );

        if (!updated) {
            return res.status(404).json({ status: "false", message: "Raw Material not found" });
        }

        const rawMaterial = await RawMaterial.findOne({ where: { id, companyId } });
        const recipes = await Recipe.findAll({ where: { companyId } });

        const updatePromises = recipes.map(async (recipe) => {
            if (!Array.isArray(recipe.items)) return;

            let itemsChanged = false;

            const updatedItems = recipe.items.map((item) => {
                const itemMaterialId = item.raw_material_id || item.material;
                const matchesMaterialId = Number(itemMaterialId) === Number(id);
                const matchesLegacyName = previousRawMaterial && item.material === previousRawMaterial.name;

                if (!matchesMaterialId && !matchesLegacyName) {
                    return item;
                }

                itemsChanged = true;
                const rate = rate_per_kg ?? item.rate_per_kg ?? 0;
                const usage = parseFloat(item.usage || 0);

                return {
                    ...item,
                    raw_material_id: Number(id),
                    material: rawMaterial ? rawMaterial.name : item.material,
                    rate_per_kg: rate,
                    total: parseFloat((rate * usage).toFixed(2))
                };
            });

            if (!itemsChanged) return;

            const totalUsage = updatedItems.reduce(
                (sum, item) => sum + parseFloat(item.usage || 0),
                0
            );

            const totalAmount = updatedItems.reduce(
                (sum, item) => sum + parseFloat(item.total || 0),
                0
            );

            const perKgValue = totalUsage > 0 ? totalAmount / totalUsage : 0;
            const productionCost = parseFloat(recipe.production_cost || 0);
            const finalValue = perKgValue + productionCost;

            return recipe.update({
                items: updatedItems,
                total_usage: parseFloat(totalUsage.toFixed(2)),
                total_amount: parseFloat(totalAmount.toFixed(2)),
                per_kg_value: parseFloat(perKgValue.toFixed(2)),
                final_value: parseFloat(finalValue.toFixed(2)),
                updatedBy: userId
            });
        });

        await Promise.all(updatePromises);

        res.json({
            status: "true",
            message: "Raw Material updated and recipes recalculated",
            data: rawMaterial
        });

    } catch (e) {
        console.error("Raw material sync error:", e);
        res.status(400).json({
            status: "false",
            message: e.message
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const companyId = getCompanyId(req);
        const deleted = await RawMaterial.destroy({ where: { id: req.params.id, companyId } });

        if (!deleted) {
            return res.status(404).json({ status: "false", message: "Raw Material not found" });
        }

        res.json({ status: "true", message: "Deleted successfully" });
    } catch (e) {
        res.status(400).json({ status: "false", message: e.message });
    }
};
