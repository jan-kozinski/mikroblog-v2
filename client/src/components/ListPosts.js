import { useSelector } from "react-redux";
import Post from "./Post";

const ListPosts = () => {
  const posts = useSelector((state) => state.posts).posts;

  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  );
};

export default ListPosts;
