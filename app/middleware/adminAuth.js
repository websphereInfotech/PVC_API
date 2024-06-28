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
    try {
      const checkToken = await tokenModel.findOne({ where: { token } });

      if (!checkToken) {
        return res
          .status(401)
          .send({ status: "false", message: "Invalid token" });
      }
      const verify = jwt.verify(checkToken.token, process.env.SECRET_KEY);
      req.user = verify;
  
      const [resource, permission] = permissionString.split(":");
      let rolePermissions;
      if(verify.type === "C"){
        rolePermissions = await permissionData.findOne({
          where: {
            role: verify.role,
            resource,
            permission,
            companyId: verify.companyId,
          },
        });
      }else{
        rolePermissions = await permissionData.findOne({
          where: {
            role: verify.role,
            resource,
            permission,
            type: false,
            companyId: verify.companyId,
          },
        });
      }
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
        message: "Token expired",
      });
    }
  };
};

module.exports = adminToken;
