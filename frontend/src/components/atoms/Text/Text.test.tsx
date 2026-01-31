import { render, screen } from "@testing-library/react";
import Text from "./Text";

describe("Text", () => {
  it("renders children", () => {
    render(<Text>Hello world</Text>);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders as p by default", () => {
    render(<Text>Paragraph</Text>);
    const el = screen.getByText("Paragraph");
    expect(el.tagName).toBe("P");
  });

  it("renders as span when as=span", () => {
    render(<Text as="span">Inline</Text>);
    expect(screen.getByText("Inline").tagName).toBe("SPAN");
  });

  it("renders as div when as=div", () => {
    render(<Text as="div">Block</Text>);
    expect(screen.getByText("Block").tagName).toBe("DIV");
  });

  it("renders with color muted", () => {
    render(<Text color="muted">Muted text</Text>);
    expect(screen.getByText("Muted text")).toBeInTheDocument();
  });

  it("renders with size lg", () => {
    render(<Text size="lg">Large text</Text>);
    expect(screen.getByText("Large text")).toBeInTheDocument();
  });

  it("renders with weight bold", () => {
    render(<Text weight="bold">Bold text</Text>);
    expect(screen.getByText("Bold text")).toBeInTheDocument();
  });

  it("renders with italic", () => {
    render(<Text italic>Italic text</Text>);
    expect(screen.getByText("Italic text")).toBeInTheDocument();
  });

  it("renders with all props combined", () => {
    render(
      <Text color="primary" size="xl" weight="semibold" italic as="span">
        Styled
      </Text>
    );
    expect(screen.getByText("Styled")).toBeInTheDocument();
  });
});
