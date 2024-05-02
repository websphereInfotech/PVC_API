// const jwt = require('jsonwebtoken');
// const tokenModel = require('../models/admintoken');
// 

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

const jwt = require("jsonwebtoken");
const tokenModel = require("../models/admintoken");
const permissionData = require("../models/permission");

const adminToken = (permissionString) => {
  return async (req, res, next) => {
    const token = req.headers["token"];
    if (!token) {
      return res.status(401).send({
        status: "false",
        message: "A token is required for authentication",
      });
    }
    console.log("token", token);
    try {
      const checkToken = await tokenModel.findOne({ where: { token } });
      // console.log("checkToken", checkToken);
      if (!checkToken) {
        return res
          .status(401)
          .send({ status: "false", message: "Invalid token" });
      }
      const verify = jwt.verify(checkToken.token, process.env.SECRET_KEY);
      req.user = verify;
// console.log("req",req.user);
      const [resource, permission] = permissionString.split(":");
      const rolePermissions = await permissionData.findOne({
        where: {
          role: verify.role,
          resource,
          permission,
        },
      });
console.log("rolePermissions",rolePermissions);
      if (rolePermissions && rolePermissions.permissionValue) {
        return next();
      } else {
        return res
          .status(403)
          .send({ status: "false", message: "Permission denied" });
      }
    } catch (error) {
      console.error("Error during permission check:", error);
      return res.status(401).send({
        status: "false",
        message: "Invalid token or permission check error",
      });
    }
  };
};

module.exports = adminToken;
