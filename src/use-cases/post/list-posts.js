export default function makeListPosts({ dbGateway }) {
  return async function listPosts(options = {}) {
    return await dbGateway.find({}, options);
  };
}
