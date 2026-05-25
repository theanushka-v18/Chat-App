import { useAppSelector } from "@redux/hooks";
import type { TChatMessage } from "@modules/chat/redux/chatSlice";

const MsgCard = ({ chat }: { chat: TChatMessage }) => {
  const { userData } = useAppSelector((state) => state.auth);
  return (
    <div
      className={`${
        chat.receiver === userData?._id ? "sender-msg-card" : "me-msg-card"
      }`}
    >
      <p>{chat.message}</p>
    </div>
  );
};

export default MsgCard;
