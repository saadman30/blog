'use client';

import { useEffect, useRef, useState } from "react";

import type { PostEditorData, PostStatus } from "@/lib/types";
import Button from "@/components/atoms/Button";
import Flex from "@/components/atoms/Flex";
import Heading from "@/components/atoms/Heading";
import Link from "@/components/atoms/Link";
import Section from "@/components/atoms/Section";
import Text from "@/components/atoms/Text";

import styles from "./WriteScreen.module.scss";

export interface WriteScreenProps {
  initialData: PostEditorData;
}

type SavingState = "idle" | "saving" | "saved" | "error";

interface SaveDraftPayload {
  id: number | null;
  title: string;
  body: string;
  slug: string;
  description: string;
  status: PostStatus;
  scheduledFor: string | null;
}

const AUTOSAVE_DEBOUNCE_MS = 800;

async function saveDraft(payload: SaveDraftPayload) {
  // Mutation endpoint is assumed to exist on the backend.
  await fetch("/admin/posts/save-draft", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

const formatTime = (date: Date) =>
  date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });

const WriteScreen = ({ initialData }: WriteScreenProps) => {
  const [title, setTitle] = useState(
    initialData.seo.title || initialData.post?.title || ""
  );
  const [body, setBody] = useState(initialData.post?.body || "");
  const [slug, setSlug] = useState(initialData.seo.slug);
  const [description, setDescription] = useState(
    initialData.seo.description || ""
  );
  const [status, setStatus] = useState<PostStatus>(initialData.status);
  const [savingState, setSavingState] = useState<SavingState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!title && !body && !description) {
      return;
    }

    setSavingState("saving");

    if (saveTimeoutRef.current != null) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        await saveDraft({
          id: initialData.post?.id ?? null,
          title,
          body,
          slug,
          description,
          status,
          scheduledFor: initialData.scheduledFor
        });
        setSavingState("saved");
        setLastSavedAt(new Date());
      } catch (error) {
        // For v1 we silently log and show a soft error state in the UI.
        // The writer should always be able to continue typing.
        // eslint-disable-next-line no-console
        console.error("Failed to autosave draft", error);
        setSavingState("error");
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimeoutRef.current != null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, body, slug, description, status, initialData.post?.id, initialData.scheduledFor]);

  const autosaveLabel =
    savingState === "saving"
      ? "Saving…"
      : savingState === "saved" && lastSavedAt
        ? `Saved at ${formatTime(lastSavedAt)}`
        : savingState === "error"
          ? "Autosave unavailable"
          : "Idle";

  const titleLength = title.trim().length;
  const descriptionLength = description.trim().length;
  const hasSlug = slug.trim().length > 0;

  const titleCheck =
    titleLength === 0
      ? "Add a clear, descriptive title."
      : titleLength < 30
        ? "Title is quite short — consider adding more context."
        : titleLength > 70
          ? "Title may be truncated in search — consider tightening it."
          : "Title length looks good.";

  const descriptionCheck =
    descriptionLength === 0
      ? "Add a one-sentence description for search and social."
      : descriptionLength < 50
        ? "Description is short — add a bit more detail."
        : descriptionLength > 160
          ? "Description is long — consider trimming for snippets."
          : "Description length looks good.";

  const slugCheck = hasSlug
    ? "Slug is set. Keep it short, lowercase, and hyphen-separated."
    : "Add a URL slug before publishing.";

  const handlePublishNow = () => {
    setStatus("published");
    // Server-side publish action will live here in a follow-up.
  };

  const handleSchedule = () => {
    setStatus("scheduled");
    // Opening a scheduler UI is intentionally deferred; v1 keeps this simple.
  };

  return (
    <Section as="section" spacing="lg" ariaLabel="Write new post">
      <div className={styles.root}>
        <div className={styles.editorColumn}>
          <Flex justify="between" align="center" gap="sm" as="header">
            <Heading level="h1">Write</Heading>
            <Text
              as="span"
              size="xs"
              color={
                savingState === "error"
                  ? "accent"
                  : savingState === "saving"
                    ? "primary"
                    : "muted"
              }
              aria-live="polite"
            >
              {autosaveLabel}
            </Text>
          </Flex>

          <div className={styles.titleField}>
            <label className={styles.label} htmlFor="post-title">
              <Text as="span" size="sm" color="muted">
                Title
              </Text>
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Start with a working title"
              className={styles.titleInput}
            />
          </div>

          <div className={styles.bodyField}>
            <label className={styles.label} htmlFor="post-body">
              <Text as="span" size="sm" color="muted">
                Markdown
              </Text>
            </label>
            <textarea
              id="post-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write in calm, focused Markdown. Preview stays in a separate tab."
              className={styles.bodyTextarea}
            />
          </div>
        </div>

        <aside className={styles.metaColumn} aria-label="Post controls and SEO">
          <section className={styles.panel}>
            <Heading level="h2">Status</Heading>
            <Text as="p" size="sm" color="muted">
              Keep this post as a draft until it feels ready. Publishing is a
              deliberate action.
            </Text>
            <div className={styles.statusRow}>
              <Text as="span" size="sm">
                Current status:
              </Text>
              <Text as="span" size="sm" color="primary" weight="medium">
                {status === "draft"
                  ? "Draft"
                  : status === "scheduled"
                    ? "Scheduled"
                    : "Published"}
              </Text>
            </div>
            <Flex direction="column" gap="sm" as="div">
              <Button type="button" onClick={handlePublishNow}>
                Publish now
              </Button>
              <Button type="button" variant="ghost" onClick={handleSchedule}>
                Schedule…
              </Button>
            </Flex>
          </section>

          <section className={styles.panel} aria-label="SEO checklist">
            <Heading level="h2">SEO checklist</Heading>
            <ul className={styles.checklist}>
              <li>
                <Text as="p" size="sm">
                  <strong>Title:</strong> {titleCheck}
                </Text>
              </li>
              <li>
                <Text as="p" size="sm">
                  <strong>Description:</strong> {descriptionCheck}
                </Text>
              </li>
              <li>
                <Text as="p" size="sm">
                  <strong>Slug:</strong> {slugCheck}
                </Text>
              </li>
            </ul>
            <div className={styles.metaField}>
              <label className={styles.label} htmlFor="post-description">
                <Text as="span" size="sm" color="muted">
                  Description
                </Text>
              </label>
              <textarea
                id="post-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className={styles.metaTextarea}
                rows={3}
              />
            </div>
            <div className={styles.metaField}>
              <label className={styles.label} htmlFor="post-slug">
                <Text as="span" size="sm" color="muted">
                  Slug
                </Text>
              </label>
              <input
                id="post-slug"
                type="text"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                className={styles.metaInput}
              />
            </div>
          </section>

          <section className={styles.panel} aria-label="Preview actions">
            <Heading level="h2">Preview</Heading>
            <Text as="p" size="sm" color="muted">
              Open a focused, read-only preview in a separate tab. Writing and
              evaluation never share the same screen.
            </Text>
            <Link
              href={initialData.previewUrl}
              variant="button"
              external
            >
              Open preview
            </Link>
          </section>
        </aside>
      </div>
    </Section>
  );
};

export default WriteScreen;

