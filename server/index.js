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

// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const axios = require("axios");
// const crypto = require("crypto");
// const bodyParser = require("body-parser");
// const helmet = require("helmet");

// dotenv.config();

// const app = express();
// const PORT = 5000;
// const salt_key = "f8de9bcc-c6f5-4ae2-bcf9-ff84151eab67";
// const merchant_id = "SU2507081620336428452705";

// app.use(helmet());
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
//   const { userId, amount, mobile } = req.body;

//   if (!userId || !amount || !mobile) {
//     return res.status(400).json({ error: "Missing required fields." });
//   }
//   if (isNaN(amount) || amount <= 0) {
//     return res.status(400).json({ error: "Invalid amount." });
//   }

//   try {
//     const payload = {
//       merchantId: merchant_id,
//       merchantTransactionId: `TXN_${Date.now()}`,
//       merchantUserId: userId,
//       amount: amount * 100, // Convert to paise
//       // amount: 1 * 100, // Convert to paise
//       redirectUrl: "https://think.wegfx.com/payment-success",
//       redirectMode: "POST",
//       mobileNumber: mobile,
//       paymentInstrument: { type: "PAY_PAGE" },
//     };
//     console.log("Payload:", payload);

//     const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
//       "base64"
//     );
//     const xVerify = generateXVerify(base64Payload, "/pg/checkout/v2/pay", salt_key, "1");
//     console.log(xVerify, "xVerifyxVerify");

//     const baseUrl = "https://api.phonepe.com/apis/pg/checkout/v2/pay";
//     // const baseUrl = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"

//     const response = await axios.post(
//       baseUrl,
//       { request: base64Payload },
//       {
//         headers: {
//           accept: "application/json",
//           "Content-Type": "application/json",
//           "X-VERIFY": xVerify,
//         },
//       }
//     );

//     res.json(response.data);
//   } catch (error) {
//     console.error("Payment Init Error:", error.response?.data || error.message);
//     res
//       .status(500)
//       .json({
//         error: "Payment initiation failed.",
//         details: error.response?.data,
//       });
//   }
// });

// // POST /payment-callback
// app.post("/payment-callback", (req, res) => {
//   console.log("📩 Payment Callback Received:", req.body);
//   // Add X-VERIFY verification here as per PhonePe docs
//   res.status(200).send("Callback received.");
// });

// app.get("/", (req, res) => {
//   res.send("✅ Payment API is running!");
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const crypto = require("crypto");
const helmet = require("helmet");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Environment Variables
const MERCHANT_ID = "SU2507081620336428452705";
const SALT_KEY = "f8de9bcc-c6f5-4ae2-bcf9-ff84151eab67";
// const MERCHANT_ID = "M22YOQGB6C5LL";
// const SALT_KEY = "05ad3adc-857d-439a-aff4-2ee07d9028f9";
const SALT_INDEX = "1"; // Can change to dynamic if needed
const SUCCESS_URL = "https://think.wegfx.com/payment-success";
const FAILURE_URL =  "https://think.wegfx.com/";

// Middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// Utility: X-VERIFY Signature
function generateXVerify(base64Payload, path, saltKey, saltIndex) {
  const hashInput = base64Payload + path + saltKey;
  const hash = crypto.createHash("sha256").update(hashInput).digest("hex");
  return `${hash}###${saltIndex}`;
}

// Initiate Payment
app.post("/initiate-payment", async (req, res) => {
  try {
    const { userId, amount, mobile } = req.body;

    if (!userId || !amount || !mobile) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount." });
    }

    const merchantTransactionId = `TXN_${Date.now()}`;
    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: userId,
      amount: amount * 100,
      redirectUrl: `http://localhost:5000/payment-success`,
      redirectMode: "POST",
      paymentInstrument: { type: "PAY_PAGE" },
    };
    console.log(payload, "payloadpayload");

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );
    const xVerify = generateXVerify(
      base64Payload,
      "/pg/v1/pay",
      SALT_KEY,
      SALT_INDEX
    );

    const response = await axios.post(
      "https://api.phonepe.com/apis/hermes/pg/v1/pay",
      { request: base64Payload },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": xVerify,
          "X-MERCHANT-ID": MERCHANT_ID,
        },
      }
    );

    const redirectUrl =
      response.data?.data?.instrumentResponse?.redirectInfo?.url;
    console.log("redirectUrl :", redirectUrl);

    if (!redirectUrl) {
      return res
        .status(500)
        .json({ error: "Missing redirect URL", details: response.data });
    }

    return res.status(200).json({ route: redirectUrl, success: true });
  } catch (error) {
    console.error("Payment Init Error:", error.message);
    return res.status(500).json({
      error: "Payment initiation failed.",
      details: error.response?.data || error.message,
    });
  }
});

// Payment Success (redirect mode)
app.post("/payment-success", (req, res) => {
  try {
    const xVerifyHeader = req.headers["x-verify"];
    const base64Response = req.body.response;

    if (!xVerifyHeader || !base64Response) {
      return res.redirect(FAILURE_URL);
    }

    const expectedChecksum = generateXVerify(
      base64Response,
      "/pg/v1/status",
      SALT_KEY,
      SALT_INDEX
    );
    if (xVerifyHeader !== expectedChecksum) {
      return res.redirect(FAILURE_URL);
    }

    const decodedResponse = JSON.parse(
      Buffer.from(base64Response, "base64").toString()
    );

    if (decodedResponse.success && decodedResponse.code === "PAYMENT_SUCCESS") {
      console.log(
        "✅ Payment Success:",
        decodedResponse.data.merchantTransactionId
      );
      return res.redirect(SUCCESS_URL);
    } else {
      console.log("❌ Payment Failed:", decodedResponse.message);
      return res.redirect(FAILURE_URL);
    }
  } catch (error) {
    console.error("Redirect Callback Error:", error.message);
    return res.redirect(FAILURE_URL);
  }
});

// Server-to-server Callback (optional)
app.post("/api/v1/payment-callback", (req, res) => {
  try {
    const xVerifyHeader = req.headers["x-verify"];
    const base64Response = req.body.response;

    if (!xVerifyHeader || !base64Response) {
      return res.status(400).json({ error: "Missing X-VERIFY or response" });
    }

    const expectedChecksum = generateXVerify(
      base64Response,
      "/pg/v1/status",
      SALT_KEY,
      SALT_INDEX
    );
    if (xVerifyHeader !== expectedChecksum) {
      return res.status(400).json({ error: "Invalid checksum" });
    }

    const decodedResponse = JSON.parse(
      Buffer.from(base64Response, "base64").toString()
    );

    if (decodedResponse.success && decodedResponse.code === "PAYMENT_SUCCESS") {
      console.log(
        "✅ Server Callback Payment Success:",
        decodedResponse.data.merchantTransactionId
      );
    } else {
      console.log(
        "❌ Server Callback Payment Failed:",
        decodedResponse.message
      );
    }

    res.status(200).json({ message: "Callback processed successfully" });
  } catch (error) {
    console.error("Callback Error:", error.message);
    res.status(500).json({ error: "Callback processing failed" });
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
