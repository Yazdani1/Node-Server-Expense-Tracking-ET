const uuid = require("uuid");

const NationaId = require("../model/NationaId");

/**
 * To create natioan id
 * @param {*} req
 * @param {*} res
 * @returns
 */

exports.createNationalId = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      photo,
      nationalIdNumber,
      dateOfBirth,
      phoneNumber,
      city,
      fatherName,
      motherName,
      street,
      houseNumber,
      postalCode,
    } = req.body;

    const nationalIdDetails = NationaId({
      firstName,
      lastName,
      photo,
      nationalIdNumber,
      dateOfBirth,
      phoneNumber,
      city,
      fatherName,
      motherName,
      street,
      houseNumber,
      postalCode,
      slug: uuid.v4(),
      postedBy: req.user,
    });

    const alreadyExist = await NationaId.findOne({ nationalIdNumber });

    if (alreadyExist) {
      return res
        .status(422)
        .json({ error: "National Id Number Should be Unique" });
    }

    const saveNationalId = await NationaId.create(nationalIdDetails);
    res.status(201).json(saveNationalId);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

/**
 * To get all the national id and only admin can access it
 */

exports.getAllNationalIdList = async (req, res) => {
  try {

    const allNationalIdList = await NationaId.find()
      .populate("postedBy", "name role email")
      .sort({ date: -1 });
      
    res.status(200).json(allNationalIdList);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

/**
 * To search national id
 */

exports.searchNationalId = async (req, res) => {
  try {
    const nationalIdNumber = req.query.nationalid;
    // Check if nationalIdNumber is empty or undefined
    if (!nationalIdNumber) {
      return res.status(422).json({ error: "Please provide a national ID number" });
    }
    const singleNationalId = await NationaId.findOne({
      nationalIdNumber: nationalIdNumber,
    });
    if (!singleNationalId || singleNationalId.length === 0) {
      return res.status(404).json({ error: "No search results found - wrong ID number" });
    }
    res.status(200).json(singleNationalId);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// exports.searchNationalId = async (req, res) => {
//   try {

//     const singleNationalId = await NationaId.findOne({
//       nationalIdNumber: req.query.nationalid,
//     });

//     if (!singleNationalId || singleNationalId.length === 0) {
//       return res.status(404).json({ error: "No search results found - wrong id number" });
//     }

//     res.status(200).json(singleNationalId);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };
