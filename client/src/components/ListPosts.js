import React from "react";
import { useSelector } from "react-redux";

const ListPosts = () => {
  const posts = useSelector((state) => state.posts).posts;
  return (
    <ul>
      {posts.map((post) => (
        <li className="post" key={post.id}>
          <p>
            <span className="font-bold text-secondary">
              {post.author + " "}
            </span>
            says:
          </p>
          <hr />
          {post.content}
        </li>
      ))}
    </ul>
  );
};

export default ListPosts;
