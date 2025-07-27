import { AnalyzePatientDataOutput } from "@/ai/flows/analyze-patient-data";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Lightbulb, Pill, Stethoscope, TestTubeDiagonal } from "lucide-react";

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
            <Stethoscope className="w-8 h-8 mb-2 text-accent" />
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
