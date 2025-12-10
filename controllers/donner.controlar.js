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
  const result = await donnerCollections.insertOne(Donnetion);
  res.send(result);
};

// GET /donnetions
const getDonner = async (req, res) => {
  const requesterEmail = req.query.email;
  const quiry = {};
  if (requesterEmail) {
    quiry.requesterEmail = requesterEmail;
  }
  const result = await donnerCollections.find(quiry).toArray();
  res.send(result);
};
// Get SingleDonners
const getSingleDonners = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await donnerCollections.findOne(query);
  res.send(result);
};
// update Donner
const updateDonner = async (req, res) => {
  const id = req.params.id;
  const updateUser = req.body;
  const query = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: {
      Blood: updateUser.Blood,
      donetionDate: updateUser.donetionDate,
      donetionTime: updateUser.donetionTime,
      requestMessage: updateUser.requestMessage,
      recipentDistrict: updateUser.recipentDistrict,
      recipientUpazila: updateUser.recipientUpazila,
      hospitalName: updateUser.hospitalName,
      address: updateUser.address,
      recipientName: updateUser.recipientName,
    },
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
};
