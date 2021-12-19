import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  connectToSocket,
  disconnectFromSocket,
} from "../app-state/actions/socket-actions";
function WebSocketWrapper({ children }) {
  const isLoading = useSelector(
    (state) => state.auth.isLoading || state.posts.loading || state.chat.loading
  );
  const authorizedUser = useSelector((state) =>
    state.auth.user ? state.auth.user.name : null
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLoading) dispatch(connectToSocket(authorizedUser));
    return () => {
      dispatch(disconnectFromSocket());
    };
  }, [isLoading, authorizedUser]);
  return <>{children}</>;
}

export default WebSocketWrapper;
