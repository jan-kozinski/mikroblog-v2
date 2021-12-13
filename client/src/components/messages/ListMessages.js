import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

function ListMessages({ chat }) {
  const loggedUser = useSelector((state) => state.auth.user);
  const msgsRef = useRef(null);
  useEffect(() => {
    if (msgsRef.current && msgsRef.current.scrollHeight)
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, []);
  return chat.messages.length ? (
    <div className="overflow-y-scroll" ref={msgsRef}>
      {chat.messages.map((msg) => {
        let isAuthor = loggedUser && msg.author === loggedUser.name;
        return (
          <div className="px-4">
            <span
              style={{
                overflowWrap: "break-word",
              }}
              className={` max-w-full ${
                isAuthor ? "sent-msg" : "received-msg"
              }`}
            >
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
      })}
    </div>
  ) : (
    <div>This is a new conversation. Say hello!</div>
  );
}

export default ListMessages;
