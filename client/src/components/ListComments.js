import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchComments } from "../app-state/actions/comment-actions/fetch-comments";
import LoadingPosts from "./LoadingPosts";
import Post from "./Post";

function ListComments({ comments, commentsTotal, originalPostId }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <ul className="px-4 my-2 rounded-bl-lg rounded-tr-lg border-2">
        {comments.map((comm) => (
          <Post key={comm.id} post={comm} />
        ))}
      </ul>

      {isLoading ? (
        <LoadingPosts />
      ) : (
        <div className="flex justify-around">
          <p className="btn w-64 px-8 max-w-2/5">
            <span className="sm:mx-2 sm:font-bold">+</span> Add comment
          </p>
          {comments.length < commentsTotal && (
            <p
              className="btn-neutral w-64 max-w-2/5 self-stretch flex justify-items-center items-center"
              onClick={async () => {
                setIsLoading(true);
                await dispatch(fetchComments(originalPostId));
                setIsLoading(false);
              }}
            >
              <span className="m-auto">
                ▼ More comments ({commentsTotal - comments.length})
              </span>
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default ListComments;
