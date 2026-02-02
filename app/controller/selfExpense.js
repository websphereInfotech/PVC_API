const { ROLE } = require("../constant/constant");
const Account = require("../models/Account");
const C_Cashbook = require("../models/C_Cashbook");
const C_companyBalance = require("../models/C_companyBalance");
const C_Ledger = require("../models/C_Ledger");
const C_Payment = require("../models/C_Payment");
const C_SelfExpense = require("../models/C_selfExpense");
const C_userBalance = require("../models/C_userBalance");
const C_WalletLedger = require("../models/C_WalletLedger");
const EmployeeSalary = require("../models/employeeSalary");
const C_DailyBalance = require("../models/C_DailyBalance");
const { Sequelize, Op } = require("sequelize");
const moment = require("moment");

const syncDailyBalances = async (startDate, companyId, transaction = null) => {
  // 1. Fetch all balance snapshots from the modified date forward, ordered by DATE
  const balances = await C_DailyBalance.findAll({
    where: {
      companyId,
      date: { [Op.gte]: startDate }
    },
    order: [['date', 'ASC']], // Crucial: Order by transaction date, not ID
    transaction
  });

  for (let i = 0; i < balances.length; i++) {
    const current = balances[i];
    
    // 2. Determine the Opening Balance
    if (i === 0) {
      // For the first record in our affected set, look back one day in the DB
      const lastDay = await C_DailyBalance.findOne({
        where: { 
          companyId, 
          date: { [Op.lt]: current.date } 
        },
        order: [['date', 'DESC']], // Get the day immediately before
        transaction
      });
      current.openingBalance = lastDay ? lastDay.closingBalance : 0;
    } else {
      // Pull opening balance from the day we just processed in the loop
      current.openingBalance = balances[i - 1].closingBalance;
    }

    // 3. Recalculate Closing: Opening + Credit - Debit
    current.closingBalance = Number(current.openingBalance) + 
                             Number(current.totalCredit) - 
                             Number(current.totalDebit);
    
    await current.save({ transaction });
  }
};

