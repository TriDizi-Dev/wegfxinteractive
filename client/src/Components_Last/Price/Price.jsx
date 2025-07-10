import React, { useEffect, useState } from "react";
import "./Price.css";
import mobile from "../../assets/Pieimages/phone.png";
import Think from "../../assets/Pieimages/Think1.png";
import { auth, database } from "../../Firebase/firebase";
import { ref, get, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

function Price() {
  const [userdata, setUserdata] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

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

  const handleProceed = async (planType) => {
    if (!planType) {
      alert("Please select a plan to proceed.");
      return;
    }
    setSelectedPlan(planType);
    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert("User not authenticated");
      return;
    }

    const now = Date.now();
    let expiry;

    if (planType === "starter") {
      expiry = now + 7 * 24 * 60 * 60 * 1000; // 1 Week
    } else if (planType === "pro") {
      expiry = now + 30 * 24 * 60 * 60 * 1000; // 1 Month
    } else if (planType === "elite") {
      expiry = now + 90 * 24 * 60 * 60 * 1000; // 3 Months
    } else {
      alert("Invalid plan selected");
      return;
    }

    const userPlanRef = ref(database, `users/${uid}/plan`);
    await set(userPlanRef, {
      type: planType,
      startTime: now,
      endTime: expiry,
    });

    navigate("/pie", { state: { planType } });
  };

  return (
    <div className="cost">
      <header className="app-header">
        <span className="logo-placeholder">A Purple'd Advertising Company</span>
        <div className="user-profile">
          <span>{userdata.name}</span>
          <div className="avatar-circle">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="avatar-icon"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </header>

      <main className="main-content">
        <img src={Think} alt="Think1" className="logo1" />
        <h2 className="section-heading">
          <span className="foundation-text">{userdata?.ageGroup?.title}</span> (Age {userdata?.ageGroup?.age})
        </h2>

        <div className="content-area">
          <div className="image-section">
            <img
              src={mobile}
              alt="Mobile Payment"
              className="payment-illustration"
            />
          </div>

          <div className="pricing-section">
            <div className="pricing-plans">
              <div
                className={`price-card trial-pack ${
                  selectedPlan === "starter" ? "selected" : ""
                }`}
                onClick={() => handleProceed("starter")}
              >
                <p className="plan-label">Trial Pack</p>
                <h3 className="plan-name">Starter Plan</h3>
                <p className="price">
                  ₹<span className="price-value">99</span>
                </p>
                <p className="duration">1 Week</p>
              </div>

              <div
                className={`price-card recommended ${
                  selectedPlan === "pro" ? "selected" : ""
                }`}
                onClick={() => handleProceed("pro")}
              >
                <p className="plan-label">Recommended</p>
                <h3 className="plan-name">Pro Plan</h3>
                <p className="price">
                  ₹<span className="price-value">299</span>
                </p>
                <p className="duration">1 Month</p>
              </div>

              <div
                className={`price-card super-saver ${
                  selectedPlan === "elite" ? "selected" : ""
                }`}
                onClick={() => handleProceed("elite")}
              >
                <p className="plan-label">Super Saver</p>
                <h3 className="plan-name">Elite Plan</h3>
                <p className="price">
                  ₹<span className="price-value">799</span>
                </p>
                <p className="duration">3 Months</p>
              </div>
            </div>

            <p className="flexible-options-text">
              Simple Prices, Flexible Options
            </p>

            <ul className="payment-options">
              <li>• UPI / Google Pay / PhonePe</li>
              <li>• Debit & Credit Cards</li>
              <li>• Net Banking</li>
              <li>• Wallets (Paytm, Mobikwik)</li>
              <li>• QR Code for instant payment</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Price;
