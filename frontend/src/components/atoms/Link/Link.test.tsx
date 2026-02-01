import { render, screen } from "@testing-library/react";
import Link from "./Link";

describe("Link", () => {
  it("renders with href and children", () => {
    render(<Link href="/about">About</Link>);
    const anchor = screen.getByRole("link", { name: /about/i });
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute("href", "/about");
  });

  it("applies external target and rel when external is true", () => {
    render(
      <Link href="https://example.com" external>
        External
      </Link>
    );
    const anchor = screen.getByRole("link", { name: /external/i });
    expect(anchor).toHaveAttribute("target", "_blank");
    expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("supports variant prop for styling", () => {
    render(
      <Link href="/" variant="brand">
        Brand
      </Link>
    );
    expect(screen.getByRole("link", { name: /brand/i })).toBeInTheDocument();
  });
});
