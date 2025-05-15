'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House } from '@phosphor-icons/react';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export function MainNav() {
  const pathname = usePathname();
  
  const navItems: NavItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: <House weight="bold" className="w-5 h-5" />
    },
    {
      label: 'Blog',
      href: '/blog',
    },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== '/' && pathname?.startsWith(item.href));
          
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              isActive 
                ? 'text-primary' 
                : 'text-muted-foreground'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
