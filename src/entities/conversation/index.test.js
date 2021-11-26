import makeConversation from ".";
import Message from "../message";

describe("makeConversation", () => {
  let validConvData;

  beforeAll(() => {
    validConvData = {
      id: `conv-id-${randomInt()}`,
      membersIds: [
        `first-user-id-${randomInt()}`,
        `second-user-id-${randomInt()}`,
      ],
      messages: [`conv-id-${randomInt()}`],
    };
  });

  it("Should throw an error if no id is provided", () => {
    const conv = { ...validConvData, id: undefined };
    expect(() => makeConversation(conv)).toThrow();
  });
  it("Should throw an error if provided id is not a string or is empty", () => {
    const invalidIds = [1, Math.random(), [], {}, "    "];
    invalidIds.forEach((id) => {
      let conv = { ...validConvData, id };
      expect(() => makeConversation(conv)).toThrow();
    });
  });

  it("Should throw an error if membersIds is not provided", () => {
    const conv = { ...validConvData, membersIds: undefined };
    expect(() => makeConversation(conv)).toThrow();
  });

  it("Should throw an error if membersIds is not an array", () => {
    const invalidInput = [0, 12, "", "asd", {}, null, undefined, NaN];
    for (let inp in invalidInput) {
      const conv = { ...validConvData, membersIds: inp };
      expect(() => makeConversation(conv)).toThrow();
    }
  });

  it("Should throw an error if membersIds contains less than two ids", () => {
    const conv = { ...validConvData, membersIds: ["only-one-id"] };
    expect(() => makeConversation(conv)).toThrow();
  });

  it("Should throw an error if membersIds contains non string values", () => {
    const invalidInput = [0, 12, [], ["", "asd"], {}, null, undefined, NaN];
    for (let inp in invalidInput) {
      const conv = {
        ...validConvData,
        membersIds: ["first-id", invalidInput[inp]],
      };
      expect(() => makeConversation(conv)).toThrow();
    }
  });

  it("Should throw an error if membersIds contains two exactly same ids", () => {
    for (let i = 0; i < 5; i++) {
      let id = `id-${randomInt()}-${i}`;
      const conv = {
        ...validConvData,
        membersIds: [id, id],
      };
      expect(() => makeConversation(conv)).toThrow();
    }
  });

  it("Should return a conversation object with getters for each property if supplied with the correct input data", () => {
    const conv = makeConversation(validConvData);
    expect(conv).toEqual(
      expect.objectContaining({
        getId: expect.any(Function),
        getMembersIds: expect.any(Function),
        getMessages: expect.any(Function),
      })
    );
  });
  it("Newly crated conv properties getters should return proper values", () => {
    const conv = makeConversation(validConvData);
    expect(conv.getId()).toEqual(validConvData.id);
    expect(conv.getMembersIds()).toEqual(validConvData.membersIds);
  });

  it("Add message should add a message to messages array", () => {
    const messageData = {
      id: `msg-id-${randomInt()}`,
      authorId: `author-id-${randomInt()}`,
      conversationId: `conv-id-${randomInt()}`,
      text: `text-${randomInt()}-about-${randomInt()}`,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    const message = new Message(messageData);

    const conv = makeConversation(validConvData);
    const initialMsgs = [...conv.getMessages()];
    conv.addMessage(message);
    const finalMsgs = [...conv.getMessages()];
    expect(finalMsgs.length).toEqual(initialMsgs.length + 1);
    expect(finalMsgs[finalMsgs.length - 1]).toEqual(messageData);
  });

  it("Add message should throw an error if message is not of type Message", () => {
    const conv = makeConversation(validConvData);

    const invalidInput = [
      0,
      12,
      "",
      "   ",
      "test",
      [],
      ["", "asd"],
      {},
      validConvData,
      new Error(),
      null,
      undefined,
      NaN,
    ];
    for (let inp in invalidInput) {
      expect(() => conv.addMessage(invalidInput[inp])).toThrow();
    }
  });
});

function randomInt(max = 100, min = 1) {
  return Math.round(Math.random() * max + min);
}
