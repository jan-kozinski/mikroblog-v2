import { jest } from "@jest/globals";
import makeRemovePost from "./remove-post";

describe("remove-post use case", () => {
  let postId, authorId, postsDb, commentsDb, removePost;
  beforeAll(() => {
    postId = `id-${Math.round(Math.random() * 100)}`;
    authorId = `user-${Math.round(Math.random() * 100)}`;
    postsDb = {
      deleteById: jest.fn((id) => {
        if (id === postId) return Promise.resolve();
        return new Promise(() => {
          throw new Error("Entity not found");
        });
      }),
      findById: jest.fn((id) =>
        Promise.resolve({
          id,
          authorId,
          content: "content",
        })
      ),
    };
    commentsDb = {
      deleteMany: jest.fn(),
    };
    removePost = makeRemovePost({ postsDb, commentsDb });
  });
  afterEach(() => {
    postsDb.deleteById.mockClear();
    commentsDb.deleteMany.mockClear();
  });
  it("Should remove the post alongside with comments attached to it", async () => {
    expect(postsDb.deleteById).toBeCalledTimes(0);
    expect(commentsDb.deleteMany).toBeCalledTimes(0);

    await removePost(postId, authorId);

    expect(postsDb.deleteById).toBeCalledTimes(1);
    expect(commentsDb.deleteMany).toBeCalledTimes(1);
    expect(postsDb.deleteById).toBeCalledWith(postId);
    expect(commentsDb.deleteMany).toBeCalledWith({ originalPostId: postId });
  });
  it("Should throw an error if users tries to delete a post that he is not the author of", async () => {
    await expect(() => removePost(postId, "fraud-id")).rejects.toThrow();
  });
});
