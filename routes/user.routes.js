const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  updateUser,
} = require("../controllers/user.controlar");

// POST
router.post("/", createUser);

// GET
router.get("/", getUsers);

// PATCH
router.patch("/:id", updateUser);

module.exports = router;
