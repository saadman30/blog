'use client';

import { useState, useEffect } from "react";
import { api } from "@/lib/api/client";
import type { AdminSettings } from "@/lib/types";
import Button from "@/components/atoms/Button";
import Flex from "@/components/atoms/Flex";
import Heading from "@/components/atoms/Heading";
import Input from "@/components/atoms/Input/Input";
import Textarea from "@/components/atoms/Input/Textarea";
import Section from "@/components/atoms/Section";
import Text from "@/components/atoms/Text";

const SettingsPage = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [seoDefaults, setSeoDefaults] = useState(settings?.seoDefaults);
  const [authorName, setAuthorName] = useState(settings?.authorName);
  const [authorBio, setAuthorBio] = useState(settings?.authorBio);
  const [integrations, setIntegrations] = useState(settings?.integrations);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.getAdminSettings().then((data) => {
      setSettings(data);
      setSeoDefaults(data.seoDefaults);
      setAuthorName(data.authorName);
      setAuthorBio(data.authorBio);
      setIntegrations(data.integrations);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !settings || !seoDefaults || !authorName || !authorBio || !integrations) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      await fetch("/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          seoDefaults,
          authorName,
          authorBio,
          integrations
        })
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Section as="section" spacing="lg" ariaLabel="Writer settings">
      <form onSubmit={handleSubmit}>
        <Section as="header" spacing="none">
          <Heading level="h1">Settings</Heading>
          <Text as="p" size="sm" color="muted">
            Intentionally boring defaults. Set them once, then get back to
            writing.
          </Text>
        </Section>

        <Section as="section" variant="card" spacing="none">
          <Heading level="h2">SEO defaults</Heading>
          <Flex direction="column" gap="xs">
            <label htmlFor="seo-title-suffix">
              <Text as="span" size="sm" color="muted">
                Title suffix
              </Text>
            </label>
            <Input
              id="seo-title-suffix"
              type="text"
              value={seoDefaults.defaultTitleSuffix}
              onChange={(event) =>
                setSeoDefaults({
                  ...seoDefaults,
                  defaultTitleSuffix: event.target.value
                })
              }
            />
          </Flex>
          <Flex direction="column" gap="xs">
            <label htmlFor="seo-description">
              <Text as="span" size="sm" color="muted">
                Default description
              </Text>
            </label>
            <Textarea
              id="seo-description"
              value={seoDefaults.defaultDescription}
              onChange={(event) =>
                setSeoDefaults({
                  ...seoDefaults,
                  defaultDescription: event.target.value
                })
              }
              rows={3}
            />
          </Flex>
          <Flex direction="column" gap="xs">
            <label htmlFor="seo-og-image">
              <Text as="span" size="sm" color="muted">
                Default social image URL
              </Text>
            </label>
            <Input
              id="seo-og-image"
              type="url"
              value={seoDefaults.defaultOgImageUrl}
              onChange={(event) =>
                setSeoDefaults({
                  ...seoDefaults,
                  defaultOgImageUrl: event.target.value
                })
              }
            />
          </Flex>
        </Section>

        <Section as="section" variant="card" spacing="none">
          <Heading level="h2">Author</Heading>
          <Flex direction="column" gap="xs">
            <label htmlFor="author-name">
              <Text as="span" size="sm" color="muted">
                Name
              </Text>
            </label>
            <Input
              id="author-name"
              type="text"
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
            />
          </Flex>
          <Flex direction="column" gap="xs">
            <label htmlFor="author-bio">
              <Text as="span" size="sm" color="muted">
                Short bio
              </Text>
            </label>
            <Textarea
              id="author-bio"
              value={authorBio}
              onChange={(event) => setAuthorBio(event.target.value)}
              rows={3}
            />
          </Flex>
        </Section>

        <Section as="section" variant="card" spacing="none">
          <Heading level="h2">Integrations</Heading>
          <Flex align="center" gap="xs">
            <label htmlFor="rss-enabled">
              <Input
                id="rss-enabled"
                type="checkbox"
                checked={integrations.rssEnabled}
                onChange={(event) =>
                  setIntegrations({
                    ...integrations,
                    rssEnabled: event.target.checked
                  })
                }
              />{" "}
              <Text as="span" size="sm">
                Generate RSS feed
              </Text>
            </label>
          </Flex>
          <Flex align="center" gap="xs">
            <label htmlFor="email-digest-enabled">
              <Input
                id="email-digest-enabled"
                type="checkbox"
                checked={integrations.emailDigestEnabled}
                onChange={(event) =>
                  setIntegrations({
                    ...integrations,
                    emailDigestEnabled: event.target.checked
                  })
                }
              />{" "}
              <Text as="span" size="sm">
                Weekly email digest
              </Text>
            </label>
          </Flex>
        </Section>

        <Section as="section" variant="card" spacing="none">
          <Heading level="h2">Danger zone</Heading>
          <Text as="p" size="sm" color="muted">
            Export or remove content only when you&apos;re certain. This screen
            should never be opened by accident.
          </Text>
          <Flex as="div" justify="start" gap="sm">
            <Button type="button" variant="ghost">
              Export all content
            </Button>
          </Flex>
        </Section>

        <Flex as="footer" justify="end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save changes"}
          </Button>
        </Flex>
      </form>
    </Section>
  );
};

export default SettingsPage;

