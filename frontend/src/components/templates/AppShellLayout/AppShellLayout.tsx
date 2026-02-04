import type { ReactNode } from "react";

import AdminNavigationRail from "@/components/organisms/AdminNavigationRail";

import styles from "./AppShellLayout.module.scss";

export interface AppShellLayoutProps {
  children: ReactNode;
}

const AppShellLayout = ({ children }: AppShellLayoutProps) => {
  return (
    <div className={styles.root}>
      <aside className={styles.nav} aria-label="Writer app navigation">
        <AdminNavigationRail />
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default AppShellLayout;

