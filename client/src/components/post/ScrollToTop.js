import React from "react";

function ScrollToTop() {
  return (
    <div
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
  );
}

export default ScrollToTop;
