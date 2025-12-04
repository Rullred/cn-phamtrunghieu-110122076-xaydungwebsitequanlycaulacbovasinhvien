import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  icon = null,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false
}) => {
  return (
    <button
      type={type}
      className={`modern-btn btn-${variant} btn-${size} ${fullWidth ? 'btn-fullwidth' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;
