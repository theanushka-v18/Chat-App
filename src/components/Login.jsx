import { Link, useNavigate } from "react-router-dom";
import homePage from "../assets/home-page.png";
import { motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { login } from "../redux/slices/authSlice";
import { TbLoader } from "react-icons/tb";
import { useToast } from "../hooks/useToast";

const Login = () => {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { isLoading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(userDetails));

    if (login.fulfilled.match(result)) {
      navigate("/chat", { state: { toastMessage: result.payload.message } });
    } else if (login.rejected.match(result)) {
      showToast({ message: result.error.message, type: "error" });
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
            value={userDetails.email}
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
            <Link to={"/forgot-password"}>Forgot password?</Link>
          </div>
          <div className="auth-btn-links">
            <Link to={"/signup"}>New user? Sign up here</Link>
            <button type="submit" className="primary-button">
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
