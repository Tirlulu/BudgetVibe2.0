import React from 'react';

/**
 * Skeleton loader for tables. Renders placeholder rows with animated shimmer.
 */
export default function TableSkeleton({ rows = 5, columns = 6 }) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="table min-w-[600px]">
        <thead>
          <tr>
            {Array.from({ length: columns }, (_, i) => (
              <th key={i}>
                <span className="inline-block h-4 w-20 bg-slate-200 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }, (_, colIndex) => (
                <td key={colIndex}>
                  <span
                    className="inline-block h-4 bg-slate-100 rounded animate-pulse"
                    style={{ width: colIndex === 0 ? 120 : 60 + (colIndex % 3) * 20 }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
