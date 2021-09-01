import {
  unlikePost,
  likePost,
  clearPostError,
} from "../app-state/actions/post-actions";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import { faHeart as heartRegular } from "@fortawesome/free-regular-svg-icons";

function LikeBtn({ likesCount, likersIds, postId }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const isLiker = isAuthenticated && likersIds && likersIds.includes(user.id);
  const [icon, setIcon] = useState(heartRegular);
  const [isHandlingRequest, setIsHandlingRequest] = useState(false);

  useEffect(() => {
    setIcon(isLiker ? faHeart : heartRegular);
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const handleLikeBtnClick = async (e) => {
    if (isHandlingRequest || !isAuthenticated) return;

    setIsHandlingRequest(true);
    dispatch(clearPostError());
    if (isLiker) {
      await dispatch(unlikePost(postId));
      setIcon(faHeart);
    } else {
      await dispatch(likePost(postId));
      setIcon(faHeartBroken);
    }
    setTimeout(() => setIsHandlingRequest(false), 200);
  };

  return (
    <>
      <FontAwesomeIcon
        onMouseEnter={() => {
          if (!isAuthenticated) return;
          setIcon(isLiker ? faHeartBroken : faHeart);
        }}
        onMouseLeave={() => {
          if (!isAuthenticated) return;
          setIcon(isLiker ? faHeart : heartRegular);
        }}
        onClick={handleLikeBtnClick}
        className={
          isAuthenticated ? "like-btn mt-1" : "text-red-500 ml-auto mt-1"
        }
        aria-label={isLiker ? "Remove like" : "Give post a like"}
        icon={icon}
      />
      <span aria-label="Post's likes counts" className="text-red-500 ml-1">
        {likesCount}
      </span>
    </>
  );
}

export default LikeBtn;
