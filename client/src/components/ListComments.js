import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../app-state/actions/comment-actions/fetch-comments";
import AddComment from "./AddComment";
import Loading from "./Loading";
import Post from "./post/Post";

function ListComments({ comments, commentsTotal, originalPostId }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [hasOpenModal, setHasOpenModal] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <>
      {comments.length > 0 && (
        <ul className="px-4 my-2 rounded-bl-lg rounded-tr-lg border-2">
          {comments.map((comm) => (
            <Post key={comm.id} post={comm} isComment />
          ))}
        </ul>
      )}

      {isLoading ? (
        <Loading />
      ) : (
        <div
          className={`flex justify-around ${hasOpenModal ? "flex-col" : ""}`}
        >
          {isAuthenticated &&
            (hasOpenModal ? (
              <AddComment
                originalPostId={originalPostId}
                closeModal={() => setHasOpenModal(false)}
              />
            ) : (
              <button
                className="btn w-64 px-8 max-w-2/5"
                onClick={() => setHasOpenModal(true)}
                aria-label="Add a comment"
              >
                <span className="sm:mx-2 sm:font-bold">+</span> Add comment
              </button>
            ))}

          {comments.length < commentsTotal && (
            <button
              className={`btn-neutral w-64 max-w-2/5 ${
                hasOpenModal
                  ? "mx-auto"
                  : "self-stretch flex justify-items-center items-center"
              }`}
              onClick={async () => {
                setIsLoading(true);
                await dispatch(fetchComments(originalPostId));
                setIsLoading(false);
              }}
              aria-label="Load more comments"
            >
              <span className="m-auto">
                ▼ More comments ({commentsTotal - comments.length})
              </span>
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default ListComments;
