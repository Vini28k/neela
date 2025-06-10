import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Calendar, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WeatherPatterns = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const mockData = {
    week: {
      averageStress: 32,
      calmPeriods: 18,
      stormWarnings: 3,
      patterns: [
        { day: 'Mon', stress: 25, calm: 75 },
        { day: 'Tue', stress: 45, calm: 55 },
        { day: 'Wed', stress: 20, calm: 80 },
        { day: 'Thu', stress: 60, calm: 40 },
        { day: 'Fri', stress: 35, calm: 65 },
        { day: 'Sat', stress: 15, calm: 85 },
        { day: 'Sun', stress: 10, calm: 90 },
      ]
    }
  };

  const data = mockData[selectedPeriod as keyof typeof mockData];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="flex items-center gap-4 px-6 py-4">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Weather Patterns</h1>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {['day', 'week', 'month'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="capitalize"
            >
              {period}
            </Button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Average Stress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{data.averageStress}%</div>
              <p className="text-sm text-green-600">↓ 5% from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Calm Periods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{data.calmPeriods}</div>
              <p className="text-sm text-green-600">↑ 3 from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Storm Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{data.stormWarnings}</div>
              <p className="text-sm text-orange-600">→ Same as last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Pattern Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Weekly Weather Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.patterns.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium text-slate-600">
                    {day.day}
                  </div>
                  <div className="flex-1 flex rounded-lg overflow-hidden h-8">
                    <div 
                      className="bg-red-200 flex items-center justify-center text-xs font-medium text-red-800"
                      style={{ width: `${day.stress}%` }}
                    >
                      {day.stress > 20 && `${day.stress}%`}
                    </div>
                    <div 
                      className="bg-green-200 flex items-center justify-center text-xs font-medium text-green-800"
                      style={{ width: `${day.calm}%` }}
                    >
                      {day.calm > 20 && `${day.calm}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-200 rounded"></div>
                <span className="text-sm text-slate-600">Stress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-200 rounded"></div>
                <span className="text-sm text-slate-600">Calm</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">🌅 Morning Pattern</h4>
                <p className="text-sm text-blue-700">
                  You tend to have the calmest mornings on weekends. Consider maintaining similar routines on weekdays.
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">⚡ Stress Trigger</h4>
                <p className="text-sm text-orange-700">
                  Thursday shows consistently higher stress levels. Consider scheduling lighter activities on this day.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">🎯 Success Pattern</h4>
                <p className="text-sm text-green-700">
                  Your weekend routine creates optimal conditions for calm weather. Great work!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeatherPatterns;