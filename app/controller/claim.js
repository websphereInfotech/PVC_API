const { Sequelize } = require("sequelize");
const C_claim = require("../models/C_claim");
const User = require("../models/user");
const C_claimLedger = require("../models/C_claimLedger");
const C_receiveCash = require("../models/C_Receipt");
const C_userBalance = require("../models/C_userBalance");
const companyUser = require("../models/companyUser");
const C_WalletLedger = require("../models/C_WalletLedger");
const Account = require("../models/Account");
const C_CompanyBalance = require("../models/C_companyBalance");
const Salary = require("../models/salary");
const SalaryPayment = require("../models/salaryPayment");
const {SALARY_PAYMENT_TYPE, ROLE} = require("../constant/constant");

exports.create_claim = async (req, res) => {
  try {
    const fromUserId = req.user.userId;
    const { toUserId, amount, description, purpose } = req.body;

    if (toUserId === "" || toUserId === undefined || !toUserId) {
      return res
        .status(400)
        .json({ status: "true", message: "Required Field : User" });
    }
    const userData = await User.findOne({ where: { id: toUserId } });
    if (!userData) {
      return res
        .status(404)
        .json({ status: "false", message: "User Not Found" });
    }
    const data = await C_claim.create({
      toUserId,
      amount,
      description,
      fromUserId,
      purpose,
      companyId: req.user.companyId,
    });
    return res.status(200).json({
      status: "true",
      message: "Claim Created Successfully",
      data: data,
    });
  } catch (error) {
    // console.log(error);
    console.error("Error creating claim:", error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_claim = async (req, res) => {
  try {
    const { id } = req.params;
    const { toUserId, amount, description, purpose } = req.body;

    const userData = await C_claim.findOne({
      where: { id: id, companyId: req.user.companyId },
    });

    if (!userData) {
      return res
        .status(404)
        .json({ status: "false", message: "Claim Not Found" });
    }
    if (req.user.userId === userData.fromUserId) {
      await C_claim.update(
        {
          toUserId,
          amount,
          description,
          purpose,
          companyId: req.user.companyId,
        },
        { where: { id } }
      );
      const data = await C_claim.findOne({
        where: { id: id, companyId: req.user.companyId },
      });
      return res.status(200).json({
        status: "true",
        message: "Claim Updated successfully",
        data: data,
      });
    } else {
      return res.status(403).json({ status: "false", message: "Invalid Id" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_claim = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await C_claim.findOne({
      where: { id: id, companyId: req.user.companyId },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Claim Not Found" });
    }
    if (req.user.userId === data.fromUserId) {
      await C_claim.destroy({ where: { id } });
      return res
        .status(200)
        .json({ status: "true", message: "Claim Deleted successfully" });
    } else {
      return res.status(403).json({ status: "false", message: "Invalid Id" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_myclaim = async (req, res) => {
  try {
    const id = req.user.userId;

    const data = await C_claim.findAll({
      where: { fromUserId: id, companyId: req.user.companyId },
      include: [
        { model: User, as: "fromUser" },
        { model: User, as: "toUser" },
      ],
    });

    if (data.length > 0) {
      return res.status(200).json({
        status: "true",
        message: "Claim Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Claim Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.view_reciveclaim = async (req, res) => {
  try {
    const id = req.user.userId;
    const data = await C_claim.findAll({
      where: { toUserId: id, companyId: req.user.companyId },
      include: [
        { model: User, as: "toUser" },
        { model: User, as: "fromUser" },
      ],
    });
    if (data.length > 0) {
      return res.status(200).json({
        status: "true",
        message: "Claim Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Claim Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.isapproved_claim = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    const companyId = req.user.companyId;

    const data = await C_claim.findOne({
      where: {
        id: id,
        toUserId: req.user.userId,
        companyId: req.user.companyId,
      },
      include: [{model: User, as: "toUser"}, {model: User, as: "fromUser"}],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Claim Not Found" });
    }

    if (data.isApproved !== null) {
      return res.status(400).json({
        status: "false",
        message: "Claim has already been approved or rejected",
      });
    }
    let existingBalance;
    if(data.toUser.role === ROLE.SUPER_ADMIN){
      existingBalance = await C_CompanyBalance.findOne({
        where: {
          companyId: data.companyId,
        }
      })
    }else {
      existingBalance = await C_userBalance.findOne({
        where: { userId: req.user.userId, companyId: req.user.companyId },
      });
    }
    const balance = existingBalance?.balance ?? 0
    const amount = data.amount;
    if(isApproved === true && balance<amount){
      return res.status(400).json({
        status: "false",
        message: "Not enough fund."
      })
    }
    data.isApproved = isApproved;
    data.date = new Date();

    await data.save();

    if (isApproved === true) {
      // await C_claimLedger.create({
      //   claimId: data.id,
      //   userId: req.user.userId,
      //   date: new Date(),
      //   companyId: req.user.companyId,
      // });

      await C_WalletLedger.create({
        claimId: data.id,
        userId: req.user.userId,
        companyId: companyId,
        date: new Date(),
        isApprove: true,
        approveDate: new Date(),
      })

      await C_WalletLedger.create({
        claimId: data.id,
        userId: data.fromUserId,
        companyId: companyId,
        date: new Date(),
        isApprove: true,
        approveDate: new Date(),
      })

      let companyCashBalance = await C_CompanyBalance.findOne({
        where: {
          companyId: data.companyId,
        }
      })
      const fromUserBalance = await C_userBalance.findOne({
        where: { userId: data.fromUserId, companyId: req.user.companyId },
      });
      const toUserBalance = await C_userBalance.findOne({
        where: { userId: req.user.userId, companyId: req.user.companyId },
      });


      if(data.fromUser.role === ROLE.SUPER_ADMIN){
        await companyCashBalance.increment('balance', {by: amount})
      }else {
        await fromUserBalance.increment('balance', {by: amount})
      }

      if(data.toUser.role === ROLE.SUPER_ADMIN){
        await companyCashBalance.decrement('balance', {by: amount})
      }else {
        await toUserBalance.decrement('balance', {by: amount})
      }

      // await C_claimLedger.create({
      //   claimId: data.id,
      //   userId: data.fromUserId,
      //   date: new Date(),
      //   companyId: req.user.companyId,
      // });

      // const fromUserBalance = await C_userBalance.findOne({
      //   where: { userId: data.fromUserId, companyId: req.user.companyId },
      // });
      //
      // const toUserBalance = await C_userBalance.findOne({
      //   where: { userId: req.user.userId, companyId: req.user.companyId },
      // });
      //
      // fromUserBalance.balance += data.amount;
      // toUserBalance.balance -= data.amount;
      //
      // await fromUserBalance.save();
      // await toUserBalance.save();


      // if(data.fromUser.role === "Super Admin"){
      //   if(data.purpose === "Salary" || data.purpose === "Advance") {
      //     const salaryData = await Salary.findOne({
      //       where:{
      //         userId: data.fromUserId,
      //         companyId: companyId
      //       },
      //       order: [
      //         ['monthStartDate', 'DESC']
      //       ]
      //     });
      //     salaryData.payableAmount -= data.amount
      //     await salaryData.save()
      //
      //     await SalaryPayment.create({
      //       amount: data.amount,
      //       salaryId: salaryData.id,
      //       paymentType: SALARY_PAYMENT_TYPE.CASH,
      //       date: data.date,
      //       companyBankId: null,
      //       userBankId: null
      //     });
      //   }
      //   companyCashBalance.balance += data.amount;
      //   await companyCashBalance.save()
      // }else if(data.toUser.role === "Super Admin"){
      //   if(data.purpose === "Salary" || data.purpose === "Advance") {
      //     const salaryData = await Salary.findOne({
      //       where:{
      //         userId: data.fromUserId,
      //         companyId: companyId
      //       },
      //       order: [
      //         ['monthStartDate', 'DESC']
      //       ]
      //     });
      //     salaryData.payableAmount -= data.amount
      //     await salaryData.save()
      //
      //     await SalaryPayment.create({
      //       amount: data.amount,
      //       salaryId: salaryData.id,
      //       paymentType: SALARY_PAYMENT_TYPE.CASH,
      //       date: data.date,
      //       companyBankId: null,
      //       userBankId: null
      //     });
      //   }
      //   companyCashBalance.balance -= data.amount;
      //   await companyCashBalance.save()
      // }
    }


    return res.status(200).json({
      status: "true",
      message: `Claim ${isApproved ? "Approved" : "Rejected"}`,
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_ClaimUser = async (req, res) => {
  try {
    const userID = req.user.userId;

    const data = await companyUser.findAll({
      where: {
        companyId: req.user.companyId,
        userID: {
          [Sequelize.Op.ne]: userID,
        },
      },
      include: [
        { model: User, as: "users", attributes: { exclude: ["password"] } },
      ],
      // attributes: { exclude: ["password"] },
    });
    if (data.length > 0) {
      return res.status(200).json({
        status: "true",
        message: "User Data Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "User Data Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_single_claim = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await C_claim.findOne({
      where: { id: id, companyId: req.user.companyId },
      include: [
        { model: User, as: "fromUser" },
        { model: User, as: "toUser" },
      ],
    });

    if (data) {
      return res.status(200).json({
        status: "true",
        message: "View Data Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Claim Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.view_claimBalance_ledger = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fromDate, toDate } = req.query;
    const whereClause = { userId: userId, companyId: req.user.companyId };

    if (fromDate && toDate) {
      whereClause.date = { [Sequelize.Op.between]: [fromDate, toDate] };
    }

    const allData = await C_claimLedger.findAll({
      attributes: [
        "id",
        "userId",
        "date",
        [
          Sequelize.literal(`SUM(CASE 
            WHEN \`claimLedger\`.\`amount\` IS NOT NULL THEN \`claimLedger\`.\`amount\`
            ELSE CASE WHEN \`claimData\`.\`fromUserId\` = ${userId} THEN \`claimData\`.\`amount\` ELSE 0 END
          END)`),
          "creditAmount",
        ],
        [
          Sequelize.literal(
            `SUM(CASE WHEN \`claimData\`.\`toUserId\` = ${userId} THEN \`claimData\`.\`amount\` ELSE 0 END)`
          ),
          "debitAmount",
        ],
        [
          Sequelize.literal(`COALESCE(
        \`claimLedger->accountReceiptCash\`.\`contactPersonName\`, 
        CASE 
          WHEN \`claimData\`.\`fromUserId\` = ${userId} THEN \`claimData->toUser\`.\`username\`
          WHEN \`claimData\`.\`toUserId\` = ${userId} THEN \`claimData->fromUser\`.\`username\`
          ELSE NULL 
        END, 
        'Unknown'
      )`),
          "name",
        ]
      ],
      include: [
        {
          model: C_receiveCash,
          as: "claimLedger",
          attributes: [],
          include: [
            { model: Account, as: "accountReceiptCash", attributes: [] },
          ],
        },
        {
          model: C_claim,
          as: "claimData",
          attributes: [],
          include: [{ model: User, as: "toUser", attributes: [] }, { model: User, as: "fromUser", attributes: [] }],
        },
      ],
      where: whereClause,
      group: ["id"],
      order: [["date", "ASC"]],
      raw: true,
    });

    let openingBalance = 0;

    if (fromDate || toDate) {
      const previousData = await C_claimLedger.findOne({
        attributes: [
          [
            Sequelize.literal(`SUM(CASE 
            WHEN \`claimLedger\`.\`amount\` IS NOT NULL THEN \`claimLedger\`.\`amount\`
            ELSE CASE WHEN \`claimData\`.\`fromUserId\` = ${userId} THEN \`claimData\`.\`amount\` ELSE 0 END
          END)`),
            "openingBalance",
          ],
        ],
        include: [
          { model: C_receiveCash, as: "claimLedger", attributes: [] },
          { model: C_claim, as: "claimData", attributes: [] },
        ],
        where: {
          userId: userId,
          companyId: req.user.companyId,
          date: { [Sequelize.Op.lt]: fromDate },
        },
        raw: true,
      });

      openingBalance =
        previousData && previousData.openingBalance !== null
          ? parseFloat(previousData.openingBalance)
          : 0;
    }
    const enrichedData = allData.map((item) => {
      const credit = parseFloat(item.creditAmount);
      const debit = parseFloat(item.debitAmount);
      const remainingBalance = openingBalance + credit - debit;
      const enrichedItem = {
        ...item,
        openingBalance: openingBalance,
        remainingBalance: remainingBalance,
      };
      openingBalance = remainingBalance;
      return enrichedItem;
    });

    const filteredData = enrichedData.filter((item) => {
      return !fromDate || item.date >= fromDate;
    });

    if (filteredData.length > 0) {
      return res.status(200).json({
        status: "true",
        message: "Claim Ledger Show Successfully",
        data: filteredData,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Claim Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
//user balance
exports.view_user_balance = async (req, res) => {
  try {
    const data = await C_userBalance.findOne({
      where: { userId: req.user.userId, companyId: req.user.companyId },
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "User Balance Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "User Balance Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
