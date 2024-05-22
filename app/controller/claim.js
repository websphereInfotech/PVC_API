const C_claim = require("../models/C_claim");
const C_customer = require("../models/C_customer");
const User = require("../models/user");

exports.create_claim = async (req, res) => {
  try {
    const fromUserId = req.user.userId;
    const { toUserId, amount, description } = req.body;

    if (toUserId === "" || toUserId === undefined || !toUserId) {
      return res
        .status(400)
        .json({ status: "true", message: "Required Field : toUserId" });
    }
    const data = await C_claim.create({
      toUserId,
      amount,
      description,
      fromUserId,
    });
    return res.status(200).json({
      status: "true",
      message: "Claim Created Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_claim = async (req, res) => {
  try {
    const { id } = req.params;
    const { toUserId, amount, description } = req.body;

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

    const data = await C_claim.findAll({ where: { fromUserId: id },include:[ { model: User, as: 'toUser' },] });

    if (data.length > 0) {
      return res
        .status(200)
        .json({
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

    const data = await C_claim.findAll({ where: { toUserId: id },include:[{model:User, as:'toUser'}] });
    if (data.length > 0) {
      return res
        .status(200)
        .json({
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

    const data = await C_claim.findByPk(id);

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Claim Not Found" });
    }
    const { toUserId, isApproved } = req.body;

    if (req.user.userId !== toUserId) {
      return res.status(403).json({ status: "false", message: "Invalid Id" });
    }

    if (data.isApproved !== null) {
      return res
        .status(400)
        .json({
          status: "false",
          message: "Claim has already been approved or rejected",
        });
    }
    data.isApproved = isApproved;

    await data.save();

    return res
      .status(200)
      .json({
        status: "true",
        message: `Claim Approved ${isApproved}`,
        data: data,
      });
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
        { model: User, as: 'fromUser' },
        { model: User, as: 'toUser' }
      ]
    });
    
    if (data) {
      return res.status(200).json({ status: 'true', message: 'View Data Show Successfully', data: data });
    } else {
      return res.status(404).json({ status: 'false', message: 'Claim Not Found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
}