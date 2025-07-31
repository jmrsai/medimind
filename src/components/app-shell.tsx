
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { BookText, FlaskConical, Download } from 'lucide-react';
import { Separator } from './ui/separator';
import { Header } from './header';

const NAV_ITEMS = [
  { href: '/', label: 'Patient Analysis', icon: FlaskConical },
  { href: '/summarize', label: 'Summarize Doc', icon: BookText },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const handleDownload = () => {
    if (pathname === '/') {
        window.print();
    } else {
        alert("No report to download on this page.");
    }
  };

  const isReportAvailable = pathname === '/';

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r bg-card md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Icons.logo className="h-7 w-7 text-primary" />
              <span className="font-headline text-xl">MediMind by JMR</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-4 text-sm font-medium">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    { 'bg-primary/10 text-primary': pathname === href }
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>
      <div className="flex flex-col">
        <Header isReportAvailable={isReportAvailable} onDownload={handleDownload} />
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
