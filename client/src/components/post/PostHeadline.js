import { useCallback } from "react";
import { useSelector } from "react-redux";
import useTimestamp from "../../hooks/useTimestamp";
import LikeBtn from "../LikeBtn";

function PostHeadline({ post, isComment }) {
  const postAge = useTimestamp(post.createdAt);
  const lastEditAge = useTimestamp(post.modifiedAt);
  const error = useSelector((state) => state.posts.error);

  const shouldDisplayError = useCallback(() => {
    if (isComment) {
      return !!error && error.origin === "COMM" && error.commentId === post.id;
    } else
      return (
        !!error && error.origin === "LIKE_POST" && error.postId === post.id
      );
  }, [isComment, error]);

  return (
    <>
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
          isComment={isComment}
        />
      </div>
      {shouldDisplayError() && (
        <p className="danger w-max mb-2 ml-auto">{error.message}</p>
      )}
      <hr />
    </>
  );
}

export default PostHeadline;
