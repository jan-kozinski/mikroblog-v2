class inMemoryDb {
  #data = [];
  findById(id) {
    return this.findOne({ id });
  }
  findOne(queries) {
    // Returns first record that matches ONLY THE FIRST QUERY not all queries.
    // Won't be fixed unless necessary, because inMemoryDb is just a temporary solution used exclusively for development purposes
    for (let q in queries) {
      for (let d of this.#data) {
        if (d[q] === queries[q]) return d;
      }
    }
    return null;
  }
  find(queries) {
    let recordsToReturn = this.#data;
    for (let q in queries) {
      recordsToReturn = recordsToReturn.filter((u) => {
        return u[q] === queries[q];
      });
    }
    return !!recordsToReturn.length ? recordsToReturn : null;
  }
  insert(record) {
    const index = this.#data.push(record) - 1;
    return this.#data[index];
  }
  update(record, data) {
    let original = this.findById(record.id);
    this.#data = this.#data.map((d) => {
      if (d.id === original.id)
        return {
          ...original,
          ...data,
        };
      else return d;
    });
    original = {
      ...original,
      ...data,
    };
    return Promise.resolve(original);
  }
}

export default inMemoryDb;
