import { rest } from "msw";

export const handlers = [
  rest.get("/api/post", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body({
        success: true,
        payload: [
          {
            id: "dasdsadasd",
            authorId: "dsafdsf",
            content: "this is a test post",
          },
        ],
      })
    );
  }),
];
