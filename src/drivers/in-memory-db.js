const inMemoryDb = {
  _users: [],
  findById(id) {
    return this.find({ id });
  },
  findOne(queries) {
    for (let q in queries) {
      for (let u of this._users) {
        if (u[q] === queries[q]) return u;
      }
    }
    return null;
  },
  find(queries) {
    let usersToReturn = this._users;
    for (let q in queries) {
      usersToReturn = usersToReturn.filter((u) => {
        return u[q] === queries[q];
      });
    }
    return !!usersToReturn.length ? usersToReturn : null;
  },
  insert(userData) {
    const index = this._users.push(userData) - 1;
    return this._users[index];
  },
};

export default inMemoryDb;
