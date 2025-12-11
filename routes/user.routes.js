const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  updateUser,
  getRoleUser,
} = require("../controllers/user.controlar");

// POST
router.post("/", createUser);

// GET
router.get("/", getUsers);
// get
router.get("/:email/role", getRoleUser);

// PATCH
router.patch("/:id", updateUser);

module.exports = router;
