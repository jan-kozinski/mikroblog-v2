import React from "react";
import SearchRecipients from "./SearchRecipients";

function CreateConversation({ className = "" }) {
  return (
    <form className={className + " flex flex-col"}>
      <SearchRecipients />
      <div className="flex m-4 p-2">
        <h4 className="mr-4">message</h4>
        <textarea className="textbox w-full"></textarea>
      </div>

      <button
        type="submit"
        className="m-auto mb-8 w-4/5 btn shadow-btn"
        onClick={(e) => e.preventDefault()}
      >
        Send
      </button>
    </form>
  );
}

export default CreateConversation;
