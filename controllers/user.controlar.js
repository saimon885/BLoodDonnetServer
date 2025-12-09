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
  user.role = "user";
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
  const result = await userCollections.find(quiry).toArray();
  res.send(result);
};

// PATCH /users/:id
const updateUser = async (req, res) => {
  const id = req.params.id;
  const updateUser = req.body;
  const query = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      displayName: updateUser.displayName,
      photoURL: updateUser.photoURL,
      email: updateUser.email,
      bloodGroup: updateUser.bloodGroup,
      district: updateUser.district,
      upazila: updateUser.upazila,
    },
  };
  const result = await userCollections.updateOne(query, updateDoc);
  res.send(result);
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
};
