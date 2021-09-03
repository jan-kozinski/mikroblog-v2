import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  login,
  validationError,
  clearErrors,
} from "../app-state/actions/auth-actions";

function LoginForm() {
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(clearErrors());
    if (!email) return dispatch(validationError("Please provide an email"));
    if (!password)
      return dispatch(validationError("Please provide a password"));
    dispatch(login({ email, password }));
  };

  return (
    <form aria-label="signin-form" className="px-4" onSubmit={onSubmit}>
      <label htmlFor="signin-form-email">E-mail</label>
      <input
        type="email"
        name="signin-form-email"
        id="signin-form-email"
        className="my-2 bg-gray-200 rounded block w-full p-2"
        placeholder="E-mail"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label htmlFor="signin-form-password">Password</label>
      <input
        type="password"
        name="signin-form-password"
        id="signin-form-password"
        className="my-2 bg-gray-200 rounded block w-full p-2"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      {!!error && (
        <div role="alert" className="danger">
          {error.message}
        </div>
      )}
      <button className="btn w-full my-1" type="submit">
        Sign in
      </button>
    </form>
  );
}

export default LoginForm;
