import { AnalyzePatientDataOutput } from '@/ai/flows/analyze-patient-data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Apple,
  BrainCog,
  ClipboardList,
  GaugeCircle,
  HeartPulse,
  Pill,
  Stethoscope,
  TestTubeDiagonal,
  TrendingUp,
} from 'lucide-react';

interface DiagnosisDisplayProps {
  data: AnalyzePatientDataOutput;
}

const SectionCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="bg-background">
    <CardHeader>
      <div className="flex items-center gap-3">
        {icon}
        <CardTitle className="text-base">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground space-y-2 pl-12 pt-0">
      {children}
    </CardContent>
  </Card>
);

const ListSection = ({ items }: { items: string[] }) => {
  if (!items || items.length === 0) {
    return <p>No specific items provided.</p>;
  }
  return (
    <ul className="list-disc space-y-1 pl-4">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

export function DiagnosisDisplay({ data }: DiagnosisDisplayProps) {
  const confidencePercent = Math.round(data.confidenceLevel * 100);

  return (
    <div id="printable-area" className="space-y-6 printable-area">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Stethoscope className="h-6 w-6 text-primary" />
              <CardTitle>Primary Diagnosis</CardTitle>
            </div>
            <CardDescription className="pt-2 text-xl font-semibold text-foreground">
              {data.primaryDiagnosis}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 py-1.5 px-3"
          >
            <GaugeCircle className="h-4 w-4" />
            <span className="text-lg font-bold">{confidencePercent}%</span>
            <span className="text-sm text-muted-foreground ml-1">Conf.</span>
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Confidence Level
          </p>
          <Progress
            value={confidencePercent}
            aria-label={`${confidencePercent}% confidence`}
          />
        </CardContent>
      </Card>
      
      <Accordion type="multiple" defaultValue={['reasoning', 'treatment']} className="w-full space-y-4">
        <AccordionItem value="reasoning" className="border rounded-lg bg-card/50">
          <AccordionTrigger className="p-4 text-base font-semibold hover:no-underline">
            <div className="flex items-center gap-3">
              <BrainCog className="h-5 w-5 text-primary" />
              <span>Diagnostic Reasoning</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 text-sm text-muted-foreground">
            {data.diagnosticReasoning}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="differential" className="border rounded-lg bg-card/50">
          <AccordionTrigger className="p-4 text-base font-semibold hover:no-underline">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-primary" />
              <span>Differential Diagnoses</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 text-sm">
            <ListSection items={data.differentialDiagnoses} />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="tests" className="border rounded-lg bg-card/50">
          <AccordionTrigger className="p-4 text-base font-semibold hover:no-underline">
            <div className="flex items-center gap-3">
              <TestTubeDiagonal className="h-5 w-5 text-primary" />
              <span>Recommended Tests</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 text-sm">
            <ListSection items={data.recommendedTests} />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="treatment" className="border rounded-lg bg-card/50">
          <AccordionTrigger className="p-4 text-base font-semibold hover:no-underline">
            <div className="flex items-center gap-3">
              <HeartPulse className="h-5 w-5 text-primary" />
              <span>Treatment Plan</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 space-y-4">
            <SectionCard icon={<Pill className="h-5 w-5 text-accent" />} title="Medications">
              <ListSection items={data.treatmentPlan.medications} />
            </SectionCard>
             <SectionCard icon={<Activity className="h-5 w-5 text-accent" />} title="Therapies">
              <ListSection items={data.treatmentPlan.therapies} />
            </SectionCard>
             <SectionCard icon={<Apple className="h-5 w-5 text-accent" />} title="Lifestyle Modifications">
              <ListSection items={data.treatmentPlan.lifestyleModifications} />
            </SectionCard>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="prognosis" className="border rounded-lg bg-card/50">
          <AccordionTrigger className="p-4 text-base font-semibold hover:no-underline">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary"/>
              <span>Prognosis</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 text-sm text-muted-foreground">
            {data.prognosis}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
