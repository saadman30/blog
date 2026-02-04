import { render, screen } from "@testing-library/react";

import type { AdminSettings } from "@/lib/types";

import SettingsScreen from "./SettingsScreen";

const settings: AdminSettings = {
  seoDefaults: {
    defaultTitleSuffix: "• Example",
    defaultDescription: "Example description",
    defaultOgImageUrl: "https://example.com/og.png"
  },
  authorName: "Author",
  authorBio: "Bio",
  integrations: {
    rssEnabled: true,
    emailDigestEnabled: false
  }
};

describe("SettingsScreen", () => {
  it("renders settings sections", () => {
    render(<SettingsScreen settings={settings} />);

    expect(
      screen.getByText(/seo defaults/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/author/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/integrations/i)
    ).toBeInTheDocument();
  });
});

