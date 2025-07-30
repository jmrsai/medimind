
import { Icons } from './icons';

export function LogoLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="relative flex items-center justify-center w-24 h-24">
        <div className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary/50"></div>
        <Icons.logo className="relative inline-flex w-16 h-16 text-primary" />
      </div>
      <p className="text-lg font-semibold text-muted-foreground animate-pulse">Analyzing...</p>
    </div>
  );
}
