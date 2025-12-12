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
const donnerCollections = client
  .db("BloodDonnet")
  .collection("donnerCollection");

// POST /donnetion
const createDonner = async (req, res) => {
  const Donnetion = req.body;
  Donnetion.status = "pending";
  Donnetion.createdAt = new Date();
  const result = await donnerCollections.insertOne(Donnetion);
  res.send(result);
};
// allget Donor
const AllDonor = async (req, res) => {
  const result = await donnerCollections
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  res.send(result);
  
};

// GET /donnetions
const getDonner = async (req, res) => {
  const requesterEmail = req.query.email;
  const quiry = {};
  if (requesterEmail) {
    quiry.requesterEmail = requesterEmail;
  }
  const result = await donnerCollections
    .find(quiry)
    .sort({ createdAt: -1 })
    .toArray();
  res.send(result);
};
// Get SingleDonners
const getSingleDonners = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await donnerCollections.findOne(query);
  res.send(result);
};
// const updateDonner = async (req, res) => {
//   const id = req.params.id;
//   const updateUser = req.body;
//   const query = { _id: new ObjectId(id) };
//   const updateDoc = {
//     $set: {
//       Blood: updateUser.Blood,
//       donetionDate: updateUser.donetionDate,
//       donetionTime: updateUser.donetionTime,
//       requestMessage: updateUser.requestMessage,
//       recipentDistrict: updateUser.recipentDistrict,
//       recipientUpazila: updateUser.recipientUpazila,
//       hospitalName: updateUser.hospitalName,
//       address: updateUser.address,
//       recipientName: updateUser.recipientName,
//     },
//   };
//   const result = await donnerCollections.updateOne(query, updateDoc);
//   res.send(result);
// };
const updateDonner = async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  const query = { _id: new ObjectId(id) };

  const updateSet = {};
  const allowedFields = [
    "Blood",
    "donetionDate",
    "donetionTime",
    "requestMessage",
    "recipentDistrict",
    "recipientUpazila",
    "hospitalName",
    "address",
    "recipientName",
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
  const result = await donnerCollections.updateOne(query, updateDoc);
  res.send(result);
};

// Delete Donner
const deleteDonner = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await donnerCollections.deleteOne(query);
  res.send(result);
};

module.exports = {
  createDonner,
  getDonner,
  getSingleDonners,
  updateDonner,
  deleteDonner,
  AllDonor,
};
