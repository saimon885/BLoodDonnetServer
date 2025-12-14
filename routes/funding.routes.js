const express = require("express");
const router = express.Router();
const {
  createCheckOut,
  updatePayment,
} = require("../controllers/Funding.controlar");
const verifyToken = require("../MiddleWare/MiddleWare");
// POST
router.post("/", createCheckOut);
// update
router.patch("/", updatePayment);
module.exports = router;
