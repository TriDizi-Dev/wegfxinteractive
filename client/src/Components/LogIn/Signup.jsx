import React, { useState, useEffect } from "react";
import image2 from "../../assets/Login/image2.png";
import image1 from "../../assets/Login/image1.jpg"
import image3 from "../../assets/Login/image3.png"
import image4 from "../../assets/Login/image4.png"
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  fetchSignInMethodsForEmail,
  signOut,
} from "firebase/auth";
import { ref, set, get, database, auth } from "../../Firebase/firebase";
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

const SignupPage= () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] =useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]=useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [redirectHandled, setRedirectHandled] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle Google Redirect login (even if useEffect doesn't fire)
  if (!redirectHandled && sessionStorage.getItem("googleRedirect") === "true") {
    setRedirectHandled(true);
    sessionStorage.removeItem("googleRedirect");

    getRedirectResult(auth)
      .then(async (result) => {
        if (!result?.user) return;
        const uid = result.user.uid;
        const email = result.user.email;

        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//    const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSignup = (e) => {
//     e.preventDefault();
//     console.log("Form Submitted:", formData);
//   };

        if (!snapshot.exists()) {
          await set(userRef, { email, role: "user" });
        }

        const token = await result.user.getIdToken();
        setStorageItem("authToken", token);
        setStorageItem("userType", "user");

        const planRef = ref(database, `users/${uid}/plan`);
        const planSnap = await get(planRef);
        const now = Date.now();

        if (planSnap.exists() && now < planSnap.val().endTime) {
          navigate("/quiz");
        } else {
          navigate("/slectPlanpage");
        }
      })
      .catch((err) => {
        console.error("Google Sign-In Failed:", err);
        setError("Google Sign-In Failed");
      });
  }

  const handleUserLoginSignup = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required.");
      return;
    }

    try {
      let userCredential;

      if (isSignup) {
        const existingMethods = await fetchSignInMethodsForEmail(auth, trimmedEmail);
        if (existingMethods.length > 0) {
          setError("Email already exists. Please log in.");
          return;
        }

        userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        await set(ref(database, `users/${userCredential.user.uid}`), {
          email: trimmedEmail,
          role: "user",
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);

        const snapshot = await get(ref(database, `users/${userCredential.user.uid}`));
        if (snapshot.exists() && snapshot.val().role === "admin") {
          setError("Admins must log in through the Admin tab.");
          return;
        }
      }

      const token = await userCredential.user.getIdToken();
      setStorageItem("authToken", token);
      setStorageItem("userType", "user");

      const uid = userCredential.user.uid;
      const planRef = ref(database, `users/${uid}/plan`);
      const planSnap = await get(planRef);
      const now = Date.now();

      if (planSnap.exists() && now < planSnap.val().endTime) {
        navigate("/quiz");
      } else {
        navigate("/slectPlanpage");
      }
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-email") setError("Invalid email format.");
      else if (err.code === "auth/user-not-found") setError("User not found. Please sign up.");
      else if (err.code === "auth/wrong-password") setError("Incorrect password.");
      else setError(isSignup ? "Signup failed." : "Login failed.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        sessionStorage.setItem("googleRedirect", "true");
        await signInWithRedirect(auth, provider);
      } else {
        const result = await signInWithPopup(auth, provider);
        const email = result.user.email;

        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.includes("password")) {
          setError("This email is already registered with Email/Password.");
          await signOut(auth);
          return;
        }

        const uid = result.user.uid;
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
          await set(userRef, { email, role: "user" });
        }

        const token = await result.user.getIdToken();
        setStorageItem("authToken", token);
        setStorageItem("userType", "user");

        const planRef = ref(database, `users/${uid}/plan`);
        const planSnap = await get(planRef);
        const now = Date.now();

        if (planSnap.exists() && now < planSnap.val().endTime) {
          navigate("/quiz");
        } else {
          navigate("/slectPlanpage");
        }
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google Sign-In Failed.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="signup-left">
          <img src={image2} alt="Cartoon" className="cartoon-touch" />
          <img src={image3} className="image_3"/>
        <h2>
          Unleash the <span className="star-text">Star</span> Within!
        </h2>
        <p>
          Boost your child’s confidence  and social skills to unlock lifelong success.
        </p>
        </div>

        <div className="signup-right">
            <div className="heading">
                <img src={image4} className="logeimage"/>
                <h3>Create an account</h3>
            </div>
        
          {/* <h2>{isSignup ? "User Signup" : "User Login"}</h2> */}
          

          <form onSubmit={handleUserLoginSignup}>
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
                <div className="form-group">
                  <label>Confirm Password</label>
                 <input
                    type="password"
                 name="confirmPassword"
                // value={formData.confirmPassword}
                  // onChange={handleChange}
                   value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                 required
                 />
                </div>
            </div>
            <div>
               <p>
      Already have an account?{" "}
      <b className="sign" onClick={() => navigate("/")}>Login</b></p>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="btn-Sinup">
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </form>
          </div>
      </div>
    </div>
  );
};

export default SignupPage;