'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { analyzePatientData } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Header } from '@/components/header';
import { WelcomeDisplay } from '@/components/welcome-display';
import { AnalysisSkeleton } from '@/components/analysis-skeleton';
import { DiagnosisDisplay } from '@/components/diagnosis-display';

import { type AnalyzePatientDataOutput } from '@/ai/flows/analyze-patient-data';
import { AlertTriangle, FlaskConical, Loader2 } from 'lucide-react';

const formSchema = z.object({
  patientData: z.string().min(50, {
    message: 'Patient data must be at least 50 characters long.',
  }),
});

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalyzePatientDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientData: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzePatientData({ patientData: values.patientData });
      setAnalysis(result);
    } catch (e: any) {
      const errorMessage = e.message || 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header
        isReportAvailable={!!analysis}
        onDownload={handleDownloadReport}
      />
      <main className="flex-1 container py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-8 no-print">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
                <Card className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle>Patient Report</CardTitle>
                    <CardDescription>
                      Paste the patient's report data below for AI analysis.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <FormField
                      control={form.control}
                      name="patientData"
                      render={({ field }) => (
                        <FormItem className="h-full flex flex-col">
                          <FormLabel className="sr-only">Patient Data</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Patient presents with fever, cough, and shortness of breath..."
                              className="h-full min-h-[300px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FlaskConical className="mr-2 h-4 w-4" />
                      )}
                      Analyze Data
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </div>
          <div className="flex flex-col">
            {isLoading && <AnalysisSkeleton />}
            {error && !isLoading && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {analysis && !isLoading && <DiagnosisDisplay data={analysis} />}
            {!isLoading && !error && !analysis && <WelcomeDisplay />}
          </div>
        </div>
      </main>
    </div>
  );
}
