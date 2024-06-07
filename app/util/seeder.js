const company = require("../models/company");
const User = require("../models/user");
const CompanyUser = require("../models/companyUser");
const Permissions = require("../models/permission");
const { permissions } = require('../middleware/permissions');

const existingData = async () => {
  try {
    let existingUser = await User.findOne({
      where: { username: "Vipul Ghelani" },
    });
 
    if (!existingUser) {
      existingUser = await User.create({
        username: "Vipul Ghelani",
        email: "vipul@example.com",
        mobileno: 9988776655,
        password:
          "$2a$10$Mb31UZbFdVgXmEnXadWx4O2VGzguRS0tIw0XX.DbOzNoPzm8Awja6",
        salary: null,
        role: "Super Admin",
      });
    }

    let existingCompany = await company.findOne({
      where: { companyname: "Shree Krishna Industry" },
    });

    if (!existingCompany) {
      existingCompany = await company.create({
        companyname: "Shree Krishna Industry",
        gstnumber: "GSTSI1234567890",
        email: "krishna@example.com",
        mobileno: 1234567890,
        address1: "123 first floor",
        address2: "Mota varachha",
        pincode: 395006,
        state: "Gujarat",
        city: "Surat",
      });
    }

    const companyUserExist = await CompanyUser.findOne({
      where: { userId: existingUser.id, companyId: existingCompany.id },
    });
    if (!companyUserExist) {
      await CompanyUser.create({
        userId: existingUser.id,
        companyId: existingCompany.id,
        setDefault: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const existingPermission = async () => {
  try {
    const allCompany = await company.findAll();
    for (const comapy of allCompany) {
      const promises = [];

      for (const resource in permissions) {
        const rolePermissions = permissions[resource];

        for (const role in rolePermissions) {
          const permissionsForRole = rolePermissions[role];

          for (const permissionKey in permissionsForRole) {
           
            const permissionValue = permissionsForRole[permissionKey];
            const type = resource.includes("Cash") ? true : false;
    
            const isPermissionExist = await Permissions.findOne({
              where: {
                role: role,
                resource: resource,
                companyId: comapy.id,
                type: type,
                permission: permissionKey,
                permissionValue: permissionValue,
              },
            });
            if (!isPermissionExist) {
              promises.push({
                role: role,
                resource: resource,
                companyId: comapy.id,
                type: type,
                permission: permissionKey,
                permissionValue: permissionValue,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
          }
        }
      }
      await Permissions.bulkCreate(promises);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { existingData, existingPermission };
