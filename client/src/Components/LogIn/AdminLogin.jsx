import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get, database, auth } from "../../Firebase/firebase";
import { GrView } from "react-icons/gr";
import { BiHide } from "react-icons/bi";
import "./AdminLoginPage.css";

const setStorageItem = (key, value) => {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    localStorage.setItem(key, value);
  }
};

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const snapshot = await get(ref(database, `users/${uid}`));
      if (snapshot.exists() && snapshot.val().role === "admin") {
        const token = await userCredential.user.getIdToken();
        setStorageItem("authToken", token);
        setStorageItem("userType", "admin");
        navigate("/dashboard");
      } else {
        setError("You are not authorized as admin.");
      }
    } catch (err) {
      if (err.code === "auth/invalid-email") setError("Invalid email format.");
      else if (err.code === "auth/user-not-found") setError("Admin not found.");
      else if (err.code === "auth/wrong-password") setError("Incorrect password.");
      else setError("Login failed.");
    }
  };

  return (
    <div className="admin-page-scope">
      <div className="admin-login-wrapper">
        <div className="admin-login-container">
          <h2 className="admin-login-heading">Admin Login</h2>
          <form onSubmit={handleAdminLogin}>
            <div className="admin-form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label>Password</label>
              <div className="admin-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="admin-toggle-password"
                >
                  {showPassword ? <GrView /> : <BiHide />}
                </button>
              </div>
            </div>

            {error && <p className="admin-error-message">{error}</p>}

            <button type="submit" className="admin-btn-login">
              Login as Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
