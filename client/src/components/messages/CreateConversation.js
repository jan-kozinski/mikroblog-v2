import React from "react";

function CreateConversation({ className = "" }) {
  return (
    <form className={className + " flex flex-col"}>
      <div className="flex m-4 p-2">
        <h4 className="mr-4">recipients</h4>
        <input
          type="text"
          className="w-full h-8 bg-gray-200 rounded-lg p-2"
        ></input>
      </div>

      <div className="flex m-4 p-2">
        <h4 className="mr-4">message</h4>
        <textarea className="textbox"></textarea>
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
