const C_claim = require("../models/C_claim");


exports.create_claim = async(req,res) => {
    try {
        const fromUserId = req.user.userId;
        const { toUserId, amount, description} = req.body;
       const data =  await C_claim.create({
            toUserId,
            amount,
            description,
            fromUserId
        });
         return res.status(200).json({ status:'true', message:'Claim Created Successfully',data:data});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status:'false', message:'Internal Server Error'});
    }
}
// exports.update_claim = async(req,res) => {
//     co
// }