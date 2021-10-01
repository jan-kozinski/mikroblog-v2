import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import ListComments from "../ListComments";
import PostHeadline from "./PostHeadline";

function Post({ post, isComment }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.posts.error);
  const [isBeingEdited, setIsBeingEdited] = useState(false);

  const isAuthor = isAuthenticated && user.name === post.author;
  const editPostError =
    !!error && error.origin === "EDIT_POST" && error.postId === post.id;

  useEffect(() => {
    if (editPostError) setIsBeingEdited(true);
  }, [editPostError]);

  return (
    <li className={`post ${post.isDeleted ? "deleted-content" : ""}`}>
      <PostHeadline post={post} isComment={isComment} />

      {!isBeingEdited && <p>{post.content}</p>}

      {isAuthor && (
        <div className={isBeingEdited ? "" : "flex justify-between"}>
          {!isBeingEdited && (
            <DeletePost
              postId={post.id}
              isComment={isComment}
              className={post.isDeleted ? "invisible" : ""}
            />
          )}
          <EditPost
            isBeingEdited={isBeingEdited}
            setIsBeingEdited={setIsBeingEdited}
            post={post}
            errorOccured={editPostError}
            isComment={isComment}
          />
        </div>
      )}
      {!!post.comments && (
        <ListComments
          comments={post.comments}
          commentsTotal={post.commentsTotal}
          originalPostId={post.id}
        />
      )}
    </li>
  );
}

export default Post;
