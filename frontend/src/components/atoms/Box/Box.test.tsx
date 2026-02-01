import { render, screen } from "@testing-library/react";
import Box from "./Box";

describe("Box", () => {
  it("renders children", () => {
    render(<Box>Inner text</Box>);
    expect(screen.getByText("Inner text")).toBeInTheDocument();
  });

  it("renders as div by default", () => {
    const { container } = render(<Box>Content</Box>);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders as custom element when as is provided", () => {
    const { container } = render(<Box as="article">Content</Box>);
    expect(container.firstChild?.nodeName).toBe("ARTICLE");
  });

  it("applies maxWidth variant via class", () => {
    const { container } = render(<Box maxWidth="prose">Content</Box>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/root--prose/);
  });
});
