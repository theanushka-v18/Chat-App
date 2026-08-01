import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import {
  clearUnread,
  getAllUsers,
  setSelectedUser,
} from "@modules/chat/redux/chatSlice";
import UserShimmerBox from "./UserShimmerBox";
import type { TUserData } from "@modules/auth/redux/authSlice";

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
          {[1, 2, 3, 4, 5].map((i) => {
            return <UserShimmerBox key={i} width="100%" height="30px" />;
          })}
        </div>
      ) : (
        <>
          {allUsers?.map((user, idx) => {
            return (
              <h4
                key={idx}
                style={{
                  backgroundColor:
                    selectedUser?.id === user.id ? "#fffcfb" : "",
                  color:
                    selectedUser?.id === user.id ? "var(--primary-color)" : "",
                }}
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  dispatch(clearUnread(user.id));
                }}
              >
                {user.name}
                {(unreadCounts[user.id] ?? 0) > 0 && (
                  <span className="unread-badge">{unreadCounts[user.id]}</span>
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
