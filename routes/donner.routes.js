const express = require("express");
const router = express.Router();
const {
  createDonner,
  getDonner,
  getSingleDonners,
  updateDonner,
  deleteDonner,
  AllDonor,
  getAllDonationCount
} = require("../controllers/donner.controlar");
const verifyToken = require("../MiddleWare/MiddleWare");
// POST
router.post("/", createDonner);

// GET
router.get("/", getDonner);

router.get("/all", AllDonor);
router.get("/DonnetionCount", getAllDonationCount);
// get single donners
router.get("/:id",verifyToken, getSingleDonners);
// update
router.patch("/:id", updateDonner);
// Delete
router.delete("/:id", deleteDonner);

module.exports = router;
