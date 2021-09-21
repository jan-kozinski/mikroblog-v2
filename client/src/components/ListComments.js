import Post from "./Post";

function ListComments({ comments, commentsTotal }) {
  return (
    <>
      <ul>
        {comments.map((comm) => (
          <Post key={comm.id} post={comm} />
        ))}
      </ul>

      {commentsTotal > 2 && (
        <p className="btn-neutral w-max px-8 mx-auto">
          ▼ More comments ({commentsTotal - 2})
        </p>
      )}
    </>
  );
}

export default ListComments;
