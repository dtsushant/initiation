import React, { memo } from 'react';
import { Card, Statistic } from 'antd';
import { motion } from 'framer-motion';
import { defaultVariants } from './animations';

/**
 * StatCard - A reusable animated statistic card component
 *
 * Used to display key metrics across the application with consistent styling
 * and animation behavior.
 */
export const StatCardAlt: React.FC<StatCardProps> = memo(
  ({
    title,
    value,
    precision,
    formatter,
    icon,
    className = '',
    variants = defaultVariants,
    disableAnimation = false,
    cardProps,
    statisticProps,
    onClick,
    description,
    hoverEffect = true,
  }) => {
    // Determine the appropriate wrapper based on animation settings
    const Wrapper = disableAnimation ? React.Fragment : motion.div;
    const wrapperProps = disableAnimation ? {} : { variants };

    const cardClass = `shadow-sm flex flex-col justify-between ${
      hoverEffect ? 'hover:shadow-md transition-shadow cursor-pointer' : ''
    } ${className}`;

    return (
      <Wrapper {...wrapperProps}>
        <Card className={cardClass} onClick={onClick} {...cardProps}>
          <div className="flex flex-col">
            <div className="mb-2">{icon}</div>
            <Statistic
              value={value}
              precision={precision}
              formatter={formatter}
              {...statisticProps}
            />
            <div className="mt-2 text-sm text-gray-500">{title}</div>
          </div>
          {description && (
            <div className="mt-2 text-sm text-gray-500">{description}</div>
          )}
        </Card>
      </Wrapper>
    );
  }
);

StatCardAlt.displayName = 'StatCardAlt';
