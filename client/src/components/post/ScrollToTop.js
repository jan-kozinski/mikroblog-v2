import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { useState } from "react";
import { fetchOnlyLatestPosts } from "../../app-state/actions/post-actions";

function ScrollToTop() {
  const postsAddedSinceLastFetch = useSelector(
    (state) => state.posts.postsAddedSinceLastFetch
  );
  const dispatch = useDispatch();
  const [shouldBeVisible, setShouldBeVisible] = useState(false);

  useScrollPosition(({ prevProps, currPos }) => {
    setShouldBeVisible(currPos.y < -400);
  });

  const scrollUpAndFetch = () => {
    window.scroll(0, 0);
    if (postsAddedSinceLastFetch) dispatch(fetchOnlyLatestPosts());
  };

  return (
    <div
      className="scroll-top-btn lg:left-2/3 xl:left-5/6 md:right-4 bottom-8"
      style={{
        opacity: +shouldBeVisible,
      }}
      onClick={() => scrollUpAndFetch()}
    >
      {postsAddedSinceLastFetch > 0 && (
        <span
          style={{
            right: "10%",
            top: "5%",
          }}
          className="text-sm text-white absolute bg-red-500 px-2 rounded-full"
        >
          {postsAddedSinceLastFetch}
        </span>
      )}
      <FontAwesomeIcon
        style={{ width: "100%" }}
        className="h-full text-center"
        icon={faAngleUp}
      />
    </div>
  );
}

export default ScrollToTop;
