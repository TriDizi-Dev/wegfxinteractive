// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const axios = require("axios");
// const crypto = require("crypto");
// const bodyParser = require("body-parser");

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(bodyParser.json());

// // Util function to generate X-VERIFY
// function generateXVerify(base64Payload, path, saltKey, saltIndex) {
//   const hash = crypto
//     .createHash("sha256")
//     .update(base64Payload + path + saltKey)
//     .digest("hex");
//   return `${hash}###${saltIndex}`;
// }

// // POST /initiate-payment
// app.post("/initiate-payment", async (req, res) => {
//   console.log(req, "ghjkl");

//   try {
//     const { userId, amount, mobile } = req.body;

//     const payload = {
//       merchantId: process.env.PHONEPE_MERCHANT_ID,
//       merchantTransactionId: `TXN_${Date.now()}`,
//       merchantUserId: userId,
//       amount: amount * 100,
//       redirectUrl: "https://wegfxinteractive.netlify.app/payment-success",
//       redirectMode: "POST",
//       mobileNumber: mobile,
//       paymentInstrument: {
//         type: "PAY_PAGE",
//       },
//     };
//     console.log(payload, "payloadpayload");

//     const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
//       "base64"
//     );

//     const xVerify = generateXVerify(
//       base64Payload,
//       "/pg/v1/pay",
//       "f8de9bcc-c6f5-4ae2-bcf9-ff84151eab67",
//       "1"
//     );

//     const response = await axios.post(
//       "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
//       // "https://api.phonepe.com/apis/pg/checkout/v2/pay",
//       { request: base64Payload },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-VERIFY": xVerify,
//           "X-MERCHANT-ID": "SU2507081620336428452705",
//         },
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error("Payment Init Error:", error.response?.data || error.message);
//     res.status(500).json({ error: "Payment initiation failed." });
//   }
// });

// // POST /payment-callback
// app.post("/payment-callback", async (req, res) => {
//   // Optionally verify checksum from PhonePe callback here
//   console.log("📩 Payment Callback Received:", req.body);
//   res.status(200).send("Callback received.");
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const helmet = require("helmet");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const salt_key = "f8de9bcc-c6f5-4ae2-bcf9-ff84151eab67";
const merchant_id = "SU2507081620336428452705";

app.use(helmet());
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
  const { userId, amount, mobile } = req.body;

  if (!userId || !amount || !mobile) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount." });
  }
  if (!/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ error: "Invalid mobile number." });
  }

  try {
    const payload = {
      merchantId: merchant_id,
      merchantTransactionId: `TXN_${Date.now()}`,
      merchantUserId: userId,
      // amount: amount * 100, // Convert to paise
      amount: 1 * 100, // Convert to paise
      redirectUrl: "https://wegfxinteractive.netlify.app/payment-success",
      redirectMode: "POST",
      mobileNumber: mobile,
      paymentInstrument: { type: "PAY_PAGE" },
    };
    console.log("Payload:", payload);

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );
    const xVerify = generateXVerify(base64Payload, "/pg/checkout/v2/pay", salt_key, "1");
    console.log(xVerify, "xVerifyxVerify");

    const baseUrl = "https://api.phonepe.com/apis/pg/checkout/v2/pay";
    // const baseUrl = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"

    const response = await axios.post(
      baseUrl,
      { request: base64Payload },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Payment Init Error:", error.response?.data || error.message);
    res
      .status(500)
      .json({
        error: "Payment initiation failed.",
        details: error.response?.data,
      });
  }
});

// POST /payment-callback
app.post("/payment-callback", (req, res) => {
  console.log("📩 Payment Callback Received:", req.body);
  // Add X-VERIFY verification here as per PhonePe docs
  res.status(200).send("Callback received.");
});

app.get("/", (req, res) => {
  res.send("✅ Payment API is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
