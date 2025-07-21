const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const helmet = require("helmet");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Environment Variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
CLIENT_VERSION = 1;
const SUCCESS_URL = process.env.SUCCESS_URL;
const FAILURE_URL = process.env.FAILURE_URL;

// Middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

const getAccessToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("client_version", CLIENT_VERSION);
    params.append("client_secret", CLIENT_SECRET);
    params.append("grant_type", "client_credentials");

    const response = await axios.post(
      "https://api.phonepe.com/apis/identity-manager/v1/oauth/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(response.data, "tokennnn");

    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error fetching token:",
      error.response?.data || error.message
    );
    throw new Error("Unable to fetch access token");
  }
};
// Initiate Payment
app.post("/initiate-payment", async (req, res) => {
  try {
    const { userId, amount, mobile, plan } = req.body;

    if (!userId || !amount || !mobile || !plan) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount." });
    }

    const merchantOrderId = `TXN_${Date.now()}`;
    const redirectUrlWithPlan = `${SUCCESS_URL}?plan=${plan}`;
    const failureUrlWithPlan = `${FAILURE_URL}?plan=${plan}`;
    const payload = {
      merchantOrderId,
      amount: amount * 100, // Convert to paise
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: `Payment for user ${userId} - Plan: ${plan}`,
        merchantUrls: {
          redirectUrl: redirectUrlWithPlan,
          failureUrl: failureUrlWithPlan,
        },
      },
    };

    const token = await getAccessToken();

    const response = await axios.post(
      "https://api.phonepe.com/apis/pg/checkout/v2/pay",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", JSON.stringify(response.data, null, 2));

    // Try multiple possible redirect URL paths
    const redirectUrl =
      response.data?.data?.redirectUrl ||
      response.data?.data?.instrumentResponse?.redirectInfo?.url ||
      response.data?.redirectUrl;

    if (!redirectUrl) {
      return res.status(500).json({
        error: "Missing redirect URL",
        details: response.data,
      });
    }

    return res.status(200).json({ route: redirectUrl, success: true });
  } catch (error) {
    console.error("Payment Init Error:", error.response?.data || error.message);
    return res.status(500).json({
      error: "Payment initiation failed.",
      details: error.response?.data || error.message,
    });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("✅ PhonePe Payment API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
