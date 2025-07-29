
'use client';

import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';

interface TrialLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TrialLimitDialog({ open, onOpenChange }: TrialLimitDialogProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Free Trial Limit Reached</AlertDialogTitle>
          <AlertDialogDescription>
            You have used all your free analyses. Please log in or create an account to continue using MediMind with unlimited access.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleLogin}>Login / Sign Up</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
