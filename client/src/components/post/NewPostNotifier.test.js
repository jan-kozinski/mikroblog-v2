import NewPostNotifier from "./NewPostNotifier";
import { render, screen } from "../../__test__/test-utils";
import userEvent from "@testing-library/user-event";
import Wall from "../layout/Wall";

describe("<NewPostNotifier /> render tests:", () => {
  it("Should be hidden by default", async () => {
    render(<NewPostNotifier />);
    expect(await screen.queryByRole("button")).not.toBeInTheDocument();
  });
  it("Should display correctly if there are new posts that can be fetched", async () => {
    render(<NewPostNotifier />, {
      preloadedState: {
        posts: {
          postsAddedSinceLastFetch: 3,
        },
      },
    });
    await screen.findByText("3");
    await screen.findByRole("button");
  });
  it("Should fetch posts on button click", async () => {
    render(<Wall />, {
      preloadedState: {
        posts: {
          posts: [
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
          postsAddedSinceLastFetch: 3,
        },
      },
    });

    const button = await screen.findByText(/show them/i);

    await userEvent.click(button);
    await screen.findByText(/api called with &after query/i);
    expect(await screen.queryByText(/show them/i)).not.toBeInTheDocument();
  });
});
