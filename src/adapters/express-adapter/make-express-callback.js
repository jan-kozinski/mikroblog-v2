export default function makeExpressCallback(controller) {
  return async (req, res) => {
    const httpRequest = {
      body: req.body,
      cookies: req.cookies,
      query: req.query,
      params: req.params,
      method: req.method,
      path: req.path,
      headers: {
        "Content-Type": req.get("Content-Type"),
      },
    };
    try {
      const httpResponse = await controller(httpRequest);

      if (httpResponse.headers) {
        res.set(httpResponse.headers);
      }
      extractCookies(httpResponse, res);
      res.type("json");
      res.status(httpResponse.statusCode).send(httpResponse.body);
    } catch (e) {
      console.error(e);
      res.status(500).send({ error: "An unkown error occurred." });
    }
  };
}

function extractCookies(httpRes, expressRes) {
  const { cookies } = httpRes.body;
  if (cookies) {
    for (const c in cookies) {
      expressRes.cookie(c, cookies[c], { httpOnly: true });
    }
    delete httpRes.body.cookies;
  }
}
