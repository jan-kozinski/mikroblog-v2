export default function makeListCommsByPost({ dbGateway }) {
  return async function listCommsByPost(originalPostId, options = {}) {
    if (
      !originalPostId ||
      typeof originalPostId !== "string" ||
      originalPostId.trim().length < 1
    )
      throw new Error("Original post id not supplied");
    return await dbGateway.find({ originalPostId }, options);
  };
}
