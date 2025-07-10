// // SlectPlanpage.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth, database } from "../../../Firebase/firebase";
// import { ref, set } from "firebase/database";
// import "./SlectPlanpage.css";

// const SlectPlanpage = () => {
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const navigate = useNavigate();

//   const handleProceed = async () => {
//     if (!selectedPlan) {
//       alert("Please select a plan to proceed.");
//       return;
//     }

//     const uid = auth.currentUser?.uid;
//     if (!uid) {
//       alert("User not authenticated");
//       return;
//     }

//     const now = Date.now();
//     let expiry;

//     if (selectedPlan === "daily") {
//       expiry = now + 24 * 60 * 60 * 1000;
//     } else if (selectedPlan === "weekly") {
//       expiry = now + 7 * 24 * 60 * 60 * 1000;
//     } else {
//       alert("Invalid plan selected");
//       return;
//     }

//     const userPlanRef = ref(database, `users/${uid}/plan`);
//     await set(userPlanRef, {
//       type: selectedPlan,
//       startTime: now,
//       endTime: expiry,
//     });

//     navigate("/quiz", { state: { selectedPlan } });
//   };

//   return (
//     <div className="plan-wrapper">
//       <div className="plan-container animate-pop">
//         <h2 className="plan-heading">🎯 Choose Your Plan</h2>

//         <div className="plans">
//           <div
//             className={`plan-card animate-bounce ${selectedPlan === "daily" ? "active" : ""}`}
//             onClick={() => setSelectedPlan("daily")}
//           >
//             <h3>💡 Daily Plan</h3>
//             <p>₹99 / Day</p>
//           </div>

//           <div
//             className={`plan-card animate-bounce-delay ${selectedPlan === "weekly" ? "active" : ""}`}
//             onClick={() => setSelectedPlan("weekly")}
//           >
//             <h3>🔥 Weekly Plan</h3>
//             <p>₹199 / Week</p>
//           </div>
//         </div>

//         <button className="proceed-btn ripple" onClick={handleProceed}>
//           🚀 Proceed to Payment
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SlectPlanpage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../../../Firebase/firebase";
import { ref, set } from "firebase/database";
import axios from "axios";
import "./SlectPlanpage.css";

const SlectPlanpage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const handleProceed = async () => {
    if (!selectedPlan) {
      alert("Please select a plan to proceed.");
      return;
    }

    const uid = auth.currentUser?.uid;
    if (!uid) {
      alert("User not authenticated");
      return;
    }

    const now = Date.now();
    let expiry;

    if (selectedPlan === "daily") {
      expiry = now + 24 * 60 * 60 * 1000;
    } else if (selectedPlan === "weekly") {
      expiry = now + 7 * 24 * 60 * 60 * 1000;
    } else {
      alert("Invalid plan selected");
      return;
    }

    const userPlanRef = ref(database, `users/${uid}/plan`);
    await set(userPlanRef, {
      type: selectedPlan,
      startTime: now,
      endTime: expiry,
    });

    navigate("/quiz", { state: { selectedPlan } });
  };

  // const handleProceed = async () => {
  //   if (!selectedPlan) return alert("Please select a plan.");

  //   const uid = auth.currentUser?.uid;
  //   if (!uid) return alert("User not authenticated");

  //   const amount = selectedPlan === "daily" ? 99 : 199;
  //   try {
  //     const res = await axios.post("http://localhost:5000/initiate-payment", {
  //       userId: uid,
  //       amount,
  //       mobile: "9999999999",
  //       plan: selectedPlan,
  //     });

  //     console.log("Full Response:", res);
  //     console.log("Redirect URL:", res.data?.route);

  //     if (res.data?.route) {
  //       window.location.href = res.data.route;
  //     } else {
  //       alert("No redirect URL returned.");
  //     }
  //   } catch (err) {
  //     console.error("Payment Error", err.response?.data || err.message);
  //     alert("Failed to initiate payment.");
  //   }
  // };

  return (
    <div className="plan-wrapper">
      <div className="plan-container animate-pop">
        <h2 className="plan-heading">🎯 Choose Your Plan</h2>

        <div className="plans">
          <div
            className={`plan-card animate-bounce ${
              selectedPlan === "daily" ? "active" : ""
            }`}
            onClick={() => setSelectedPlan("daily")}
          >
            <h3>💡 Daily Plan</h3>
            <p>₹99 / Day</p>
          </div>

          <div
            className={`plan-card animate-bounce-delay ${
              selectedPlan === "weekly" ? "active" : ""
            }`}
            onClick={() => setSelectedPlan("weekly")}
          >
            <h3>🔥 Weekly Plan</h3>
            <p>₹199 / Week</p>
          </div>
        </div>

        <button className="proceed-btn ripple" onClick={handleProceed}>
          🚀 Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default SlectPlanpage;
