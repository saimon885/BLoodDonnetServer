const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  updateUser,
  getRoleUser,
  alladminuser,
  Alluser,
  getAllDonor,
  getAllVolunteer,
  getAllAdmin,
  getBloodGroup,
} = require("../controllers/user.controlar");
const verifyToken = require("../MiddleWare/MiddleWare");
// POST
router.post("/", createUser);

// GET
router.get("/", verifyToken, getUsers);
// get
router.get("/allusers", Alluser);
// getUsrs Role
router.get("/allusers/bloods", getBloodGroup);
router.get("/allusers/Role", getAllDonor);
router.get("/allVolunteers/Role", getAllVolunteer);
router.get("/allAdmins/Role", getAllAdmin);
router.get("/alladminusers", verifyToken, alladminuser);

// email
router.get("/:email/role", verifyToken, getRoleUser);

// PATCH
router.patch("/:id", updateUser);

module.exports = router;
