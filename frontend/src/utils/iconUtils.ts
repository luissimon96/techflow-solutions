import React from 'react';
import { IconType } from 'react-icons';

// Utility function to cast icon types for Chakra UI compatibility
export const asChakraIcon = (icon: IconType): React.ElementType => {
  return icon as React.ElementType;
};

// Helper to create icon elements
export const createIconElement = (icon: IconType, props?: any) => {
  const IconComponent = asChakraIcon(icon);
  return React.createElement(IconComponent, props);
}; 