'use client';

import { useEffect, useRef, useState } from "react";
import type { PostEditorData, PostStatus } from "@/lib/types";
import Box from "@/components/atoms/Box";
import Button from "@/components/atoms/Button";
import Flex from "@/components/atoms/Flex";
import Heading from "@/components/atoms/Heading";
import Input from "@/components/atoms/Input/Input";
import Link from "@/components/atoms/Link";
import Section from "@/components/atoms/Section";
import Text from "@/components/atoms/Text";
import Textarea from "@/components/atoms/Input/Textarea";

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

const WritePageClient = ({ initialData }: { initialData: PostEditorData }) => {
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
  };

  const handleSchedule = () => {
    setStatus("scheduled");
  };

  return (
    <Section as="section" spacing="lg" ariaLabel="Write new post">
      <Flex wrap gap="lg">
        <Box maxWidth="wide" flex="grow">
          <Flex direction="column" gap="lg">
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

            <Flex direction="column" gap="xs">
              <label htmlFor="post-title">
                <Text as="span" size="sm" color="muted">
                  Title
                </Text>
              </label>
              <Input
                id="post-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Start with a working title"
              />
            </Flex>

            <Flex direction="column" gap="xs">
              <label htmlFor="post-body">
                <Text as="span" size="sm" color="muted">
                  Markdown
                </Text>
              </label>
              <Textarea
                id="post-body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Write in calm, focused Markdown. Preview stays in a separate tab."
                rows={18}
              />
            </Flex>
          </Flex>
        </Box>

        <Box maxWidth="narrow" flex="none">
          <Flex direction="column" gap="md" as="aside" aria-label="Post controls and SEO">
          <Section as="section" variant="card" spacing="none">
            <Heading level="h2">Status</Heading>
            <Text as="p" size="sm" color="muted">
              Keep this post as a draft until it feels ready. Publishing is a
              deliberate action.
            </Text>
            <Flex justify="between" align="center" gap="sm">
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
            </Flex>
            <Flex direction="column" gap="sm" as="div">
              <Button type="button" onClick={handlePublishNow}>
                Publish now
              </Button>
              <Button type="button" variant="ghost" onClick={handleSchedule}>
                Schedule…
              </Button>
            </Flex>
          </Section>

          <Section as="section" variant="card" spacing="none" aria-label="SEO checklist">
            <Heading level="h2">SEO checklist</Heading>
            <Flex direction="column" gap="xs" as="div">
              <Text as="p" size="sm">
                <strong>Title:</strong> {titleCheck}
              </Text>
              <Text as="p" size="sm">
                <strong>Description:</strong> {descriptionCheck}
              </Text>
              <Text as="p" size="sm">
                <strong>Slug:</strong> {slugCheck}
              </Text>
            </Flex>
            <Flex direction="column" gap="xs">
              <label htmlFor="post-description">
                <Text as="span" size="sm" color="muted">
                  Description
                </Text>
              </label>
              <Textarea
                id="post-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
              />
            </Flex>
            <Flex direction="column" gap="xs">
              <label htmlFor="post-slug">
                <Text as="span" size="sm" color="muted">
                  Slug
                </Text>
              </label>
              <Input
                id="post-slug"
                type="text"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
              />
            </Flex>
          </Section>

          <Section as="section" variant="card" spacing="none" aria-label="Preview actions">
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
          </Section>
          </Flex>
        </Box>
      </Flex>
    </Section>
  );
};

export default WritePageClient;
