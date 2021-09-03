import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

function LoadingPosts() {
  return <FontAwesomeIcon icon={faCog} spin aria-label="Loading..." />;
}

export default LoadingPosts;
