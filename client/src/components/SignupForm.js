import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { register } from "../app-state/actions/auth-actions";

function SignupForm() {
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ email, name, password }));
  };

  const displayError = () => {
    if (error)
      return (
        <div role="alert" className="danger">
          {error.message}
        </div>
      );
    else if (password !== repeatPassword)
      return (
        <div role="alert" className="danger">
          Passwords don't match
        </div>
      );
  };

  return (
    <form aria-label="signup-form" className="px-4" onSubmit={onSubmit}>
      <label htmlFor="signup-form-email">E-mail</label>
      <input
        type="email"
        name="signup-form-email"
        id="signup-form-email"
        className="my-2 bg-gray-200 rounded block w-full p-2"
        placeholder="E-mail"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label htmlFor="signup-form-name">Name</label>
      <input
        type="name"
        name="signup-form-name"
        id="signup-form-name"
        className="my-2 bg-gray-200 rounded block w-full p-2"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <label htmlFor="signup-form-password">Password</label>
      <input
        type="password"
        name="signup-form-password"
        id="signup-form-password"
        className="my-2 bg-gray-200 rounded block w-full p-2"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <label htmlFor="signup-form-repeat-password">Reapeat Password</label>
      <input
        type="repeat-password"
        name="signup-form-repeat-password"
        id="signup-form-repeat-password"
        className="my-2 bg-gray-200 rounded block w-full p-2"
        placeholder="Repeat password"
        onChange={(e) => setRepeatPassword(e.target.value)}
        value={repeatPassword}
      />
      {displayError()}
      <button className="btn ml-auto mb-4" type="submit">
        Sign in
      </button>
    </form>
  );
}

export default SignupForm;
