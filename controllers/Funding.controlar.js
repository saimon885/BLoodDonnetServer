// controllers/user.controller.js

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const crypto = require("crypto");

require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.egyr9n8.mongodb.net/?appName=Cluster0`;

function generateTrackingId() {
  const prefix = "BLDFUND";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `${prefix}-${date}-${random}`;
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const paymentCollections = client
  .db("BloodDonnet")
  .collection("fundingPayments");

const stripe = require("stripe")(process.env.DB_PAY);
const express = require("express");
const app = express();
app.use(express.static("public"));

// post Payment
const createCheckOut = async (req, res) => {
  const paymentInfo = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "USD",
            unit_amount: paymentInfo.fundAmount * 100,
            product_data: {
              name: "BloodHive Funding",
              description: "Donation for BloodHive platform.",
            },
          },
          quantity: 1,
        },
      ],
      customer_email: paymentInfo.funder_email,
      mode: "payment",
      metadata: {
        funderName: paymentInfo.funderName,
        fundAmount: paymentInfo.fundAmount.toString(),
      },
      success_url: `${process.env.SITE_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_DOMAIN}/payment-cancelled`,
    });

    res.send({ url: session.url });
  } catch (error) {
    console.error("Stripe API Error:", error.message);
    res.status(500).send({ error: "Stripe session creation failed." });
  }
};

// update Payment
const updatePayment = async (req, res) => {
  const sessionId = req.query.session_id;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.send({ success: false, message: "Payment not completed" });
    }

    const transactionId = session.payment_intent;
    const query = { transactionId: transactionId };
    const paymentExist = await paymentCollections.findOne(query);
    if (paymentExist) {
      return res.send({
        success: true,
        message: "Payment already recorded",
        transactionId: paymentExist.transactionId,
        trackingId: paymentExist.trackingId,
        amount: paymentExist.amount,
        paidAt: paymentExist.paidAt,
        funderName: paymentExist.funderName,
      });
    }

    const trackingId = generateTrackingId();

    const payment = {
      amount: parseFloat(session.metadata.fundAmount),
      currency: session.currency,
      funderEmail: session.customer_email,
      funderName: session.metadata.funderName,
      transactionId: transactionId,
      trackingId: trackingId,
      paymentStatus: session.payment_status,
      paidAt: new Date(),
    };
    const resultPayments = await paymentCollections.insertOne(payment);
    res.send({
      success: true,
      message: "Funding recorded successfully",
      transactionId: transactionId,
      trackingId: trackingId,
      amount: payment.amount,
      paidAt: payment.paidAt,
      funderName: payment.funderName,
      paymentInfo: resultPayments,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, error: "Failed to verify and update payment" });
  }
};

// get payment
const getPayment = async (req, res) => {
  const email = req.query.email;
  const query = {};
  if (email) {
    query.customer_email = email;
  }
  const cursor = paymentCollections.find(query).sort({ paidAt: -1 }).limit(10);
  const result = await cursor.toArray();
  res.send(result);
};
const getAdmindashboardPayment = async (req, res) => {
  const pipeline = [
    {
      $match: {
        paymentStatus: "paid",
      },
    },
    {
      $group: {
        _id: null,
        totalFund: { $sum: "$amount" },
      },
    },
  ];

  const result = await paymentCollections.aggregate(pipeline).toArray();

  res.send(result);
};

module.exports = {
  createCheckOut,
  updatePayment,
  getPayment,
  getAdmindashboardPayment,
};
