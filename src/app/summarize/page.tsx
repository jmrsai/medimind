
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnalysisSkeleton } from '@/components/analysis-skeleton';

import { type SummarizeDocumentOutput } from '@/ai/flows/summarize-document';
import { AlertTriangle, BookText, Loader2, Upload, X, File as FileIcon } from 'lucide-react';

// Mock function
const summarizeDocument = async (input: any): Promise<any> => {
  console.log("Summarization request:", input);
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Return an error or mock data
  throw new Error("AI functionality is temporarily disabled due to a dependency conflict. Please try again later.");
}

const formSchema = z.object({
  document: z.instanceof(File).optional(),
});

function SummaryDisplay({ summary, title }: { summary: string, title: string }) {
    return (
        <Card className="bg-white dark:bg-card shadow-lg">
            <CardHeader>
                <CardTitle>Summary for: {title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-wrap">{summary}</p>
            </CardContent>
        </Card>
    )
}

function Welcome() {
    return (
        <Card className="h-full border-0 shadow-none bg-transparent flex items-center justify-center">
             <div className="text-center">
                <BookText className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold mb-2">Document Summarizer</h2>
                <p className="text-muted-foreground">Upload a document to get a concise summary.</p>
            </div>
        </Card>
    )
}

export default function Page() {
  const [summary, setSummary] = useState<SummarizeDocumentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentDataUri, setDocumentDataUri] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

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
  
  const onSubmit = async () => {
    if (!documentFile) {
      toast({
          variant: 'destructive',
          title: 'No file selected',
          description: 'Please upload a document to summarize.',
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const result = await summarizeDocument({ 
        documentDataUri: documentDataUri!,
      });
      setSummary(result);
    } catch (e: any) {
      const errorMessage = e.message || 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-full grid-cols-1 gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-8 no-print">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
            <Card className="flex flex-col h-full bg-white dark:bg-card shadow-lg">
              <CardHeader>
                <CardTitle>Summarize Document</CardTitle>
                <CardDescription>
                  Upload a document to generate a concise summary.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-center">
                <div className="space-y-2">
                    <label htmlFor="file-upload" className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                            <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-md text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-sm text-muted-foreground">PDF, PNG, or JPG (MAX. 5MB)</p>
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
                <Button type="submit" disabled={isLoading || !documentFile} className="w-full" size="lg">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BookText className="mr-2 h-4 w-4" />
                  )}
                  Summarize Document
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
      <div className="flex flex-col">
        {summary && !isLoading && <SummaryDisplay summary={summary.summary} title={documentFile?.name || 'Document'} />}
        {isLoading && <AnalysisSkeleton />}
        {error && !isLoading && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && !summary && <Welcome />}
      </div>
    </div>
  );
}
