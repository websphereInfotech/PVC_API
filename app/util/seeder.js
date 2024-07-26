const company = require("../models/company");
const User = require("../models/user");
const CompanyUser = require("../models/companyUser");
const Permissions = require("../models/permission");
const { permissions } = require("../middleware/permissions");
const companyBalance = require("../models/companyBalance");
const C_userBalance = require("../models/C_userBalance");
const C_companyBalance = require("../models/C_companyBalance");
const AccountGroup = require("../models/AccountGroup");
const { ACCOUNT_GROUPS_TYPE} = require("../constant/constant");

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
    const existingBalance = await C_userBalance.findOne({
      where: {userId: existingUser.id, companyId: existingCompany.id },
    });
    if(!existingBalance) {
      await C_userBalance.create({
        userId: existingUser.id,
        companyId: existingCompany.id,
        balance:0
      });
    }
    const existingComapnyBalance = await C_companyBalance.findOne({
      where: {companyId: existingCompany.id },
    });
    if(!existingComapnyBalance) {
      await C_companyBalance.create({
        companyId: existingCompany.id,
        balance:0
      });
    }

    const balanceExists = await companyBalance.findOne({
      where:{companyId: existingCompany.id},
    });
    if(!balanceExists) {
      await companyBalance.create({
        companyId: existingCompany.id,
        balance:0
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const exisingGroup = async () => {
  try {
    const allCompanies = await company.findAll();
    const groupList = Object.values(ACCOUNT_GROUPS_TYPE);

    for (const company of allCompanies) {
      const existingGroups = await AccountGroup.findAll({ where: { companyId: company.id } });

      const existingGroupMap = new Map(existingGroups.map(group => [group.name, group]));

      for (const group of groupList) {
        if (!existingGroupMap.has(group)) {
          await AccountGroup.create({
            name: group,
            companyId: company.id,
          });
        }
      }

      for (const existingGroup of existingGroups) {
        if (!groupList.includes(existingGroup.name)) {
          await existingGroup.destroy();
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
};


const existingPermission = async () => {
  try {
    const allCompany = await company.findAll();
    for (const company of allCompany) {
      const existingPermissions = await Permissions.findAll({
        where: { companyId: company.id }
      });

      const existingPermissionsMap = new Map();
      for (const permission of existingPermissions) {
        existingPermissionsMap.set(
            `${permission.role}_${permission.resource}_${permission.permission}`,
            permission
        );
      }

      const createPromises = [];
      const deletePromises = [];
      const newPermissionsSet = new Set();

      for (const resource in permissions) {
        const rolePermissions = permissions[resource];

        for (const role in rolePermissions) {
          const permissionsForRole = rolePermissions[role];

          for (const permissionKey in permissionsForRole) {
            const permissionValue = permissionsForRole[permissionKey];
            const type = resource.includes("Cash")

            const permissionIdentifier = `${role}_${resource}_${permissionKey}`;
            newPermissionsSet.add(permissionIdentifier);

            if (!existingPermissionsMap.has(permissionIdentifier)) {
              const newPermission = {
                role: role,
                resource: resource,
                companyId: company.id,
                type: type,
                permission: permissionKey,
                permissionValue: permissionValue,
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              createPromises.push(Permissions.create(newPermission));
            }
          }
        }
      }

      for (const [permissionIdentifier, permission] of existingPermissionsMap) {
        if (!newPermissionsSet.has(permissionIdentifier)) {
          deletePromises.push(Permissions.destroy({
            where: {
              id: permission.id
            }
          }));
        }
      }

      await Promise.all(createPromises);
      await Promise.all(deletePromises);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { existingData, existingPermission, exisingGroup };
