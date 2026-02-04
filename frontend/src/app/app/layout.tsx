import type { ReactNode } from "react";

import AppShellLayout from "@/components/templates/AppShellLayout";

interface Props {
  children: ReactNode;
}

const AppLayout = ({ children }: Props) => {
  return <AppShellLayout>{children}</AppShellLayout>;
};

export default AppLayout;

