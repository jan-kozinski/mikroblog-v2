import ListComments from "./ListComments";
import Wall from "./layout/Wall";
import { render, screen, act } from "../__test__/test-utils";
import userEvent from "@testing-library/user-event";
const comments = [
  {
    id: "id-12",
    originalPostId: "op-12",
    authorId: "test-user",
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
describe("<ListComments rendering tests: ", () => {
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

  it("Cancel button should hide the form", async () => {
    render(
      <ListComments
        comments={comments}
        commentsTotal={1}
        originalPostId={comments[0].originalPostId}
      />,
      {
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
      }
    );

    const addCommBtn = await screen.findByLabelText(/Add a comment/i);
    userEvent.click(addCommBtn);
    expect(
      await screen.queryByLabelText(/Add a comment/i)
    ).not.toBeInTheDocument();
    await screen.findByLabelText(/Write a comment/i);

    const cancelBtn = await screen.findByText(/cancel/i);
    userEvent.click(cancelBtn);

    expect(await screen.queryByText(/cancel/i)).not.toBeInTheDocument();
    expect(
      await screen.queryByLabelText(/Write a comment/i)
    ).not.toBeInTheDocument();
    await screen.findByLabelText(/Add a comment/i);
  });
});

describe("<Wall /> rendering tests", () => {
  beforeEach(async () => {
    render(<Wall />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: {
            name: comments[0].author,
            id: comments[0].authorId,
            email: "test@test.com",
          },
        },
      },
    });

    const addCommBtn = await screen.findByLabelText(/Add a comment/i);
    userEvent.click(addCommBtn);
    const addCommTextbox = await screen.findByLabelText(/Write a comment/i);
    await userEvent.type(addCommTextbox, comments[0].content, {
      delay: 1,
    });

    userEvent.click(await screen.findByLabelText(/Save comment/i));
  });

  it("If user is logged in, should allow him to add a comment", async () => {
    const addCommBtn = await screen.findByLabelText(/Add a comment/i);
    userEvent.click(addCommBtn);
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

  it("Should edit the comment", async () => {
    await screen.findByText(comments[0].content);
    const editCommBtn = await screen.findByLabelText(/start editting comment/i);
    userEvent.click(editCommBtn);
    const commentTextbox = await screen.findByLabelText(/Edit comment/i);
    expect(commentTextbox).toHaveValue(comments[0].content);
    userEvent.clear(commentTextbox);
    expect(commentTextbox).toHaveValue("");
    await userEvent.type(commentTextbox, "What a brilliant story of yours!", {
      delay: 1,
    });
    expect(commentTextbox).toHaveValue("What a brilliant story of yours!");
    const submitBtn = await screen.findByLabelText(/confirm changes/i);
    await userEvent.click(submitBtn);

    expect(
      await screen.queryByLabelText(/Edit comment/i)
    ).not.toBeInTheDocument();

    await screen.findByText(/What a brilliant story of yours!/i);
    expect(
      await screen.queryByText(comments[0].content)
    ).not.toBeInTheDocument();
  });
  it("Like button should like a comment", async () => {
    jest.useFakeTimers();
    expect(screen.queryByLabelText(/Remove like/i)).not.toBeInTheDocument();

    const likeBtn = await screen.findByLabelText(/Give comment a like/i);
    let likesCount = await screen.findByLabelText(/Comment's likes count/i);

    expect(likesCount.innerHTML).toBe("0");
    userEvent.click(likeBtn);

    const rmLikeBtn = await screen.findByLabelText(/Remove like/i);
    expect(likesCount.innerHTML).toBe("1");
    act(() => {
      jest.runAllTimers();
    });

    userEvent.click(rmLikeBtn);

    await screen.findByLabelText(/Give comment a like/i);
    expect(screen.queryByLabelText(/Remove like/i)).not.toBeInTheDocument();
    expect(likesCount.innerHTML).toBe("0");
    jest.useRealTimers();
  });
  it("Delete button click should change the post content to message that the comment has been deleted", async () => {
    const delCommBtn = await screen.findByLabelText(/delete comment/i);
    userEvent.click(delCommBtn);
    await screen.findByText(/deleted/i);
  });
});
