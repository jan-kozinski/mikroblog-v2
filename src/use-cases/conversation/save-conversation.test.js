import { jest } from "@jest/globals";
import dbMockup from "../../../__test__/utils/dbMockup";
import makeSaveConversation from "./save-conversation";

describe("save conversation use case", () => {
  let validConvData, saveConversation, genId;
  beforeAll(() => {
    validConvData = {
      id: `1`,
      membersIds: [`id-${genRandomInt()}`, `id-${genRandomInt()}`],
      messages: [],
    };
    genId = jest.fn(() => "this is an id");

    saveConversation = makeSaveConversation({
      conversationsDb: dbMockup,
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
        id: `id-${genRandomInt()}`,
        membersIds: [`id-1-${genRandomInt()}`, `id-2-${genRandomInt()}`],
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
