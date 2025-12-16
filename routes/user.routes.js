const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  updateUser,
  getRoleUser,
  alladminuser,
  Alluser,
  getAllDonor
} = require("../controllers/user.controlar");
const verifyToken = require("../MiddleWare/MiddleWare");
// POST
router.post("/", createUser);

// GET
router.get("/", verifyToken, getUsers);
// get
router.get("/allusers", Alluser);
router.get("/allusers/Role", getAllDonor);
router.get("/alladminusers", verifyToken, alladminuser);

// email
router.get("/:email/role", verifyToken, getRoleUser);

// PATCH
router.patch("/:id",  updateUser);

module.exports = router;
