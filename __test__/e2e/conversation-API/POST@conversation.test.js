import axios from "axios";

describe("POST@/api/conversation", () => {
  let creatorId, cookie, recipientId;
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
  });

  it("Should successfully create a conversation", async () => {
    const response = await axios.post(
      "/api/conversation",
      {
        membersIds: [creatorId, recipientId],
      },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );

    expect(response.status).toEqual(201);
    expect(response.data.success).toBe(true);
    const expectedBody = expect.objectContaining({
      id: expect.any(String),
      members: expect.arrayContaining([expect.any(String), expect.any(String)]),
      messages: [],
    });

    expect(response.data.payload).toEqual(expectedBody);
  });

  it("Should respond with an error if membersIds are not provided", async () => {
    const response = await axios.post(
      "/api/conversation",
      {},
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    expect(response.status).toEqual(400);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toEqual(expect.any(String));
  });

  it("Should respond with an error if membersIds is invalid", async () => {
    const badInputs = [
      {},
      { field: "key" },
      "",
      "  ",
      "abcd",
      0,
      null,
      NaN,
      17,
    ];
    await badInputs.forEach(async (i) => {
      const response = await axios.post(
        "/api/conversation",
        { membersIds: i },
        {
          headers: {
            Cookie: cookie,
          },
        }
      );
      expect(response.status).toEqual(400);
      expect(response.data.success).toBe(false);
      expect(response.data.error).toEqual(expect.any(String));
    });
  });

  it("Should respond with an error if membersIds contains only one id", async () => {
    const response = await axios.post(
      "/api/conversation",
      { membersIds: [creatorId] },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    expect(response.status).toEqual(400);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toEqual(expect.any(String));
  });

  it("Should respond with an error if doesn't contain creator id", async () => {
    const recipientOneData = {
      name: "recipientA",
      email: "recipientA@test.com",
      password: "legit123",
    };

    const recipientOneId = (await axios.post("/api/user", recipientOneData))
      .data.payload.id;

    const recipientTwoData = {
      name: "recipientB",
      email: "recipientB@test.com",
      password: "legit123",
    };

    const recipientTwoId = (await axios.post("/api/user", recipientTwoData))
      .data.payload.id;

    const response = await axios.post(
      "/api/conversation",
      { membersIds: [recipientOneId, recipientTwoId] },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    expect(response.status).toEqual(400);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toEqual(expect.any(String));
  });

  it("Should respond with an error if membersIds contains id of non-existant user", async () => {
    const response = await axios.post(
      "/api/conversation",
      { membersIds: [creatorId, "some-fakish-id"] },
      {
        headers: {
          Cookie: cookie,
        },
      }
    );
    expect(response.status).toEqual(400);
    expect(response.data.success).toBe(false);
    expect(response.data.error).toEqual(expect.any(String));
  });
});
