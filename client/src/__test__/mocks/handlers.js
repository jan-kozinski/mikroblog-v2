import { rest } from "msw";
import {
  authUserEndpoint,
  commentsEndpoint,
  postsEndpoint,
} from "../../constants/api-endpoints";

export const handlers = [
  rest.get(postsEndpoint, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body({
        success: true,
        payload: [
          {
            id: `id-${Math.round(Math.random() * 1000)}`,
            authorId: `id-${Math.round(Math.random() * 1000)}`,
            author: "test-user",
            content: "this is a test post",
            likesCount: "0",
            likersIds: [],
            comments: [],
            commentsTotal: 0,
            createdAt: new Date(),
            modifiedAt: new Date(),
          },
        ],
      })
    );
  }),

  rest.post(postsEndpoint, (req, res, ctx) => {
    if (!req.body.content)
      return res(
        ctx.status(400),
        ctx.body({
          success: false,
          error: "Content must be provided",
        })
      );
    return res(
      ctx.status(201),
      ctx.body({
        success: true,
        payload: {
          id: `id-${Math.round(Math.random() * 1000)}`,
          author: "test-user",
          content: req.body.content,
          likesCount: "0",
          likersIds: [],
          comments: [],
          commentsTotal: 0,
          createdAt: new Date(),
          modifiedAt: new Date(),
        },
      })
    );
  }),

  rest.put(`${postsEndpoint}/:postId`, (req, res, ctx) => {
    if (!req.body.content)
      return res(
        ctx.status(400),
        ctx.body({
          success: false,
          error: "Content must be provided",
        })
      );

    return res(
      ctx.status(201),
      ctx.body({
        success: true,
        payload: {
          id: req.params.postId,
          author: "test-user",
          content: req.body.content,
          createdAt: new Date(Date.now() - 100000),
          modifiedAt: new Date(),
        },
      })
    );
  }),

  rest.delete(`${postsEndpoint}/:postId`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body({
        success: true,
      })
    );
  }),

  rest.post(`${postsEndpoint}/:postId/likes`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.body({
        success: true,
        payload: {
          likesCount: "1",
          likersIds: ["test-user"],
        },
      })
    );
  }),

  rest.delete(`${postsEndpoint}/:postId/likes`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body({
        success: true,
        payload: {
          likesCount: "0",
          likersIds: [],
        },
      })
    );
  }),

  rest.post(authUserEndpoint, (req, res, ctx) => {
    req.body = JSON.parse(req.body);
    if (
      req.body.email === "test@test.com" &&
      req.body.password === "password"
    ) {
      return res(
        ctx.status(200),
        ctx.body({
          success: true,
          payload: {
            name: "testuser123",
            email: "test@test.com",
            memberSince: new Date(),
          },
        })
      );
    } else {
      return res(
        ctx.status(401),
        ctx.body({
          success: false,
          error: "Invalid credentials",
        })
      );
    }
  }),
  rest.post(authUserEndpoint + "/session", (req, res, ctx) => {
    return res(
      ctx.status(401),
      ctx.body({
        success: false,
        error: "Session timed out",
      })
    );
  }),
  rest.get(commentsEndpoint + "/:originalPostId", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body({
        success: true,
        payload: [
          {
            id: "dasdsadasd",
            authorId: `id-${Math.round(Math.random() * 1000)}`,
            originalPostId: req.params.originalPostId,
            author: "test-user",
            content: "this is a test comment",
            likesCount: "0",
            likersIds: [],
            createdAt: new Date(),
            modifiedAt: new Date(),
          },
        ],
      })
    );
  }),
  rest.post(commentsEndpoint + "/:originalPostId", (req, res, ctx) => {
    if (!req.body.content)
      return res(
        ctx.status(400),
        ctx.body({
          success: false,
          error: "Content must be provided",
        })
      );
    return res(
      ctx.status(201),
      ctx.body({
        success: true,
        payload: {
          id: `id-${Math.round(Math.random() * 1000)}`,
          originalPostId: req.params.originalPostId,
          author: "test-user",
          content: req.body.content,
          likesCount: "0",
          likersIds: [],
          createdAt: new Date(),
          modifiedAt: new Date(),
        },
      })
    );
  }),
  rest.put(`${commentsEndpoint}/:commentId`, (req, res, ctx) => {
    if (!req.body.content)
      return res(
        ctx.status(400),
        ctx.body({
          success: false,
          error: "Content must be provided",
        })
      );

    return res(
      ctx.status(201),
      ctx.body({
        success: true,
        payload: {
          id: req.params.commentId,
          content: req.body.content,
          createdAt: new Date(Date.now() - 100000),
          modifiedAt: new Date(),
        },
      })
    );
  }),
  rest.post(`${commentsEndpoint}/:commentId/likes`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.body({
        success: true,
        payload: {
          likesCount: "1",
          likersIds: ["test-user"],
        },
      })
    );
  }),

  rest.delete(`${commentsEndpoint}/:commentId/likes`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body({
        success: true,
        payload: {
          likesCount: "0",
          likersIds: [],
        },
      })
    );
  }),
  rest.delete(`${commentsEndpoint}/:commentId`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body({
        success: true,
        payload: {
          isDeleted: "true",
          content: "deleted",
        },
      })
    );
  }),
];
