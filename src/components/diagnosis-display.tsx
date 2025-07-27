
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
  FlaskConical,
  GaugeCircle,
  HeartPulse,
  Pill,
  Stethoscope,
  TestTubeDiagonal,
  TrendingUp,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { KeyTakeaways } from './key-takeaways';

interface DiagnosisDisplayProps {
  data: AnalyzePatientDataOutput;
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

export function DiagnosisDisplay({ data }: DiagnosisDisplayProps) {
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
    <div id="printable-area" className="space-y-6 printable-area">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard icon={<BrainCog className="h-5 w-5 text-primary" />} title="Diagnostic Reasoning">
            <p className="whitespace-pre-wrap">{data.diagnosticReasoning}</p>
        </SectionCard>

        <SectionCard icon={<ClipboardList className="h-5 w-5 text-primary" />} title="Differential Diagnoses">
            <ListSection items={data.differentialDiagnoses} />
        </SectionCard>
        
        <SectionCard icon={<TestTubeDiagonal className="h-5 w-5 text-primary" />} title="Recommended Tests">
            <ListSection items={data.recommendedTests} />
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
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="p-4 rounded-lg bg-card/50">
                    <div className="flex items-center gap-3 mb-2">
                        <Pill className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold">Medications</h4>
                    </div>
                    <ListSection items={data.treatmentPlan.medications} />
                </div>
                <div className="p-4 rounded-lg bg-card/50">
                    <div className="flex items-center gap-3 mb-2">
                        <FlaskConical className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold">Therapies</h4>
                    </div>
                    <ListSection items={data.treatmentPlan.therapies} />
                </div>
                <div className="p-4 rounded-lg bg-card/50">
                    <div className="flex items-center gap-3 mb-2">
                        <Apple className="h-5 w-5 text-accent" />
                        <h4 className="font-semibold">Lifestyle</h4>
                    </div>
                    <ListSection items={data.treatmentPlan.lifestyleModifications} />
                </div>
          </CardContent>
      </Card>

    </div>
  );
}
