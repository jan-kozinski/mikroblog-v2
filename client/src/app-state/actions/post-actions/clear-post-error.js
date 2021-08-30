import { CLEAR_POST_ERROR } from "../types";

export const clearPostError = () => (dispatch) =>
  dispatch({ type: CLEAR_POST_ERROR });
