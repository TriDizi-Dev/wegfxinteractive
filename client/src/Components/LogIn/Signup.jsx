import React, { useState } from "react";
import image2 from "../../assets/Login/image2.png";
import image3 from "../../assets/Login/image3.png";
import image4 from "../../assets/Login/image4.png";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { ref, set, database, auth } from "../../Firebase/firebase";
import { GrView } from "react-icons/gr";
import { BiHide } from "react-icons/bi";
import "./Signup.css";

const setStorageItem = (key, value) => {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    localStorage.setItem(key, value);
  }
};

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleUserSignup = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();
    const trimmedConfirm = confirm.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedName || !trimmedConfirm) {
      setError("All fields are required.");
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const existingMethods = await fetchSignInMethodsForEmail(auth, trimmedEmail);
      if (existingMethods.length > 0) {
        setError("Email already exists. Please log in.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        trimmedPassword
      );

      await set(ref(database, `users/${userCredential.user.uid}`), {
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        role: "user",
      });

      alert("Signup Successful");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-email") setError("Invalid email format.");
      else if (err.code === "auth/weak-password")
        setError("Password should be at least 6 characters.");
      else setError("Signup failed.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="signup-left">
          <img src={image2} alt="Cartoon" className="cartoon-touch" />
          <img src={image3} className="image_3" alt="Decoration" />
          <h2>
            Unleash the <span className="star-text">Star</span> Within!
          </h2>
          <h3>
            Boost your child’s confidence and social skills to unlock lifelong
            success.
          </h3>
        </div>

        <div className="signup-right">
          <div className="heading">
            <img src={image4} className="logeimage" alt="Logo" />
            <h3>Create an account</h3>
          </div>

          <form onSubmit={handleUserSignup}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                >
                  {showPassword ? <GrView /> : <BiHide />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <div>
              <p>
                Already have an account?{" "}
                <b className="sign" onClick={() => navigate("/")}>
                  Login
                </b>
              </p>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="btn-Sinup">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
