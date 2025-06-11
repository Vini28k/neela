/**
 * Consolidated weather display component
 * Replaces multiple duplicate weather-related components
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getWeatherDisplayData } from '@/utils/helpers';
import { WEATHER_CONFIG } from '@/utils/constants';
import type { BaseComponentProps, WeatherType } from '@/types';

interface WeatherCardProps extends BaseComponentProps {
  weatherType: WeatherType;
  intensity?: number;
  showQuote?: boolean;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  weatherType,
  intensity = 50,
  showQuote = false,
  showProgress = true,
  size = 'medium',
  isDarkMode = false,
  className = ''
}) => {
  const weatherData = getWeatherDisplayData(weatherType);
  const config = WEATHER_CONFIG[weatherType];
  
  const sizeClasses = {
    small: 'p-4 text-sm',
    medium: 'p-6 text-base',
    large: 'p-8 text-lg'
  };

  const iconSizes = {
    small: 'text-4xl',
    medium: 'text-6xl',
    large: 'text-8xl'
  };

  return (
    <Card 
      className={`shadow-lg border-2 ${className}`}
      style={{
        background: config.gradient,
        borderColor: 'rgba(255,255,255,0.5)'
      }}
    >
      <CardContent className={sizeClasses[size]}>
        <div className="text-center">
          {/* Weather Icon */}
          <div className={`${iconSizes[size]} mb-4`}>
            {config.emoji}
          </div>

          {/* Weather Title */}
          <h2 
            className="font-bold mb-2"
            style={{ 
              color: config.textColor,
              fontSize: size === 'large' ? '24px' : size === 'medium' ? '20px' : '16px'
            }}
          >
            {weatherData.title}
          </h2>

          {/* Weather Description */}
          <p 
            className="opacity-90 mb-4"
            style={{ color: config.textColor }}
          >
            {weatherData.description}
          </p>

          {/* Intensity Progress */}
          {showProgress && (
            <div className="mb-4">
              <div 
                className="text-center font-bold mb-2"
                style={{ color: config.textColor }}
              >
                {intensity}%
              </div>
              <div 
                className="rounded-full h-2"
                style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${intensity}%`,
                    backgroundColor: 'rgba(255,255,255,0.8)'
                  }}
                />
              </div>
            </div>
          )}

          {/* Quote */}
          {showQuote && (
            <blockquote 
              className="italic text-sm mt-4 p-3 rounded-lg border-l-4"
              style={{
                borderLeftColor: config.textColor,
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: config.textColor
              }}
            >
              "{weatherData.quote}"
            </blockquote>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;