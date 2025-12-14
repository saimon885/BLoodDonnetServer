const express = require("express");
const router = express.Router();
const { createCheckOut } = require("../controllers/Funding.controlar");
const verifyToken = require("../MiddleWare/MiddleWare");
// POST
router.post("/", createCheckOut);
module.exports = router;
