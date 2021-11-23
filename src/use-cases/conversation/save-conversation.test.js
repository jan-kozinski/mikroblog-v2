import { jest } from "@jest/globals";
import dbMockup from "../../../__test__/utils/dbMockup";
import makeSaveConversation from "./save-conversation";

describe("save conversation use case", () => {
  let validConvData, saveConversation, genId, usersDb;
  beforeAll(() => {
    validConvData = {
      id: `1`,
      membersIds: [`legit-id-${genRandomInt()}`, `legit-id-${genRandomInt()}`],
      messages: [],
    };
    genId = jest.fn(() => "this is an id");

    usersDb = {
      findById: jest.fn((id) => {
        if (id.slice(0, 5) === "legit")
          return Promise.resolve({
            id,
            name: `name-${genRandomInt()}`,
          });
        else return Promise.resolve(null);
      }),
    };

    saveConversation = makeSaveConversation({
      conversationsDb: dbMockup,
      usersDb,
      Id: { genId },
    });
  });
  beforeEach(() => {
    dbMockup._RESET_DB();
    dbMockup.insert.mockClear();
    dbMockup.find.mockClear();
    dbMockup.findById.mockClear();
    genId.mockClear();
  });

  it("Given proper input should insert the conv into database", async () => {
    expect(dbMockup.insert).toBeCalledTimes(0);

    for (let i = 0; i < 5; i++) {
      let conv = {
        id: `id-${i}-${genRandomInt()}`,
        membersIds: [
          `legit-id-1-${i}-${genRandomInt()}`,
          `legit-id-2-${i}-${genRandomInt()}`,
        ],
        messages: [],
      };
      await saveConversation(conv);
      expect(dbMockup.insert).toBeCalledTimes(i + 1);
      expect(dbMockup.insert.mock.calls[i][0]).toEqual(conv);
    }
  });

  it("Should throw an error if provided with already taken id", async () => {
    dbMockup.insert(validConvData);

    await expect(saveConversation(validConvData)).rejects.toThrow();
  });
  it("Should throw an error if members are not found in the users database", async () => {
    expect(dbMockup.insert).toBeCalledTimes(0);

    let conv = {
      id: `id-${genRandomInt()}`,
      membersIds: [`fake-1-${genRandomInt()}`, `fake-2-${genRandomInt()}`],
      messages: [],
    };

    await expect(saveConversation(conv)).rejects.toThrow();

    expect(dbMockup.insert).toBeCalledTimes(0);
  });

  it("Should return saved conv data", async () => {
    const conv = await saveConversation(validConvData);
    expect(conv).toEqual({
      id: validConvData.id,
      membersIds: validConvData.membersIds,
      messages: validConvData.messages,
    });
  });

  it("Given no id should generate one", async () => {
    expect(genId).toBeCalledTimes(0);
    await saveConversation({ ...validConvData, id: undefined });
    expect(genId).toBeCalledTimes(1);
  });
});

function genRandomInt(max = 1000, min = 1) {
  return Math.round(Math.random() * max + min);
}
