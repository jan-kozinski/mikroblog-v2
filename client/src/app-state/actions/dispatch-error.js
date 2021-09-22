export default function dispatchError(error, type, dispatch, withPayload = {}) {
  const internalServerError =
    !error.response || !error.response.data || !error.response.data.error;
  dispatch({
    type,
    payload: {
      ...withPayload,
      message: internalServerError
        ? "Something went wrong..."
        : error.response.data.error,
    },
  });
}
