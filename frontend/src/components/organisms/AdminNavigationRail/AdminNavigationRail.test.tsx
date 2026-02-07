import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

import AdminNavigationRail from "./AdminNavigationRail";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn()
}));

describe("AdminNavigationRail", () => {
  it("renders all navigation destinations", () => {
    (usePathname as vi.Mock).mockReturnValue("/app/write");

    render(<AdminNavigationRail />);

    expect(
      screen.getByRole("link", { name: /write/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /posts/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /insights/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /settings/i })
    ).toBeInTheDocument();
  });
});

