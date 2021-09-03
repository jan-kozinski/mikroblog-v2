import { VALIDATION_ERROR } from "../types";

export const validationError = (message) => (dispatch) =>
  dispatch({
    type: VALIDATION_ERROR,
    payload: {
      message,
    },
  });
