import React from "react";
import { useDispatch } from "react-redux";
import { sendMessage } from "../../app-state/actions/chat-actions/send-message";
import { useState } from "react";
function SendMessage({ chatId }) {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const onSubmit = (e) => {
    e.preventDefault();
    setText("");
    dispatch(sendMessage({ chatId, text }));
  };
  return (
    <form className={"mt-auto w-full flex p-4"}>
      <input
        type="text"
        className="w-full bg-gray-200 rounded-l-full p-2"
        placeholder="Send a message"
        aria-label="message"
        value={text}
        onChange={(e) => {
          e.preventDefault();
          setText(e.target.value);
        }}
      ></input>

      <button
        type="submit"
        className="btn shadow-btn px-3"
        aria-label="send"
        style={{
          borderTopLeftRadius: "0",
          borderBottomLeftRadius: "0",
        }}
        onClick={onSubmit}
      >
        Send
      </button>
    </form>
  );
}

export default SendMessage;
