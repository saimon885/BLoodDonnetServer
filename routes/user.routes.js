const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  updateUser,
  getRoleUser,
} = require("../controllers/user.controlar");
const verifyToken = require("../MiddleWare/MiddleWare");
// POST
router.post("/", createUser);

// GET
router.get("/", verifyToken, getUsers);
// get
router.get("/:email/role", verifyToken, getRoleUser);

// PATCH
router.patch("/:id", updateUser);

module.exports = router;
