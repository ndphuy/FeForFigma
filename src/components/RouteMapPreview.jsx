import React from 'react';
import { AppMap } from './AppMap';

export const RouteMapPreview = ({ 
  points = [], 
  meta = '18.5 km · 07:00', 
  tag = 'Lộ trình tối ưu',
  heightClass = 'h-60 min-h-[240px] shrink-0',
  className = ''
}) => {
  return (
    <AppMap
      mode="preview"
      points={points}
      meta={meta}
      tag={tag}
      heightClass={heightClass}
      className={className}
    />
  );
};

