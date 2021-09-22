import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

function LoadingPosts() {
  return (
    <FontAwesomeIcon
      icon={faCog}
      className="block mx-auto mt-4 text-4xl"
      spin
      aria-label="Loading..."
    />
  );
}

export default LoadingPosts;
