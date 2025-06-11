/**
 * Reusable action button component
 * Consolidates button patterns used throughout the app
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import type { BaseComponentProps } from '@/types';

interface ActionButtonProps extends BaseComponentProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  emoji?: string;
  onClick: () => void;
  variant?: 'default' | 'emergency' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  gradient?: string;
  textColor?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  description,
  icon: Icon,
  emoji,
  onClick,
  variant = 'default',
  size = 'medium',
  disabled = false,
  isDarkMode = false,
  gradient,
  textColor,
  className = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'emergency':
        return {
          background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
          color: 'white',
          border: '2px solid #c53030'
        };
      case 'outline':
        return {
          backgroundColor: isDarkMode ? 'rgba(26, 32, 44, 0.9)' : 'rgba(255,255,255,0.9)',
          borderColor: isDarkMode ? '#4a5568' : '#e2e8f0',
          color: isDarkMode ? '#f7fafc' : '#2d3748',
          border: '2px solid'
        };
      default:
        return {
          background: gradient || 'linear-gradient(135deg, #3182ce 0%, #2c5282 100%)',
          color: textColor || 'white',
          border: 'none'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-4 py-2 text-sm';
      case 'large':
        return 'px-8 py-6 text-lg';
      default:
        return 'px-6 py-4 text-base';
    }
  };

  const styles = getVariantStyles();

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`${getSizeClasses()} rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${className}`}
      style={styles}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Icon or Emoji */}
        {emoji && (
          <span className={size === 'large' ? 'text-4xl' : size === 'medium' ? 'text-2xl' : 'text-lg'}>
            {emoji}
          </span>
        )}
        {Icon && !emoji && (
          <Icon className={size === 'large' ? 'w-8 h-8' : size === 'medium' ? 'w-6 h-6' : 'w-4 h-4'} />
        )}
        
        {/* Title */}
        <span className="font-semibold">{title}</span>
        
        {/* Description */}
        {description && (
          <span className="text-xs opacity-80 text-center leading-tight">
            {description}
          </span>
        )}
      </div>
    </Button>
  );
};

export default ActionButton;