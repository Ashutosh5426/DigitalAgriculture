// const organizationModel = require("../models/organizationModel");
// const propertyModel = require("../models/propertyModel");
const regionModel = require('../models/regionModel');
const mongoose = require("mongoose");
// const fieldModel = require('../models/fieldModel');

//********* <----VALIDATOR FUNCTIONS----> *********
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number") return false;
  return true;
};

const isValidObject = (data) => {
  if (Object.keys(data).length === 0) {
    return false
  }
  return true
}

//********* <----CREATE REGION HANDLER----> ***********
const createRegion = async function (req, res) {
  try {
    let data = req.body;

    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "There is no data to create." });

    let { seasons, cropCycles, regionalCrops } = data;

    if (!isValidObject(data)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter data for creation" });
    }


    if (typeof seasons != 'object') {
      return res
        .status(400)
        .send({ status: false, message: "please provide valid seasons" });
    }

    if (typeof cropCycles != 'object')
      return res
        .status(400)
        .send({ status: false, message: "cropCycles is not present." });

    if (typeof regionalCrops != 'object')
      return res
        .status(400)
        .send({ status: false, message: "regionalCrops is not present." });

    let savedData = await regionModel.create(data);
    return res.status(201).send({
      status: true,
      message: "Added Successfully",
      data: savedData,
    });

  } catch (error) { res.status(500).send({ status: false, message: error.message }) };
}

//******** <----GET FIELD DETAILS----> **********
const getRegionDetail = async function (req, res) {
  try {

    let regionData = await regionModel.find();

    return res
      .status(200)
      .send({ status: true, message: "Field details", data: regionData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//******* <----UPDATE FIELD DETAILS----> **********
const updateRegion = async (req, res) => {
  try {
    const Data = req.body;
    let regionId = req.query.regionId;

    if (Object.keys(Data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "There is no data to create." });

    if (!isValidObject(Data)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter data for creation" });
    }

    let { seasons, cropCycles, regionalCrops } = Data;

    if (seasons) {
      if (typeof seasons != 'object') {
        return res
          .status(400)
          .send({ status: false, message: "please provide valid seasons" });
      }
    }

    if (cropCycles) {
      if (typeof cropCycles != 'object') {
        return res
          .status(400)
          .send({ status: false, message: "please provide valid cropCycles" });
      }
    }

    if (regionalCrops) {
      if (typeof regionalCrops != 'object') {
        return res
          .status(400)
          .send({ status: false, message: "please provide regionalCrops" });
      }
    }

    const updateData = await regionModel.findOneAndUpdate(
      { _id: regionId },
      Data,
      { new: true }
    );
    return res.status(200).send({
      status: true,
      message: "Updated successfully",
      data: updateData,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createRegion, getRegionDetail, updateRegion };