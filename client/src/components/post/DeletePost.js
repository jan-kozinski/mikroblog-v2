import { useDispatch } from "react-redux";
import { deleteComment } from "../../app-state/actions/comment-actions";

function DeletePost({ postId, isComment, className }) {
  const dispatch = useDispatch();
  return (
    <button
      aria-label={`delete ${isComment ? "comment" : "post"}`}
      className={`btn-danger px-2 mt-1 ${className}`}
      onClick={() => {
        if (isComment) dispatch(deleteComment(postId));
      }}
    >
      DELETE X
    </button>
  );
}

export default DeletePost;
