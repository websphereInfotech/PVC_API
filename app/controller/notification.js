const Notification = require('../models/notification');
exports.view_all_notification = async (req,res)=>{
    try {
        const {isFront} = req.query;
        const userType = req.user.type;
        const companyId = req.user.companyId
        let whereClause = {
            companyId: companyId
        };

        if (userType !== 'C') {
            whereClause.type = null
        }

        const allStockNotification = await Notification.findAll({
            where:whereClause,
            ...(isFront === 'true' && {limit: 5}),
            order: [["createdAt", "DESC"]]
        })

        return res.status(200).json({
            status: 'true',
            message: 'Notification Successfully Fetch.',
            data: allStockNotification
        })
    }catch (e){
        console.log(e);
        return res.status(500).json({
            status: "false",
            message: "Internal Server Error.",
        })
    }
}