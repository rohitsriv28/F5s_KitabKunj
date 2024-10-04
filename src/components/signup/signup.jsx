import React, { useState } from "react";
import { useSignupHook } from "./useSignUpHook";
import { Link } from "react-router-dom";
import "../signup/signup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

function SignUp() {
  const { formData, setFormData, passwordMatch, signUp } = useSignupHook();

  const { name, email, password, confirmPassword, faculty, semester } =
    formData;
  return (
    <div className="signup">
      <div className="signup-welcome">
        <h1>Welcome to Our Platform!</h1>
        <p>
          Ready to embark on your educational journey with us? Join our vibrant
          community of learners and book enthusiasts by signing up today!
          Whether you're an avid reader, a passionate advocate for quality
          education, or simply someone who believes in the transformative power
          of learning, we welcome you with open arms. Experience the convenience
          of donating, renting, or buying second-hand books with just a few
          clicks. Plus, gain access to exclusive features, personalized
          recommendations, and a supportive network of fellow learners. Let's
          make education accessible for all, one sign-up at a time. Sign up now
          and be part of something extraordinary!
        </p>
        <div className="social-icons">
          <FontAwesomeIcon icon={faFacebook} />
          <FontAwesomeIcon icon={faTwitter} />
          <FontAwesomeIcon icon={faInstagram} />
        </div>
      </div>
      <div className="sign-up-container">
        <form onSubmit={signUp} className="sign-up-form">
          <h1>
            <center>Sign Up</center>
          </h1>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <div className="form-group-row">
              <div className="form-group-half">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group-half">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  inputMode="numeric"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="form-group-row">
              <div className="form-group-half">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group-half">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            {!passwordMatch && (
              <div className="error-message-pw">
                <center>Passwords do not match</center>
              </div>
            )}
          </div>

          <button type="submit">Sign Up</button>
          <span>
            Already have account ? <Link to="/login">Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
