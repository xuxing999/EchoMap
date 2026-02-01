'use client';

import React from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { getClusterSize, getClusterColor } from '@/lib/map-utils';

interface ClusterMarkerProps {
  longitude: number;
  latitude: number;
  pointCount: number;
  onClick: () => void;
}

/**
 * 聚合標記元件
 * 採用 Glassmorphism 風格，大小與顏色根據點數量動態變化
 */
export default function ClusterMarker({
  longitude,
  latitude,
  pointCount,
  onClick,
}: ClusterMarkerProps) {
  const size = getClusterSize(pointCount);
  const color = getClusterColor(pointCount);

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      anchor="center"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick();
      }}
    >
      <div
        className="cluster-marker cursor-pointer transform hover:scale-110 transition-all duration-200"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {/* Glassmorphism 背景 */}
        <div
          className="absolute inset-0 rounded-full backdrop-blur-md border-2 border-white/30 shadow-xl"
          style={{
            backgroundColor: `${color}CC`, // CC = 80% 不透明度
          }}
        />

        {/* 內部光暈效果 */}
        <div
          className="absolute inset-[6px] rounded-full"
          style={{
            backgroundColor: `${color}66`, // 66 = 40% 不透明度
          }}
        />

        {/* 數字 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-bold text-white drop-shadow-lg"
            style={{
              fontSize: `${size * 0.35}px`,
            }}
          >
            {pointCount}
          </span>
        </div>

        {/* 外圈脈衝動畫 */}
        <div
          className="absolute inset-[-4px] rounded-full opacity-30 animate-ping-slow"
          style={{
            backgroundColor: color,
          }}
        />
      </div>
    </Marker>
  );
}
