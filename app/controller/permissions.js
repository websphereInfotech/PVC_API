const permission = require("../models/permission");


exports.get_all_permissions = async(req,res) => {
    try {
        const data = await permission.findAll();

        if (data.length > 0) {
            return res.status(200).json({ status:'true',message:'Permission Data Fetch Successfully', data: data});
        } else {
            return res.status(404).json({ status:'false',message:'Permission Data not Found '});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status:'false', message:"Internal Server Error"});
    }
}