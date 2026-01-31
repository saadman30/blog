import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("renders with provided text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("supports ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button", { name: /ghost/i })).toBeInTheDocument();
  });
});

