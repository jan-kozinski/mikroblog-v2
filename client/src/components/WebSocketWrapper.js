import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  connectToSocket,
  disconnectFromSocket,
} from "../app-state/actions/socket-actions";
function WebSocketWrapper({ children }) {
  const isLoading = useSelector(
    (state) => !state.auth.loading && !state.posts.loading
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(connectToSocket());
    return () => {
      dispatch(disconnectFromSocket());
    };
  }, [isLoading]);
  return <>{children}</>;
}

export default WebSocketWrapper;
