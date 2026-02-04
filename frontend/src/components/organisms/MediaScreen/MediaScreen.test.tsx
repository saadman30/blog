import { render, screen } from "@testing-library/react";

import type { MediaItem } from "@/lib/types";

import MediaScreen from "./MediaScreen";

const makeItem = (overrides: Partial<MediaItem>): MediaItem => ({
  id: "1",
  url: "/image.png",
  alt: "Example image",
  type: "image",
  usageCount: 0,
  createdAt: new Date().toISOString(),
  ...overrides
});

describe("MediaScreen", () => {
  it("renders upload controls and media grid", () => {
    render(<MediaScreen items={[makeItem({})]} />);

    expect(
      screen.getByLabelText(/file/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/example image/i)
    ).toBeInTheDocument();
  });
});

