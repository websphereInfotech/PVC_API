const company = require("../models/company");

exports.get_all_company = async(req,res) => {
    try {
        const data = await company.findAll();
        if(data) {
            return res.status(200).json({ status:'Success', message:"Company Data Show Successfully", data: data});
        } else {
            return res.status(404).json({ status:'false', message:'Company Not Found'});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({status:'false', message:'Internal Server Error'});
    }
}