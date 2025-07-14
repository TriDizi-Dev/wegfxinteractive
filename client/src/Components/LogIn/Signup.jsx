import React, { useState } from "react";
import image2 from "../../assets/Login/image2.png";
import image3 from "../../assets/Login/image3.png";
import image4 from "../../assets/Login/image4.png";
import image5 from "../../assets/Login/Picture10.png";
import image6 from "../../assets/Login/Picture12.png"
import { useNavigate } from "react-router-dom";
// import pic1 from "../../assets/Login/Picture12.png"
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
  const [success, setsuccess] = useState("");
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
      const existingMethods = await fetchSignInMethodsForEmail(
        auth,
        trimmedEmail
      );
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
<<<<<<< HEAD
     setTimeout(() => {
      navigate("/")
     }, 1000);
      alert("Signup Successful");
=======
      setTimeout(() => {
        navigate("/");
      }, 3000);
      // alert("Signup Successful");
      setsuccess("Signup successful !");
>>>>>>> 33ef4738f94397f3251c8864e16b41a14233188d
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
<<<<<<< HEAD
           <div className="stares">
                      <img src={image6} className="image6"/>
                      <img  src={image5} className="image5"/>
                    </div>
=======
          <div className="stares">
            <img src={image6} className="img6" />
            <img src={image5} className="img5" />
          </div>
>>>>>>> 33ef4738f94397f3251c8864e16b41a14233188d
          <h2>
            Unleash the <span className="star-text">Star</span> Within!
          </h2>
          <h3>
            Boost your child’s confidence and social <br />
            skills to unlock lifelong success.
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

            <div className="para">
              <p>
                Already have an account?{" "}
                <b className="signup" >
                  Login
                </b>
              </p>
            </div>

            {error && <p className="error-message2">{error}</p>}
            {success && <p className="error-message2 succesMsg_signup">{success}</p>}

<<<<<<< HEAD
            <button type="submit" className="btn-Sinup" onClick={() => navigate("/")}>
=======
            <button type="submit" className="btn-Sinup">
>>>>>>> 33ef4738f94397f3251c8864e16b41a14233188d
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
