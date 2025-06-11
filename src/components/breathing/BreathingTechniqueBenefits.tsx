import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreathingTechnique } from '@/data/breathingTechniques';

interface BreathingTechniqueBenefitsProps {
  technique: BreathingTechnique;
}

const BreathingTechniqueBenefits = ({ technique }: BreathingTechniqueBenefitsProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
          ✨ Benefits of {technique.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {technique.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-green-500 mt-1">•</span>
              {benefit}
            </li>
          ))}
        </ul>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-1">Breathing Pattern</h4>
          <p className="text-blue-700 text-sm">
            Inhale for {technique.pattern.inhale} seconds, 
            hold for {technique.pattern.hold} seconds, 
            exhale for {technique.pattern.exhale} seconds
            {technique.pattern.pause ? `, pause for ${technique.pattern.pause} seconds` : ''}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingTechniqueBenefits;