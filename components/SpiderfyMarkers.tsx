'use client';

import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { Venue } from '@/types/venue';

interface SpiderfyMarkersProps {
  venues: Venue[];
  positions: [number, number][];
  centerCoords: [number, number];
  onVenueClick: (venue: Venue) => void;
  getMarkerColor: (tags: string[]) => string;
}

/**
 * Spiderfy 標記元件
 * 將重疊的場地以蜘蛛網狀/放射狀展開顯示
 */
export default function SpiderfyMarkers({
  venues,
  positions,
  centerCoords,
  onVenueClick,
  getMarkerColor,
}: SpiderfyMarkersProps) {
  return (
    <>
      {/* 連線（從中心到各展開點） */}
      {positions.map((pos, index) => (
        <svg
          key={`line-${index}`}
          className="absolute inset-0 pointer-events-none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          {/* SVG 連線將在 Map 層級處理，這裡簡化 */}
        </svg>
      ))}

      {/* 展開的標記 */}
      {venues.map((venue, index) => {
        const position = positions[index];
        return (
          <Marker
            key={`spiderfy-${venue.id}`}
            longitude={position[0]}
            latitude={position[1]}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onVenueClick(venue);
            }}
          >
            <div className="spiderfy-marker-wrapper relative">
              {/* 連線到中心 */}
              <div
                className="spiderfy-line absolute bottom-0 left-1/2 w-[2px] origin-bottom"
                style={{
                  backgroundColor: '#4A5D4E88',
                  height: '40px',
                  transform: `rotate(${calculateLineAngle(position, centerCoords)}deg) translateX(-50%)`,
                }}
              />

              {/* 標記圖示 */}
              <div
                className="cursor-pointer transform hover:scale-125 transition-transform duration-200 animate-bounce-in"
                style={{
                  width: '36px',
                  height: '36px',
                  animation: `bounceIn 0.${3 + index}s ease-out`,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={getMarkerColor(venue.tags)}
                  stroke="white"
                  strokeWidth="2"
                  className="drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
            </div>
          </Marker>
        );
      })}
    </>
  );
}

/**
 * 計算連線角度（從展開點指向中心）
 */
function calculateLineAngle(
  from: [number, number],
  to: [number, number]
): number {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return angle - 90; // 調整為從底部出發
}
