import { motion } from "motion/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../redux/slices/authSlice";
import { TbLoader } from "react-icons/tb";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [resetPasswordDetails, setResetPasswordDetails] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const { isLoading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setResetPasswordDetails({
      ...resetPasswordDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      resetPasswordDetails.newPassword !== resetPasswordDetails.confirmPassword
    ) {
      toast.warning("Confirm password should be same as new password");
      return;
    }
    dispatch(
      resetPassword({ token, newPassword: resetPasswordDetails.newPassword })
    ).then((res) => {
      if (res.type === "resetPassword/fulfilled") {
        navigate("/");
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
        <h1 className="form-title">Reset password</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="newPassword">NEW PASSWORD</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={resetPasswordDetails.newPassword}
            onChange={handleChange}
            id="newPassword"
            required
            className="input"
            name="newPassword"
          />

          <label htmlFor="confirmNewPassword">CONFIRM NEW PASSWORD</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={resetPasswordDetails.confirmNewPassword}
            onChange={handleChange}
            id="confirmNewPassword"
            required
            className="input"
            name="confirmNewPassword"
          />
          <div className="auth-btn-links">
            <button type="submit" className="primary-button">
              {isLoading ? (
                <TbLoader size={30} className="loader" />
              ) : (
                "Reset Password"
              )}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
