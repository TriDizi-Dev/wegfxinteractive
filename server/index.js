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
const bodyParser = require("body-parser");
const helmet = require("helmet");

dotenv.config();

const app = express();
const PORT = 5000;
const salt_key = "05ad3adc-857d-439a-aff4-2ee07d9028f9"; // Replace with your sandbox salt key
const merchant_id = "M22YOQGB6C5LL"; // Replace with your sandbox merchant ID
// const salt_key = "f8de9bcc-c6f5-4ae2-bcf9-ff84151eab67"; // Replace with your sandbox salt key
// const merchant_id = "SU2507081620336428452705"; // Replace with your sandbox merchant ID
const SUCCESS_URL = "https://think.wegfx.com/payment-success"; // Success redirect URL
const FAILURE_URL = "https://think.wegfx.com/"; // Failure redirect URL

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Util function to generate X-VERIFY
function generateXVerify(base64Payload, path, saltKey, saltIndex) {
  const string = base64Payload + path + saltKey;
  console.log("Checksum Input:", { base64Payload, path, saltKey, string });
  const hash = crypto.createHash("sha256").update(string).digest("hex");
  return `${hash}###${saltIndex}`;
}

// POST /initiate-payment
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
      merchantId: merchant_id,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: userId,
      amount: amount * 100, // Convert to paise
      redirectUrl: `http://localhost:${PORT}/payment-success`, // Use localhost for testing
      redirectMode: "POST",
      mobileNumber: mobile,
      paymentInstrument: { type: "PAY_PAGE" },
    };
    console.log("Payload:", payload);

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
    console.log("Base64 Payload:", base64Payload);
    const xVerify = generateXVerify(base64Payload, "/pg/v1/pay", salt_key, "1");
    console.log("X-VERIFY:", xVerify);

    // const baseUrl = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"; // Sandbox for testing
    const baseUrl = "https://api.phonepe.com/apis/hermes/pg/v1/pay"; // Sandbox for testing

    const options = {
      method: "POST",
      url: baseUrl,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
      },
      data: {
        request: base64Payload,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("PhonePe Response:", JSON.stringify(response.data, null, 2));
        console.log("Instrument Response:", response.data.data?.instrumentResponse);
        console.log("Redirect Info:", response.data.data?.instrumentResponse?.redirectInfo);

        if (!response.data.data?.instrumentResponse?.redirectInfo?.url) {
          console.error("Redirect URL is undefined or missing");
          return res.status(500).json({
            error: "Invalid response from PhonePe: Missing redirect URL",
            response: response.data,
          });
        }

        return res.status(200).json({
          route: response.data.data.instrumentResponse.redirectInfo.url,
          success: true,
        });
      })
      .catch(function (error) {
        console.error("Payment Init Error:", error.response?.data || error.message);
        return res.status(500).json({
          error: "Payment initiation failed.",
          details: error.response?.data || error.message,
        });
      });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

// POST /payment-success
app.post("/payment-success", (req, res) => {
  try {
    console.log("📩 Redirect URL Callback Received:", {
      body: req.body,
    });

    const xVerifyHeader = req.headers["x-verify"];
    if (!xVerifyHeader) {
      console.error("Missing X-VERIFY header");
      return res.redirect(FAILURE_URL);
    }

    const base64Response = req.body.response;
    const expectedChecksum = generateXVerify(base64Response, "/pg/v1/status", salt_key, "1");
    console.log("Redirect X-VERIFY:", { received: xVerifyHeader, expected: expectedChecksum });

    if (xVerifyHeader !== expectedChecksum) {
      console.error("Invalid checksum");
      return res.redirect(FAILURE_URL);
    }

    const decodedResponse = JSON.parse(Buffer.from(base64Response, "base64").toString());
    console.log("Decoded Redirect Callback:", JSON.stringify(decodedResponse, null, 2));

    if (decodedResponse.success && decodedResponse.code === "PAYMENT_SUCCESS") {
      console.log("Payment Successful for Transaction:", decodedResponse.data.merchantTransactionId);
      return res.redirect(SUCCESS_URL);
    } else {
      console.log("Payment Failed for Transaction:", decodedResponse.data.merchantTransactionId, "Reason:", decodedResponse.message);
      return res.redirect(FAILURE_URL);
    }
  } catch (error) {
    console.error("Redirect Callback Error:", error.message);
    return res.redirect(FAILURE_URL);
  }
});

// POST /payment-callback
app.post("/payment-callback", (req, res) => {
  try {
    console.log("📩 Server Callback Received:", req.body);

    const xVerifyHeader = req.headers["x-verify"];
    if (!xVerifyHeader) {
      return res.status(400).json({ error: "Missing X-VERIFY header" });
    }

    const base64Response = req.body.response;
    const expectedChecksum = generateXVerify(base64Response, "/pg/v1/status", salt_key, "1");
    console.log("Callback X-VERIFY:", { received: xVerifyHeader, expected: expectedChecksum });

    if (xVerifyHeader !== expectedChecksum) {
      return res.status(400).json({ error: "Invalid checksum" });
    }

    const decodedResponse = JSON.parse(Buffer.from(base64Response, "base64").toString());
    console.log("Decoded Server Callback:", JSON.stringify(decodedResponse, null, 2));

    if (decodedResponse.success && decodedResponse.code === "PAYMENT_SUCCESS") {
      console.log("Payment Successful for Transaction:", decodedResponse.data.merchantTransactionId);
      // Add logic to update database or perform post-payment actions
    } else {
      console.log("Payment Failed for Transaction:", decodedResponse.data.merchantTransactionId, "Reason:", decodedResponse.message);
    }

    res.status(200).json({ message: "Callback processed successfully" });
  } catch (error) {
    console.error("Callback Error:", error.message);
    res.status(500).json({ error: "Callback processing failed" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Payment API is running!");
});

app.listen(PORT, () =>{

  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});