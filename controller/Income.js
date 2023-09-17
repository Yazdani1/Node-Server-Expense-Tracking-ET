const uuid = require("uuid");
const axios = require("axios");

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
      .populate(
        "postedBy",
        "name email imageUrl slug role award accountType city"
      )
      .sort({
        date: -1,
      });
    res.status(200).json(incomeRecord);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

/**
 * To delete loged in user single income record
 */

exports.deleteIncomeRecord = async (req, res) => {
  try {
    const deletequery = { _id: req.params.id };

    const singleIncomeRecord = await Income.findById(deletequery);

    if (!singleIncomeRecord) {
      return res
        .status(404)
        .json({ error: "Income record id could not found" });
    }

    const logedInUserId = req.user._id;
    const singleUserid = singleIncomeRecord.postedBy._id.toString();

    if (logedInUserId === singleUserid) {
      const deleteSingleIncomeRecord = await Income.findByIdAndDelete(
        deletequery
      );

      res.status(200).json({
        message: "Income record deleted successfully",
        deleteSingleIncomeRecord,
      });
    } else {
      return res
        .status(422)
        .json({ error: "You cant delete other user record" });
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

/**
 * For testing purpose to get api video streaming api data
 */

const API_VIDEO_STREAMING = "";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

// exports.getVideoStreamingData = async (req, res) => {
//   try {
  
//     const result = await axios.get(API_URL);

//     res.status(200).json(result.data);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };
exports.getVideoStreamingData = async (req, res) => {
  try {
    const response = await axios.get(API_URL);

    // Modify the data by adding an extra field to each item
    const modifiedData = response.data.map(item => {
      return {
        ...item, // Keep all the original fields from the item
        extraField: "Hello",
        postedBy:req.user._id // Add the extraField with the desired value
      };
    });

    res.json(modifiedData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


  // const res = await axios.get()

    // const data = [
    //   {
    //     title: "First test data",
    //     des: "First test description",
    //     age: 24,
    //     userId: req.user._id
    //   },
    //   {
    //     title: "First test data",
    //     des: "First test description",
    //     age: 36,
    //     userId: req.user._id

    //   },
    // ];