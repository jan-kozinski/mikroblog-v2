import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ListMessages from "./ListMessages";
import SendMessage from "./SendMessage";

function Chat({ chats, className }) {
  const { chatId } = useParams();

  const { error } = useSelector((state) => state.chat);
  const chat = chats.find((c) => c.id === chatId);

  return (
    <div className={className + " flex flex-col justify-between"}>
      <ListMessages chat={chat} />
      <div>
        {error && error.origin === "SEND_MSG" && (
          <div role="alert" className="danger mx-4 mt-2">
            {error.message}
          </div>
        )}
        <SendMessage chatId={chatId} />
      </div>
    </div>
  );
}

export default Chat;
