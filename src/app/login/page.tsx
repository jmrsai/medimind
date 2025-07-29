
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error('Error signing in with Google', error);
      // You could show a toast notification here
    }
  };
  
  if (loading || user) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
            <Icons.logo className="h-12 w-12 animate-spin text-primary" />
        </div>
      )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center p-3 mx-auto mb-4 border rounded-full bg-primary/10 w-14 h-14">
                <Icons.logo className="w-8 h-8 text-primary" />
            </div>
          <CardTitle className="text-2xl">Welcome to MediMind</CardTitle>
          <CardDescription>Sign in to access your AI diagnostic assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGoogleSignIn} className="w-full">
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 177.2 56.4l-63.1 61.9C291.5 99.6 268.9 92 248 92c-71 0-129.2 57.3-129.2 128s58.2 128 129.2 128c79.2 0 117.2-56.9 121.2-82.4H248v-68h239.4c2.6 12.7 3.9 26.1 3.9 40.8z"></path></svg>
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
