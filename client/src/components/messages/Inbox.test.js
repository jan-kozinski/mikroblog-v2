import Inbox from "./Inbox";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "../../__test__/test-utils";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
describe("<Inbox rendering test: ", () => {
  it("Should succesfully create conversation", async () => {
    const history = createMemoryHistory();
    history.push("/inbox");
    render(
      <Router history={history}>
        <Inbox />
      </Router>,
      {
        preloadedState: {
          auth: {
            isAuthenticated: true,
            user: {
              name: "author",
              id: "123",
            },
          },
        },
      }
    );

    expect(
      await screen.queryByText(/this is a new conversation/i)
    ).not.toBeInTheDocument();

    const userSearchbar = await screen.findByLabelText("recipients");
    userEvent.click(userSearchbar);

    await userEvent.type(userSearchbar, "t", {
      delay: 1,
    });

    const searchResult = await screen.findByText(/test-user/i);
    userEvent.click(searchResult);
    expect(searchResult).not.toBeInTheDocument();
    userEvent.click(await screen.findByLabelText(/send/i));
    await screen.findByText(/this is a new conversation/i);
  });
  it("Should succesfully add a message to conversation", async () => {
    const history = createMemoryHistory();
    history.push("/inbox/c/chatid");
    render(
      <Router history={history}>
        <Inbox />
      </Router>,
      {
        preloadedState: {
          auth: {
            isAuthenticated: true,
            user: {
              name: "author",
              id: "123",
            },
          },
          chat: {
            loading: false,
            error: null,
            conversations: [
              {
                id: "chatid",
                members: ["author", "user2"],
                messages: [],
              },
            ],
          },
        },
      }
    );
    const msgTextbox = await screen.findByLabelText("message");

    expect(msgTextbox).toHaveValue("");
    await userEvent.type(msgTextbox, "hello there, friend", {
      delay: 1,
    });
    expect(msgTextbox).toHaveValue("hello there, friend");
    const submitBtn = await screen.findByLabelText("send");
    userEvent.click(submitBtn);
    expect(msgTextbox).toHaveValue("");
    screen.debug();
    await screen.findByText("hello there, friend");
  });
});
