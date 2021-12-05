import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../../app-state/actions/chat-actions/fetch-conversations";
import CreateConversation from "./CreateConversation";
import ListConversations from "./ListConversations";
import Chat from "./Chat";
import { Switch, Route } from "react-router-dom";
function Inbox() {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.conversations);
  useEffect(() => {
    dispatch(fetchConversations());
  }, []);
  return (
    <div
      style={{
        height: "90vh",
      }}
      className="bg-white m-2 rounded-lg grid grid-cols-3 grid-rows-2 auto-rows-min"
    >
      <div className="rows-start-0 row-end-1 h-16 font-bold text-2xl text-primary border-b-2 solid p-4">
        Conversations
      </div>
      <div className="row-start-0 col-start-2 text-white font-bold text-2xl text-center rounded-tr-lg col-end-4 bg-secondary h-16 w-full">
        <h4 className="transform translate-y-1/2">Start new conversation</h4>
      </div>
      <Switch>
        <Route path="/inbox" exact>
          <CreateConversation className="row-start-1 row-end-3 col-start-2 col-end-4" />
        </Route>
        <Route path="/inbox/c/:chatId">
          <Chat
            className="row-start-1 row-end-3 col-start-2 col-end-4"
            chats={chats}
          />
        </Route>
      </Switch>
      <ListConversations chats={chats} className="row-start-1 row-end-3" />
    </div>
  );
}

export default Inbox;
