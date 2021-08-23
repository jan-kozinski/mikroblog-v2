export default function makeListPosts({ dbGateway }) {
  return async function listPosts() {
    return await dbGateway.find({});
  };
}
