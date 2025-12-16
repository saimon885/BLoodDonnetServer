const express = require("express");
const router = express.Router();
const {
  createCheckOut,
  updatePayment,
  getPayment,
  getAdmindashboardPayment,
} = require("../controllers/Funding.controlar");
const verifyToken = require("../MiddleWare/MiddleWare");
// POST
router.post("/", createCheckOut);
// update
router.patch("/", updatePayment);
// get payment
router.get("/", getPayment);
router.get("/paymentStatus", getAdmindashboardPayment);
module.exports = router;
