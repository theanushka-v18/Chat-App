import { Link, useNavigate } from "react-router-dom";
import homePage from "@assets/home-page.png";
import { motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import React, { useState } from "react";
import { login } from "@modules/auth/redux/authSlice";
import { TbLoader } from "react-icons/tb";
import { RoutePaths } from "@/api/RoutePaths";

const Login = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading } = useAppSelector((state) => state.auth);
  const isButtonDisabled = !userDetails.email || !userDetails.password;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "email") {
      if (e.target.value.length > 255) {
        return; // Prevent further input if the email exceeds 255 characters
      }
    }
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(login(userDetails));

    if (login.fulfilled.match(result)) {
      navigate(RoutePaths.CHAT);
    }
  };
  return (
    <div className="auth-container">
      <motion.img
        initial={{ x: 150 }}
        animate={{ x: 0 }}
        transition={{ duration: 1 }}
        src={homePage}
        alt="Home Page"
      />
      <motion.div
        initial={{ x: -150 }}
        animate={{ x: 0 }}
        transition={{ duration: 1 }}
        className="form-container"
      >
        <h1 className="form-title">Sign In</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">EMAIL</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={userDetails.email.toLowerCase()}
            onChange={handleChange}
            id="email"
            required
            className="input"
            name="email"
          />

          <label htmlFor="passworwd">PASSWORD</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={userDetails.password}
            onChange={handleChange}
            required
            className="input"
            name="password"
          />

          <div className="forgot-password-text">
            <Link to={RoutePaths.FORGOT_PASSWORD}>Forgot password?</Link>
          </div>
          <div className="auth-btn-links">
            <Link to={RoutePaths.SIGNUP}>New user? Sign up here</Link>
            <button disabled={isButtonDisabled || isLoading} type="submit" className="primary-button">
              {isLoading ? (
                <TbLoader size={30} className="loader" />
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
