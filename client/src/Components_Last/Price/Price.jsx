import React, { useEffect, useState } from "react";
import "./price.css";
import mobile from "../../assets/AllWebpAssets/AssetMobilePlans.webp";
import Think from "../../assets/AllWebpAssets/Asset3.webp";
import { auth, database } from "../../Firebase/firebase";
import { ref, get, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../../Components/Navbar/Navbar";

function Price() {
  const [userdata, setUserdata] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [coupan, setcoupan] = useState("");
  const [couponStatus, setCouponStatus] = useState("");

  const BenifitsObj = {
    "Foundation Thinkers": [
      "Builds Critical Thinking Early",
      "Enhances Cognitive Skills",
      "Develops Independent Learners",
      "Improves Communication & Emotional Intelligence",
      "Encourages Awareness & Responsibility",
    ],
    "Explorative Thinkers": [
      "Deepens Analytical Thinking",
      "Stimulate Curiosity-Driven Learning",
      "Strengthens Problem-Solving & Application",
      "Enhances Awareness of the World",
      "Boosts Confidence & Collaboration",
    ],
    "Future - Ready Thinkers": [
      "Prepares for Real-World Challenges",
      "Memory Exploration & Skill Readiness",
      "Strengthens Higher-Order Thinking",
      "Tech Integration & Digital Fluency",
      "Promotes Creative and Logical Thinking",
    ],
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserdata(data || {});
        }
      }
    };
    fetchUser();
  }, []);

  // const handleProceed = async (planType) => {
  //   if (!planType) {
  //     alert("Please select a plan to proceed.");
  //     return;
  //   }
  //   setSelectedPlan(planType);
  //   const uid = auth.currentUser?.uid;
  //   if (!uid) {
  //     alert("User not authenticated");
  //     return;
  //   }

  //   const now = Date.now();
  //   let expiry;

  //   if (planType === "starter") {
  //     expiry = now + 7 * 24 * 60 * 60 * 1000; // 1 Week
  //   } else if (planType === "pro") {
  //     expiry = now + 30 * 24 * 60 * 60 * 1000; // 1 Month
  //   } else if (planType === "elite") {
  //     expiry = now + 90 * 24 * 60 * 60 * 1000; // 3 Months
  //   } else {
  //     alert("Invalid plan selected");
  //     return;
  //   }

  //   const userPlanRef = ref(database, `users/${uid}/plan`);
  //   await set(userPlanRef, {
  //     type: planType,
  //     startTime: now,
  //     endTime: expiry,
  //   });

  //   navigate("/report", { state: { planType } });
  // };

  const handleProceed = async (planType) => {
    if (!planType) return alert("Please select a plan.");

    const uid = auth.currentUser?.uid;
    if (!uid) return alert("User not authenticated");

    let amount;

    switch (planType) {
      case "starter":
        amount = 149; // Set base amount for starter
        break;
      case "pro":
        amount = 399; // Set base amount for pro
        break;
      case "elite":
        amount = 999; // Set base amount for elite
        break;
      default:
        alert("Invalid plan selected");
        return;
    }

    // Apply coupon
    if (coupan) {
      switch (coupan) {
        case "COUP50":
          amount = amount * 0.5; // or amount -= amount * 0.5;
          break;
        case "COUP20":
          amount = amount * 0.8;
          break;
        default:
          console.log("Invalid coupon code");
      }
    }

    console.log("Final amount:", amount);

    try {
      const res = await axios.post(
        "https://api.think.wegfx.com/initiate-payment",
        {
          userId: uid,
          amount,
          mobile: "9999999999",
          plan: planType,
        }
      );

      console.log("Full Response:", res);
      console.log("Redirect URL:", res.data?.route);

      if (res.data?.route) {
        window.location.href = res.data.route;
      } else {
        alert("No redirect URL returned.");
      }
    } catch (err) {
      console.error("Payment Error", err.response?.data || err.message);
      alert("Failed to initiate payment.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="cost">
        <main className="main-content">
          <img src={Think} alt="Think1" className="logo1" />

          <div className="content-area">
            <div className="image-section">
              <img
                src={mobile}
                alt="Mobile Payment"
                className="payment-illustration"
              />
            </div>

            <div className="pricing-section">
              <h2 className="section-heading">
                <span className="foundation-text">
                  {userdata?.ageGroup?.title}
                </span>{" "}
                (Age {userdata?.ageGroup?.age})
              </h2>
              <div className="pricing-plans">
                <div className="Price_Card_and_title">
                  <p className="plan-label">Trial Pack</p>
                  <div
                    className={`price-card trial-pack ${
                      selectedPlan === "starter" ? "selected" : ""
                    }`}
                    onClick={() => handleProceed("starter")}
                  >
                    {/* <h3 className="plan-name">Starter Plan</h3> */}
                    <p className="price">
                      {" "}
                      <span className="price-value">₹ 149</span>
                    </p>
                    <p className="duration">1 Week</p>
                  </div>
                </div>
                <div className="Price_Card_and_title">
                  <p className="plan-label">Basic</p>

                  <div
                    className={`price-card recommended ${
                      selectedPlan === "pro" ? "selected" : ""
                    }`}
                    onClick={() => handleProceed("pro")}
                  >
                    <div></div>

                    <p className="Wrong_Price">
                      ₹ <span>599</span>
                    </p>
                    {/* <h3 className="plan-name">Pro Plan</h3> */}
                    <p className="price">
                      <span className="price-value">₹ 399</span>
                    </p>
                    <p className="duration">1 Month</p>
                  </div>
                </div>
                <div className="Price_Card_and_title">
                  <p className="plan-label">Super Saver</p>

                  <div
                    className={`price-card super-saver ${
                      selectedPlan === "elite" ? "selected" : ""
                    }`}
                    onClick={() => handleProceed("elite")}
                  >
                    <p className="Wrong_Price">
                      ₹ <span>1899</span>
                    </p>

                    {/* <h3 className="plan-name">Elite Plan</h3> */}
                    <p className="price">
                      <span className="price-value">₹ 999</span>
                    </p>
                    <p className="duration">3 Months</p>
                  </div>
                </div>
              </div>

              {/* <p className="flexible-options-text">
                Simple Prices, Flexible Options
              </p> */}
              <div className="Benifits_text_main_container">
                <div className="Coupon_Container">
                  <p
                    className="Apply_Coupon_btn"
                    onClick={() => setShowCouponPopup(true)}
                  >
                    Click Here to Apply Coupon
                  </p>
                  {couponStatus === "valid" && (
                    <p className="success">Coupon applied!</p>
                  )}
                </div>
                <p className="Benifits_text">
                  Benifits of {userdata?.ageGroup?.title}
                </p>
                <div className="payment-options">
                  {Array.isArray(BenifitsObj[userdata?.ageGroup?.title]) &&
                    BenifitsObj[userdata?.ageGroup?.title].map((item) => (
                      <p>{item}</p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showCouponPopup && (
        <div className="coupon-popup-overlay">
          <div className="coupon-popup">
            <h3>Apply Coupon</h3>
            <input
              type="text"
              value={coupan}
              onChange={(e) => setcoupan(e.target.value)}
              placeholder="Enter Coupon Code"
            />
            <button
              onClick={() => {
                if (coupan === "COUP50" || coupan === "COUP20") {
                  setcoupan(coupan);
                  setCouponStatus("valid");
                  setShowCouponPopup(false);
                } else {
                  setCouponStatus("invalid");
                }
              }}
            >
              Apply
            </button>
            <button onClick={() => setShowCouponPopup(false)}>Close</button>
            {couponStatus === "valid" && (
              <p className="success">Coupon applied!</p>
            )}
            {couponStatus === "invalid" && (
              <p className="error">Invalid coupon code</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Price;
