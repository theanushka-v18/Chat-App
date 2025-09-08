import { useState } from "react";
import chatAppLogo from "../assets/chat-app-logo.png";
import userLogo from "../assets/user-logo.png";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { LuLogOut } from "react-icons/lu";
import {
  changePassword,
  logout,
  logoutReducer,
} from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { TbLoader } from "react-icons/tb";
import { useToast } from "../hooks/useToast";

const Navbar = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [changePasswordDetails, setChangePasswordDetails] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { userData, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setChangePasswordDetails({
      ...changePasswordDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      changePasswordDetails.newPassword !==
      changePasswordDetails.confirmPassword
    ) {
      showToast({
        message: "Confirm password should be same as new password",
        type: "warning",
      });
      return;
    }
    dispatch(
      changePassword({
        currentPassword: changePasswordDetails.oldPassword,
        newPassword: changePasswordDetails.newPassword,
      })
    ).then((res) => {
      if (res.type === "changePassword/fulfilled") {
        showToast({ message: res.payload.message, type: "success" });
        dispatch(logout());
        dispatch(logoutReducer());
        navigate("/");
        setChangePasswordModal(false);
        setChangePasswordDetails({});
      }
    });
  };

  return (
    <div className="navbar-container">
      <div className="left-container">
        <img src={chatAppLogo} alt="Chat App Logo" />
        <h2>Chat App</h2>
      </div>

      {isAuthenticated && (
        <div className="right-container">
          <motion.img
            onClick={() => setIsUserModalOpen(!isUserModalOpen)}
            src={userLogo}
            alt="User Logo"
          />
          <AnimatePresence initial={false}>
            {isUserModalOpen ? (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="user-details-modal"
              >
                <p className="user-data-text">{userData.name}</p>
                <p className="user-data-text">{userData.email}</p>
                <div className="user-data-btn-container">
                  <button
                    className="primary-button"
                    onClick={() => {
                      setIsUserModalOpen(false);
                      setChangePasswordModal(true);
                    }}
                  >
                    <RiLockPasswordFill
                      color="whitesmoke"
                      size={30}
                      cursor={"pointer"}
                    />
                    Change Password
                  </button>
                  <button
                    className="secondary-button"
                    onClick={async () => {
                      const result = await dispatch(logout());
                      if (logout.fulfilled.match(result)) {
                        navigate("/");
                        dispatch(logoutReducer());
                        setIsUserModalOpen(false);
                        showToast({
                          message: result.payload.message,
                          type: "error",
                        });
                      }
                    }}
                  >
                    {isLoading ? (
                      <TbLoader size={30} className="loader" />
                    ) : (
                      <>
                        <LuLogOut
                          color="whitesmoke"
                          size={30}
                          cursor={"pointer"}
                        />{" "}
                        Sign out
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {changePasswordModal ? (
              <>
                <motion.div
                  className="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setChangePasswordModal(false);
                    setChangePasswordDetails({});
                  }} // close on backdrop click
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="change-password-modal"
                >
                  <h1 className="form-title">Change Password</h1>
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="oldPassword">OLD PASSWORD</label>
                    <input
                      type="password"
                      placeholder="Enter old password"
                      value={changePasswordDetails.oldPassword}
                      onChange={handleChange}
                      id="oldPassword"
                      required
                      className="input"
                      name="oldPassword"
                    />

                    <label htmlFor="newPassword">NEW PASSWORD</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={changePasswordDetails.newPassword}
                      onChange={handleChange}
                      required
                      className="input"
                      name="newPassword"
                      id="newPassword"
                    />

                    <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                    <input
                      type="password"
                      placeholder="Enter confirm password"
                      value={changePasswordDetails.confirmPassword}
                      onChange={handleChange}
                      required
                      className="input"
                      name="confirmPassword"
                      id="confirmPassword  "
                    />

                    <div className="auth-btn-links">
                      <button type="submit" className="primary-button">
                        {isLoading ? (
                          <TbLoader size={30} className="loader" />
                        ) : (
                          "Save"
                        )}
                      </button>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                          setChangePasswordModal(false);
                          setChangePasswordDetails({});
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </>
            ) : null}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Navbar;
