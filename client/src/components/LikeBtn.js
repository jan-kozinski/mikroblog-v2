import { useState, useEffect, useCallback } from "react";
import {
  removeLike,
  giveLike,
  clearPostError,
} from "../app-state/actions/post-actions";

import {
  likeComment,
  removeLikeFromComm,
} from "../app-state/actions/comment-actions";

import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import { faHeart as heartRegular } from "@fortawesome/free-regular-svg-icons";

function LikeBtn({ likesCount, likersIds, postId, isComment }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const [icon, setIcon] = useState(heartRegular);
  const [isHandlingRequest, setIsHandlingRequest] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isLiker = isAuthenticated && likersIds && likersIds.includes(user.id);

  const onClick = async () => {
    if (isHandlingRequest || !isAuthenticated) return;

    setIsHandlingRequest(true);
    if (isComment) {
      dispatch(isLiker ? removeLikeFromComm(postId) : likeComment(postId));
    } else {
      dispatch(clearPostError());
      await dispatch(isLiker ? removeLike(postId) : giveLike(postId));
    }

    setTimeout(() => setIsHandlingRequest(false), 200);
  };

  const changeIcon = useCallback(() => {
    if (isHovered) {
      setIcon(isLiker ? faHeartBroken : faHeart);
    } else {
      setIcon(isLiker ? faHeart : heartRegular);
    }
  }, [isHovered, isLiker]);
  useEffect(() => {
    changeIcon();
  }, [changeIcon]);
  return (
    <>
      <FontAwesomeIcon
        onMouseEnter={() => {
          if (!isAuthenticated) return;
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          if (!isAuthenticated) return;
          setIsHovered(false);
        }}
        onClick={onClick}
        className={
          isAuthenticated ? "like-btn mt-1" : "text-red-500 ml-auto mt-1"
        }
        aria-label={
          isLiker
            ? "Remove like"
            : `Give ${isComment ? "comment" : "post"} a like`
        }
        icon={icon}
      />
      <span
        aria-label={`${isComment ? "Comment" : "Post"}'s likes count`}
        className="text-red-500 ml-1"
      >
        {likesCount}
      </span>
    </>
  );
}

export default LikeBtn;
