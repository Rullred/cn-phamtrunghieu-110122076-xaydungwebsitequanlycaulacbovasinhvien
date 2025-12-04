import React from 'react';
import './Card.css';

export const Card = ({ children, className = '', hover = true, gradient = false }) => {
  return (
    <div className={`modern-card ${hover ? 'hover-effect' : ''} ${gradient ? 'gradient-border' : ''} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return <div className={`card-header-modern ${className}`}>{children}</div>;
};

export const CardBody = ({ children, className = '' }) => {
  return <div className={`card-body-modern ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return <div className={`card-footer-modern ${className}`}>{children}</div>;
};

export default Card;
