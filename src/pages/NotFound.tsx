import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-2xl bg-white/90 backdrop-blur-sm border-0">
        <CardHeader>
          <div className="text-6xl mb-4">🌪️</div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Lost in the Weather
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-600">
            Looks like you've wandered into uncharted weather territory. 
            The page you're looking for doesn't exist.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;