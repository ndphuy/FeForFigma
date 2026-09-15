import React from 'react';
import { AppMap } from './AppMap';

export const LiveRouteMap = ({ points = [], progress = 0, className = '' }) => {
  return (
    <AppMap
      mode="live"
      points={points}
      progress={progress}
      className={className}
      showControls={false}
    />
  );
};
