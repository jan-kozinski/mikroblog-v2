import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

function ListConversations({ className = "", chats = [] }) {
  const loggedUser = useSelector((state) => state.auth.user);
  const { pathname } = useLocation();
  const isSelected = useCallback((id) => id === pathname.slice(9), [pathname]);

  return (
    <ul className={className + " h-full border-r-2 solid"}>
      <Link to="/inbox">
        <li className="border-b-2 px-2 h-16 solid font-bold flex justify-between flex items-center">
          start new conversation
          <div className="btn w-8">+</div>
        </li>
      </Link>
      {chats.map((chat) => (
        <Link to={"/inbox/c/" + chat.id} key={chat.id}>
          <li
            className={`border-b-2 p-2 transition duration-200 ease-in rounded-xl ${
              isSelected(chat.id)
                ? "bg-primary bg-opacity-80 text-white"
                : "hover:bg-gray-300"
            }`}
          >
            <span className="text-secondary font-bold">
              {chat.members.filter((m) => m !== loggedUser.name).join(", ")}
            </span>
            <p className="truncate max-h-32 overflow-hidden">
              {chat.messages.length
                ? lastMsg(chat)
                : "This is a new conversation"}
            </p>
          </li>
        </Link>
      ))}
    </ul>
  );
}

export default ListConversations;

function lastMsg(chat) {
  const lastMsg = chat.messages[chat.messages.length - 1];
  return `${lastMsg.author}: ${lastMsg.text}`;
}
