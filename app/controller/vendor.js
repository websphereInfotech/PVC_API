const bankAccount = require("../models/bankAccount");
const vendor = require("../models/vendor");

exports.create_vendor = async (req,res) => {
    try {
        const { accountname, shortname, email, contactpersonname, mobileno, panno, creditperiod, mode, address1, address2, pincode, state, city, bankdetail, creditlimit, balance,gstnumber,bankdetails,
            totalcreadit, } = req.body
            if (bankdetail === true) {
                if (!bankdetails || bankdetails.length === 0) {
                  return res
                    .status(400)
                    .json({ status: "false", message: "Required Filed Of Items" });
                }
              // for (const item of items) {
                const existingAccount = await bankAccount.findOne({
                  where: { accountnumber: bankdetails.accountnumber },
                });
          
                const existingIFSC = await bankAccount.findOne({
                  where: { ifsccode: bankdetails.ifsccode },
                });
          
                if (existingAccount) {
                  return res.status(400).json({
                    status: "false",
                    message: "Account Number Already Exists",
                  });
                }
                if (existingIFSC) {
                  return res.status(400).json({
                    status: "false",
                    message: "IFSC Code Already Exists",
                  });
                }
              // }
            }
        const vendorData = {
            accountname,
            shortname,
            email,
            contactpersonname,
            mobileno,
            panno,
            creditperiod,
            mode,
            address1,
            address2,
            pincode,
            state,
            city,
            bankdetail,
            creditlimit,
            balance,
            gstnumber
        };
        if(creditlimit === true) {
            vendorData.totalcreadit = totalcreadit;
        }
        const  data = await vendor.create(vendorData);
        if (bankdetail === true && bankdetails) {
            const bankdata = {
              customerId: data.id,
              accountnumber: bankdetails.accountnumber,
              ifsccode: bankdetails.ifsccode,
              bankname: bankdetails.bankname,
              accounttype: bankdetails.accounttype,
            };
            await bankAccount.create(bankdata);
          }
         return res.status(200).json({ status:'true', message:'Vendor Create Successfully', data: data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status:'false', message:'Internal Server Error'});
    }
}
exports.update_vendor = async(req,res) => {
    try {
        const {id} = req.params;
        const { accountname, shortname, email, contactpersonname, mobileno, panno, creditperiod, mode, address1, address2, pincode, state, city, bankdetail, creditlimit, balance,gstnumber } = req.body

        const vendorId = await vendor.findOne({
            where:{id}
        });
        if(!vendorId) {
            return res.status(404).json({ status:'false', message:'Vendor Not Found'});
        }

        await vendor.update({
            accountname,
            shortname,
            email,
            contactpersonname,
            mobileno,
            panno,
            creditperiod,
            mode,
            address1,
            address2,
            pincode,
            state,
            city,
            bankdetail,
            creditlimit,
            balance,
            gstnumber
        },{ where:{id}});
        const data = await vendor.findByPk(id)
        return res.status(200).json({status:'true', message:'Vendor Updated Successfully',data:data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status:'false', message:'Internal Server Error'});
    }
}
exports.delete_vandor = async(req,res) => {
    try {
        const {id} = req.params;

        const data = await vendor.destroy({ where:{id}});

    if(data) {
        return res.status(200).json({ status:'true', message:'Vendor Delete Successfully'});
    } else {
        return res.status(404).json({ status:'false', message:'Vendor Not Found'});
    }   
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status:'false', message:'Internal Server Error'});
    }
}
exports.get_all_vandor = async(req,res) => {
    try {
        const data = await vendor.findAll();
        if(data) {
            return res.status(200).json({ status:'true', message:"Vendor Show Successfully", data: data});
        } else {
            return res.status(404).json({ status:'false', message:'Vendor not Found'})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status:'false', message:'Internal Server Error'});
    }
}
exports.view_vendor = async(req,res) => {
    try {
        const {id} = req.params;

        const data = await vendor.findByPk(id);

        if(data) {
            return res.status(200).json({ status:'true', message:'Vendor Show Successfully', data:data});
        } else {
            return res.status(404).json({ status:'false', message:'Vendor Not Found'});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({status:'false', message:"Internal Server Error"});
    }
}