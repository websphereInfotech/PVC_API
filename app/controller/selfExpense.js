const { ROLE } = require("../constant/constant");
const C_companyBalance = require("../models/C_companyBalance");
const C_SelfExpense = require("../models/C_selfExpense");
const C_userBalance = require("../models/C_userBalance");

exports.C_create_selfExpense = async (req, res) => {
  try {
    const { userId: user, role, companyId } = req.user;
    const { date, amount, description } = req.body;

    let existingBalance;

    if (role === ROLE.SUPER_ADMIN) {
      existingBalance = await C_companyBalance.findOne({
        where: { companyId },
      });
    } else {
      existingBalance = await C_userBalance.findOne({
        where: { companyId, userId: user },
      });
    }

    const balance = existingBalance?.balance ?? 0;

    if (balance < amount) {
      return res.status(400).json({
        status: false,
        message: "Not enough funds.",
      });
    }

    const expense = await C_SelfExpense.create({
      date,
      amount,
      description,
      userId: user,
      companyId,
    });

    await existingBalance.decrement("balance", { by: amount });

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
    const { date, amount, description } = req.body;
    const { userId, role, companyId } = req.user;

    const expense = await C_SelfExpense.findByPk(id);
    if (!expense) {
      return res
        .status(404)
        .json({ status: false, message: "Expense not found" });
    }

    const oldAmount = expense.amount;

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

    await expense.update({ date, amount, description });

    return res.status(200).json({
      status: true,
      message: "Self Expense updated successfully",
      data: expense,
    });
  } catch (error) {
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

    let balanceRecord;
    if (role === ROLE.SUPER_ADMIN) {
      balanceRecord = await C_companyBalance.findOne({ where: { companyId } });
    } else {
      balanceRecord = await C_userBalance.findOne({
        where: { companyId, userId },
      });
    }

    await balanceRecord.increment("balance", { by: expense.amount });

    await expense.destroy();

    return res
      .status(200)
      .json({ status: true, message: "Expense deleted and balance refunded" });
  } catch (error) {
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
    const expenses = await C_SelfExpense.findAll({
      where: {
        userId: id,
        companyId,
      },
      order: [["date", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      data: expenses,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};
