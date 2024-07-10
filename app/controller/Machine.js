const Machine = require('../models/Machine');

exports.create_machine = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const data = await Machine.create({...req.body, companyId: companyId});
        return res.status(200).json({
            status: "true",
            message: "Successfully Machine Created.",
            data: data
        })
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}