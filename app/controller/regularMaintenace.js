const Machine = require('../models/Machine');
const RegularMaintenance = require('../models/RegularMaintenance');

exports.create_regular_maintenance = async (req, res) => {
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
        const data = await RegularMaintenance.create({...req.body, companyId: companyId});
        return res.status(200).json({
            status: "true",
            message: "Regular Maintenance Create Successfully.",
            data: data
        })
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."});
    }
}
exports.update_regular_maintenance = async (req, res)=>{
    try {
        const {id} = req.params;
        const {machineId} = req.body;
        const companyId = req.user.companyId;
        const maintenanceExist = await RegularMaintenance.findOne({
            where: {id: id, companyId: companyId},
        })
        if(!maintenanceExist){
            return res.status(404).json({
                status: "false",
                message: "Regular Maintenance Not Found"
            })
        }
        Object.assign(maintenanceExist, req.body);
        await maintenanceExist.save()
        return res.status(200).json({
            status: "true",
            message: "Regular Maintenance Update Successfully.",
        })
    }catch (e){
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

exports.view_all_regular_maintenance = async (req, res)=>{
    try {
        const companyId = req.user.companyId;
        const data = await RegularMaintenance.findAll({
            where: {
                companyId : companyId
            },
            include: [{model: Machine, as: "machineRegularMaintenance"}]
        })
        return res.status(200).json({
            status: "true",
            message: "Regular Maintenance Fetch Successfully.",
            data: data
        })
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

exports.view_one_regular_maintenance = async (req, res)=>{
    try {
        const companyId = req.user.companyId;
        const {id} = req.params;
        const data = await RegularMaintenance.findOne({
            where: {
                companyId : companyId,
                id: id
            },
            include: [{model: Machine, as: "machineRegularMaintenance"}]
        })
        if(!data){
            return res.status(404).json({
                status: "false",
                message: "Regular Maintenance Not Found."
            })
        }
        return res.status(200).json({
            status: "true",
            message: "Regular Maintenance Fetch Successfully.",
            data: data
        })
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

exports.delete_regular_maintenance = async (req, res)=>{
    try {
        const companyId = req.user.companyId;
        const {id} = req.params;
        const data = await RegularMaintenance.findOne({
            where: {
                companyId : companyId,
                id: id
            }
        })
        if(!data){
            return res.status(404).json({
                status: "false",
                message: "Regular Maintenance Not Found."
            })
        }
        await data.destroy()
        return res.status(200).json({
            status: "true",
            message: "Regular Maintenance Delete Successfully.",
        })
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

