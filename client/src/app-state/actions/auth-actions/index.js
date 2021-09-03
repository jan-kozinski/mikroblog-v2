import { CLEAR_AUTH_ERROR } from "../types";

export { login } from "./login";
export { register } from "./register";
export { validationError } from "./validation-error";
export const clearErrors = () => (dispatch) =>
  dispatch({
    type: CLEAR_AUTH_ERROR,
  });
