import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical, Stethoscope, FileText } from 'lucide-react';

export function WelcomeDisplay() {
  return (
    <Card className="h-full border-2 border-dashed shadow-none">
      <CardHeader>
        <CardTitle className='text-center'>Welcome to MediMind</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center h-full space-y-6 p-10">
        <div className="rounded-full bg-primary/20 p-4">
            <Stethoscope className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Enhanced AI Diagnosis Support</h2>
        <p className="text-muted-foreground max-w-md">
          To get started, paste a patient's report or upload a document on the left and click "Analyze Data". Our AI will provide a comprehensive report including a primary diagnosis, differential diagnoses, a detailed treatment plan, and more.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-sm w-full max-w-lg">
          <div className="flex flex-col items-center gap-2 rounded-lg border p-4 bg-background">
            <FileText className="h-6 w-6 text-accent" />
            <span className='font-medium'>Input Data</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border p-4 bg-background">
            <FlaskConical className="h-6 w-6 text-accent" />
            <span className='font-medium'>AI Analysis</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-lg border p-4 bg-background">
            <Stethoscope className="h-6 w-6 text-accent" />
            <span className='font-medium'>View Enhanced Results</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
