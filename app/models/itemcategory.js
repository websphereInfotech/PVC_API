const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const product = require("./product");

const itemcategory = sequelize.define("P_itemcategory", {
  category: {
    type: DataTypes.STRING,
  },
  remarks: {
    type: DataTypes.STRING,
  },
});

product.hasMany(itemcategory);
itemcategory.belongsTo(product);

module.exports = itemcategory;
