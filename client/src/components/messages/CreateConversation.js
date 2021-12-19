import { useRef, useState } from "react";
import SearchRecipients from "./SearchRecipients";
import { createChat } from "../../app-state/actions/chat-actions/create-chat";
import { useDispatch, useSelector } from "react-redux";

function CreateConversation({ className = "" }) {
  const recipientsIds = useRef([]);
  const [msg, setMsg] = useState("");
  const { error } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  return (
    <form className={className + " flex flex-col"}>
      <SearchRecipients recipientsIds={recipientsIds} />
      <div className="flex m-4 p-2">
        <h4 className="mr-4">message</h4>
        <textarea
          className="textbox w-full"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        ></textarea>
      </div>
      {error && error.origin === "CREATE_CONV" && (
        <div className="danger w-4/5 mx-auto">{error.message}</div>
      )}
      <button
        type="submit"
        aria-label="send"
        className="m-auto mb-8 w-4/5 btn shadow-btn"
        onClick={(e) => {
          e.preventDefault();
          dispatch(
            createChat({ membersIds: recipientsIds.current, message: msg })
          );
        }}
      >
        Send
      </button>
    </form>
  );
}

export default CreateConversation;
