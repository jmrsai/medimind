
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FileText, FlaskConical, Lightbulb, Zap } from 'lucide-react';
import { Icons } from './icons';

export function NewWelcomeComponent() {
  return (
    <Card className="h-full border-2 border-dashed shadow-none bg-transparent">
        <CardHeader className='text-center'>
            <div className="inline-flex items-center justify-center p-3 mx-auto mb-4 border rounded-full bg-primary/10 w-14 h-14">
                <Icons.logo className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">MediMind Analysis</CardTitle>
            <CardDescription>Your AI-powered diagnostic partner</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full p-10 space-y-8 text-center">
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center p-4 space-y-2">
                    <FileText className="w-10 h-10 mb-2 text-primary" />
                    <h3 className="font-semibold">1. Input Data</h3>
                    <p className="text-sm text-muted-foreground">Paste a report or upload a file.</p>
                </div>
                <div className="flex flex-col items-center p-4 space-y-2">
                    <Zap className="w-10 h-10 mb-2 text-primary" />
                    <h3 className="font-semibold">2. Analyze</h3>
                    <p className="text-sm text-muted-foreground">Our AI provides instant insights.</p>
                </div>
                <div className="flex flex-col items-center p-4 space-y-2">
                    <Lightbulb className="w-10 h-10 mb-2 text-primary" />
                    <h3 className="font-semibold">3. Get Results</h3>
                    <p className="text-sm text-muted-foreground">Receive a detailed diagnostic report.</p>
                </div>
            </div>

            <div className="w-full max-w-md p-6 pt-4 border rounded-lg bg-background">
                <h4 className="mb-3 font-semibold text-center">What you'll get:</h4>
                <ul className="space-y-2 text-sm text-left text-muted-foreground">
                    <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 shrink-0" /> Primary & Differential Diagnoses</li>
                    <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 shrink-0" /> Confidence Score & Reasoning</li>
                    <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-500 shrink-0" /> Full Treatment Plan</li>
                </ul>
            </div>
        </CardContent>
    </Card>
  );
}
