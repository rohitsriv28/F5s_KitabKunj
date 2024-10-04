import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc, collection } from "firebase/firestore";
import { auth, db } from "../helper/firebaseConfig";
import "../signup/login.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Check if user is logged in
  const [user] = useAuthState(auth);

  useEffect(() => {
    // If user is already logged in, navigate to home page
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign in the user
      const userData = await signInWithEmailAndPassword(auth, email, password);
      const uid = userData.user.uid;

      // Fetch user details from Firestore
      const fetchColl = collection(db, "users");
      const fetchDoc = doc(fetchColl, uid);

      const userD = await getDoc(fetchDoc);
      console.log(uid);
      console.log(userD.data());

      // Check if the user document exists
      if (userD.exists()) {
        const userDataFromFirestore = userD.data();

        // Save user details to localStorage
        localStorage.setItem("uid", uid);
        localStorage.setItem("userD", JSON.stringify(userDataFromFirestore));

        console.log("User logged in successfully!");

        // Navigate to homepage after successful login
        // window.history.back();
        navigate("/");
      } else {
        console.error("User document not found in Firestore.");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <div className="login">
      <>
        <div className="login-welcome">
          <h1>Welcome Back !</h1>
          <p>
            Welcome back to our Education for All platform! Ready to dive back
            into the world of learning? Log in here to access your
            personalized dashboard, where you can pick up right where you left
            off. Whether you're returning to explore new books, connect with
            fellow learners, or manage your account settings, we're here to
            make your journey seamless and enriching. Simply enter your
            credentials below and let the adventure continue. Welcome back!
          </p>
          <div className="social-icons">
            <FontAwesomeIcon icon={faFacebook} />
            <FontAwesomeIcon icon={faTwitter} />
            <FontAwesomeIcon icon={faInstagram} />
          </div>
        </div>
        <div className="login-container">
          <form onSubmit={handleLogin} className="login-form">
            <h1>
              <center>Login</center>
            </h1>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit">Login</button>
            <span>
              Don't have account ? <Link to="/signup">Signup</Link>
            </span>
          </form>
        </div>
      </>
    </div>
  );
};

export default Login;
