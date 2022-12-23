const organizationModel = require("../models/organizationModel");
const validateEmail = require("email-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

//****** <---- INITIALIZING REGEX && SALT ROUNDS----> *******
const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{8,15}$/;
const saltRounds = 10;

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

//********* <----REGISTER USER HANDLER----> ***********
const register = async function (req, res) {
  try {
    let data = req.body;

    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "There is no data to register." });

    let { name, email, password, location } = data;

    if (!isValidObject(data)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter data for creation" });
    }

    if (!isValid(name))
      return res
        .status(400)
        .send({ status: false, message: "Name is not present." });

    if (!isValid(email))
      return res
        .status(400)
        .send({ status: false, message: "Email address is not present." });

    if (!validateEmail.validate(email))
      return res
        .status(400)
        .send({ status: false, message: "Email address is invalid." });
    let checkEmail = await organizationModel.findOne({ email });

    if (checkEmail)
      return res
        .status(400)
        .send({
          status: false,
          message: "This email address is already registered.",
        });

    if (!isValid(password))
      return res
        .status(400)
        .send({ status: false, message: "Password is not present." });
    password = password.trim();
    if (!passwordRegex.test(password))
      return res
        .status(400)
        .send({
          status: false,
          message: "Password should have 8 to 15 characters.",
        });

    if (!isValid(location))
      return res
        .status(400)
        .send({ status: false, message: "Location is not present." });

    data.password = await bcrypt.hash(password, saltRounds);

    let savedData = await organizationModel.create(data);
    return res.status(201).send({
      status: true,
      message: "Registered Successfully",
      data: savedData,
    });

  } catch (error) { res.status(500).send({ status: false, message: error.message }) };
};


//********* <----LOGIN API----> ************
const login = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "There is no data to Login." });

    if (!isValid(email))
      return res
        .status(400)
        .send({ status: false, message: "Email address should be present." });

    if (!validateEmail.validate(email))
      return res
        .status(400)
        .send({ status: false, message: "The email address is invalid." });

    let organizationData = await organizationModel.findOne({ email });
    if (!organizationData)
      return res
        .status(404)
        .send({
          status: false,
          message: "This email address is not registered.",
        });

    if (!isValid(password))
      return res
        .status(400)
        .send({ status: false, message: "Password should be present." });
        
    if (!passwordRegex.test(password))
      return res
        .status(400)
        .send({
          status: false,
          message: "Password is invalid. It should have 8 to 15 characters.",
        });

    let checkPassword = await bcrypt.compare(password, organizationData.password);
    if (!checkPassword)
      return res
        .status(400)
        .send({ status: false, message: "Invalid Password Credential." });

    const token = jwt.sign(
      {
        userId: organizationData._id,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 100*60 * 60,
      },
      "digitialFarmingKey"
    );

    res.header("Authorisation", token);
    return res.status(200).send({
      status: true,
      message: "LoggedIn successfully.",
      data: { Id: organizationData._id, token: token },
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { register, login };