import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editComment } from "../../app-state/actions/comment-actions";
import { editPost, clearPostError } from "../../app-state/actions/post-actions";

function EditPost({
  isBeingEdited,
  setIsBeingEdited,
  post,
  errorOccured,
  isComment,
}) {
  const [content, setContent] = useState(post.content);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.posts.error);
  const onSubmit = async (e) => {
    e.preventDefault();
    isComment
      ? dispatch(editComment({ content, commentId: post.id }))
      : dispatch(editPost({ content, postId: post.id }));
    setIsBeingEdited(false);
  };

  if (isBeingEdited)
    return (
      <form onSubmit={onSubmit}>
        <textarea
          className="textbox"
          onChange={(e) => setContent(e.target.value)}
          value={content}
          placeholder="What's poppin'?"
          aria-label={isComment ? "Edit comment" : "Edit post"}
        />
        {errorOccured && <p className="danger my-2">{error.message}</p>}
        <p className="flex justify-between">
          <button
            type="reset"
            onClick={(e) => {
              e.preventDefault();
              setIsBeingEdited(false);
            }}
            className="btn-neutral px-2 mt-1"
          >
            Cancel
          </button>
          <button
            className="btn px-2 mt-1"
            type="submit"
            aria-label="Confirm changes"
          >
            Submit
          </button>
        </p>
      </form>
    );
  else
    return (
      <button
        onClick={() => {
          setContent(post.content);
          !isComment && dispatch(clearPostError());
          setIsBeingEdited(true);
        }}
        className="btn px-2 mt-1"
        aria-label={`Start editting ${isComment ? "comment" : "post"}`}
      >
        EDIT O
      </button>
    );
}

export default EditPost;
