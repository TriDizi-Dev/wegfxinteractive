import React, { useEffect, useState } from "react";
import "./price.css";
import mobile from "../../assets/AllWebpAssets/AssetMobilePlans.webp";
import Think from "../../assets/AllWebpAssets/Asset3.webp";
import { auth, database } from "../../Firebase/firebase";
import { ref, get, getDatabase } from "firebase/database";
import axios from "axios";
import { Navbar } from "../../Components/Navbar/Navbar";

function Price() {
  const [userdata, setUserdata] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [coupan, setcoupan] = useState("");
  const [couponStatus, setCouponStatus] = useState("");
  const [Discount,setDiscount] = useState(null)
  const [CouponDetails,setCouponDetails] = useState(null)
  console.log(CouponDetails,"CouponDetails");
  
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

  //   if (planType === "Trial") {
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
      amount = 49;
      break;
    case "pro":
      amount = 199;
      break;
    case "elite":
      amount = 599;
      break;
    default:
      alert("Invalid plan selected");
      return;
  }

  // ✅ Apply coupon rules
  if (coupan && couponStatus === "valid") {
    if (planType === "starter") {
      amount = 0; // 49 → Free
    } else if (planType === "pro") {
      amount = 149; // 199 → 149
    } else if (planType === "elite") {
      amount = 399; // 599 → 399
    }
  }

  console.log("Final amount:", amount);

  // ✅ If Free → Skip payment and route directly
  if (amount === 0) {
    const now = Date.now();
    const expiry = now + 7 * 24 * 60 * 60 * 1000; // 1 Week trial

    const userPlanRef = ref(database, `users/${uid}/plan`);
    await set(userPlanRef, {
      type: planType,
      startTime: now,
      endTime: expiry,
    });

    // redirect without payment
    window.location.href = "/report"; 
    return;
  }

  // ✅ Otherwise → normal payment flow
  try {
    const res = await axios.post(
      "https://api.think.wegfx.com/initiate-payment",
      {
        userId: uid,
        amount,
        mobile: "1799179917999",
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
                    {/* <h3 className="plan-name">Trial Plan</h3> */}
                   <p className="price">
  <span className="price-value">
    {(couponStatus === "valid" && CouponDetails?.category === "Trial")
      ? "Free"
      : "₹ 49"}
  </span>
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
{(couponStatus === "valid" && CouponDetails.category === "Basic") &&
                    <p className="Wrong_Price">
                      ₹ <span>199</span>
                    </p>
}
                    {/* <h3 className="plan-name">Pro Plan</h3> */}
                    <p className="price">
  <span className="price-value">
    {(couponStatus === "valid" && CouponDetails?.category === "Basic")
      ? "₹ 149" // fixed discounted price
      : "₹ 199"}
  </span>
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
                   {(couponStatus === "valid" && CouponDetails.category === "Super Saver") &&
                    <p className="Wrong_Price">
                      ₹ <span>599</span>
                    </p>
}

                    <p className="price">
  <span className="price-value">
    {(couponStatus === "valid" && CouponDetails?.category === "Super Saver")
      ? "₹ 399"
      : "₹ 599"}
  </span>
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
                  Benefits of {userdata?.ageGroup?.title}
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
              onChange={(e) => setcoupan(e.target.value.toUpperCase())}

              placeholder="Enter Coupon Code"
            />
            <button
  onClick={async () => {
    if (!coupan) return;

    try {
      const couponRef = ref(database, `coupons/${coupan}`);
      const snapshot = await get(couponRef);

      if (snapshot.exists()) {
        const discount = snapshot.val().percentage;
        console.log(discount,"discountdiscount");
       const values = snapshot.val() 
        setCouponDetails(values)
        if (typeof discount === "number" && discount > 0 && discount <= 100) {
          setCouponStatus("valid");
          setShowCouponPopup(false);
          setDiscount(discount)
        } else {
          setCouponStatus("invalid");
        }
      } else {
        setCouponStatus("invalid");
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
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
