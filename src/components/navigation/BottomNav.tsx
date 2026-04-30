
"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, BookOpen, User, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Descubre', icon: Compass, href: '/descubre' },
    { label: 'Biblioteca', icon: BookOpen, href: '/biblioteca' },
    { label: 'Perfil', icon: User, href: '/perfil' },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Estudio', icon: Palette, href: '/estudio' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t-2 border-pink-100 px-6 py-4 flex justify-between items-center rounded-t-[32px] shadow-[0_-8px_30px_rgba(255,68,178,0.1)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all duration-300",
              isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"
            )}
          >
            <div className={cn(
              "p-2.5 rounded-[18px] transition-all duration-500",
              isActive ? "bg-primary text-white shadow-lg shadow-primary/30 rotate-[5deg]" : "bg-transparent"
            )}>
              <Icon size={24} strokeWidth={isActive ? 3 : 2} />
            </div>
            <span className={cn("text-[9px] font-bold uppercase tracking-widest", isActive ? "opacity-100" : "opacity-60")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
