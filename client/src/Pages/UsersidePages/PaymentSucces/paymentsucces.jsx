import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth, database } from "../../../Firebase/firebase";
import { ref, set } from "firebase/database";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    const plan = params.get("plan");
    const now = Date.now();
    let expiry;

    if (plan === "daily") expiry = now + 24 * 60 * 60 * 1000;
    else if (plan === "weekly") expiry = now + 7 * 24 * 60 * 60 * 1000;
    else {
      alert("Invalid plan type");
      return;
    }

    if (!uid) return;

    const planRef = ref(database, `users/${uid}/plan`);
    set(planRef, {
      type: plan,
      startTime: now,
      endTime: expiry,
    }).then(() => {
      navigate("/quiz");
    });
  }, []);

  return <h2>Verifying payment and activating your plan...</h2>;
};

export default PaymentSuccess;
