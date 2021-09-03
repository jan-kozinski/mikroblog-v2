import { useSelector } from "react-redux";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import { useState, useEffect } from "react";
import LikeBtn from "./LikeBtn";
import useTimestamp from "../hooks/useTimestamp";

function Post({ post }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.posts.error);
  const postAge = useTimestamp(post.createdAt);
  const lastEditAge = useTimestamp(post.modifiedAt);
  const [isBeingEdited, setIsBeingEdited] = useState(false);

  const isAuthor = isAuthenticated && user.name === post.author;
  const editPostError =
    !!error && error.origin === "EDIT_POST" && error.postId === post.id;

  useEffect(() => {
    if (editPostError) setIsBeingEdited(true);
  }, [editPostError]);

  return (
    <li className="post">
      <div className="flex">
        <h4>
          <span className="font-bold text-secondary">{post.author}</span>
        </h4>
        <span className="ml-12 font-thin italic text-gray-700">
          <span className="dot mr-1.5" />
          {postAge}
          {post.createdAt !== post.modifiedAt && (
            <>
              <span className="dot mx-1.5" />
              {`last edit: ${lastEditAge}`}
            </>
          )}
        </span>
        <LikeBtn
          likesCount={post.likesCount}
          likersIds={post.likersIds}
          postId={post.id}
        />
      </div>

      {!!error && error.origin === "LIKE_POST" && error.postId === post.id && (
        <p className="danger w-max mb-2 ml-auto">{error.message}</p>
      )}
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
