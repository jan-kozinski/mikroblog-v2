import { useSelector, useDispatch } from "react-redux";
import { fetchOnlyLatestPosts } from "../../app-state/actions/post-actions";

function NewPostNotifier() {
  const postsAddedSinceLastFetch = useSelector(
    (state) => state.posts.postsAddedSinceLastFetch
  );

  const dispatch = useDispatch();

  const fetchLatestPosts = () => {
    dispatch(fetchOnlyLatestPosts());
  };
  return (
    <>
      {postsAddedSinceLastFetch > 0 && (
        <div style={{ padding: "1rem 0" }} className="post text-center">
          <span className="text-secondary font-bold mx-1">
            {postsAddedSinceLastFetch}
          </span>
          new posts {postsAddedSinceLastFetch > 1 ? "were" : "was"} added.
          <button className="btn p-2 mx-4" onClick={() => fetchLatestPosts()}>
            Show {postsAddedSinceLastFetch > 1 ? "them" : "it"}
          </button>
        </div>
      )}
    </>
  );
}

export default NewPostNotifier;
