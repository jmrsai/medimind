import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical, Stethoscope, FileText, Bot } from 'lucide-react';

export function WelcomeDisplay() {
  return (
    <Card className="h-full border-2 border-dashed shadow-none bg-card/50">
      <CardHeader className="text-center">
        <div className="inline-flex items-center justify-center p-3 mx-auto mb-4 border rounded-full bg-primary/10 w-14 h-14">
            <Bot className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className='text-2xl'>Welcome to MediMind</CardTitle>
        <p className="pt-2 text-muted-foreground">Your AI-Powered Diagnostic Assistant</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center h-full space-y-6">
        <p className="max-w-md text-muted-foreground">
          To begin, provide patient data on the left using text or a document upload. The AI will generate a comprehensive analysis including diagnoses, treatment plans, and more.
        </p>
        <div className="grid grid-cols-1 gap-4 pt-4 text-sm md:grid-cols-3 w-full max-w-lg">
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-background">
            <FileText className="w-6 h-6 text-accent" />
            <span className='font-medium'>Input Data</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-background">
            <FlaskConical className="w-6 h-6 text-accent" />
            <span className='font-medium'>AI Analysis</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-background">
            <Stethoscope className="w-6 h-6 text-accent" />
            <span className='font-medium'>View Results</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
