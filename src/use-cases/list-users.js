export default function makeListUsers({ dbGateway }) {
  return async function listComments() {
    return await dbGateway.find({});
  };
}
