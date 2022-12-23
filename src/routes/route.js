const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");
const propertyController = require("../controllers/propertyController");
const fieldController = require('../controllers/fieldController');
const regionController = require('../controllers/regionController');

router.post("/register", organizationController.register);
router.post("/login", organizationController.login);

router.post("/registerProperty/:companyId", propertyController.createProperty);
router.get("/getPropertyDetails", propertyController.getPropertyDetail);
router.put('/updatePropertyDetails', propertyController.updateProperty);

router.post("/registerField/:companyId", fieldController.createField);
router.get("/getFieldDetails", fieldController.getFieldDetail);
router.put("/updateFieldDetails", fieldController.updatefield);

router.post("/createRegion", regionController.createRegion);
router.get("/getRegionDetails", regionController.getRegionDetail);
router.put("/updateRegionDetails", regionController.updateRegion);

router.all("/*", async function (req, res) {
  res.status(404).send({ status: false, msg: "Page Not Found!" });
});

module.exports = router;