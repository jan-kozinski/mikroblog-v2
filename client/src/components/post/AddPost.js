import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../app-state/actions/post-actions";

function AddPost() {
  const [content, setContent] = useState("");
  const error = useSelector((state) => state.posts.error);
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createPost(content));
    setContent("");
  };
  return (
    <form className="post" onSubmit={onSubmit}>
      <textarea
        className="textbox w-full"
        onChange={(e) => setContent(e.target.value)}
        value={content}
        placeholder="What's poppin'?"
        aria-label="Add new post"
      />
      {!!error && error.origin === "ADD_POST" && (
        <p className="danger mt-2">{error.message}</p>
      )}
      <button className="btn ml-auto block px-2 mt-1" type="submit">
        Submit
      </button>
    </form>
  );
}

export default AddPost;
