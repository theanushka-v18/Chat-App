import { motion } from "motion/react";
import React, { useState } from "react";
import { TbLoader } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../redux/slices/authSlice.js";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(forgotPassword({ email })).then((res) => {
      if (res.type === "forgotPassword/fulfilled") {
        setIsEmailSent(true);
      }
    });
  };

  return (
    <div className="auth-container">
      <motion.div
        initial={{ x: -150 }}
        animate={{ x: 0 }}
        transition={{ duration: 1 }}
        className="form-container"
      >
        <h1 className="form-title">Forgot password</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">EMAIL</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            required
            className="input"
            name="email"
          />
          <div className="auth-btn-links">
            {isEmailSent ? (
              "Reset link has been sent to your email"
            ) : (
              <button type="submit" className="primary-button">
                {isLoading ? (
                  <TbLoader size={30} className="loader" />
                ) : (
                  "Send reset link"
                )}
              </button>
            )}
            {!isEmailSent && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
