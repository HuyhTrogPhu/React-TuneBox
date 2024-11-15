import React from 'react';

export function Card({ children }) {
  return <div className="card">{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="card-title">{children}</h2>;
}

export function CardContent({ children }) {
  return <div className="card-content">{children}</div>;
}
