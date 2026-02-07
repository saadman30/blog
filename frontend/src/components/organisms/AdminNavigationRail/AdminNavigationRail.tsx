'use client';

import type { ReactNode } from 'react';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, FileText, PenSquare, Settings } from 'lucide-react';

import styles from './AdminNavigationRail.module.scss';

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/app/write',
    label: 'Write',
    icon: <PenSquare aria-hidden />
  },
  {
    href: '/app/posts',
    label: 'Posts',
    icon: <FileText aria-hidden />
  },
  {
    href: '/app/insights',
    label: 'Insights',
    icon: <BarChart3 aria-hidden />
  },
  {
    href: '/app/settings',
    label: 'Settings',
    icon: <Settings aria-hidden />
  }
];

const AdminNavigationRail = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.root} aria-label="Writer app navigation">
      <ul className={styles.list}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            !!pathname?.startsWith(`${item.href}/`);

          const linkClassName = isActive ? styles.linkActive : styles.link;

          return (
            <li key={item.href} className={styles.item}>
              <NextLink
                href={item.href}
                aria-label={item.label}
                className={linkClassName}
              >
                {item.icon}
              </NextLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AdminNavigationRail;

