import Post from "./Post";

const ListPosts = ({ posts }) => {
  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  );
};

export default ListPosts;
