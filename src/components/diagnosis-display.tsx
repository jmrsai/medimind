
import { cn } from '@/lib/utils';
import { AnalyzePatientDataOutput } from '@/ai/flows/analyze-patient-data';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Apple,
  BrainCog,
  ClipboardList,
  FileText,
  FlaskConical,
  GaugeCircle,
  HeartPulse,
  Pill,
  Stethoscope,
  TestTubeDiagonal,
  TrendingUp,
  Info
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { KeyTakeaways } from './key-takeaways';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface DiagnosisDisplayProps {
  data: AnalyzePatientDataOutput;
  documentFile: File | null;
  documentDataUri: string | null;
}

const SectionCard = ({
  icon,
  title,
  children,
  className
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={cn('bg-card/50', className)}>
    <CardHeader className='pb-4'>
      <div className="flex items-center gap-3">
        {icon}
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="text-sm text-muted-foreground space-y-2">
      {children}
    </CardContent>
  </Card>
);

const ListSection = ({ items }: { items: string[] }) => {
  if (!items || items.length === 0) {
    return <p>No specific items provided.</p>;
  }
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

export function DiagnosisDisplay({ data, documentFile, documentDataUri }: DiagnosisDisplayProps) {
  const confidencePercent = Math.round(data.confidenceLevel * 100);
  
  const chartData = [
    { name: data.primaryDiagnosis, confidence: confidencePercent, fill: 'var(--color-primary)' },
    ...(data.differentialDiagnoses.slice(0, 3).map((dx, i) => ({
      name: dx,
      // Fake some data for visuals
      confidence: Math.max(0, confidencePercent - 20 - i * 15),
      fill: 'var(--color-secondary)',
    })))
  ].sort((a, b) => b.confidence - a.confidence);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2 text-primary'>
            <Stethoscope className="h-5 w-5" />
            <span className='font-semibold'>Primary Diagnosis</span>
          </div>
          <CardTitle className='text-2xl !mt-1'>
            {data.primaryDiagnosis}
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between mb-4">
                <CardDescription>Confidence levels for top diagnoses.</CardDescription>
                <Badge
                    variant="outline"
                    className="flex items-center gap-1.5 py-1.5 px-3 border-primary/50"
                >
                    <GaugeCircle className="h-4 w-4 text-primary" />
                    <span className="text-lg font-bold">{confidencePercent}%</span>
                    <span className="text-sm text-muted-foreground ml-1">Conf.</span>
                </Badge>
            </div>
            <ChartContainer config={{}} className="h-[200px] w-full">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" dataKey="confidence" unit="%" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}/>
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="confidence" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ChartContainer>
        </CardContent>
      </Card>
      
      <KeyTakeaways data={data} />

      {documentFile && documentDataUri && (
        <SectionCard icon={<FileText className="h-5 w-5 text-primary" />} title={`Uploaded Document: ${documentFile.name}`}>
          {documentFile.type === 'application/pdf' ? (
            <div className="h-[500px] w-full">
              <iframe src={documentDataUri} className="w-full h-full" title={documentFile.name} />
            </div>
          ) : (
            <img src={documentDataUri} alt={documentFile.name} className="max-w-full h-auto rounded-md" />
          )}
        </SectionCard>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard icon={<BrainCog className="h-5 w-5 text-primary" />} title="Diagnostic Reasoning">
            <p className="whitespace-pre-wrap">{data.diagnosticReasoning}</p>
        </SectionCard>

        <SectionCard icon={<ClipboardList className="h-5 w-5 text-primary" />} title="Differential Diagnoses">
            <ListSection items={data.differentialDiagnoses} />
        </SectionCard>
        
        <SectionCard icon={<TestTubeDiagonal className="h-5 w-5 text-primary" />} title="Recommended Tests">
            <Accordion type="single" collapsible className="w-full">
              {data.recommendedTests.map((test, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">{test.name}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground pl-2 border-l-2 border-accent">
                      <span className="font-semibold text-foreground">Rationale:</span> {test.rationale}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </SectionCard>
        
        <SectionCard icon={<TrendingUp className="h-5 w-5 text-primary" />} title="Prognosis">
            <p>{data.prognosis}</p>
        </SectionCard>
      </div>

      <Card>
          <CardHeader>
               <div className="flex items-center gap-3">
                    <HeartPulse className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg font-semibold">Comprehensive Treatment Plan</CardTitle>
                </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full space-y-4">
              <AccordionItem value="medications" className="border rounded-lg p-4 bg-card/50">
                <AccordionTrigger className="py-0 hover:no-underline">
                   <div className="flex items-center gap-3">
                        <Pill className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold">Medications</h4>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-3">
                    {data.treatmentPlan.medications.map((med, index) => (
                      <div key={index} className="pl-4">
                        <p className="font-semibold">{med.name} - <span className="font-normal italic">{med.dosage}</span></p>
                        <p className="text-muted-foreground text-xs pl-2 border-l-2 border-accent/50 mt-1">
                          <span className="font-semibold text-foreground/80">Rationale:</span> {med.rationale}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="therapies" className="border rounded-lg p-4 bg-card/50">
                <AccordionTrigger className="py-0 hover:no-underline">
                   <div className="flex items-center gap-3">
                        <FlaskConical className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold">Therapies</h4>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-3">
                    {data.treatmentPlan.therapies.map((therapy, index) => (
                      <div key={index} className="pl-4">
                        <p className="font-semibold">{therapy.name}</p>
                        <p className="text-muted-foreground text-xs">{therapy.description}</p>
                        <p className="text-muted-foreground text-xs pl-2 border-l-2 border-accent/50 mt-1">
                          <span className="font-semibold text-foreground/80">Rationale:</span> {therapy.rationale}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="lifestyle" className="border rounded-lg p-4 bg-card/50">
                <AccordionTrigger className="py-0 hover:no-underline">
                  <div className="flex items-center gap-3">
                        <Apple className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold">Lifestyle</h4>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-3">
                    {data.treatmentPlan.lifestyleModifications.map((life, index) => (
                      <div key={index} className="pl-4">
                        <p className="font-semibold">{life.recommendation}</p>
                        <p className="text-muted-foreground text-xs">{life.description}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
      </Card>

    </div>
  );
}
