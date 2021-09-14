export default function makeExpressCallback(controller) {
  return async (req, res) => {
    try {
      const httpRequest = {
        body: req.body,
        cookies: req.cookies,
        query: req.query,
        params: req.params,
        method: req.method,
        path: req.path,
        ip: req.ip,
        headers: {
          "Content-Type": req.get("Content-Type"),
        },
      };
      const httpResponse = await controller(httpRequest);

      if (httpResponse.headers) {
        res.set(httpResponse.headers);
      }
      extractCookies(httpResponse, res);
      res.type("json");
      res.status(httpResponse.statusCode).send({
        ...httpResponse.body,
        csrfToken: req.csrfToken ? req.csrfToken() : null,
      });
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .send({ success: false, error: "An unkown error occurred." });
    }
  };
}

function extractCookies(httpRes, expressRes) {
  const { cookies } = httpRes;
  if (cookies) {
    for (const c in cookies) {
      expressRes.cookie(c, cookies[c], { httpOnly: true });
    }
    delete httpRes.cookies;
  }
}
