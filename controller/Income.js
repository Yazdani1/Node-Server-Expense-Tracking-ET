const uuid = require("uuid");

const Income = require("../model/Income");

/**
 * To create income record
 * @param {*} req
 * @param {*} res
 */

exports.createIncomeRecord = async (req, res) => {
  try {
    const { title, des, amount } = req.body;

    const incomeRecordDetails = Income({
      title,
      des,
      amount,
      slug: uuid.v4(),
      postedBy: req.user._id,
    });

    const saveIncomeRecord = await Income.create(incomeRecordDetails);

    res.status(201).json(saveIncomeRecord);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

/**
 * To get loged in user income record
 */

exports.getUserIncomeRecord = async (req, res) => {
  try {

    const incomeRecord = await Income.find({ postedBy: req.user._id })
    .populate("postedBy","name email imageUrl slug role award accountType city")
    .sort({
      date: 1,
    });

    res.status(200).json(incomeRecord);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
