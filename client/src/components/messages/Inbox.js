import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations } from "../../app-state/actions/chat-actions/fetch-conversations";
import CreateConversation from "./CreateConversation";
import ListConversations from "./ListConversations";
import Chat from "./Chat";
import Loading from "../Loading";
import { Switch, Route } from "react-router-dom";
import InboxHeader from "./InboxHeader";
function Inbox() {
  const dispatch = useDispatch();
  const isLoading = useSelector(
    (state) => state.chat.loading || state.auth.isLoading
  );
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const chats = useSelector((state) => state.chat.conversations);
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch, fetchConversations]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) window.location.replace("/");
  }, [isLoading, isAuthenticated]);

  return (
    <div
      style={{
        height: "90vh",
      }}
      className="bg-white m-2 rounded-lg grid grid-cols-3 grid-rows-2 auto-rows-min"
    >
      <InboxHeader />
      <Switch>
        <Route path="/inbox" exact>
          <CreateConversation className="row-start-1 row-end-3 col-start-2 col-end-4" />
        </Route>
        <Route path="/inbox/c/:chatId">
          {isLoading ? (
            <Loading />
          ) : (
            <Chat
              className="row-start-1 row-end-3 col-start-2 col-end-4"
              chats={chats}
            />
          )}
        </Route>
      </Switch>
      {isLoading ? (
        <Loading />
      ) : (
        <ListConversations chats={chats} className="row-start-1 row-end-3" />
      )}
    </div>
  );
}

export default Inbox;
