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

const jwt = require("jsonwebtoken");
const tokenModel = require("../models/admintoken");
const permissionData = require("../models/permission");

const adminToken = (permissionString) => {
  return async (req, res, next) => {
    const token = req.headers["token"];
    if (!token) {
      return res.status(401).send({ status: "false", message: "A token is required for authentication" });
    }

    try {
      const checkToken = await tokenModel.findOne({ where: { token } });
      if (!checkToken) {
        return res.status(401).send({ status: "false", message: "Invalid token" });
      }

      const verify = jwt.verify(checkToken.token, process.env.SECRET_KEY);
      req.user = verify;

      if (verify.type === "C") {
        const resourcesForTypeC = ["Login", "Quotation", "Sales Return"];
        const permissionDataResult = await permissionData.findAll({
          where: {
            resource: resourcesForTypeC,
          },
        });

        // Manual grouping and structuring
        const groupedPermissions = permissionDataResult.reduce((acc, permission) => {
          const role = permission.role;
          const resource = permission.resource;

          if (!acc[role]) {
            acc[role] = {};
          }

          if (!acc[role][resource]) {
            acc[role][resource] = [];
          }

          acc[role][resource].push({
            id: permission.id,
            permissionValue: permission.permissionValue,
            permission: permission.permission,
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt,
          });

          return acc;
        }, {});

        const formattedPermissions = Object.keys(groupedPermissions).map((role) => ({
          role,
          permissions: Object.keys(groupedPermissions[role]).map((resource) => ({
            resource,
            permissions: groupedPermissions[role][resource],
          })),
        }));

        return res.status(200).send({
          status: "true",
          message: "Permission data fetched successfully",
          data: formattedPermissions,
        });
      } else {
        const [resource, permission] = permissionString.split(":");
        const rolePermissions = await permissionData.findOne({
          where: {
            role: verify.role,
            resource,
            permission,
          },
        });

        if (rolePermissions && rolePermissions.permissionValue) {
          return next();
        } else {
          return res.status(403).send({ status: "false", message: "Permission denied" });
        }
      }
    } catch (error) {
      console.error("Error during permission check:", error);
      return res.status(401).send({ status: "false", message: "Invalid token or permission check error" });
    }
  };
};

module.exports = adminToken;
