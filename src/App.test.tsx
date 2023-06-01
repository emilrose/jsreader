import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders library link", () => {
  render(<App />);
  const libraryLink = screen.getByText(/library/i);
  expect(libraryLink).toBeInTheDocument();
});
