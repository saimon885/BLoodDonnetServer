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

const stripe = require("stripe")(process.env.DB_PAY);
const express = require("express");
const app = express();
app.use(express.static("public"));

const createCheckOut = async (req, res) => {
  const paymentInfo = req.body;
  // console.log(paymentInfo.funder_email);
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
      },
      success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled`,
    });

    res.send({ url: session.url });
  } catch (error) {
    // console.error("Stripe API Error:", error.message);
    res.status(500).send({ error: "Stripe session creation failed." });
  }
};
module.exports = {
  createCheckOut,
};
