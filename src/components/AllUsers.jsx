import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUnread,
  getAllUsers,
  setSelectedUser,
} from "../redux/slices/chatSlice";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { allUsers, selectedUser, unreadCounts } = useSelector(
    (state) => state.chat
  );
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllUsers({ name: userData?.name })).then((res) => {
      if (res.type === "getAllUsers/fulfilled") {
        dispatch(setSelectedUser(res.payload[0]._id));
      }
    });
  }, [dispatch, userData?.name]);

  return (
    <div className="all-users">
      {allUsers?.map((user) => {
        return (
          <h4
            style={{
              backgroundColor: selectedUser === user._id ? "#fffcfb" : "",
              color: selectedUser === user._id ? "var(--primary-color)" : "",
            }}
            onClick={() => {
              dispatch(setSelectedUser(user._id));
              dispatch(clearUnread(user._id));
            }}
          >
            {user.name}
            {unreadCounts[user._id] > 0 && (
              <span className="unread-badge">{unreadCounts[user._id]}</span>
            )}
          </h4>
        );
      })}
    </div>
  );
};

export default AllUsers;
