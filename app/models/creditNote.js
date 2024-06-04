const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const customer = require('./customer');

const creditNote = sequelize.define("P_creditNote", {
    customerId : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    creditnoteNo : {
        type: DataTypes.INTEGER
    },
    creditdate: {
        type : DataTypes.DATEONLY
    },
    org_invoiceno : {
        type : DataTypes.INTEGER,
        allowNull:false
    }, 
    org_invoicedate : {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    LL_RR_no : {
        type: DataTypes.INTEGER
    },
    dispatchThrough: { type: DataTypes.STRING },
    motorVehicleNo: { type: DataTypes.STRING },
    destination: { type: DataTypes.STRING },
    totalIgst: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      totalSgst: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      totalMrp: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      mainTotal: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      totalQty: {
        type: DataTypes.INTEGER,
        defaultValue:0
      },
      companyId : {type: DataTypes.INTEGER}
});

customer.hasMany(creditNote, {foreignKey:'customerId', onDelete:'CASCADE',as:'CreditCustomer'});
creditNote.belongsTo(customer, {foreignKey:'customerId', onDelete:'CASCADE', as:"CreditCustomer"});

module.exports = creditNote;