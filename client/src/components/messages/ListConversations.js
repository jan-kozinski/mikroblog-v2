import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function ListConversations({ className = "", chats = [] }) {
  const loggedUser = useSelector((state) => state.auth.user);
  return (
    <ul className={className + " h-full border-r-2 solid"}>
      <li className="border-b-2 p-2 solid">
        <Link to="/inbox" className="font-bold flex justify-between">
          start new conversation
          <div className="btn w-8">+</div>
        </Link>
      </li>
      {chats.map((chat) => (
        <li key={chat.id} className="border-b-2 p-2 solid">
          <Link to={"/inbox/c/" + chat.id}>
            <span className="text-secondary font-bold">
              {chat.members.filter((m) => m !== loggedUser.name).join(", ")}
            </span>
          </Link>
          <p>
            {chat.messages.length
              ? lastMsg(chat)
              : "This is a new conversation"}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default ListConversations;

function lastMsg(chat) {
  const lastMsg = chat.messages[chat.messages.length - 1];
  return `${lastMsg.author}: ${lastMsg.text}`;
}
