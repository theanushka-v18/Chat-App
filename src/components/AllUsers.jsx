import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUnread,
  getAllUsers,
  setSelectedUser,
} from "../redux/slices/chatSlice";
import { TbLoader } from "react-icons/tb";
import UserShimmerBox from "./UserShimmerBox";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { allUsers, selectedUser, unreadCounts, isUsersLoading } = useSelector(
    (state) => state.chat
  );
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllUsers({ name: userData?.name })).then((res) => {
      if (res.type === "getAllUsers/fulfilled") {
        dispatch(setSelectedUser(res.payload.users?.[0]?._id));
      }
    });
  }, [dispatch, userData?.name]);

  return (
    <div className="all-users">
      {isUsersLoading ? (
        // <TbLoader size={30} className="loader" />
        <div
          style={{
            width: "100%",
          }}
        >
          {[1, 2, 3, 4, 5].map(() => {
            return <UserShimmerBox width="100%" height="30px" />;
          })}
        </div>
      ) : (
        <>
          {allUsers?.map((user) => {
            return (
              <h4
                style={{
                  backgroundColor: selectedUser === user._id ? "#fffcfb" : "",
                  color:
                    selectedUser === user._id ? "var(--primary-color)" : "",
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
        </>
      )}
    </div>
  );
};

export default AllUsers;
