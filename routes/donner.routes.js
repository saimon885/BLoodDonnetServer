const express = require("express");
const router = express.Router();
const {
  createDonner,
  getDonner,
  getSingleDonners,
  updateDonner,
  deleteDonner,
  AllDonor,
} = require("../controllers/donner.controlar");

// POST
router.post("/", createDonner);

// GET
router.get("/", getDonner);

router.get("/all", AllDonor);
// get single donners
router.get("/:id", getSingleDonners);
// update
router.patch("/:id", updateDonner);
// Delete
router.delete("/:id", deleteDonner);

module.exports = router;
