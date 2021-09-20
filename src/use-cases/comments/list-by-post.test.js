import dbMockup from "../../../__test__/utils/dbMockup";
import makeListCommsByPost from "./list-by-post";

describe("list all comments", () => {
  let listComments, originalPostId;
  beforeAll(() => {
    listComments = makeListCommsByPost({ dbGateway: dbMockup });
    originalPostId = "id-123";
  });
  afterEach(() => {
    dbMockup._RESET_DB();
    dbMockup.insert.mockClear();
    dbMockup.find.mockClear();
    dbMockup.findById.mockClear();
  });
  it("Should return comments attached to post of privided id", async () => {
    let comms = [];
    for (let i = 0; i < 5; i++) {
      let comment = {
        id: `${i}-${Math.round(Math.random() * 10)}`,
        originalPostId,
        authorId: `user-${i}-${Math.round(Math.random() * 10)}`,
        content: `content-${i}-${Math.round(Math.random() * 10)}`,
        createdAt: "doesn't matter",
        modifiedAt: "doesn't matter",
      };
      await dbMockup.insert(comment);
      comms.push(comment);
    }

    const returnedPosts = await listComments(originalPostId);
    expect(returnedPosts).toEqual(comms);
  });

  it("Should not return comments attached to another post", async () => {
    let comms = [];
    for (let i = 0; i < 5; i++) {
      let comment = {
        id: `${i}-${Math.round(Math.random() * 10)}`,
        originalPostId,
        authorId: `user-${i}-${Math.round(Math.random() * 10)}`,
        content: `content-${i}-${Math.round(Math.random() * 10)}`,
        createdAt: "doesn't matter",
        modifiedAt: "doesn't matter",
      };
      await dbMockup.insert(comment);
      comms.push(comment);
    }

    for (let i = 0; i < 5; i++) {
      let comment = {
        id: `${i}-${Math.round(Math.random() * 10)}`,
        originalPostId: "another-id-321",
        authorId: `user-${i}-${Math.round(Math.random() * 10)}`,
        content: `content-${i}-${Math.round(Math.random() * 10)}`,
        createdAt: "doesn't matter",
        modifiedAt: "doesn't matter",
      };
      await dbMockup.insert(comment);
    }

    const returnedPosts = await listComments(originalPostId);
    expect(returnedPosts).toEqual(comms);
  });
});
