import { jest } from "@jest/globals";

const dbMockup = {
  _users: [],
  findById: jest.fn((id) => {
    for (let u of dbMockup._users) {
      if (u.id === id) return u;
      else return null;
    }
  }),
  find: jest.fn((queries) => {
    let usersToReturn = dbMockup._users;
    for (let q in queries) {
      usersToReturn = usersToReturn.filter((u) => {
        return u[q] === queries[q];
      });
    }
    return !!usersToReturn.length ? usersToReturn : null;
  }),
  findOne: jest.fn((queries) => {
    for (let q in queries) {
      for (let u of dbMockup._users) {
        if (u[q] === queries[q]) return u;
      }
    }
    return null;
  }),
  insert: jest.fn((u) => {
    const index = dbMockup._users.push(u) - 1;
    return dbMockup._users[index];
  }),
  _RESET_DB() {
    this._users = [];
  },
};

export default dbMockup;
