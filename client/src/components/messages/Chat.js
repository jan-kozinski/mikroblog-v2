import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../app-state/actions/chat-actions/send-message";
import { useState } from "react";

function Chat({ chats, className }) {
  const { chatId } = useParams();
  const loggedUser = useSelector((state) => state.auth.user);
  const chat = chats.find((c) => c.id === chatId);
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const onSubmit = (e) => {
    e.preventDefault();
    console.log(text);
    dispatch(sendMessage({ chatId, text }));
  };

  return (
    <div className={className + " flex flex-col"}>
      {chat.messages.length ? (
        chat.messages.map((msg) => {
          let isAuthor = loggedUser && msg.author === loggedUser.name;
          return (
            <div className="px-4">
              <span className={`${isAuthor ? "sent-msg" : "received-msg"}`}>
                {msg.text}
              </span>
              <span
                className={
                  "text-neutral block w-max font-light italic" +
                  (isAuthor ? " ml-auto mr-8" : "")
                }
              >
                {isAuthor ? "you" : msg.author}
              </span>
            </div>
          );
        })
      ) : (
        <div>This is a new conversation. Say hello!</div>
      )}

      <form className={"mt-auto w-full flex p-4"}>
        <input
          type="text"
          className="w-full bg-gray-200 rounded-l-full p-2"
          placeholder="Send a message"
          value={text}
          onChange={(e) => {
            e.preventDefault();
            setText(e.target.value);
          }}
        ></input>

        <button
          type="submit"
          className="btn shadow-btn px-3"
          style={{
            borderTopLeftRadius: "0",
            borderBottomLeftRadius: "0",
          }}
          onClick={onSubmit}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
