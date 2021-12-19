import makeMessage from ".";

describe("makeMessage", () => {
  let validMsgData;

  beforeAll(() => {
    validMsgData = {
      id: `msg-id-${randomInt()}`,
      authorId: `author-id-${randomInt()}`,
      author: `author-name-${randomInt()}`,
      conversationId: `conv-id-${randomInt()}`,
      text: `text-${randomInt()}-about-${randomInt()}`,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
  });

  it("Should throw an error if no id is provided", () => {
    const msg = { ...validMsgData, id: undefined };
    expect(() => makeMessage(msg)).toThrow();
  });
  it("Should throw an error if provided id is not a string or is empty", () => {
    const invalidIds = [1, Math.random(), [], {}, "    "];
    invalidIds.forEach((id) => {
      let msg = { ...validMsgData, id };
      expect(() => makeMessage(msg)).toThrow();
    });
  });

  it("Should throw an error if no authorId is provided", () => {
    const msg = { ...validMsgData, authorId: undefined };
    expect(() => makeMessage(msg)).toThrow();
  });
  it("Should throw an error if provided authorId is not a string or is empty", () => {
    const invalidIds = [1, Math.random(), [], {}, "    "];
    invalidIds.forEach((id) => {
      let msg = { ...validMsgData, authorId: id };
      expect(() => makeMessage(msg)).toThrow();
    });
  });

  it("Should throw an error if no author name is provided", () => {
    const msg = { ...validMsgData, author: undefined };
    expect(() => makeMessage(msg)).toThrow();
  });
  it("Should throw an error if provided author name is not a string or is empty", () => {
    const invalidIds = [1, Math.random(), [], {}, "    "];
    invalidIds.forEach((id) => {
      let msg = { ...validMsgData, author: id };
      expect(() => makeMessage(msg)).toThrow();
    });
  });

  it("Should throw an error if no text is provided", () => {
    const msg = { ...validMsgData, text: undefined };
    expect(() => makeMessage(msg)).toThrow();
  });
  it("Should throw an error if provided text is not a string or is empty", () => {
    const invalidContents = [
      0,
      1,
      NaN,
      null,
      Math.random(),
      [],
      {},
      "",
      "    ",
    ];
    invalidContents.forEach((c) => {
      let msg = { ...validMsgData, text: c };
      expect(() => makeMessage(msg)).toThrow();
    });
  });

  it("Should throw an error if no conversationId is provided", () => {
    const msg = { ...validMsgData, conversationId: undefined };
    expect(() => makeMessage(msg)).toThrow();
  });
  it("Should throw an error if provided conversationId is not a string or is empty", () => {
    const invalidIds = [1, Math.random(), [], {}, "    "];
    invalidIds.forEach((id) => {
      let msg = { ...validMsgData, conversationId: id };
      expect(() => makeMessage(msg)).toThrow();
    });
  });

  it("Should return a msg object with getters for each property if supplied with the correct input data", () => {
    const msg = makeMessage(validMsgData);
    expect(msg).toEqual(
      expect.objectContaining({
        getId: expect.any(Function),
        getAuthorId: expect.any(Function),
        getText: expect.any(Function),
        getCreatedAt: expect.any(Function),
        getModifiedAt: expect.any(Function),
      })
    );
  });
  it("Newly crated msg properties getters should return proper values", () => {
    const msg = makeMessage(validMsgData);

    expect(msg.getId()).toEqual(validMsgData.id);
    expect(msg.getAuthorId()).toEqual(validMsgData.authorId);
    expect(msg.getConversationId()).toEqual(validMsgData.conversationId);
    expect(msg.getText()).toEqual(validMsgData.text);

    expect(msg.getCreatedAt()).toBeInstanceOf(Date);
    expect(msg.getModifiedAt()).toBeInstanceOf(Date);
    expect(msg.getModifiedAt()).toEqual(msg.getCreatedAt());
  });
});

function randomInt(max = 100, min = 1) {
  return Math.round(Math.random() * max + min);
}
