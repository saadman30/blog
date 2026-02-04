import { render, screen } from "@testing-library/react";

import type { PostEditorData } from "@/lib/types";

import WriteScreen from "./WriteScreen";

const baseEditorData: PostEditorData = {
  post: null,
  status: "draft",
  scheduledFor: null,
  seo: {
    title: "",
    description: "",
    slug: ""
  },
  previewUrl: "/preview/example"
};

describe("WriteScreen", () => {
  it("renders title and markdown fields", () => {
    render(<WriteScreen initialData={baseEditorData} />);

    expect(
      screen.getByLabelText(/title/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/markdown/i)
    ).toBeInTheDocument();
  });

  it("renders preview link", () => {
    render(<WriteScreen initialData={baseEditorData} />);

    expect(
      screen.getByRole("link", { name: /open preview/i })
    ).toBeInTheDocument();
  });
});

