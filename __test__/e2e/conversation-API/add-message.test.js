import axios from "axios";

describe("POST@/api/conversation/:conversationId", () => {
  let creatorId, recipientId, conversationId, cookie;
  beforeAll(async () => {
    const creatorData = {
      name: "legit",
      email: "legit@test.com",
      password: "legit123",
    };
    creatorId = (await axios.post("/api/user", creatorData)).data.payload.id;

    cookie = (
      await axios.post("/api/user/auth", {
        email: creatorData.email,
        password: creatorData.password,
      })
    ).headers["set-cookie"][0];

    const recipientData = {
      name: "recipient",
      email: "recipient@test.com",
      password: "legit123",
    };

    recipientId = (await axios.post("/api/user", recipientData)).data.payload
      .id;

    conversationId = (
      await axios.post(
        "/api/conversation",
        {
          membersIds: [creatorId, recipientId],
        },
        { headers: { Cookie: cookie } }
      )
    ).data.payload.id;
  });

  it("Should successfully add a message", async () => {
    const response = await axios.post(
      `/api/conversation/${conversationId}`,
      {
        text: "test-text",
      },
      {
        headers: { Cookie: cookie },
      }
    );
    expect(response.status).toBe(201);
    expect(response.data.success).toBe(true);
    expect(response.data.payload).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        conversationId,
        authorId: creatorId,
        text: "test-text",
        createdAt: expect.any(String),
        modifiedAt: expect.any(String),
      })
    );
  });

  it("Should respond with an error if user sents a request with invalid body", async () => {
    const badInputs = [[], [1], "", null, undefined, NaN, {}, { field: "key" }];

    for (const i of badInputs) {
      const response = await axios.post(
        `/api/conversation/${conversationId}`,
        {
          text: i,
        },
        {
          headers: { Cookie: cookie },
        }
      );
      expect(response.status).toBe(400);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toEqual(expect.any(String));
    }
  });

  it("Should respond with an error if user is not logged in", async () => {
    const response = await axios.post(`/api/conversation/${conversationId}`, {
      text: "test-text",
    });
    expect(response.status).toBe(403);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toEqual(expect.any(String));
  });

  it("Should respond with an error if user tries to add a message to a conversation that he is not the member of", async () => {
    const userData = {
      name: "user",
      email: "user@test.com",
      password: "user123",
    };

    const userCookie = (await axios.post("/api/user", userData)).headers[
      "set-cookie"
    ][0];

    const response = await axios.post(
      `/api/conversation/${conversationId}`,
      {
        text: "test-text",
      },
      {
        headers: { Cookie: userCookie },
      }
    );

    expect(response.status).toBe(403);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toEqual(expect.any(String));
  });
});
