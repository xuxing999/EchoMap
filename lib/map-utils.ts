/**
 * 地圖工具函式
 * 用於聚合點計算、Spiderfy 位置計算等
 */

import { Venue } from '@/types/venue';
import bbox from '@turf/bbox';
import { featureCollection, point } from '@turf/helpers';

/**
 * 將 Venues 轉換為 GeoJSON Features
 */
export function venuesToGeoJSON(venues: Venue[]) {
  return venues.map((venue) => ({
    type: 'Feature' as const,
    properties: {
      cluster: false,
      venueId: venue.id,
      venue: venue,
    },
    geometry: {
      type: 'Point' as const,
      coordinates: venue.coordinates,
    },
  }));
}

/**
 * 根據聚合點數量計算大小
 */
export function getClusterSize(pointCount: number): number {
  if (pointCount < 10) return 40;
  if (pointCount < 30) return 50;
  if (pointCount < 50) return 60;
  return 70;
}

/**
 * 根據聚合點數量計算顏色（綠色深淺）
 */
export function getClusterColor(pointCount: number): string {
  if (pointCount < 10) return '#6B8272'; // 淺綠
  if (pointCount < 30) return '#4A5D4E'; // 主色調墨綠
  if (pointCount < 50) return '#3A4D3E'; // 深綠
  return '#2A3D2E'; // 最深綠
}

/**
 * 計算包含所有座標點的 Bounds
 */
export function calculateBounds(coordinates: [number, number][]) {
  const features = coordinates.map((coord) =>
    point(coord)
  );
  const collection = featureCollection(features);
  const [minLng, minLat, maxLng, maxLat] = bbox(collection);

  return {
    minLng,
    minLat,
    maxLng,
    maxLat,
  };
}

/**
 * 計算 Spiderfy（蜘蛛網展開）的位置
 * 將重疊的標記以圓形放射狀展開
 */
export function calculateSpiderfyPositions(
  centerCoords: [number, number],
  count: number,
  radius: number = 0.0008 // 約 80 公尺的經緯度差
): [number, number][] {
  const positions: [number, number][] = [];
  const angleStep = (2 * Math.PI) / count;

  for (let i = 0; i < count; i++) {
    const angle = i * angleStep - Math.PI / 2; // 從正上方開始
    const lng = centerCoords[0] + radius * Math.cos(angle);
    const lat = centerCoords[1] + radius * Math.sin(angle);
    positions.push([lng, lat]);
  }

  return positions;
}

/**
 * 檢查座標是否完全相同或極度靠近
 */
export function areCoordinatesNearby(
  coord1: [number, number],
  coord2: [number, number],
  threshold: number = 0.00001 // 約 1 公尺
): boolean {
  const lngDiff = Math.abs(coord1[0] - coord2[0]);
  const latDiff = Math.abs(coord1[1] - coord2[1]);
  return lngDiff < threshold && latDiff < threshold;
}

/**
 * 檢測並分組重疊的場地
 */
export function detectOverlappingVenues(
  venues: Venue[],
  threshold: number = 0.00001
): Map<string, Venue[]> {
  const groups = new Map<string, Venue[]>();

  venues.forEach((venue) => {
    const key = `${venue.coordinates[0].toFixed(5)},${venue.coordinates[1].toFixed(5)}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(venue);
  });

  // 只返回有重疊的群組（2 個以上場地）
  const overlappingGroups = new Map<string, Venue[]>();
  groups.forEach((venues, key) => {
    if (venues.length > 1) {
      overlappingGroups.set(key, venues);
    }
  });

  return overlappingGroups;
}
