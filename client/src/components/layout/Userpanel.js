import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  loadUserSession,
} from "../../app-state/actions/auth-actions";
import { Link } from "react-router-dom";
import LoginForm from "../LoginForm";
import SignupForm from "../SignupForm";
import UserDashboard from "./UserDashboard";
function Userpannel() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const _csrf = useSelector((state) => state.auth._csrf);
  const isFirstRender = useRef(true);
  const dispatch = useDispatch();

  const [loginOverRegistration, switchForm] = useState(true);

  useEffect(() => {
    if (!_csrf) return;
    if (isFirstRender.current) {
      dispatch(loadUserSession());
      isFirstRender.current = false;
    }
  }, [_csrf]);

  if (isAuthenticated) return <UserDashboard />;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="user-form-container ">
      <h2 className="user-form-headline">
        {loginOverRegistration ? "Login" : "Register"}
      </h2>
      <div className="faced-down-triangle" />
      {loginOverRegistration ? <LoginForm /> : <SignupForm />}

      <hr className="border-blue-900 mx-4 mb-4" />
      <Link
        className="user-form-switch"
        to="#"
        onClick={() => {
          dispatch(clearErrors());
          switchForm(!loginOverRegistration);
        }}
      >
        {loginOverRegistration
          ? "New here? Go ahead and Sign Up!"
          : "Already have an account? Sign in now!"}
      </Link>
    </div>
  );
}

export default Userpannel;
