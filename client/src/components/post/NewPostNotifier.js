import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOnlyLatestPosts } from "../../app-state/actions/post-actions";

function NewPostNotifier() {
  const postsAddedSinceLastFetch = useSelector(
    (state) => state.posts.postsAddedSinceLastFetch
  );
  const notificationRef = useRef();
  const scrollUpRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  const observer = new IntersectionObserver(([entry]) => {
    setIsVisible(entry.isIntersecting);
  });

  useEffect(() => {
    if (notificationRef.current instanceof Element)
      observer.observe(notificationRef.current);
    return () => {
      observer.disconnect();
    };
  }, [notificationRef.current]);

  const dispatch = useDispatch();

  const fetchLatestPosts = () => {
    dispatch(fetchOnlyLatestPosts());
  };
  return (
    <>
      {postsAddedSinceLastFetch > 0 && (
        <div
          style={{ padding: "1rem 0" }}
          ref={notificationRef}
          className="post text-center"
        >
          <span className="text-secondary font-bold mx-1">
            {postsAddedSinceLastFetch}
          </span>
          new posts {postsAddedSinceLastFetch > 1 ? "were" : "was"} added.
          <button className="btn p-2 mx-4" onClick={() => fetchLatestPosts()}>
            Show {postsAddedSinceLastFetch > 1 ? "them" : "it"}
          </button>
          {!isVisible && (
            <div
              ref={scrollUpRef}
              style={
                notificationRef.current
                  ? {
                      transform: `translate(${
                        notificationRef.current.offsetWidth * 1.02
                      }px,0)`,
                      bottom: "3vh",
                    }
                  : {
                      display: "none",
                    }
              }
              className="bg-white rounded-lg text-neutral fixed md:text-6xl lg:text-8xl md:h-16 lg:h-24 md:w-16 lg:w-24 sm:hidden md:block"
            >
              <span
                style={{
                  right: "10%",
                  top: "5%",
                }}
                className="text-sm text-white absolute bg-red-500 px-2 rounded-full"
              >
                {postsAddedSinceLastFetch}
              </span>
              <FontAwesomeIcon icon={faAngleUp} />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default NewPostNotifier;
