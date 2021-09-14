import Userpannel from "./Userpannel";
import { cleanup, render, screen } from "../../__test__/test-utils";
import userEvent from "@testing-library/user-event";

describe("Signin user in", () => {
  beforeEach(() => {
    render(<Userpannel />, {
      preloadedState: {
        auth: {
          isLoading: false,
        },
      },
    });
  });

  it("Should successfully login the user", async () => {
    expect(screen.getByRole("form", { hidden: true })).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
    const emailInput = screen.getByLabelText("E-mail");
    await userEvent.type(emailInput, "test@test.com", {
      delay: 1,
    });
    expect(emailInput).toHaveValue("test@test.com");

    const passwordInput = screen.getByLabelText("Password");
    await userEvent.type(passwordInput, "password", {
      delay: 1,
    });
    expect(passwordInput).toHaveValue("password");

    userEvent.click(screen.getByRole("button"));
    await screen.findByText(/loading/i);
    await screen.findByText(/testuser123/i);
  });

  it("Should inform the user of errors occuring througout the login attempt", async () => {
    let emailInput = screen.getByLabelText("E-mail");
    let passwordInput = screen.getByLabelText("Password");
    expect(emailInput).toHaveValue("");
    userEvent.click(screen.getByRole("button"));
    await screen.findByRole(/alert/i);

    cleanup();
    render(<Userpannel />, {
      preloadedState: {
        auth: {
          isLoading: false,
        },
      },
    });
    emailInput = screen.getByLabelText("E-mail");
    passwordInput = screen.getByLabelText("Password");
    await userEvent.type(emailInput, "test@test.com", {
      delay: 1,
    });
    expect(emailInput).toHaveValue("test@test.com");
    expect(passwordInput).toHaveValue("");
    userEvent.click(screen.getByRole("button"));
    await screen.findByRole(/alert/i);

    cleanup();
    render(<Userpannel />, {
      preloadedState: {
        auth: {
          isLoading: false,
        },
      },
    });
    emailInput = screen.getByLabelText("E-mail");
    passwordInput = screen.getByLabelText("Password");
    await userEvent.type(emailInput, "test@test.com", {
      delay: 1,
    });
    expect(emailInput).toHaveValue("test@test.com");
    await userEvent.type(passwordInput, "badpass", {
      delay: 1,
    });
    expect(passwordInput).toHaveValue("badpass");
    userEvent.click(screen.getByRole("button"));
    await screen.findByRole(/alert/i);
  });
});
