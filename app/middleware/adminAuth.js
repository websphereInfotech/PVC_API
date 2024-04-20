// const jwt = require('jsonwebtoken');
// const tokenModel = require('../models/admintoken');
// const permission = require('../models/permission');

// const adminToken = async(req, res, next ) => {
//     const token = req.headers['token'];

//     if(!token) {
//         return res.status(401).send({status:"false",message : 'A token is Required For Authentication' });
//     }

//     try {
//         var checkToken = await tokenModel.findOne({ token: token });

//         if(checkToken) {
//             const verify = jwt.verify(checkToken.token, process.env.SECRET_KEY);

//             req.user = verify;
//             console.log("verify",verify);
//             const requestedRoute = req.originalUrl;
//             console.log("requestedRoute", requestedRoute);

//             const rolePermissions = await permission.findAll({
//                 where: {
//                     role: verify.role,
//                     permission: requestedRoute
//                 }
//             });
//             console.log("rolepermissions",rolePermissions[0]);
//             const hasTruePermission = rolePermissions.some(permission => permission.dataValues.permissionValue === true);
 
//                 if(hasTruePermission) {
                    
//                     return next();
//                 } else {
//                     return res.status(403).send({ status: "false", message: "Permission denied" });
//                 }
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(401).send({status:"false", message: "Invalid Token" });
//     }
// }

// module.exports = adminToken;
const jwt = require('jsonwebtoken');
const tokenModel = require('../models/admintoken');
// const permissionData = require('../models/permission');

const adminToken = (permissionString) => {
    console.log("@@@@@@@@@@@");
    return async (req, res, next) => {
        console.log("enter");
        const token = req.headers['token'];
        console.log("token",token);
        if (!token) {
            return res.status(401).send({ status: "false", message: 'A token is Required For Authentication' });
        }

        try {
            var checkToken = await tokenModel.findOne({ token: token });
            console.log("check",checkToken);
            if (checkToken) {
                const verify = jwt.verify(checkToken.token, process.env.SECRET_KEY);

                req.user = verify;
                console.log("verify", verify);

                // Split the permission string into resource and action
                const [resource, permission] = permissionString.split(':');
                console.log("Fetching permission for:", resource, permission);
                console.log("Fetching permission for:", permissionString);
                console.log(verify.role,resource,permission,"Demo data");

                const rolePermissions = await permissionData.findOne({
                    where: {
                        role: verify.role,
                        resource: resource,
                        permission: permission
                    }
                });

                console.log("rolepermissions", rolePermissions);

                if (rolePermissions && rolePermissions.permissionValue === true) {
                    return next();
                } else {
                    return res.status(403).send({ status: "false", message: "Permission denied" });
                }
            }
        } catch (error) {
            console.log(error);
            return res.status(401).send({ status: "false", message: "Invalid Token" });
        }
    };
}

module.exports = adminToken;



