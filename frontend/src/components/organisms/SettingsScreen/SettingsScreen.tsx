'use client';

import { useState } from "react";

import type { AdminSettings } from "@/lib/types";
import Button from "@/components/atoms/Button";
import Flex from "@/components/atoms/Flex";
import Heading from "@/components/atoms/Heading";
import Section from "@/components/atoms/Section";
import Text from "@/components/atoms/Text";

import styles from "./SettingsScreen.module.scss";

export interface SettingsScreenProps {
  settings: AdminSettings;
}

const SettingsScreen = ({ settings }: SettingsScreenProps) => {
  const [seoDefaults, setSeoDefaults] = useState(settings.seoDefaults);
  const [authorName, setAuthorName] = useState(settings.authorName);
  const [authorBio, setAuthorBio] = useState(settings.authorBio);
  const [integrations, setIntegrations] = useState(settings.integrations);
  const [isSaving, setIsSaving] = useState(false);

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
      <form className={styles.root} onSubmit={handleSubmit}>
        <header className={styles.header}>
          <Heading level="h1">Settings</Heading>
          <Text as="p" size="sm" color="muted">
            Intentionally boring defaults. Set them once, then get back to
            writing.
          </Text>
        </header>

        <section className={styles.section}>
          <Heading level="h2">SEO defaults</Heading>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="seo-title-suffix">
              <Text as="span" size="sm" color="muted">
                Title suffix
              </Text>
            </label>
            <input
              id="seo-title-suffix"
              type="text"
              value={seoDefaults.defaultTitleSuffix}
              onChange={(event) =>
                setSeoDefaults({
                  ...seoDefaults,
                  defaultTitleSuffix: event.target.value
                })
              }
              className={styles.input}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="seo-description">
              <Text as="span" size="sm" color="muted">
                Default description
              </Text>
            </label>
            <textarea
              id="seo-description"
              value={seoDefaults.defaultDescription}
              onChange={(event) =>
                setSeoDefaults({
                  ...seoDefaults,
                  defaultDescription: event.target.value
                })
              }
              className={styles.textarea}
              rows={3}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="seo-og-image">
              <Text as="span" size="sm" color="muted">
                Default social image URL
              </Text>
            </label>
            <input
              id="seo-og-image"
              type="url"
              value={seoDefaults.defaultOgImageUrl}
              onChange={(event) =>
                setSeoDefaults({
                  ...seoDefaults,
                  defaultOgImageUrl: event.target.value
                })
              }
              className={styles.input}
            />
          </div>
        </section>

        <section className={styles.section}>
          <Heading level="h2">Author</Heading>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="author-name">
              <Text as="span" size="sm" color="muted">
                Name
              </Text>
            </label>
            <input
              id="author-name"
              type="text"
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="author-bio">
              <Text as="span" size="sm" color="muted">
                Short bio
              </Text>
            </label>
            <textarea
              id="author-bio"
              value={authorBio}
              onChange={(event) => setAuthorBio(event.target.value)}
              className={styles.textarea}
              rows={3}
            />
          </div>
        </section>

        <section className={styles.section}>
          <Heading level="h2">Integrations</Heading>
          <div className={styles.checkboxRow}>
            <label htmlFor="rss-enabled">
              <input
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
          </div>
          <div className={styles.checkboxRow}>
            <label htmlFor="email-digest-enabled">
              <input
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
          </div>
        </section>

        <section className={styles.section}>
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
        </section>

        <footer className={styles.footer}>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save changes"}
          </Button>
        </footer>
      </form>
    </Section>
  );
};

export default SettingsScreen;

