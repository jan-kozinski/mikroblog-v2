import { jest } from "@jest/globals";

const dbMockup = {
  _data: [],
  findById: jest.fn((id) => {
    for (let u of dbMockup._data) {
      if (u.id === id) return Promise.resolve(u);
      else return Promise.resolve(null);
    }
  }),
  find: jest.fn((queries) => {
    let usersToReturn = dbMockup._data;
    for (let q in queries) {
      usersToReturn = usersToReturn.filter((u) => {
        return u[q] === queries[q];
      });
    }
    return Promise.resolve(usersToReturn.length ? usersToReturn : null);
  }),
  findOne: jest.fn((queries) => {
    for (let q in queries) {
      for (let u of dbMockup._data) {
        if (u[q] === queries[q]) return Promise.resolve(u);
      }
    }
    return Promise.resolve(null);
  }),
  insert: jest.fn((u) => {
    const index = dbMockup._data.push(u) - 1;
    return Promise.resolve(dbMockup._data[index]);
  }),
  update: jest.fn((record, data) => {
    let original = dbMockup.findById(record.id);
    original = {
      ...original,
      ...data,
    };
    return Promise.resolve(original);
  }),
  _RESET_DB() {
    this._data = [];
  },
};

export default dbMockup;
