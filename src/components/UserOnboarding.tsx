import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Shield, Activity, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserOnboardingProps {
  onComplete?: () => void;
}

const UserOnboarding = ({ onComplete }: UserOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      title: "Welcome to Your Mental Weather Station",
      icon: Heart,
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-6">🌤️</div>
          <div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">
              Understanding Your Inner Climate
            </h3>
            <p className="text-base leading-relaxed mb-8 text-slate-600">
              Just like weather outside changes, your inner emotional climate shifts throughout the day. 
              Our app helps you understand and navigate these natural patterns with personalized insights and support.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-3xl">☀️</div>
              <div className="text-left">
                <h4 className="font-semibold text-green-800">Clear Weather</h4>
                <p className="text-sm text-green-700">Calm, balanced emotional state</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="text-3xl">🌤️</div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-800">Cloudy Weather</h4>
                <p className="text-sm text-gray-600">Some stress or uncertainty</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="text-3xl">⛈️</div>
              <div className="text-left">
                <h4 className="font-semibold text-red-800">Stormy Weather</h4>
                <p className="text-sm text-red-700">High stress or overwhelming feelings</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Heart Rate Monitoring & Patterns",
      icon: Activity,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">💓</div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">
              Your Heart Tells Your Story
            </h3>
            <p className="leading-relaxed mb-6 text-slate-600">
              Your heart rate reveals patterns about your emotional weather. We use this data to provide personalized insights and early warning systems.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-blue-500">
                1
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Establish Your Baseline</h4>
                <p className="text-sm text-slate-600">Learn what's normal for your unique patterns</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-blue-500">
                2
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Predict Weather Changes</h4>
                <p className="text-sm text-slate-600">Notice patterns before you feel overwhelmed</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-blue-500">
                3
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Receive Personalized Tools</h4>
                <p className="text-sm text-slate-600">Get the right support at the right time</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg p-4 border-2 bg-orange-50 border-orange-200">
            <h4 className="font-semibold mb-2 text-orange-800">Compatible Devices</h4>
            <p className="text-sm text-orange-700">
              Polar H10, Apple Watch, Fitbit, and most Bluetooth heart rate monitors
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Autism-Specific Features",
      icon: Brain,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">
              Designed for Autistic Minds
            </h3>
            <p className="leading-relaxed mb-6 text-slate-600">
              Our platform includes specialized features designed specifically for autistic individuals and their unique sensory and emotional experiences.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg p-4 border-2 bg-purple-50 border-purple-200">
              <h4 className="font-semibold text-purple-800">🎯 Sensory Overload Detection</h4>
              <p className="text-sm mt-2 text-purple-700">
                Advanced algorithms detect patterns that may indicate sensory overwhelm before meltdowns occur
              </p>
            </div>
            <div className="rounded-lg p-4 border-2 bg-green-50 border-green-200">
              <h4 className="font-semibold text-green-800">🫁 Specialized Breathing Techniques</h4>
              <p className="text-sm mt-2 text-green-700">
                Visual and audio breathing exercises designed for autistic sensory preferences
              </p>
            </div>
            <div className="rounded-lg p-4 border-2 bg-blue-50 border-blue-200">
              <h4 className="font-semibold text-blue-800">📊 Pattern Recognition</h4>
              <p className="text-sm mt-2 text-blue-700">
                Identify triggers, safe spaces, and optimal times for different activities
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Crisis Prevention & Support",
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">
              Proactive Crisis Prevention
            </h3>
            <p className="leading-relaxed mb-6 text-slate-600">
              Our intelligent system monitors for early warning signs and provides immediate support tools when you need them most.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg p-4 border-2 bg-yellow-50 border-yellow-200">
              <h4 className="font-semibold text-yellow-800">⚡ Early Warning System</h4>
              <ul className="text-sm mt-2 space-y-1 text-yellow-700">
                <li>• Rapid heart rate changes indicating stress</li>
                <li>• Sustained elevation suggesting overwhelm</li>
                <li>• Pattern recognition for personal triggers</li>
              </ul>
            </div>
            <div className="rounded-lg p-4 border-2 bg-blue-50 border-blue-200">
              <h4 className="font-semibold text-blue-800">🎯 Immediate Support Tools</h4>
              <ul className="text-sm mt-2 space-y-1 text-blue-700">
                <li>• Guided breathing exercises</li>
                <li>• Calming sensory tools</li>
                <li>• Emergency contact options</li>
                <li>• Safe space recommendations</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg p-4 border-2 text-center bg-purple-50 border-purple-200">
            <h4 className="font-semibold mb-2 text-purple-800">🔒 Your Privacy is Protected</h4>
            <p className="text-sm text-purple-700">
              All data is encrypted and stored securely. You control what's shared and can delete everything anytime.
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (onComplete) {
        onComplete();
      } else {
        navigate('/welcome');
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-2xl bg-white/90 backdrop-blur-sm border-0">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <StepIcon className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-lg text-slate-900">
                  {currentStepData.title}
                </CardTitle>
              </div>
              <div className="text-sm text-slate-500 font-medium">
                {currentStep + 1} of {steps.length}
              </div>
            </div>
            <div className="w-full rounded-full h-2 bg-slate-200">
              <div 
                className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-600"
                style={{ 
                  width: `${((currentStep + 1) / steps.length) * 100}%`
                }}
              />
            </div>
          </CardHeader>
          
          <CardContent className="min-h-[500px] flex flex-col">
            <div className="flex-1">
              {currentStepData.content}
            </div>
            
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
              <Button
                onClick={prevStep}
                variant="outline"
                disabled={currentStep === 0}
                className="border-2 border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
              >
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserOnboarding;