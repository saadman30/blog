import React from "react";
import NextImage from "next/image";
import type { ImageProps as NextImageProps } from "next/image";
import { clsx } from "clsx";

import styles from "./Image.module.scss";

/** Aspect ratio of the image wrapper when using fill. "auto" = no constraint (parent sizes). */
export type ImageAspectRatio = "square" | "16/9" | "16/10" | "auto";

/** Border radius variant. */
export type ImageRadius = "default" | "none";

/** Object fit when image fills container. */
export type ImageObjectFit = "cover" | "contain" | "fill" | "none";

export interface ImageProps
  extends Omit<NextImageProps, "className" | "style" | "src" | "alt"> {
  /** Alt text for accessibility. Omit or use "" when showPlaceholder is true. */
  alt?: string;
  /** Image source (path, static import, or URL). Omit when showPlaceholder is true. */
  src?: NextImageProps["src"];
  /**
   * When true, image fills the wrapper; use with aspectRatio for responsive layout.
   * When false, width and height are required.
   */
  fill?: boolean;
  /** Aspect ratio of the wrapper when fill is true. Ignored when fill is false. */
  aspectRatio?: ImageAspectRatio;
  /** Border radius variant. */
  radius?: ImageRadius;
  /** How the image fits inside the container when fill is true. */
  objectFit?: ImageObjectFit;
  /** Image priority (disables lazy loading). Use for LCP images. */
  priority?: boolean;
  /** Quality 1–100. Default from Next.js. */
  quality?: number | `${number}`;
  /** Responsive sizes hint. Recommended when using fill. */
  sizes?: string;
  /** Placeholder: "blur" | "empty" or data URL. */
  placeholder?: NextImageProps["placeholder"];
  /** Blur data URL when placeholder="blur". */
  blurDataURL?: string;
  /** When true and src is omitted, shows an empty-state placeholder (e.g. for cards). */
  showPlaceholder?: boolean;
}

const Image = React.forwardRef<HTMLDivElement, ImageProps>(
  (
    {
      src,
      alt = "",
      fill = true,
      aspectRatio = "auto",
      radius = "default",
      objectFit = "cover",
      priority,
      quality,
      sizes,
      placeholder,
      blurDataURL,
      showPlaceholder = false,
      width,
      height,
      ...rest
    },
    ref
  ) => {
    const aspectClass =
      aspectRatio === "square"
        ? styles.wrapperSquare
        : aspectRatio === "16/9"
          ? styles.wrapper16x9
          : aspectRatio === "16/10"
            ? styles.wrapper16x10
            : undefined;

    const radiusClass =
      radius === "default" ? styles.radiusDefault : styles.radiusNone;

    const objectFitClass =
      objectFit === "cover"
        ? styles.objectCover
        : objectFit === "contain"
          ? styles.objectContain
          : objectFit === "fill"
            ? styles.objectFill
            : styles.objectNone;

    const wrapperClassName = clsx(
      styles.wrapper,
      fill && styles.wrapperFill,
      aspectClass,
      radiusClass
    );

    const imageClassName = clsx(styles.image, objectFitClass);

    const usePlaceholderOnly = showPlaceholder && src == null;

    if (usePlaceholderOnly) {
      return (
        <div ref={ref} className={wrapperClassName} aria-hidden>
          <div className={styles.placeholder} />
        </div>
      );
    }

    const imageProps = {
      src: src!,
      alt,
      ...(fill
        ? { fill: true as const, sizes: sizes ?? "100vw" }
        : { width, height }),
      priority,
      quality,
      placeholder,
      blurDataURL,
      ...rest,
    };

    return (
      <div ref={ref} className={wrapperClassName} aria-hidden={alt === ""}>
        <NextImage {...imageProps} className={imageClassName} />
      </div>
    );
  }
);

Image.displayName = "Image";

export default Image;
