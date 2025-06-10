import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Heart, 
  Cloud, 
  Shield, 
  Activity, 
  Users,
  Brain,
  Zap,
  Target,
  ArrowRight,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  const features = [
    {
      icon: Heart,
      title: "Heart Rate Monitoring",
      description: "Connect wearable devices to track your physiological responses in real-time"
    },
    {
      icon: Cloud,
      title: "Emotional Weather Tracking",
      description: "Understand your emotional patterns with our unique weather metaphor system"
    },
    {
      icon: Brain,
      title: "Autism-Specific Tools",
      description: "Specialized features designed for autistic individuals' unique needs"
    },
    {
      icon: Zap,
      title: "Crisis Prevention",
      description: "Early warning systems to help prevent meltdowns before they occur"
    },
    {
      icon: Activity,
      title: "Breathing Exercises",
      description: "Guided breathing techniques with visual and audio support"
    },
    {
      icon: Target,
      title: "Personalized Insights",
      description: "AI-powered analysis of your patterns and triggers"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mental Weather
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
              <Link to="/auth">
                <Button>
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Your Personal{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mental Weather
              </span>{' '}
              Station
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Track your emotional climate, predict storms, and find your calm. 
              Designed specifically for autistic individuals and those who support them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Heart className="w-5 h-5 mr-2" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/explanation">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Understand Your Inner Weather
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our comprehensive platform combines cutting-edge technology with autism-specific insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="py-16 px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Tracking Your Mental Weather?
              </h2>
              <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                Join thousands of users who are already understanding their emotional patterns better
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Heart className="w-5 h-5 mr-2" />
                    Create Your Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/connect">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Activity className="w-5 h-5 mr-2" />
                    Connect Device
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Mental Weather</span>
              </div>
              <p className="text-slate-400">
                Your personal mental wellness tracking platform
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Heart Rate Monitoring</li>
                <li>Emotional Weather Tracking</li>
                <li>Crisis Prevention</li>
                <li>Breathing Exercises</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/explanation" className="hover:text-white">How It Works</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Admin</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/admin" className="hover:text-white flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Panel
                </Link></li>
                <li><Link to="/admin-setup" className="hover:text-white flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Setup
                </Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Mental Weather. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;