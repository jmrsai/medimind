
'use client';

import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

type HeaderProps = {
  isReportAvailable: boolean;
  onDownload: () => void;
};

export function Header({ isReportAvailable, onDownload }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-sm no-print">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center gap-3">
          <Icons.logo className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            MediMind
          </h1>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button
            onClick={onDownload}
            disabled={!isReportAvailable}
            variant="ghost"
            className='hover:bg-primary/20'
          >
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
    </header>
  );
}
