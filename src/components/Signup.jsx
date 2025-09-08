import { Link, useNavigate } from "react-router-dom";
import homePage from "../assets/home-page.png";
import { motion } from "motion/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/slices/authSlice";
import { TbLoader } from "react-icons/tb";

const Signup = () => {
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signup(userDetails));
    if (signup.fulfilled.match(result)) {
      navigate("/chat");
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        initial={{ x: -150 }}
        animate={{ x: 0 }}
        transition={{ duration: 1 }}
        className="form-container"
      >
        <h1 className="form-title">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={userDetails.fullName}
            onChange={handleChange}
            id="fullName"
            required
            className="input"
            name="fullName"
          />

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

          <div className="auth-btn-links">
            <Link to={"/"}>Already a user? Sign in here</Link>
            <button type="submit" className="primary-button">
              {isLoading ? (
                <TbLoader size={30} className="loader" />
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </motion.div>
      <motion.img
        initial={{ x: 150 }}
        animate={{ x: 0 }}
        transition={{ duration: 1 }}
        src={homePage}
        alt="Home Page"
      />
    </div>
  );
};

export default Signup;
