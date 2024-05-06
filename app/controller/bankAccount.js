// const bankAccount = require("../models/bankAccount");

// exports.create_bankaccount = async (req,res) => {
//     try {
//         const { accountname, mobileno, shortname, email, holdername, accountnumber, ifsccode, bankname, openingbalance } = req.body;
//         const data = await bankAccount.create({
//           accountname,
//           shortname,
//           email, 
//           mobileno,
//           holdername,
//           accountnumber,
//           ifsccode,
//           bankname,
//           openingbalance
//         });
//         return res.status(200).json({ status:'true', message: "Bank Account CreateSuccessfully", data: data });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ status:'Fail', message:'Internal Server Error' });
//     }
//   }
//   exports.update_bankaccount = async (req,res) => {
//     try {
//       const {id} = req.params;
//       const { accountname, mobileno, shortname, email, holdername, accountnumber, ifsccode, bankname, openingbalance } = req.body;
  
//       const bankId = await bankAccount.findByPk(id);
//       if(!bankId) {
//         return res.status(404).json({ status:'false', message:'Bank Account Not Found' });
//       }
//       await bankAccount.update({
//         accountname : accountname,
//         shortname : shortname,
//         mobileno : mobileno,
//         email : email,
//         holdername : holdername,
//         accountnumber : accountnumber,
//         ifsccode : ifsccode,
//         bankname :bankname,
//         openingbalance : openingbalance
//       }, { where: {id:id}});
  
//       const data = await bankAccount.findByPk(id);
//       return res.status(200).json({ status:'true', message:'Bank Account Update Successfully', data : data});
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ status:'false', message:'Internal Server Error' });
//     }
//   }
//   exports.delete_bankaccount = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const data = await bankAccount.destroy({ where: {id: id}});
//         if(data) {
//           return res.status(200).json({ status:'true',message:'Bank Account Delete Successfully'});
//         } else {
//           return res.status(404).json({ status:'false', message:'Bank Account Not Found'});
//         }
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ status:'false', message:'Internal Server Error'});
//     }
//   }
//   exports.view_bankaccount = async (req,res) => {
//     try {
//         const {id} = req.params;
        
//         const data = await bankAccount.findByPk(id);
//         if(data)
//         {
//           return res.status(200).json({ status:'true', message:'Bank Account Show Successfully', data:data });
//         } else {
//           return res.status(404).json({ status:'false', message:'Bank Account Not Found'});
//         }
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ status:'false', message:'Internal Server Error'});
//     }
//   }
//   exports.get_all_bankaccount = async (req,res) => {
//     try {
//       const data = await bankAccount.findAll();
//       if(data)
//       {
//         return res.status(200).json({ status:'true', message:'Bank Account Show Successfully', data:data });
//       } else {
//         return res.status(404).json({ status:'false', message:'Bank Account Not Found'});
//       }
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ status:'false', message:'Internal Server Error'});
//     }
//   }