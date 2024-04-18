// const jwt = require('jsonwebtoken');
// const usertoken = require('../models/userToken');
// // const db = require('../models');
// const permission = require('../models/permission');

// const userToken = async(req, res, next ) => {
//     const token = req.headers['token'];

//     if(!token) {
//         return res.status(401).send({status:"false",message : 'A token is Required For Authentication' });
//     }

//     try {
//         console.log("enter user");
//         var checkToken = await usertoken.findOne({ token: token });
            
//         if(checkToken) {
//             const verify = jwt.verify(checkToken.token, process.env.SECRET_KEY);

//             req.user = verify;
//             console.log("verify",verify);
//             const rolePermissions = await permission.findAll({ where: { role: verify.role} });
//             console.log("rolepermissions",rolePermissions);
//             const requestedRoute = req.originalUrl;
//             console.log("requestedRoute",requestedRoute);
//             const permissionFound = rolePermissions.some(permission => permission.route === requestedRoute);

//             console.log("permissionFound",permissionFound);
//             // const hashPrmissions = rolePermissions.some(Permission => Permission.route === requested) 
//                 if(permissionFound) {
//                     return next();
//                 } else {
//                     return res.status(403).send({ status: "false", message: "Permission denied" });
//                 }
//             // next();
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(401).send({status:"false", message: "Invalid Token" });
//     }
// }

// module.exports = userToken;