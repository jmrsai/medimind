
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { analyzePatientData } from '@/app/actions';
import { useAuth } from '@/hooks/use-auth';

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
import { NewWelcomeComponent } from '@/components/new-welcome-component';
import { AnalysisSkeleton } from '@/components/analysis-skeleton';
import { DiagnosisDisplay } from '@/components/diagnosis-display';

import { type AnalyzePatientDataOutput } from '@/ai/flows/analyze-patient-data';
import { AlertTriangle, FlaskConical, Loader2, Upload, X, File as FileIcon } from 'lucide-react';
import { Icons } from '@/components/icons';

const formSchema = z.object({
  patientData: z.string().optional(),
});

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalyzePatientDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentDataUri, setDocumentDataUri] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientData: '',
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Icons.logo className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a file smaller than 5MB.',
        });
        return;
      }
      setDocumentFile(file);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setDocumentDataUri(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setDocumentFile(null);
    setDocumentDataUri(null);
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.patientData && !documentFile) {
      form.setError('patientData', {
        type: 'manual',
        message: 'Please either paste patient data or upload a document.',
      });
      return;
    }
    form.clearErrors('patientData');
    
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzePatientData({ 
        patientData: values.patientData || '',
        documentDataUri: documentDataUri ?? undefined,
      });
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
                      Paste the patient's report data below or upload a document for AI analysis.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <FormField
                      control={form.control}
                      name="patientData"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Patient Data</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Patient presents with fever, cough, and shortness of breath..."
                              className="min-h-[200px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="relative my-4 flex items-center">
                      <div className="flex-grow border-t border-muted"></div>
                      <span className="flex-shrink mx-4 text-muted-foreground text-xs uppercase">Or</span>
                      <div className="flex-grow border-t border-muted"></div>
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="file-upload" className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PDF, PNG, or JPG (MAX. 5MB)</p>
                            </div>
                            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="application/pdf,image/png,image/jpeg" />
                        </label>

                        {documentFile && (
                            <div className="flex items-center justify-between p-2.5 bg-muted/50 rounded-md text-sm border">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <FileIcon className="h-5 w-5 text-primary flex-shrink-0" />
                                    <span className="font-medium truncate" title={documentFile.name}>{documentFile.name}</span>
                                </div>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={handleRemoveFile}>
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove file</span>
                                </Button>
                            </div>
                        )}
                    </div>
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
            <div id="printable-area" className="printable-area space-y-6">
              {analysis && !isLoading && <DiagnosisDisplay data={analysis} documentFile={documentFile} documentDataUri={documentDataUri} />}
            </div>
            {isLoading && <AnalysisSkeleton />}
            {error && !isLoading && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {!isLoading && !error && !analysis && <NewWelcomeComponent />}
          </div>
        </div>
      </main>
    </div>
  );
}
