import React from 'react';
import './Badge.css';

const Badge = ({ children, variant = 'primary', size = 'medium', className = '' }) => {
  return (
    <span className={`modern-badge badge-${variant} badge-${size} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
