const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const crypto = require("crypto");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Util function to generate X-VERIFY
function generateXVerify(base64Payload, path, saltKey, saltIndex) {
  const hash = crypto
    .createHash("sha256")
    .update(base64Payload + path + saltKey)
    .digest("hex");
  return `${hash}###${saltIndex}`;
}

// POST /initiate-payment
app.post("/initiate-payment", async (req, res) => {
  console.log(req,"ghjkl");
  
  try {
    const { userId, amount, mobile } = req.body;

    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: `TXN_${Date.now()}`,
      merchantUserId: userId,
      amount: amount * 100,
      redirectUrl: process.env.REDIRECT_URL,
      redirectMode: "POST",
      mobileNumber: mobile,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
console.log(payload,"payloadpayload");

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );

    const xVerify = generateXVerify(
      base64Payload,
      "/pg/v1/pay",
      process.env.PHONEPE_SALT_KEY,
      process.env.PHONEPE_SALT_INDEX
    );

    const response = await axios.post(
      // "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      "https://api.phonepe.com/apis/pg/checkout/v2/pay",
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Payment Init Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment initiation failed." });
  }
});

// POST /payment-callback
app.post("/payment-callback", async (req, res) => {
  // Optionally verify checksum from PhonePe callback here
  console.log("📩 Payment Callback Received:", req.body);
  res.status(200).send("Callback received.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
