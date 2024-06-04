const { Sequelize, Op } = require("sequelize");
const C_claim = require("../models/C_claim");
const User = require("../models/user");
const C_claimLedger = require("../models/C_claimLedger");
const C_receiveCash = require("../models/C_receiveCash");
const C_userBalance = require("../models/C_userBalance");

exports.create_claim = async (req, res) => {
  try {
    const fromUserId = req.user.userId;
    const { toUserId, amount, description, purpose } = req.body;

    if (toUserId === "" || toUserId === undefined || !toUserId) {
      return res
        .status(400)
        .json({ status: "true", message: "Required Field : toUserId" });
    }
    const userData = await User.findOne({where:{id:toUserId}});
    if(!userData) {
      return res.status(404).json({ status:'false', message:'User Not Found'});
    }
    const data = await C_claim.create({
      toUserId,
      amount,
      description,
      fromUserId,
      purpose,
    });
    // const claim =  await C_claimBalance.create({
    //   receiveId:data.fromUserId,
    //   claimId:data.toUserId,
    //   date: new Date()
    // });
    // console.log("claim>>>>>>>>",claim);
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

    const userData = await C_claim.findByPk(id);

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
        },
        { where: { id } }
      );
      const data = await C_claim.findByPk(id);
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

    const data = await C_claim.findByPk(id);
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
      where: { fromUserId: id },
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
      where: { toUserId: id },
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

    const data = await C_claim.findOne({
      where: { id: id, toUserId: req.user.userId },
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
    data.isApproved = isApproved;

    await data.save();

    await C_claimLedger.create({
      claimId: data.id,
      userId: req.user.userId,
      date: new Date(),
    });

    await C_claimLedger.create({
      claimId: data.id,
      userId: data.fromUserId,
      date: new Date(),
    });

    if (isApproved === true) {
      
      const fromUserBalance = await C_userBalance.findOne({
        where: { userId: data.fromUserId, companyId: req.user.companyId },
      });

      const toUserBalance = await C_userBalance.findOne({
        where: { userId: req.user.userId, companyId: req.user.companyId },
      });

      fromUserBalance.balance += data.amount;
      toUserBalance.balance -= data.amount;

      await fromUserBalance.save();
      await toUserBalance.save();
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

    const data = await User.findAll({
      where: {
        id: {
          [Sequelize.Op.ne]: userID, 
        },
      },
      attributes: { exclude: ["password"] },
    });
    if (data) {
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
      where: { id },
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

exports.view_claim_ledger = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fromDate, toDate } = req.query;

    let whereCondition = {
      [Op.or]: [{ fromUserId: userId }, { toUserId: userId }],
    };

    if (fromDate && toDate) {
      whereCondition.updatedAt = {
        [Op.between]: [new Date(fromDate), new Date(toDate)],
      };
    }

    const data = await C_claim.findAll({
      attributes: [
        "fromUserId",
        "toUserId",
        "updatedAt",
        //       [Sequelize.literal(`
        //   CASE
        //     WHEN fromUserId = :userId THEN ''
        //     ELSE (SELECT username FROM P_users WHERE id = P_C_claim.fromUserId)
        //   END
        // `), "fromUsername"],
        // [Sequelize.literal(`
        //   CASE
        //     WHEN toUserId = :userId THEN ''
        //     ELSE (SELECT username FROM P_users WHERE id = P_C_claim.toUserId)
        //   END
        // `), "toUsername"],
        [
          Sequelize.literal(`
    CASE 
      WHEN fromUserId = :userId THEN (SELECT username FROM P_users WHERE id = P_C_claim.toUserId)
      ELSE (SELECT username FROM P_users WHERE id = P_C_claim.fromUserId)
    END
  `),
          "username",
        ],
        [
          Sequelize.literal(
            "CASE WHEN fromUserId = :userId THEN amount ELSE 0 END"
          ),
          "debitAmount",
        ],
        [
          Sequelize.literal(
            "CASE WHEN toUserId = :userId THEN amount ELSE 0 END"
          ),
          "creditAmount",
        ],
        [
          Sequelize.literal(`
            CAST(
              COALESCE((
                SELECT SUM(CASE WHEN cl2.fromUserId = :userId THEN cl2.amount ELSE 0 END - CASE WHEN cl2.toUserId = :userId THEN cl2.amount ELSE 0 END)
                FROM P_C_claims AS cl2
                WHERE cl2.updatedAt < P_C_claim.updatedAt
                AND (cl2.fromUserId = :userId OR cl2.toUserId = :userId)
              ), 0) AS CHAR
            )
          `),
          "openingBalance",
        ],
        [
          Sequelize.literal(`
            CAST(
              (
                SUM(CASE WHEN fromUserId = :userId THEN amount ELSE 0 END - CASE WHEN toUserId = :userId THEN amount ELSE 0 END)
                OVER (PARTITION BY NULL ORDER BY updatedAt ASC)
              ) AS CHAR
            )
          `),
          "remainingBalance",
        ],
      ],
      where: whereCondition,
      group: ["fromUserId", "toUserId", "updatedAt", "amount"],
      order: [["updatedAt", "ASC"]],
      replacements: { userId: userId },
      raw: true,
    });

    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Claim Ledger Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Claim Ledger Not Found" });
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
    const whereClause = { userId: userId };

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
      ],
      include: [
        { model: C_receiveCash, as: "claimLedger", attributes: [] },
        { model: C_claim, as: "claimData", attributes: [] },
      ],
      where: { userId: userId },
      group: ["id"],
      order: [["date", "ASC"]],
      raw: true,
    });

    let openingBalance = 0;
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

    const filteredData = enrichedData.filter(item => {
      return !fromDate || item.date >= fromDate;
    });

    if (filteredData.length > 0) {
      return res.status(200).json({
        status: "true",
        message: "Claim Ledger Show Successfully",
        data: filteredData,
      });
    } else {
      return res.status(404).json({ status: "false", message: "Claim Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_user_balance = async (req,res) => {
  try {
    const data = await C_userBalance.findOne({where:{userId:req.user.userId, companyId:req.user.companyId}});
    if(data) {
      return res.status(200).json({ status:'true', message:'User Balance Show Successfully',data:data});
    } else {
      return res.status(404).json({ status:'false', message:'User Balance Not Found'});
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
}


