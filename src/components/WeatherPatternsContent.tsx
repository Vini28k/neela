import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Calendar, Heart, Cloud, Sun, CloudRain } from 'lucide-react';

interface WeatherPatternsContentProps {
  isDarkMode: boolean;
  cardBackground: string;
  cardBorder: string;
  primaryText: string;
  secondaryText: string;
}

const WeatherPatternsContent = ({
  isDarkMode,
  cardBackground,
  cardBorder,
  primaryText,
  secondaryText
}: WeatherPatternsContentProps) => {
  // Mock data - in real app this would come from API
  const weeklyData = [
    { day: 'Mon', weather: 'sunny', stress: 25, calm: 75, heartRate: 72 },
    { day: 'Tue', weather: 'cloudy', stress: 45, calm: 55, heartRate: 85 },
    { day: 'Wed', weather: 'sunny', stress: 20, calm: 80, heartRate: 68 },
    { day: 'Thu', weather: 'stormy', stress: 70, calm: 30, heartRate: 95 },
    { day: 'Fri', weather: 'cloudy', stress: 40, calm: 60, heartRate: 78 },
    { day: 'Sat', weather: 'sunny', stress: 15, calm: 85, heartRate: 65 },
    { day: 'Sun', weather: 'sunny', stress: 10, calm: 90, heartRate: 62 }
  ];

  const stats = {
    averageStress: 32,
    calmPeriods: 18,
    stormWarnings: 3,
    averageHeartRate: 75
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'sunny': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-4 h-4 text-gray-500" />;
      case 'stormy': return <CloudRain className="w-4 h-4 text-red-500" />;
      default: return <Sun className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTrendIcon = (value: number, comparison: number) => {
    if (value > comparison) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (value < comparison) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card style={{
          background: cardBackground,
          border: `2px solid ${cardBorder}`,
          borderRadius: '16px'
        }}>
          <CardContent style={{ padding: '16px', textAlign: 'center' }}>
            <Heart className="w-6 h-6 mx-auto mb-2" style={{ color: primaryText }} />
            <div style={{
              fontSize: '20px',
              fontWeight: 700,
              color: primaryText,
              marginBottom: '4px'
            }}>
              {stats.averageStress}%
            </div>
            <div style={{
              fontSize: '12px',
              color: secondaryText
            }}>
              Avg Stress
            </div>
            <div className="flex items-center justify-center mt-2">
              {getTrendIcon(stats.averageStress, 35)}
              <span style={{
                fontSize: '10px',
                color: stats.averageStress < 35 ? '#38a169' : '#e53e3e',
                marginLeft: '4px'
              }}>
                {stats.averageStress < 35 ? '↓ 3%' : '↑ 2%'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card style={{
          background: cardBackground,
          border: `2px solid ${cardBorder}`,
          borderRadius: '16px'
        }}>
          <CardContent style={{ padding: '16px', textAlign: 'center' }}>
            <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: primaryText }} />
            <div style={{
              fontSize: '20px',
              fontWeight: 700,
              color: primaryText,
              marginBottom: '4px'
            }}>
              {stats.calmPeriods}
            </div>
            <div style={{
              fontSize: '12px',
              color: secondaryText
            }}>
              Calm Periods
            </div>
            <div className="flex items-center justify-center mt-2">
              {getTrendIcon(stats.calmPeriods, 15)}
              <span style={{
                fontSize: '10px',
                color: stats.calmPeriods > 15 ? '#38a169' : '#e53e3e',
                marginLeft: '4px'
              }}>
                {stats.calmPeriods > 15 ? '↑ 3' : '↓ 2'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card style={{
          background: cardBackground,
          border: `2px solid ${cardBorder}`,
          borderRadius: '16px'
        }}>
          <CardContent style={{ padding: '16px', textAlign: 'center' }}>
            <CloudRain className="w-6 h-6 mx-auto mb-2" style={{ color: primaryText }} />
            <div style={{
              fontSize: '20px',
              fontWeight: 700,
              color: primaryText,
              marginBottom: '4px'
            }}>
              {stats.stormWarnings}
            </div>
            <div style={{
              fontSize: '12px',
              color: secondaryText
            }}>
              Storm Warnings
            </div>
            <div className="flex items-center justify-center mt-2">
              {getTrendIcon(stats.stormWarnings, 4)}
              <span style={{
                fontSize: '10px',
                color: stats.stormWarnings < 4 ? '#38a169' : '#e53e3e',
                marginLeft: '4px'
              }}>
                {stats.stormWarnings < 4 ? '↓ 1' : '→ Same'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card style={{
          background: cardBackground,
          border: `2px solid ${cardBorder}`,
          borderRadius: '16px'
        }}>
          <CardContent style={{ padding: '16px', textAlign: 'center' }}>
            <Heart className="w-6 h-6 mx-auto mb-2" style={{ color: primaryText }} />
            <div style={{
              fontSize: '20px',
              fontWeight: 700,
              color: primaryText,
              marginBottom: '4px'
            }}>
              {stats.averageHeartRate}
            </div>
            <div style={{
              fontSize: '12px',
              color: secondaryText
            }}>
              Avg Heart Rate
            </div>
            <div className="flex items-center justify-center mt-2">
              {getTrendIcon(stats.averageHeartRate, 78)}
              <span style={{
                fontSize: '10px',
                color: stats.averageHeartRate < 78 ? '#38a169' : '#e53e3e',
                marginLeft: '4px'
              }}>
                {stats.averageHeartRate < 78 ? '↓ 3 bpm' : '↑ 2 bpm'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Pattern Chart */}
      <Card style={{
        background: cardBackground,
        border: `2px solid ${cardBorder}`,
        borderRadius: '16px',
        marginBottom: '20px'
      }}>
        <CardHeader style={{ padding: '20px 20px 0 20px' }}>
          <CardTitle style={{
            fontSize: '16px',
            fontWeight: 700,
            color: primaryText
          }}>
            📈 Weekly Weather Pattern
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '0 20px 20px 20px' }}>
          <div className="space-y-3">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <div style={{
                  width: '40px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: secondaryText
                }}>
                  {day.day}
                </div>
                
                <div className="flex items-center gap-2">
                  {getWeatherIcon(day.weather)}
                </div>
                
                <div className="flex-1 flex rounded-lg overflow-hidden h-6">
                  <div
                    className="flex items-center justify-center text-xs font-medium"
                    style={{
                      width: `${day.stress}%`,
                      backgroundColor: '#fed7d7',
                      color: '#742a2a'
                    }}
                  >
                    {day.stress > 15 && `${day.stress}%`}
                  </div>
                  <div
                    className="flex items-center justify-center text-xs font-medium"
                    style={{
                      width: `${day.calm}%`,
                      backgroundColor: '#c6f6d5',
                      color: '#22543d'
                    }}
                  >
                    {day.calm > 15 && `${day.calm}%`}
                  </div>
                </div>
                
                <div style={{
                  width: '50px',
                  fontSize: '11px',
                  color: secondaryText,
                  textAlign: 'right'
                }}>
                  {day.heartRate} bpm
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-6 mt-4 pt-4 border-t" style={{ borderColor: cardBorder }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#fed7d7' }}></div>
              <span style={{ fontSize: '12px', color: secondaryText }}>Stress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#c6f6d5' }}></div>
              <span style={{ fontSize: '12px', color: secondaryText }}>Calm</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card style={{
        background: cardBackground,
        border: `2px solid ${cardBorder}`,
        borderRadius: '16px',
        marginBottom: '20px'
      }}>
        <CardHeader style={{ padding: '20px 20px 0 20px' }}>
          <CardTitle style={{
            fontSize: '16px',
            fontWeight: 700,
            color: primaryText
          }}>
            🔍 Pattern Insights
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '0 20px 20px 20px' }}>
          <div className="space-y-4">
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: isDarkMode ? 'rgba(56, 161, 105, 0.1)' : '#f0fff4',
              border: '2px solid #38a169'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#22543d',
                marginBottom: '8px'
              }}>
                🌅 Weekend Recovery Pattern
              </h4>
              <p style={{
                fontSize: '12px',
                color: '#2f855a',
                lineHeight: '1.4'
              }}>
                Your stress levels consistently drop on weekends. Consider incorporating weekend routines into weekdays.
              </p>
            </div>
            
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: isDarkMode ? 'rgba(237, 137, 54, 0.1)' : '#fff3e0',
              border: '2px solid #ed8936'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#c05621',
                marginBottom: '8px'
              }}>
                ⚡ Thursday Stress Spike
              </h4>
              <p style={{
                fontSize: '12px',
                color: '#dd6b20',
                lineHeight: '1.4'
              }}>
                Thursday shows consistently higher stress. Consider scheduling lighter activities or extra self-care.
              </p>
            </div>
            
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
              border: '2px solid #3b82f6'
            }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1e40af',
                marginBottom: '8px'
              }}>
              💓 Heart Rate Correlation
              </h4>
              <p style={{
                fontSize: '12px',
                color: '#2563eb',
                lineHeight: '1.4'
              }}>
                Your heart rate patterns align well with stress levels, showing good body awareness.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Period Selector */}
      <div className="flex gap-2 mb-6">
        <Button
          variant="default"
          size="sm"
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '12px'
          }}
        >
          Week
        </Button>
        <Button
          variant="outline"
          size="sm"
          style={{
            backgroundColor: cardBackground,
            borderColor: cardBorder,
            color: primaryText,
            borderRadius: '12px'
          }}
        >
          Month
        </Button>
        <Button
          variant="outline"
          size="sm"
          style={{
            backgroundColor: cardBackground,
            borderColor: cardBorder,
            color: primaryText,
            borderRadius: '12px'
          }}
        >
          3 Months
        </Button>
      </div>
    </>
  );
};

export default WeatherPatternsContent;