import dbMockup from "../../../__test__/utils/dbMockup";
import makeListPosts from "./list-posts";

describe("list all posts", () => {
  let listPosts;
  beforeAll(() => {
    listPosts = makeListPosts({ dbGateway: dbMockup });
  });
  afterEach(() => {
    dbMockup._RESET_DB();
    dbMockup.insert.mockClear();
    dbMockup.find.mockClear();
    dbMockup.findById.mockClear();
  });
  it("Should return posts ", async () => {
    let posts = [];
    for (let i = 0; i < 5; i++) {
      let post = {
        id: `${i}-${Math.round(Math.random() * 10)}`,
        authorId: `user-${i}-${Math.round(Math.random() * 10)}`,
        content: `content-${i}-${Math.round(Math.random() * 10)}`,
        createdAt: "doesn't matter",
        modifiedAt: "doesn't matter",
      };
      await dbMockup.insert(post);
      posts.push(post);
    }

    const returnedPosts = await listPosts();
    expect(returnedPosts).toEqual(posts);
  });
});
