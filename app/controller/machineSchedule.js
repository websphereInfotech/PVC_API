const Machine = require('../models/Machine');
const MachineSchedule = require('../models/MachineSchedule');

exports.create_machine_schedule = async (req, res) => {
    try {
        const {companyId} = req.user;
        const {machineId} = req.body;
        const machineExist = await Machine.findOne({
            where: {
                id: machineId,
                companyId: companyId
            }
        });
        if(!machineExist){
            return res.status(422).json({status: "false", message: "Machine Not Found"})
        }
        const machineSchedule = await MachineSchedule.create({...req.body, companyId: companyId});
        return res.status(200).json({status: "true", message: "Successfully Machine Scheduled.", data: machineSchedule});
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

exports.update_machine_schedule = async (req, res)=>{
    try {
        const {id} = req.params;
        const {companyId} = req.user;
        const {machineId} = req.body;
        const machineScheduleExist = await MachineSchedule.findOne({
            where: {
                id: id,
                companyId: companyId
            }
        });
        if(!machineScheduleExist){
            return res.status(404).json({status: "false", message: "Machine Schedule Not Found"})
        }
        const machineExist = await Machine.findOne({
            where: {
                id: machineId,
                companyId: companyId
            }
        });
        if(!machineExist){
            return res.status(422).json({status: "false", message: "Machine Not Found"})
        }
        Object.assign(machineScheduleExist, req.body);
        await machineScheduleExist.save()
        return res.status(200).json({status: "true", message: "Successfully Machine Schedule Updated.", data: machineScheduleExist});
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

exports.view_machine_schedule = async (req, res) => {
    try{
        const {id} = req.params;
        const {companyId} = req.user;
        const machineScheduleExist = await MachineSchedule.findOne({
            where: {
                id: id,
                companyId: companyId
            }
        });
        if(!machineScheduleExist){
            return res.status(404).json({status: "false", message: "Machine Schedule Not Found"})
        }
        return res.status(200).json({status: "true", message: "Successfully Machine Schedule Fetch.", data: machineScheduleExist});
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

exports.view_all_machine_schedule = async (req, res) => {
    try{
        const {companyId} = req.user;
        const machineScheduleExists = await MachineSchedule.findOne({
            where: {
                companyId: companyId
            }
        });
        if(!machineScheduleExists){
            return res.status(404).json({status: "false", message: "Machine Schedule Not Found"})
        }
        return res.status(200).json({status: "true", message: "Successfully Machine Schedule Fetch.", data: machineScheduleExists});
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}

exports.delete_machine_schedule = async (req, res)=>{
    try{
        const {id} = req.params;
        const {companyId} = req.user;
        const machineScheduleExist = await MachineSchedule.findOne({
            where: {
                id: id,
                companyId: companyId
            }
        });
        if(!machineScheduleExist){
            return res.status(404).json({status: "false", message: "Machine Schedule Not Found"})
        }
        await machineScheduleExist.destroy()
        return res.status(200).json({status: "true", message: "Successfully Machine Schedule Deleted."});
    }catch (e) {
        console.error(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}