import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  clearUnread,
  getAllUsers,
  setSelectedUser,
} from "../redux/slices/chatSlice.js";
import UserShimmerBox from "./UserShimmerBox.js";
import type { TUserData } from "../redux/slices/authSlice";

const AllUsers = () => {
  const dispatch = useAppDispatch();
  const { allUsers, selectedUser, unreadCounts, isUsersLoading } =
    useAppSelector((state) => state.chat);
  const { userData } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllUsers({ name: userData?.name })).then((res) => {
      if (res.type === "getAllUsers/fulfilled") {
        dispatch(
          setSelectedUser((res.payload as { users: TUserData[] }).users?.[0]),
        );
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
                  backgroundColor:
                    selectedUser?._id === user._id ? "#fffcfb" : "",
                  color:
                    selectedUser?._id === user._id
                      ? "var(--primary-color)"
                      : "",
                }}
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  dispatch(clearUnread(user._id));
                }}
              >
                {user.name}
                {(unreadCounts[user._id] ?? 0) > 0 && (
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
