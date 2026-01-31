"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";

import styles from "./RootLayoutShell.module.scss";
import { useThemeStore, hydrateInitialTheme } from "@/store/themeStore";

type Props = {
  children: ReactNode;
};

const navLinks = [
  { href: "/about", label: "Home" },
  { href: "/", label: "Blog" },
];

const RootLayoutShell = ({ children }: Props) => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    hydrateInitialTheme();
  }, []);

  return (
    <div className={styles.shell}>
      <header className={styles.header} aria-label="Site header">
        <Link href="/" className={styles.brand}>
          Minimalist Studio
        </Link>
        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={styles.navLink}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          onClick={toggleTheme}
          className={styles.themeToggle}
          aria-label={`Activate ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </header>
      <div className={styles.content}>{children}</div>
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Minimalist Studio</span>
      </footer>
    </div>
  );
};

export default RootLayoutShell;

