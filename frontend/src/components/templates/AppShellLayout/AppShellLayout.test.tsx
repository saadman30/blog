import { render, screen } from "@testing-library/react";

import AppShellLayout from "./AppShellLayout";

describe("AppShellLayout", () => {
  it("renders children inside main region", () => {
    render(
      <AppShellLayout>
        <p>Writer content</p>
      </AppShellLayout>
    );

    expect(
      screen.getByText("Writer content")
    ).toBeInTheDocument();
  });
});

