import { AnalyzePatientDataOutput } from "@/ai/flows/analyze-patient-data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Lightbulb, Pill, TestTubeDiagonal } from "lucide-react";

interface KeyTakeawaysProps {
    data: AnalyzePatientDataOutput
}

export function KeyTakeaways({ data }: KeyTakeawaysProps) {
  const primaryMedication = data.treatmentPlan.medications[0];
  const primaryTest = data.recommendedTests[0];
    
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Key Takeaways</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex flex-col items-center justify-center p-4 text-center border rounded-lg bg-card/50">
            <StethoscopeIcon className="w-8 h-8 mb-2 text-accent" />
            <h4 className="font-semibold">Primary Diagnosis</h4>
            <p className="text-muted-foreground">{data.primaryDiagnosis}</p>
        </div>
        {primaryTest && (
            <div className="flex flex-col items-center justify-center p-4 text-center border rounded-lg bg-card/50">
                <TestTubeDiagonal className="w-8 h-8 mb-2 text-accent" />
                <h4 className="font-semibold">Key Test</h4>
                <p className="text-muted-foreground">{primaryTest}</p>
            </div>
        )}
        {primaryMedication && (
            <div className="flex flex-col items-center justify-center p-4 text-center border rounded-lg bg-card/50">
                <Pill className="w-8 h-8 mb-2 text-accent" />
                <h4 className="font-semibold">Top Medication</h4>
                <p className="text-muted-foreground">{primaryMedication}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

function StethoscopeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 8v5" />
      <path d="M4 13h4" />
      <path d="M10 8v5" />
      <path d="M8 13a2 2 0 0 0 2-2V5a4 4 0 0 0-8 0v6a2 2 0 0 0 2 2Z" />
      <path d="M8 3v2" />
      <path d="M16 3v2" />
      <path d="M20 13a2 2 0 0 0-2-2V5a4 4 0 1 0-8 0v6a2 2 0 0 0 2 2h0" />
      <path d="M10 13h4" />
      <circle cx="20" cy="15" r="2" />
      <circle cx="4" cy="15" r="2" />
    </svg>
  )
}
