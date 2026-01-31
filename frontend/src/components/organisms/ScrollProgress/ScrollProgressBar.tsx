"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./ScrollProgressBar.module.scss";

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const value = Math.min(1, Math.max(0, scrollTop / total));
      setProgress(value);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    barRef.current?.style.setProperty("--scroll-progress", String(progress));
  }, [progress]);

  return (
    <div className={styles.barRoot} aria-hidden="true">
      <div ref={barRef} className={styles.bar} />
    </div>
  );
};

export default ScrollProgressBar;

