import { useSelector } from "react-redux";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import { useState, useEffect } from "react";

function Post({ post }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const isAuthor = isAuthenticated && user.name === post.author;
  const [isBeingEdited, setIsBeingEdited] = useState(false);

  const error = useSelector((state) => state.posts.error);
  const editPostError =
    !!error && error.origin === "EDIT_POST" && error.postId === post.id;

  useEffect(() => {
    if (editPostError) setIsBeingEdited(true);
  }, [editPostError]);

  return (
    <li className="post">
      <h4>
        <span className="font-bold text-secondary">{post.author + " "}</span>
        says:
      </h4>
      <hr />
      {!isBeingEdited && <p>{post.content}</p>}

      {isAuthor && (
        <div className={isBeingEdited ? "" : "flex justify-between"}>
          {!isBeingEdited && <DeletePost />}
          <EditPost
            isBeingEdited={isBeingEdited}
            setIsBeingEdited={setIsBeingEdited}
            post={post}
            errorOccured={editPostError}
          />
        </div>
      )}
    </li>
  );
}

export default Post;
