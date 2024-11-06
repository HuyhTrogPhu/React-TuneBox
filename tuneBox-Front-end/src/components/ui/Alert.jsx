// src/components/ui/alert.jsx
import React from 'react';

export const Alert = ({ message }) => {
  return <div className="alert">{message}</div>;
};

export const AlertDescription = ({ description }) => {
  return <div className="alert-description">{description}</div>;
};

export const AlertTitle = ({ title }) => {
  return <div className="alert-title">{title}</div>;
};
