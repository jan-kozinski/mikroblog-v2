import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../app-state/actions/auth-actions";
function Userpannel() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (isAuthenticated) return <div>Welcome user!</div>;
  if (isLoading) return <div>Loading...</div>;

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="email">E-mail</label>
      <input
        type="text"
        name="email"
        className="my-2 bg-gray-200 rounded block w-full p-2"
        placeholder="E-mail"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        className="my-2 bg-gray-200 rounded block w-full p-2"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <input className="mb-4 btn" type="submit" value="Sign in" />
    </form>
  );
}

export default Userpannel;
