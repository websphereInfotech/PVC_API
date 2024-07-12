const Machine = require('../models/Machine');

exports.create_machine = async (req, res) => {
    try {
        const {name, machineNo, description} = req.body;
        const companyId = req.user.companyId;
        const data = await Machine.create({companyId: companyId, name, machineNo, description});
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

exports.view_all_machine = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const data = await Machine.findAll({
            where: {
                companyId: companyId
            }
        });
        return res.status(200).json({status: "true", message: "Machine Fetch Successfully.", data: data});
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

exports.view_one_machine = async (req, res) => {
    try {
        const {machineId} = req.params;
        const companyId = req.user.companyId;
        const data = await Machine.findOne({
            where: {
                id: machineId,
                companyId: companyId
            }
        });
        if(!data) return res.status(404).json({status: "false", message: "Machine Not Found"})
        return res.status(200).json({status: "true", message: "Machine Fetch Successfully.", data: data});
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

exports.update_machine = async (req, res)=>{
    try {
        const {machineId} = req.params;
        const companyId = req.user.companyId;
        const machineExists = await Machine.findOne({
            where: {
                id: machineId,
                companyId: companyId
            }
        });
        if(!machineExists){
            return res.status(404).json({
                status: "false",
                message: "Machine Not Found"
            })
        }
        Object.assign(machineExists, req.body);
        await machineExists.save();
        return res.status(200).json({
            status: "true",
            message: "Machine Update Successfully.",
            data: machineExists
        })
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

exports.delete_machine = async (req, res)=>{
    try {
        const {machineId} = req.params;
        const companyId = req.user.companyId;
        const machineExists = await Machine.findOne({
            where: {
                id: machineId,
                companyId: companyId
            }
        });
        if(!machineExists){
            return res.status(404).json({
                status: "false",
                message: "Machine Not Found."
            })
        }
        await machineExists.destroy()
        return res.status(200).json({
            status: "true",
            message: "Machine Delete Successfully.",
        })
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}