import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  header,
  footer,
  onClick,
  variant = 'default',
  padding = 'medium',
  className = '',
  ...props 
}) => {
  const classNames = [
    'card',
    `card-${variant}`,
    `card-padding-${padding}`,
    onClick && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} onClick={onClick} {...props}>
      {(title || subtitle || header) && (
        <div className="card-header">
          {header || (
            <>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </>
          )}
        </div>
      )}
      
      <div className="card-content">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;