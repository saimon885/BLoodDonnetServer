const express = require("express");
const router = express.Router();
const {
  createDonner,
  getDonner,
  getSingleDonners,
  updateDonner,
  deleteDonner,
} = require("../controllers/donner.controlar");

// POST
router.post("/", createDonner);

// GET
router.get("/", getDonner);
// get single donners
router.get("/:id", getSingleDonners);
// update
router.patch("/:id", updateDonner);
// Delete
router.delete("/:id", deleteDonner);


module.exports = router;
