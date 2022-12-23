const organizationModel = require("../models/organizationModel");
// const propertyModel = require("../models/propertyModel");
const mongoose = require("mongoose");
const fieldModel = require('../models/fieldModel');

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

//********* <----REGISTER FIELD HANDLER----> ***********
const createField = async function (req, res) {
  try {
    let data = req.body;
    let companyId = req.params.companyId;

    if (!mongoose.isValidObjectId(companyId))
      return res
        .status(400)
        .send({ status: false, message: "The companyId is invalid" });

    let verifyCompany = await organizationModel.findOne({ _id: companyId });

    if (!verifyCompany)
      return res
        .status(404)
        .send({
          status: false,
          message: "The company doesn't exist with the given companyId.",
        });

    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "There is no data to create." });

    let { ownedBy, area, latitude, longitude, crops } = data;

    if (!isValidObject(data)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter data for creation" });
    }

    if (!isValid(ownedBy))
      return res
        .status(400)
        .send({ status: false, message: "OwnedBy is not present." });

    if (!isValid(area))
      return res
        .status(400)
        .send({ status: false, message: "Area is not present." });

    if (!isValid(latitude))
      return res
        .status(400)
        .send({ status: false, message: "latitude is not present." });

    if (!isValid(longitude))
      return res
        .status(400)
        .send({ status: false, message: "longitude is not present." });

    if (!crops)
      return res
        .status(400)
        .send({
          status: false,
          message: "Crops are not present.",
        });

    let savedData = await fieldModel.create(data);
    return res.status(201).send({
      status: true,
      message: "Added Successfully",
      data: savedData,
    });

  } catch (error) { res.status(500).send({ status: false, message: error.message }) };
}

//******** <----GET FIELD DETAILS----> **********
const getFieldDetail = async function (req, res) {
  try {
    let companyId = req.query.companyId;

    if (!mongoose.isValidObjectId(companyId))
      return res
        .status(400)
        .send({ status: false, message: "The companyId is invalid" });

    let verifyCompany = await organizationModel.findOne({ _id: companyId });
    if (!verifyCompany)
      return res
        .status(404)
        .send({
          status: false,
          message: "The property doesn't exist with the given propertyId.",
        });

    let fieldData = await fieldModel.find({ ownedBy: verifyCompany.name });

    return res
      .status(200)
      .send({ status: true, message: "Field details", data: fieldData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//******* <----UPDATE FIELD DETAILS----> **********
const updatefield = async (req, res) => {
  try {
    const fieldData = req.body;
    let companyId = req.query.companyId;
    let fieldId = req.query.fieldId;

    if (!mongoose.isValidObjectId(companyId))
      return res
        .status(400)
        .send({ status: false, message: "The companyId is invalid" });

    let verifyCompany = await organizationModel.findOne({ _id: companyId });

    if (!verifyCompany)
      return res
        .status(404)
        .send({
          status: false,
          message: "The company doesn't exist with the given companyId.",
        });

    if (Object.keys(fieldData).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "There is no data to create." });

    let { ownedBy, area, latitude, longitude, region, crops } = fieldData;

    if (!isValidObject(fieldData)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter data for creation" });
    }

    if (!mongoose.isValidObjectId(fieldId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid field ID" });
    }

    verifyfield = await fieldModel.findOne({ _id: fieldId });

    if (!verifyfield)
      return res
        .status(404)
        .send({
          status: false,
          message: "The field doesn't exist with the given fieldId.",
        });

    if (ownedBy) {
      if (!isValid(ownedBy)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide valid owner name" });
      }
    }

    if (region) {
      if (!isValid(region)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide valid region" });
      }
    }

    if (area) {
      if (!isValid(area)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide area" });
      }
    }

    if (latitude) {
      if (!isValid(latitude)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide valid latitude" });
      }
    }

    if (longitude) {
      if (!isValid(longitude)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide valid longitude" });
      }
    }

    if (crops) {
      if (typeof crops != 'object') {
        return res
          .status(400)
          .send({ status: false, message: "please provide valid crops" });
      }
    }

    const updateData = await fieldModel.findOneAndUpdate(
      { _id: fieldId },
      fieldData,
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

module.exports = { createField, getFieldDetail, updatefield };