exports.C_create_selfExpense = async (req, res) => {  
  try {
    const { userId: user, role, companyId } = req.user;
    const { date, amount, description, accountId } = req.body;

    const paymentNo = await getPaymentNo(companyId);
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }

    let existingBalance;

    if (role === ROLE.SUPER_ADMIN) {
      existingBalance = await C_companyBalance.findOne({
        where: { companyId },
      });
      console.log(existingBalance,"admin");
      
    } else {
      existingBalance = await C_userBalance.findOne({
        where: { companyId, userId: user },
      });
    }

    const balance = existingBalance?.balance ?? 0;

    console.log("balance",balance);
    console.log("amount",amount)

    if (balance < amount) {
      return res.status(400).json({
        status: false,
        message: "Not enough funds.",
      });
    }

    const [dailyRow, created] = await C_DailyBalance.findOrCreate({
      where: { date, companyId },
      defaults: { openingBalance: 0, totalCredit: 0, totalDebit: 0, closingBalance: 0 }
    });

    if (created) {
      const lastDay = await C_DailyBalance.findOne({
        where: { companyId, date: { [Op.lt]: date } },
        order: [['date', 'DESC']]
      });
      const prevClosing = lastDay ? Number(lastDay.closingBalance) : 0;
      await dailyRow.update({ openingBalance: prevClosing, closingBalance: prevClosing });
    }

    await dailyRow.increment('totalDebit', { by: amount });
    await dailyRow.increment('closingBalance', { by: -amount });

    const data = await C_Payment.create({
      accountId,
      amount,
      description,
      date,
      paymentNo: paymentNo,
      createdBy: user,
      updatedBy: user,
      companyId: companyId,
    });

    await C_Ledger.create({
      accountId: accountId,
      companyId: companyId,
      paymentId: data.id,
      date: date,
    });

    if (role === ROLE.SUPER_ADMIN) {
      await C_WalletLedger.create({
        paymentId: data.id,
        userId: user,
        companyId: companyId,
        date: date,
        isApprove: true,
        approveDate: new Date(),
      });

      await C_Cashbook.create({
        C_paymentId: data.id,
        companyId: companyId,
        date: date,
      });
    } else {
      await C_WalletLedger.create({
        paymentId: data.id,
        userId: user,
        companyId: companyId,
        date: date,
      });
    }

    const expense = await C_SelfExpense.create({
      date,
      amount,
      description,
      userId: user,
      companyId,
      paymentId: data.id,
    });

    await existingBalance.decrement("balance", { by: amount });

    await syncDailyBalances(date, companyId);

    return res.status(201).json({
      status: true,
      message: "Self Expense Created Successfully",
      data: expense,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.C_update_selfExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, amount, description, accountId } = req.body;
    const { userId, role, companyId } = req.user;

    const expense = await C_SelfExpense.findByPk(id);
    if (!expense) {
      return res
        .status(404)
        .json({ status: false, message: "Expense not found" });
    }

    const oldAmount = Number(expense.amount || 0);
    const oldDate = expense.date;
    const newAmount = Number(amount || 0);

    // Reverse old debit from old date
    const oldDailyRow = await C_DailyBalance.findOne({ where: { date: oldDate, companyId } });
    if (oldDailyRow) {
      await oldDailyRow.decrement('totalDebit', { by: oldAmount });
      await oldDailyRow.increment('closingBalance', { by: oldAmount });
    }

    // Apply new debit to new date
    const [newDailyRow, created] = await C_DailyBalance.findOrCreate({
      where: { date, companyId },
      defaults: { openingBalance: 0, totalCredit: 0, totalDebit: 0, closingBalance: 0 }
    });

    if (created) {
      const lastDay = await C_DailyBalance.findOne({
        where: { companyId, date: { [Op.lt]: date } },
        order: [['date', 'DESC']]
      });
      const prevClosing = lastDay ? Number(lastDay.closingBalance) : 0;
      await newDailyRow.update({ openingBalance: prevClosing, closingBalance: prevClosing });
    }

    await newDailyRow.increment('totalDebit', { by: newAmount });
    await newDailyRow.increment('closingBalance', { by: -newAmount });

    const payment = await C_Payment.findOne({
      where: { id: expense.paymentId, companyId: companyId },
    });
    if (!payment) {
      return res
        .status(404)
        .json({ status: "false", message: "Payment Cash Not Found" });
    }

    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }

    if (amount !== oldAmount) {
      let balanceRecord;
      if (role === ROLE.SUPER_ADMIN) {
        balanceRecord = await C_companyBalance.findOne({
          where: { companyId },
        });
      } else {
        balanceRecord = await C_userBalance.findOne({
          where: { companyId, userId },
        });
      }

      const diff = amount - oldAmount;
      if (diff > 0 && (balanceRecord?.balance ?? 0) < diff) {
        return res
          .status(400)
          .json({ status: false, message: "Not enough funds for update." });
      }

      await balanceRecord.increment("balance", { by: oldAmount });
      await balanceRecord.decrement("balance", { by: amount });
    }

    await payment.update({
      accountId,
      amount,
      description,
      date,
      paymentNo: payment.paymentNo,
      createdBy: payment.createdBy,
      updatedBy: userId,
      companyId: companyId,
    });
    await C_Ledger.update(
      {
        accountId: accountId,
        paymentId: payment.id,
        date: date,
      },
      {
        where: {
          paymentId: payment.id,
          companyId: companyId,
        },
      }
    );
    if (role === ROLE.SUPER_ADMIN) {
      await C_WalletLedger.update(
        {
          date: date,
          approveDate: new Date(),
        },
        {
          where: {
            paymentId: payment.id,
            companyId: companyId,
            userId: userId,
          },
        }
      );

      await C_Cashbook.update(
        {
          date: date,
        },
        {
          where: {
            C_paymentId: payment.id,
            companyId: companyId,
          },
        }
      );
    } else {
      const walletLedgerExist = await C_WalletLedger.findOne({
        where: {
          paymentId: payment.id,
          companyId: companyId,
          userId: userId,
        },
      });

      const cashbookEntry = await C_Cashbook.findOne({
        where: {
          C_paymentId: payment.id,
          companyId: companyId,
        },
      });
      const entryApprove = walletLedgerExist.isApprove;
      if (entryApprove) {
        walletLedgerExist.approveDate = new Date();
        cashbookEntry.date = date;
        await cashbookEntry.save();
        if (balanceRecord) {
          await balanceRecord.increment("incomes", { by: oldAmount });
          await balanceRecord.decrement("incomes", { by: amount });
        }
      }
      walletLedgerExist.date = date;
      await walletLedgerExist.save();
    }

    await expense.update({ date, amount, description });

    await syncDailyBalances(date, companyId);

    return res.status(200).json({
      status: true,
      message: "Self Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

exports.C_delete_selfExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role, companyId } = req.user;

    const expense = await C_SelfExpense.findByPk(id);
    if (!expense) {
      return res
        .status(404)
        .json({ status: false, message: "Expense not found" });
    }    

    const deleteAmount = Number(expense.amount || 0);
    const deleteDate = expense.date;

    const dailyRow = await C_DailyBalance.findOne({ where: { date: deleteDate, companyId } });
    if (dailyRow) {
      await dailyRow.decrement('totalDebit', { by: deleteAmount });
      await dailyRow.increment('closingBalance', { by: deleteAmount });
    }

    let balanceRecord;
    if (role === ROLE.SUPER_ADMIN) {
      balanceRecord = await C_companyBalance.findOne({ where: { companyId } });
    } else {
      balanceRecord = await C_userBalance.findOne({
        where: { companyId, userId },
      });
    }

    const walletLedgerExist = await C_WalletLedger.findOne({
      where: {
        paymentId: expense.paymentId,
        companyId: companyId,
        userId: userId,
      },
    });
    const entryApprove = walletLedgerExist.isApprove;

    if (balanceRecord?.incomes >= 0 && entryApprove) {
      await balanceRecord.increment("incomes", { by: expense.amount });
    }

    await C_Payment.destroy({
      where: { id: expense.paymentId, companyId: companyId },
    });

    await balanceRecord.increment("balance", { by: expense.amount });

    await expense.destroy();

    await syncDailyBalances(deleteDate, companyId);

    return res
      .status(200)
      .json({ status: true, message: "Expense deleted and balance refunded" });
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

exports.C_view_selfExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await C_SelfExpense.findByPk(id);

    if (!expense) {
      return res
        .status(404)
        .json({ status: false, message: "Expense not found" });
    }

    return res.status(200).json({ status: true, data: expense });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

exports.C_get_all_selfExpense = async (req, res) => {
  try {
    const { companyId, userId } = req.user;

    const expenses = await C_SelfExpense.findAll({
      where: {
        userId,
        companyId,
      },
      order: [["date", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      data: expenses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

exports.C_get_all_selfExpense_by_userId = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { id } = req.params;
    const { fromDate, toDate } = req.query;

    let whereCondition = {
      userId: id,
      companyId,
    };
    if (fromDate && toDate) {
      whereCondition.date = {
        [Op.between]: [fromDate, toDate],
      };
    } else if (fromDate) {
      whereCondition.date = {
        [Op.gte]: fromDate,
      };
    } else if (toDate) {
      whereCondition.date = {
        [Op.lte]: toDate,
      };
    }
    const expenses = await C_SelfExpense.findAll({
      where: whereCondition,
      order: [["date", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      data: expenses,
    });
  } catch (error) {
    console.log("error: ", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const getPaymentNo = async (companyId) => {
  const data = await C_Payment.findAll({
    where: { companyId: companyId },
  });
  let nextPaymentcashNumber = 1;
  if (data.length > 0) {
    const existingNumbers = data
      .map((item) => parseInt(item.paymentNo))
      .filter((num) => !isNaN(num));

    const maxNumber = Math.max(...existingNumbers);

    if (!isNaN(maxNumber)) {
      nextPaymentcashNumber = maxNumber + 1;
    }
  }

  return nextPaymentcashNumber;
};
