import React from 'react';
import './Table.css';

const Table = ({ children, className = '', striped = false, hover = true }) => {
  return (
    <div className="table-wrapper">
      <table className={`modern-table ${striped ? 'table-striped' : ''} ${hover ? 'table-hover' : ''} ${className}`}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children }) => {
  return <thead className="table-header">{children}</thead>;
};

export const TableBody = ({ children }) => {
  return <tbody className="table-body">{children}</tbody>;
};

export const TableRow = ({ children, className = '' }) => {
  return <tr className={`table-row ${className}`}>{children}</tr>;
};

export const TableCell = ({ children, className = '', header = false }) => {
  const Tag = header ? 'th' : 'td';
  return <Tag className={`table-cell ${className}`}>{children}</Tag>;
};

export default Table;
