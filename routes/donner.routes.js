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
const verifyToken = require("../MiddleWare/MiddleWare");
// POST
router.post("/", verifyToken, createDonner);

// GET
router.get("/", verifyToken, getDonner);

router.get("/all", AllDonor);
// get single donners
router.get("/:id", verifyToken, getSingleDonners);
// update
router.patch("/:id", verifyToken, updateDonner);
// Delete
router.delete("/:id", verifyToken, deleteDonner);

module.exports = router;
