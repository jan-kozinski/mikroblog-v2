import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../app-state/actions/comment-actions";
function AddComment({ originalPostId, closeModal }) {
  const [content, setContent] = useState("");
  const error = useSelector((state) => state.posts.error);
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createComment({ originalPostId, content }));
    setContent("");
    closeModal();
  };
  return (
    <form
      className="post"
      onSubmit={onSubmit}
      onReset={(e) => {
        e.preventDefault();
        closeModal();
      }}
    >
      <textarea
        className="textbox"
        onChange={(e) => setContent(e.target.value)}
        value={content}
        placeholder="What's poppin'?"
        aria-label="Write a comment"
      />
      {!!error &&
        error.origin === "COMM" &&
        error.postId === originalPostId && (
          <p className="danger mt-2">{error.message}</p>
        )}
      <p className="flex justify-between">
        <button className="btn-neutral px-2 mt-1" type="reset">
          Cancel
        </button>
        <button
          className="btn px-2 mt-1"
          type="submit"
          aria-label="Save comment"
        >
          Submit
        </button>
      </p>
    </form>
  );
}

export default AddComment;
