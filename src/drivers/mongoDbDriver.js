import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URI;
class MongoDb {
  #client;
  #collection;
  constructor(collection) {
    this.#client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.collectionName = collection;
  }
  async connect() {
    await this.#client.connect((err) => err && console.log(err));
    this.#collection = this.#client
      .db("mikroblog")
      .collection(this.collectionName);
    console.log(
      "Mongo Database connection established. Collection created: ",
      this.collectionName
    );
    return this;
  }
  close() {
    console.log("Closing MongoDb connection...");
    this.#client.close();
  }
  async findOne(queries) {
    try {
      return await this.#collection.findOne(queries);
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong...");
    }
  }
  async findById(id) {
    try {
      return await this.#collection.findOne({ _id: id });
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong...");
    }
  }
  async find(
    queries = {},
    {
      limit,
      skip,
      after,
      before,
      byNewest,
      byLikesCount,
      returnTotal,
      matchAny,
    } = {}
  ) {
    /* options: {
      limit: number, 
      skip: number,
      after: string,
      before: string,
      byNewest: boolean, 
      byLikesCount: boolean,
      returnTotal: boolean, 
      matchAny: Array[namefield: string]
      }
    */
    try {
      let searchOptions = {};

      if (byNewest === true) searchOptions.sort = [["createdAt", -1]];
      if (byLikesCount === true) searchOptions.sort = [["likesCount", -1]];

      if (typeof limit === "number") searchOptions.limit = limit;
      if (typeof skip === "number") searchOptions.skip = skip;

      if (typeof after === "string")
        queries.createdAt = { ...queries.createdAt, $gt: new Date(after) };
      if (typeof before === "string")
        queries.createdAt = { ...queries.createdAt, $lt: new Date(before) };

      if (Array.isArray(matchAny)) {
        for (let i in matchAny) {
          const field = matchAny[i];
          queries[field] = { $in: queries[field] };
        }
      }

      const cursor = await this.#collection.find(queries, searchOptions);
      const result = (await cursor.toArray()).map((r) => {
        delete r._id;
        return r;
      });

      if (returnTotal === true) {
        const totalCount = await this.#collection.find(queries).count();
        result.totalCount = totalCount;
      }
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong...");
    }
  }
  async insert(data) {
    try {
      await this.#collection.insertOne({
        ...data,
        _id: data.id,
      });
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong...");
    }
  }
  async update(record, data) {
    try {
      const original = (
        await this.#collection.findOneAndUpdate(
          { id: record.id },
          {
            $set: { ...record, ...data },
          }
        )
      ).value;
      return { ...original, _id: undefined, ...data };
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong...");
    }
  }
}
export default MongoDb;
