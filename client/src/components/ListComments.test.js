import ListComments from "./ListComments";
import Wall from "./layout/Wall";
import { render, screen } from "../__test__/test-utils";
import userEvent from "@testing-library/user-event";

const comments = [
  {
    id: "id-12",
    originalPostId: "op-12",
    authorId: "test-user-12",
    author: "test-user",
    content: "this is a comment",
    likesCount: 0,
    likersIds: [],
    createdAt: "2021-09-22T12:51:59.596Z",
    modifiedAt: "2021-09-22T12:51:59.596Z",
  },
];

const originalPost = {
  id: comments[0].originalPostId,
  authorId: "not-an-actual-id",
  author: "another-test-user",
  content: "this is a test post :)))",
  likesCount: 0,
  likersIds: [],
  createdAt: "2021-09-22T10:24:24.639Z",
  modifiedAt: "2021-09-22T10:24:24.639Z",
  commentsTotal: 1,
  comments,
};

it("Should show comments", async () => {
  render(
    <ListComments
      comments={comments}
      commentsTotal={1}
      originalPostId={comments[0].originalPostId}
    />
  );
  screen.getByText(comments[0].content);
  screen.getByText(comments[0].author);
});

it("Should not show Add a comment button if a user is not logged in", async () => {
  render(
    <ListComments
      comments={comments}
      commentsTotal={1}
      originalPostId={comments[0].originalPostId}
    />,
    {
      preloadedState: {
        auth: {
          isAuthenticated: false,
        },
      },
    }
  );

  expect(
    await screen.queryByLabelText(/Add a comment/i)
  ).not.toBeInTheDocument();
});

it("Should not show Add a comment button if a user is not logged in", async () => {
  render(
    <ListComments
      comments={comments}
      commentsTotal={1}
      originalPostId={comments[0].originalPostId}
    />,
    {
      preloadedState: {
        auth: {
          isAuthenticated: false,
        },
      },
    }
  );

  expect(
    await screen.queryByLabelText(/Add a comment/i)
  ).not.toBeInTheDocument();
});

it("If user is logged in, should allow him to add a comment", async () => {
  render(<Wall />, {
    preloadedState: {
      auth: {
        isAuthenticated: true,
        user: {
          name: "test-user",
          id: "test-user",
          email: "test@test.com",
        },
      },
      posts: {
        posts: [originalPost],
        loading: false,
        lastPostReached: true,
        error: null,
      },
    },
  });

  const addPostBtn = await screen.findByLabelText(/Add a comment/i);
  userEvent.click(addPostBtn);
  const commentTextbox = await screen.findByLabelText(/Write a comment/i);
  expect(commentTextbox).toHaveValue("");
  await userEvent.type(commentTextbox, "My first comment", {
    delay: 1,
  });
  expect(commentTextbox).toHaveValue("My first comment");
  const submitBtn = await screen.findByLabelText(/Save comment/i);
  userEvent.click(submitBtn);

  expect(
    await screen.queryByLabelText(/Write a comment/i)
  ).not.toBeInTheDocument();
  await screen.findByText(/my first comment/i);
});
