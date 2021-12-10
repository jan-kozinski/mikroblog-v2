import React from "react";

function InboxHeader() {
  return (
    <>
      <div className="rows-start-0 row-end-1 h-16 font-bold text-2xl text-primary border-b-2 solid p-4">
        Conversations
      </div>
      <div className="row-start-0 col-start-2 text-white font-bold text-2xl text-center rounded-tr-lg col-end-4 bg-secondary h-16 w-full">
        <h4 className="transform translate-y-1/2">Start new conversation</h4>
      </div>
    </>
  );
}

export default InboxHeader;
