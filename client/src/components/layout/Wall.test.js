import Wall from "./Wall";
import { render, screen } from "../../__test__/test-utils";
import userEvent from "@testing-library/user-event";

it("Should load the posts", async () => {
  render(<Wall />);
  screen.getByLabelText(/loading/i);
  await screen.findByText(/this is a test post/i);
});

describe("Add a post", () => {
  beforeEach(() => {
    render(<Wall />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          user: {
            name: "test-user",
            email: "test@test.com",
          },
        },
      },
    });
  });
  it("Should successfully add a post", async () => {
    await screen.findByText(/this is a test post/i);
    const textArea = await screen.findByRole("textbox");
    await userEvent.type(textArea, "My first post!", {
      delay: 1,
    });
    expect(textArea).toHaveValue("My first post!");

    userEvent.click(screen.getByText(/submit/i));
    expect(textArea).toHaveValue("");
    await screen.findByText(/My first post!/);
  });

  it("Should display proper error message", async () => {
    await screen.findByText(/this is a test post/i);
    const textArea = await screen.findByRole("textbox");

    expect(textArea).toHaveValue("");
    userEvent.click(screen.getByText(/submit/i));
    await screen.findByText(/Content must be provided/);
  });
});

describe("Edit post", () => {
  beforeEach(() => {
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
      },
    });
  });

  it("Should successfully edit a post", async () => {
    await screen.findByText(/this is a test post/i);
    const editBtn = await screen.findByText(/Edit O/i);

    userEvent.click(editBtn);
    const textArea = await screen.findByLabelText("Edit post");
    userEvent.clear(textArea);
    await userEvent.type(textArea, "My first post!", {
      delay: 1,
    });
    expect(textArea).toHaveValue("My first post!");
    const submitBtn = await screen.findByLabelText(/Confirm changes/i);
    userEvent.click(submitBtn);
    await screen.findByText("My first post!");
  });

  it("Should display proper error message", async () => {
    await screen.findByText(/this is a test post/i);
    const editBtn = await screen.findByText(/Edit O/i);

    userEvent.click(editBtn);
    const textArea = await screen.findByLabelText("Edit post");
    userEvent.clear(textArea);

    expect(textArea).toHaveValue("");
    const submitBtn = await screen.findByLabelText(/Confirm changes/i);
    userEvent.click(submitBtn);
    await screen.findByText("Content must be provided");
  });

  it("Should discard changes on cancel button click", async () => {
    await screen.findByText(/this is a test post/i);
    const editBtn = await screen.findByText(/Edit O/i);

    userEvent.click(editBtn);
    const textArea = await screen.findByLabelText("Edit post");
    userEvent.clear(textArea);

    expect(textArea).toHaveValue("");
    const submitBtn = await screen.findByLabelText(/Confirm changes/i);
    userEvent.click(submitBtn);
    await screen.findByText("Content must be provided");

    const cancelBtn = await screen.findByText(/Cancel/i);
    userEvent.click(cancelBtn);
    expect(textArea).not.toBeInTheDocument();
    expect(submitBtn).not.toBeInTheDocument();
    userEvent.click(await screen.findByText(/Edit O/i));
    expect(await screen.findByLabelText("Edit post")).toHaveValue(
      "this is a test post"
    );

    expect(
      await screen.queryByText("Content must be provided")
    ).not.toBeInTheDocument();
  });

  it("Should give and remove like from a post successfully", async () => {
    const likeBtn = await screen.findByLabelText(/Give post a like/i);
    const likesCount = await screen.findByLabelText(/likes count/i);
    expect(likesCount.innerHTML).toEqual("0");
    userEvent.click(likeBtn);
    await screen.findByLabelText(/Remove like/i);
    expect(likesCount.innerHTML).toEqual("1");
    expect(
      await screen.queryByLabelText(/Give post a like/i)
    ).not.toBeInTheDocument();
  });
});
