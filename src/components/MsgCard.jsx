import { useSelector } from "react-redux";

const MsgCard = ({ chat }) => {
  const { userData } = useSelector((state) => state.auth);
  return (
    <div
      className={`${
        chat.receiver === userData.id ? "sender-msg-card" : "me-msg-card"
      }`}
    >
      <p>{chat.message}</p>
    </div>
  );
};

export default MsgCard;
