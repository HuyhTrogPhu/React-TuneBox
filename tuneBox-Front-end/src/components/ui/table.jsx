// src/components/ui/table.jsx
import React from 'react';

export const Table = ({ children }) => (
  <table className="table-auto w-full border-collapse">
    {children}
  </table>
);

export const TableHeader = ({ children }) => (
  <thead className="bg-gray-200">
    <tr>{children}</tr>
  </thead>
);

export const TableRow = ({ children }) => (
  <tr className="border-b">{children}</tr>
);

export const TableCell = ({ children }) => (
  <td className="px-4 py-2 text-left">{children}</td>
);

export const TableBody = ({ children }) => (
  <tbody>{children}</tbody>
)

export const TableHead = ({ children }) => (
  <th className="px-4 py-2 text-left">{children}</th>
)