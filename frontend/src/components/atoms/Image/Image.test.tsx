import { render, screen } from "@testing-library/react";
import Image from "./Image";

const placeholderSrc =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23eee' width='100' height='100'/%3E%3C/svg%3E";

describe("Image", () => {
  it("renders with required src and alt", () => {
    render(
      <Image src={placeholderSrc} alt="Test image" fill={false} width={100} height={100} />
    );
    const img = screen.getByRole("img", { name: "Test image" });
    expect(img).toBeInTheDocument();
  });

  it("renders wrapper with fill and aspectRatio square", () => {
    const { container } = render(
      <Image
        src={placeholderSrc}
        alt="Square image"
        fill
        aspectRatio="square"
      />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.className).toMatch(/wrapperSquare/);
  });

  it("applies radius variant", () => {
    const { container } = render(
      <Image
        src={placeholderSrc}
        alt="Rounded"
        fill={false}
        width={50}
        height={50}
        radius="default"
      />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toMatch(/radiusDefault/);
  });

  it("renders placeholder when showPlaceholder is true and src is omitted", () => {
    const { container } = render(
      <Image showPlaceholder aspectRatio="16/10" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.className).toMatch(/wrapper16x10/);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(wrapper.querySelector('[class*="placeholder"]')).toBeInTheDocument();
  });
});
