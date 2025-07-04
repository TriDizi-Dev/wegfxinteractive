import React from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <h2>Welcome to Admin Panel</h2>
        <div className="dashboard-buttons">
          <button
            onClick={() => navigate("/manageQuestion")}
            className="btn dashboard-btn"
          >
            Go to Questions Manage
          </button>
          <button
            onClick={() => navigate("/userDetails")}
            className="btn dashboard-btn"
          >
            Go to Users Manage
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
