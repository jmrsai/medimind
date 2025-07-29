
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { getAnalysisHistory, AnalysisHistoryRecord } from '@/lib/firestore';

import { Header } from '@/components/header';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, History as HistoryIcon, Stethoscope } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function HistorySkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/4 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-5 w-1/4" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<AnalysisHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
          const historyData = await getAnalysisHistory(user.uid);
          setHistory(historyData);
        } catch (err: any) {
          setError('Failed to fetch analysis history.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [user]);

  if (authLoading || (!user && !error)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Icons.logo className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header isReportAvailable={false} onDownload={() => {}} />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <HistoryIcon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Analysis History</h1>
          </div>

          {loading && <HistorySkeleton />}

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && !error && history.length === 0 && (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No History Found</CardTitle>
                <CardDescription>
                  You haven't performed any analyses yet. Once you do, they will appear here.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {!loading && !error && history.length > 0 && (
            <div className="space-y-4">
              {history.map((record) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-start gap-3">
                            <Stethoscope className="w-5 h-5 mt-1 text-primary"/>
                            <span>{record.analysis.primaryDiagnosis}</span>
                        </CardTitle>
                        <CardDescription>
                            Analyzed {formatDistanceToNow(new Date(record.createdAt.seconds * 1000), { addSuffix: true })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Confidence</span>
                            <Badge variant="outline" className="font-semibold">{Math.round(record.analysis.confidenceLevel * 100)}%</Badge>
                       </div>
                    </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
