export default function sanitizeQueries(queries) {
  const limit = parseIntOrUndefined(queries.limit);
  const skip = parseIntOrUndefined(queries.skip);

  return {
    limit,
    skip,
    after: queries.after,
    before: queries.before,
    byNewest: queries.sortby === "newest",
    byLikesCount: queries.sortby === "best",
    returnTotal: queries.countTotal === "true",
  };
}

function parseIntOrUndefined(num) {
  if (Object.is(+num, NaN)) return undefined;
  else return +num;
}
