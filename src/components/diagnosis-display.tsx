import { AnalyzePatientDataOutput } from '@/ai/flows/analyze-patient-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, BookOpen, HeartPulse, Percent } from 'lucide-react';

interface DiagnosisDisplayProps {
  data: AnalyzePatientDataOutput;
}

export function DiagnosisDisplay({ data }: DiagnosisDisplayProps) {
  const confidencePercent = Math.round(data.confidenceLevel * 100);

  return (
    <div id="printable-area" className="space-y-6 printable-area">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Stethoscope className="h-6 w-6 text-primary" />
              <CardTitle>AI Diagnosis</CardTitle>
            </div>
            <CardDescription className="pt-2 text-base font-semibold text-foreground">{data.diagnosis}</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1.5 py-1.5 px-3">
            <Percent className="h-4 w-4" />
            <span className="text-lg font-bold">{confidencePercent}</span>
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-muted-foreground mb-2">Confidence Level</p>
          <Progress value={confidencePercent} aria-label={`${confidencePercent}% confidence`} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle>Supporting Evidence</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>{data.supportingEvidence}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <HeartPulse className="h-6 w-6 text-primary" />
            <CardTitle>Suggested Treatments</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>{data.suggestedTreatments}</p>
        </CardContent>
      </Card>
    </div>
  );
}
