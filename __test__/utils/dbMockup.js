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
  insert: jest.fn((u) => dbMockup._users.push(u)),
};

export default dbMockup;
