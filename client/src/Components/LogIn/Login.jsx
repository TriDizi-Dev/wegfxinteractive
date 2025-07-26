import React, { useEffect, useState } from "react";
import image1 from "../../assets/Login/image1.svg";
import thinklogo from "../../assets/AllWebpAssets/Asset3.webp";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  fetchSignInMethodsForEmail,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
// Assuming these are correctly imported from your Firebase config
import { ref, set, get, database, auth } from "../../Firebase/firebase";
import { GrView } from "react-icons/gr"; // Only GrView is used
import { BiHide } from "react-icons/bi";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";
import googleImg from "../../assets/AllWebpAssets/Asset8.webp";

// Helper function to safely set storage item (sessionStorage preferred)
const setStorageItem = (key, value) => {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    localStorage.setItem(key, value);
  }
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // For password reset success
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false); // To toggle between login and forgot password forms
  const [successmsg, setsuccessmsg] = useState(""); // For login success message
  const navigate = useNavigate();

  // Unified useEffect for handling Google redirect results
  useEffect(() => {
    const handleGoogleRedirectResult = async () => {
      // Check if a Google redirect was initiated
      const redirected = sessionStorage.getItem("googleRedirect");

      if (redirected === "true") {
        // Clear the flag immediately to prevent re-processing on subsequent renders
        sessionStorage.removeItem("googleRedirect");
        setError(""); // Clear previous errors

        try {
          const result = await getRedirectResult(auth);

          if (result && result.user) {
            const user = result.user;
            const userEmail = user.email;

            // Check if this email is already registered with Email/Password
            const methods = await fetchSignInMethodsForEmail(auth, userEmail);
            if (methods.includes("password")) {
              setError(
                "This email is already registered with Email/Password. Please log in with your email and password or reset your password."
              );
              await signOut(auth); // Sign out the partially logged-in Google user
              return;
            }

            const uid = user.uid;
            const userRef = ref(database, `users/${uid}`);
            const snapshot = await get(userRef);

            // If user doesn't exist in our database, create a new entry
            if (!snapshot.exists()) {
              const name = user.displayName || "User"; // Use "User" if display name is not available
              await set(userRef, { name, email: userEmail, role: "user" });
            }

            const token = await user.getIdToken();
            setStorageItem("authToken", token);
            setStorageItem("userType", "user");

            setsuccessmsg("Google Sign-In Successful!");
            setTimeout(() => {
              navigate("/select-age-group");
            }, 1000);
          } else {
            console.log("No user found after Google redirect result.");
          }
        } catch (err) {
          console.error("Google Redirect Sign-In Error:", err);
          if (err.code === "auth/popup-closed-by-user") {
            setError("Google sign-in was cancelled.");
          } else if (err.code === "auth/cancelled-popup-request") {
            setError("Google sign-in was cancelled.");
          } else if (err.code === "auth/account-exists-with-different-credential") {
            setError("An account with this email already exists but was signed in using a different method. Please use your original sign-in method.");
          } else {
            setError(`Google Sign-In Failed: ${err.message || "Unknown error."}`);
          }
        }
      }
    };

    handleGoogleRedirectResult();
  }, []); // Empty dependency array ensures this runs only once on component mount

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setsuccessmsg("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        trimmedEmail,
        trimmedPassword
      );

      const userUid = userCredential.user.uid;
      const snapshot = await get(ref(database, `users/${userUid}`));

      // Prevent admin login through user interface
      if (snapshot.exists() && snapshot.val().role === "admin") {
        setError("Admins must log in through the Admin tab.");
        await signOut(auth); // Sign out the admin if they tried to log in here
        return;
      }

      const token = await userCredential.user.getIdToken();
      setStorageItem("authToken", token);
      setStorageItem("userType", "user");

      setsuccessmsg("Login Successful!");

      setTimeout(() => {
        navigate("/select-age-group");
      }, 2000);
    } catch (err) {
      console.error("Email/Password Login Error:", err);
      if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/user-not-found") {
        setError("User not found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (err.code === "auth/invalid-credential") { // More general for wrong user/pass
        setError("Invalid email or password.");
      }
      else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setError("");
    setMessage(""); // Clear previous messages

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address to reset the password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      setMessage("Password reset email sent! Please check your inbox (and spam folder).");
      setEmail(""); // Clear email field after sending
      setShowChangePassword(false); // Optionally go back to login form
    } catch (err) {
      console.error("Password reset error:", err);
      if (err.code === "auth/user-not-found") {
        setError("No user found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(`Failed to send password reset email: ${err.message || "Unknown error."}`);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError(""); // Clear previous errors
    setMessage("");
    setsuccessmsg("");

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" }); // Forces account selection every time

      const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

      if (isMobile) {
        sessionStorage.setItem("googleRedirect", "true"); // Set flag before redirect
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userEmail = user.email;

        const methods = await fetchSignInMethodsForEmail(auth, userEmail);
        if (methods.includes("password")) {
          setError(
            "This email is already registered with Email/Password. Please log in with your email and password or reset your password."
          );
          await signOut(auth); // Sign out the Google user
          return;
        }

        const uid = user.uid;
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
          const name = user.displayName || "User";
          await set(userRef, { name, email: userEmail, role: "user" });
        }

        const token = await user.getIdToken();
        setStorageItem("authToken", token);
        setStorageItem("userType", "user");

        setsuccessmsg("Google Sign-In Successful!");
        setTimeout(() => {
          navigate("/select-age-group");
        }, 1000);
      }
    } catch (err) {
      console.error("Google sign-in error (popup or initial redirect attempt):", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled by the user.");
      } else if (err.code === "auth/cancelled-popup-request") {
        setError("Multiple Google sign-in attempts detected. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Google sign-in popup was blocked. Please enable pop-ups for this site or try again on a mobile device.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("Your domain is not authorized for Google Sign-In. Please contact support.");
      } else {
        setError(`Google Sign-In Failed: ${err.message || "Unknown error."}`);
      }
    }
  };

  return (
    <div>
      <Navbar />

      <div className="login_box">
        <div className="login-leftside">
          <img src={image1} className="img1" alt="Login Illustration" />
        </div>

        <div className="login-rightside">
          <div className="head">
            <img src={thinklogo} className="logo" alt="Think Logo" />
            <h2>User Login</h2>
          </div>
          <form
            onSubmit={showChangePassword ? handleSendResetEmail : handleLogin}
          >
            <div className="form-login">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username" 
              />
            </div>

            {!showChangePassword && (
              <div className="form-login">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <GrView /> : <BiHide />}
                  </button>
                </div>
              </div>
            )}

            {showChangePassword && (
              <p className="info-message">
                Enter your email. We'll send a password reset link to your inbox.
              </p>
            )}

            <div>
              <div className="Login_submit_and_Create_account">
                <p className="Create_account">
                  Create an account?{" "}
                  <b className="login" onClick={() => navigate("/sign-up")}>
                    Sign Up
                  </b>
                </p>
                <button type="submit" className="btn-login">
                  {showChangePassword ? "Send Reset Link" : "Login"}
                </button>
              </div>
              <h3>
                {showChangePassword ? (
                  <span
                    className="sign"
                    onClick={() => {
                      setShowChangePassword(false);
                      setMessage("");
                      setError(""); 
                    }}
                  >
                    Back to Login
                  </span>
                ) : (
                  <span
                    className="sign"
                    onClick={() => {
                      setShowChangePassword(true);
                      setError(""); 
                      setMessage(""); 
                      setPassword(""); 
                    }}
                  >
                    Forgot password?
                  </span>
                )}
              </h3>
            </div>
            <div className="ErrAndSucHandle">
              {error && <p className="error-message1">{error}</p>}
              {message && <p className="success-message">{message}</p>}
              {successmsg && <p className="success-message">{successmsg}</p>}
            </div>
            <div type="button" onClick={handleGoogleLogin} className="btn-google">
              <img src={googleImg} alt="Google Logo" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;