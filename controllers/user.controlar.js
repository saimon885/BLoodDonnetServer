// controllers/user.controller.js

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.egyr9n8.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const userCollections = client.db("BloodDonnet").collection("users");

// POST /users
const createUser = async (req, res) => {
  const user = req.body;
  user.role = "donor";
  user.status = "active";
  user.createAt = new Date();
  user.createdAt = new Date();
  const email = user.email;
  const userExist = await userCollections.findOne({ email });
  if (userExist) {
    return res.send({ messege: "user already exist" });
  }
  const result = await userCollections.insertOne(user);
  res.send(result);
};

// GET /users
const getUsers = async (req, res) => {
  const email = req.query.email;
  const quiry = {};
  if (email) {
    quiry.email = email;
  }
  // console.log(req.headers);
  const result = await userCollections
    .find(quiry)
    .sort({ createAt: -1 })
    .toArray();
  res.send(result);
};

// allData user
const alladminuser = async (req, res) => {
  const result = await userCollections.find().sort({ createdAt: -1 }).toArray();
  res.send(result);
};

const Alluser = async (req, res) => {
  const { Blood, recipentDistrict, recipientUpazila } = req.query;
  const query = {};
  if (Blood) {
    query.bloodGroup = Blood;
  }
  if (recipentDistrict) {
    query.district = recipentDistrict;
  }
  if (recipientUpazila) {
    query.upazila = recipientUpazila;
  }
  const result = await userCollections.find(query).toArray();
  res.send(result);
};

const getAllDonor = async (req, res) => {
  const pipeline = [
    {
      $group: {
        _id: "role",
        count: { $sum: 1 },
      },
    },
  ];

  const result = await userCollections.aggregate(pipeline).toArray();
  res.send(result);
};

const getRoleUser = async (req, res) => {
  const email = req.params.email;
  const query = { email };
  const user = await userCollections.findOne(query);
  res.send({ role: user?.role || "user" });
};
// PATCH /users/:id

const updateUser = async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  const query = { _id: new ObjectId(id) };
  const updateSet = {};
  const allowedFields = [
    "role",
    "displayName",
    "photoURL",
    "email",
    "bloodGroup",
    "district",
    "upazila",
    "status",
  ];
  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      updateSet[key] = updateData[key];
    }
  }
  if (Object.keys(updateSet).length === 0) {
    return res.status(400).send({ message: "No valid fields to update." });
  }
  const updateDoc = {
    $set: updateSet,
  };

  const result = await userCollections.updateOne(query, updateDoc);
  res.send(result);
};

module.exports = {
  createUser,
  alladminuser,
  Alluser,
  getUsers,
  getAllDonor,
  updateUser,
  getRoleUser,
};
