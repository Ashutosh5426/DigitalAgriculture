const organizationModel = require("../models/organizationModel");
const propertyModel = require("../models/propertyModel");
const mongoose = require("mongoose");

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

//********* <----REGISTER PROPERTY HANDLER----> ***********
const createProperty = async function (req, res) {
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

    let { ownedBy, location, region, field } = data;

    if (!isValidObject(data)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter data for creation" });
    }

    if (!isValid(ownedBy))
      return res
        .status(400)
        .send({ status: false, message: "OwnedBy is not present." });

    if (!isValid(location))
      return res
        .status(400)
        .send({ status: false, message: "Location is not present." });

    if (!isValid(region))
      return res
        .status(400)
        .send({ status: false, message: "Region is not present." });

    if (!field)
      return res
        .status(400)
        .send({
          status: false,
          message: "Field is not present.",
        });

    let savedData = await propertyModel.create(data);
    return res.status(201).send({
      status: true,
      message: "Added Successfully",
      data: savedData,
    });

  } catch (error) { res.status(500).send({ status: false, message: error.message }) };
}

//******** <----GET PROPERTY DETAILS----> **********
const getPropertyDetail = async function (req, res) {
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

    let propertyData = await propertyModel.find({ name: verifyCompany.name });

    return res
      .status(200)
      .send({ status: true, message: "property details", data: propertyData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//******* <----UPDATE PRPERTY DETAILS----> **********
const updateProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    let companyId = req.query.companyId;
    let propertyId = req.query.propertyId;

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

    if (Object.keys(propertyData).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "There is no data to create." });

    let { ownedBy, location, region, field } = propertyData;

    if (!isValidObject(propertyData)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter data for creation" });
    }

    if (!mongoose.isValidObjectId(propertyId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid property ID" });
    }

    verifyProperty = await propertyModel.findOne({ _id: propertyId });

    if (!verifyProperty)
      return res
        .status(404)
        .send({
          status: false,
          message: "The property doesn't exist with the given propertyId.",
        });

    if (ownedBy) {
      if (!isValid(ownedBy)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide valid owner name" });
      }
    }

    if (location) {
      if (!isValid(location)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide valid location" });
      }
    }

    if (region) {
      if (!isValid(region)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide region" });
      }
    }

    if (field) {
      if (!isValid(field)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide valid field" });
      }
    }

    const updateData = await propertyModel.findOneAndUpdate(
      { _id: propertyId },
      propertyData,
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

module.exports = { createProperty, getPropertyDetail, updateProperty };