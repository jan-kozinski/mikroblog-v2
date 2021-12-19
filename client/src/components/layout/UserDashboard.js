import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

function UserDashboard() {
  const username = useSelector((state) => state.auth.user.name);

  return (
    <div className="user-form-container">
      <div className="user-form-headline text-white font-bold text-center">
        Dashboard
      </div>
      <p className="m-4">
        Hello there,{" "}
        <span className="text-secondary font-bold">{username}</span>
        <div className="grid grid-cols-2 mt-2 gap-1">
          <Link
            to="/inbox"
            className="user-panel-tile rounded-tl-xl rounded-br-lg"
          >
            messages
          </Link>
          <Link to="#" className="user-panel-tile rounded-tr-xl rounded-bl-lg">
            settings
          </Link>
          <Link to="#" className="user-panel-tile rounded-bl-xl rounded-tr-lg">
            your posts
          </Link>
          <Link to="#" className="user-panel-tile rounded-br-xl rounded-tl-lg">
            friends
          </Link>
        </div>
      </p>
    </div>
  );
}

export default UserDashboard;
