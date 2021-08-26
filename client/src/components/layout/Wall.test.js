import Wall from "./Wall";
import { render, fireEvent, screen } from "../../__test__/test-utils";

it("Should load the posts", async () => {
  render(<Wall />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findByText(/this is a test post/i)).toBeInTheDocument();
});
