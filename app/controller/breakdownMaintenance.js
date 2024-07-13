const Machine = require('../models/Machine');
const BreakdownMaintenance = require('../models/BreakdownMaintenance');

exports.create_breakdown_maintenance = async (req, res) => {
    try {
        const {machineId} = req.body;
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
        const data = await BreakdownMaintenance.create({...req.body, companyId: companyId});
        return res.status(200).json({
            status: "true",
            message: "Breakdown Maintenance Create Successfully.",
            data: data
        })
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."});
    }
}
exports.update_breakdown_maintenance = async (req, res)=>{
    try {
        const {id} = req.params;
        const companyId = req.user.companyId;
        const maintenanceExist = await BreakdownMaintenance.findOne({
            where: {id: id, companyId: companyId},
        })
        if(!maintenanceExist){
            return res.status(404).json({
                status: "false",
                message: "Breakdown Maintenance Not Found"
            })
        }
        Object.assign(maintenanceExist, req.body);
        await maintenanceExist.save()
        return res.status(200).json({
            status: "true",
            message: "Breakdown Maintenance Update Successfully.",
        })
    }catch (e){
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

exports.view_all_breakdown_maintenance = async (req, res)=>{
    try {
        const companyId = req.user.companyId;
        const data = await BreakdownMaintenance.findAll({
            where: {
                companyId : companyId
            },
            include: [{model: Machine, as: "machineBreakdownMaintenance"}]
        })
        return res.status(200).json({
            status: "true",
            message: "Breakdown Maintenance Fetch Successfully.",
            data: data
        })
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

exports.view_one_breakdown_maintenance = async (req, res)=>{
    try {
        const companyId = req.user.companyId;
        const {id} = req.params;
        const data = await BreakdownMaintenance.findOne({
            where: {
                companyId : companyId,
                id: id
            },
            include: [{model: Machine, as: "machineBreakdownMaintenance"}]
        })
        if(!data){
            return res.status(404).json({
                status: "false",
                message: "Breakdown Maintenance Not Found."
            })
        }
        return res.status(200).json({
            status: "true",
            message: "Breakdown Maintenance Fetch Successfully.",
            data: data
        })
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

exports.delete_breakdown_maintenance = async (req, res)=>{
    try {
        const companyId = req.user.companyId;
        const {id} = req.params;
        const data = await BreakdownMaintenance.findOne({
            where: {
                companyId : companyId,
                id: id
            }
        })
        if(!data){
            return res.status(404).json({
                status: "false",
                message: "Breakdown Maintenance Not Found."
            })
        }
        await data.destroy()
        return res.status(200).json({
            status: "true",
            message: "Breakdown Maintenance Delete Successfully.",
        })
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

