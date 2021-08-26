import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://dzonson:dz1k1dz1k@cluster0.txqzl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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
  async find(queries) {
    try {
      const result = await this.#collection.find(queries);
      return (await result.toArray()).map((r) => {
        delete r._id;
        return r;
      });
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong...");
    }
  }
  async insert(record) {
    try {
      const result = await this.#collection.insertOne({
        ...record,
        _id: record.id,
      });

      return record;
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong...");
    }
  }
  async update(record, data) {
    try {
      return (
        await this.#collection.findOneAndUpdate(
          { id: record.id },
          {
            $set: { ...record, ...data },
          }
        )
      ).value;
    } catch (error) {
      console.error(error);
      throw new Error("Something went wrong...");
    }
  }
}
export default MongoDb;
