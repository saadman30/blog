'use client';

import { useState } from "react";

import type { MediaItem } from "@/lib/types";
import Button from "@/components/atoms/Button";
import Flex from "@/components/atoms/Flex";
import Heading from "@/components/atoms/Heading";
import Section from "@/components/atoms/Section";
import Text from "@/components/atoms/Text";

import styles from "./MediaScreen.module.scss";

export interface MediaScreenProps {
  items: MediaItem[];
}

const MediaScreen = ({ items }: MediaScreenProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file || alt.trim().length === 0) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", alt.trim());

    try {
      setIsUploading(true);
      await fetch("/admin/media", {
        method: "POST",
        body: formData
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Section as="section" spacing="lg" ariaLabel="Media library">
      <div className={styles.root}>
        <header className={styles.header}>
          <Heading level="h1">Media</Heading>
          <Text as="p" size="sm" color="muted">
            A calm place to manage images. Upload with intent, always with alt
            text.
          </Text>
        </header>

        <form className={styles.uploadForm} onSubmit={handleUpload}>
          <Flex as="div" direction="column" gap="sm">
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="media-file">
                <Text as="span" size="sm" color="muted">
                  File
                </Text>
              </label>
              <input
                id="media-file"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setFile(event.target.files ? event.target.files[0] : null)
                }
                className={styles.fileInput}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="media-alt">
                <Text as="span" size="sm" color="muted">
                  Alt text (required)
                </Text>
              </label>
              <input
                id="media-alt"
                type="text"
                value={alt}
                onChange={(event) => setAlt(event.target.value)}
                className={styles.textInput}
                placeholder="Describe the image for readers and search."
              />
            </div>
            <Button
              type="submit"
              disabled={!file || alt.trim().length === 0 || isUploading}
            >
              {isUploading ? "Uploading…" : "Upload"}
            </Button>
          </Flex>
        </form>

        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.thumbnailWrapper}>
                {/* Native img for simplicity; can be swapped for next/image if needed */}
                <img
                  src={item.url}
                  alt={item.alt}
                  className={styles.thumbnail}
                />
              </div>
              <Text as="p" size="sm" weight="medium">
                {item.alt}
              </Text>
              <Text as="span" size="xs" color="muted">
                Used in {item.usageCount}{" "}
                {item.usageCount === 1 ? "post" : "posts"}
              </Text>
            </article>
          ))}
          {items.length === 0 && (
            <Text as="p" size="sm" color="muted">
              No media yet. Start by uploading an image with thoughtful alt
              text.
            </Text>
          )}
        </div>
      </div>
    </Section>
  );
};

export default MediaScreen;

