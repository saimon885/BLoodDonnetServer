const express = require("express");
const router = express.Router();
const {
  createCheckOut,
  updatePayment,
  getPayment,
} = require("../controllers/Funding.controlar");
const verifyToken = require("../MiddleWare/MiddleWare");
// POST
router.post("/", createCheckOut);
// update
router.patch("/", updatePayment);
// get payment
router.get("/", getPayment);
module.exports = router;
