import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

function Chat({ chats, className }) {
  const { chatId } = useParams();
  const chat = chats.find((c) => c.id === chatId);
  const dispatch = useDispatch();
  const sendMessage = (e) => {
    e.preventDefault();
  };

  return (
    <div className={className + " flex flex-col"}>
      {chat.messages.length ? (
        chat.messages.map((msg) => (
          <div>
            <span className="text-secondary inline-block font-bold">
              {msg.author}
            </span>
            says:
            <span className="bg-gray-300 block p-2 m-2 rounded-full">
              {msg.text}
            </span>
          </div>
        ))
      ) : (
        <div>This is a new conversation. Say hello!</div>
      )}

      <form className={"mt-auto w-full flex p-4"}>
        <input
          type="text"
          className="w-full bg-gray-200 rounded-l-full p-2"
          placeholder="Send a message"
        ></input>

        <button
          type="submit"
          className="btn shadow-btn px-3"
          style={{
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0",
          }}
          onClick={(e) => sendMessage(e)}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
