const Recipe = require("../models/recipe");

const getUserId = (req) => req.user.userId || req.user.id;
const getCompanyId = (req) => req.user.companyId;

exports.getAllByBusiness = async (req, res) => {
    try {
        const { businessId } = req.params;
        const companyId = getCompanyId(req) || businessId;
        const data = await Recipe.findAll({
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
        const data = await Recipe.findOne({ where: { id, companyId } });

        if (!data) {
            return res.status(404).json({ status: "false", message: "Recipe not found" });
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
        const data = await Recipe.create({
            ...req.body,
            companyId,
            createdBy: userId,
            updatedBy: userId
        });
        res.json({ status: "true", message: "Recipe created successfully", data });
    } catch (e) {
        res.status(400).json({ status: "false", message: e.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = getUserId(req);
        const companyId = getCompanyId(req);
        const [updated] = await Recipe.update(
            { ...req.body, updatedBy: userId },
            { where: { id, companyId } }
        );

        if (!updated) {
            return res.status(404).json({ status: "false", message: "Recipe not found" });
        }

        const data = await Recipe.findOne({ where: { id, companyId } });
        res.json({ status: "true", message: "Recipe updated successfully", data });
    } catch (e) {
        res.status(400).json({ status: "false", message: e.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = getCompanyId(req);
        const deleted = await Recipe.destroy({ where: { id, companyId } });

        if (!deleted) {
            return res.status(404).json({ status: "false", message: "Recipe not found" });
        }

        res.json({ status: "true", message: "Recipe deleted successfully" });
    } catch (e) {
        res.status(400).json({ status: "false", message: e.message });
    }
};
