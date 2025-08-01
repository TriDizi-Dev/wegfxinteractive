import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../../../Firebase/firebase";
import { ref, get } from "firebase/database";
import { signOut } from "firebase/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const fetchAdminInfo = async () => {
      const user = auth.currentUser;

      if (user) {
        const snapshot = await get(ref(database, `users/${user.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.role === "admin") {
            setAdminEmail(data.email || user.email);
          } else {
            navigate("/"); // Redirect non-admin users
          }
        } else {
          navigate("/"); // Redirect if user info is missing
        }
      } else {
        navigate("/"); // Not logged in
      }
    };

    fetchAdminInfo();
  }, [navigate]);

  // const handleLogout = () => {
  //   try {
  //     sessionStorage.removeItem("authToken");
  //     localStorage.removeItem("authToken");
  //     sessionStorage.removeItem("userType");
  //     localStorage.removeItem("userType");
  //   } catch (e) {
  //     console.warn("Failed to clear session/local storage:", e);
  //   }
  //   navigate("/");
  // };
   const handleLogout = async () => {
      try {
        await signOut(auth);
        window.location.href = "/admin-login";
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <h2> Admin Dashboard</h2>
        {adminEmail && (
          <p className="admin-email"> Logged in as: <strong>{adminEmail}</strong></p>
        )}

        <div className="dashboard-buttons">
          <button
            onClick={() => navigate("/manageQuestion")}
            className="btn dashboard-btn"
          >
           Manage Questions
          </button>
          <button
            onClick={() => navigate("/manage-coupons")}
            className="btn dashboard-btn"
          >
           Manage Coupons
          </button>
          <button
            onClick={() => navigate("/userDetails")}
            className="btn dashboard-btn"
          >
             View Users
          </button>
          <button onClick={handleLogout} className="btn logout-btn">
             Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
