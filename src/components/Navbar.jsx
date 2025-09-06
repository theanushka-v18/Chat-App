import { useState } from "react";
import chatAppLogo from "../assets/chat-app-logo.png";
import userLogo from "../assets/user-logo.png";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { LuLogOut } from "react-icons/lu";
import { logout, logoutReducer } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const { userData, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
                className="user-details-container"
              >
                <p className="user-data-text">{userData.name}</p>
                <p className="user-data-text">{userData.email}</p>
                <div className="user-data-btn-container">
                  <button
                    className="secondary-button"
                    onClick={async () => {
                      const result = await dispatch(logout());
                      if (logout.fulfilled.match(result)) {
                        navigate("/");
                        dispatch(logoutReducer());
                        setIsUserModalOpen(false);
                      }
                    }}
                  >
                    <LuLogOut color="whitesmoke" size={30} cursor={"pointer"} />
                    Sign out
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      )}
      {/* <div className="right-container">
        <button className="primary-button">
          <FaUser size={20} />
          Login
        </button>
      </div> */}
    </div>
  );
};

export default Navbar;
