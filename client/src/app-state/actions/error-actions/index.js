import { GET_ERRORS, CLEAR_ERRORS } from "../types";

// RETURN ERRORS

export const returnErrors = (msg, status) => {
  return {
    type: GET_ERRORS,
    payload: {
      msg,
      status,
    },
  };
};

export const clearErrors = () => ({ type: CLEAR_ERRORS });
