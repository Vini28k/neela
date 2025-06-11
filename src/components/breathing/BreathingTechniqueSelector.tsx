import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreathingTechnique } from '@/data/breathingTechniques';

interface BreathingTechniqueSelectorProps {
  selectedTechnique: BreathingTechnique;
  techniques: BreathingTechnique[];
  onTechniqueChange: (techniqueId: string) => void;
  isDarkMode?: boolean;
}

const BreathingTechniqueSelector = ({ 
  selectedTechnique, 
  techniques, 
  onTechniqueChange, 
  isDarkMode 
}: BreathingTechniqueSelectorProps) => {
  return (
    <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
      <CardHeader>
        <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          🎯 Choose Your Technique
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {techniques.map((technique) => (
            <Button
              key={technique.id}
              onClick={() => onTechniqueChange(technique.id)}
              variant={selectedTechnique.id === technique.id ? "default" : "outline"}
              className={`p-4 h-auto text-left justify-start ${
                selectedTechnique.id === technique.id 
                  ? '' 
                  : isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : ''
              }`}
              style={{
                backgroundColor: selectedTechnique.id === technique.id ? technique.color : undefined
              }}
            >
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center justify-between w-full mb-2">
                  <h4 className="font-semibold">{technique.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${
                    technique.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    technique.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {technique.difficulty}
                  </span>
                </div>
                <p className="text-sm opacity-90 mb-2">{technique.description}</p>
                <div className="text-xs opacity-75">
                  Pattern: {technique.pattern.inhale}-{technique.pattern.hold}-{technique.pattern.exhale}
                  {technique.pattern.pause ? `-${technique.pattern.pause}` : ''} • {technique.duration} min
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingTechniqueSelector;