// components/ui/Card.jsx
import React from "react";

export const Card = ({ children }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">{children}</div>
);

export const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
