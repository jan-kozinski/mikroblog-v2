import { jest } from "@jest/globals";
import dbMockup from "../../../__test__/utils/dbMockup";
import makeMessage, { Message } from "../../entities/message";
import makeAddMessage from "./add-message";
describe("add message use case", () => {
  let validMsgData, addMessage, genId, convsDb, usersDb;
  beforeAll(() => {
    validMsgData = {
      id: `msg-id-${randomInt()}`,
      authorId: `author-id-${randomInt()}`,
      conversationId: `conv-id-${randomInt()}`,
      text: `text-number-${randomInt()}`,
      createdAt: new Date(),
      modifiedAt: new Date(),
    };
    genId = jest.fn(() => `id-${randomInt()}`);
    usersDb = {
      findById: jest.fn((id) => {
        if (id === validMsgData.authorId)
          return Promise.resolve({
            id,
            name: `name-${randomInt()}-${validMsgData.authorId}`,
            email: `${validMsgData.authorId}@test.com`,
          });
        else return Promise.resolve(null);
      }),
    };
    addMessage = makeAddMessage({
      conversationsDb: dbMockup,
      usersDb,
      Id: { genId },
    });
  });

  beforeEach(() => {
    dbMockup._RESET_DB();
    dbMockup.insert({
      id: validMsgData.conversationId,
      membersIds: [validMsgData.authorId, `id-${randomInt()}`],
      messages: [],
    });
    dbMockup.insert.mockClear();
    dbMockup.find.mockClear();
    dbMockup.findById.mockClear();
    usersDb.findById.mockClear();
    genId.mockClear();
  });

  it("Should throw an error if author is not found in users database", async () => {
    const fakeId = `fake-${randomInt()}`;
    const message = {
      ...validMsgData,
      authorId: fakeId,
    };
    await expect(addMessage(message)).rejects.toThrow();

    expect(usersDb.findById).toBeCalledTimes(1);
    expect(usersDb.findById).toBeCalledWith(fakeId);
  });
  it("Should throw an error if the converstation that new message belongs to is not found", async () => {
    const message = makeMessage({
      ...validMsgData,
      conversationId: `fake-${randomInt()}`,
    });

    await expect(addMessage(message)).rejects.toThrow();
  });

  it("Should append the message to conversations messages array", async () => {
    await addMessage(validMsgData);

    expect(dbMockup.update).toBeCalledTimes(1);
    const oldConv = dbMockup.update.mock.calls[0][0];
    expect(oldConv.messages.length).toBe(0);
    const updatedConv = dbMockup.update.mock.calls[0][1];
    expect(updatedConv.id).toEqual(validMsgData.conversationId);
    expect(updatedConv.membersIds).toEqual(
      expect.arrayContaining([validMsgData.authorId])
    );
    expect(updatedConv.messages).toEqual(
      expect.arrayContaining([expect.any(Message)])
    );
  });

  it("Given no id should generate one", async () => {
    expect(genId).toBeCalledTimes(0);
    await addMessage({ ...validMsgData, id: undefined });
    expect(genId).toBeCalledTimes(1);
  });
});

function randomInt(max = 1000, min = 1) {
  return Math.round(Math.random() * max + min);
}
