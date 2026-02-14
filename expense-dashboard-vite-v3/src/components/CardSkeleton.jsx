import React from 'react';
import { Card } from '../ui/index.js';

/**
 * Skeleton loader for card/chart areas.
 */
export default function CardSkeleton({ className = '' }) {
  return (
    <Card className={className}>
      <div className="h-5 w-32 bg-slate-200 rounded animate-pulse mb-4" />
      <div className="h-64 bg-slate-100 rounded animate-pulse" />
    </Card>
  );
}
