'use client';

import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import MapGL, { Marker, Popup, NavigationControl, MapRef } from 'react-map-gl/maplibre';
import Supercluster from 'supercluster';
import { Venue } from '@/types/venue';
import ClusterMarker from './ClusterMarker';
import SpiderfyMarkers from './SpiderfyMarkers';
import {
  venuesToGeoJSON,
  calculateBounds,
  calculateSpiderfyPositions,
} from '@/lib/map-utils';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  venues: Venue[];
  onVenueClick?: (venue: Venue) => void;
  selectedVenue?: Venue | null;
  initialCenter?: { longitude: number; latitude: number } | null;
}

// Supercluster 配置
const CLUSTER_OPTIONS = {
  radius: 60, // 聚合半徑（像素）
  maxZoom: 16, // 最大聚合層級（超過此層級不再聚合）
  minZoom: 0,
  nodeSize: 64,
};

export default function Map({ venues, onVenueClick, selectedVenue, initialCenter }: MapProps) {
  const mapRef = useRef<MapRef>(null);

  const [viewState, setViewState] = useState({
    longitude: 121.5325,
    latitude: 25.0420,
    zoom: 12,
  });

  // 處理定位：當 initialCenter 變化時移動地圖中心
  useEffect(() => {
    if (initialCenter && mapRef.current) {
      mapRef.current.flyTo({
        center: [initialCenter.longitude, initialCenter.latitude],
        zoom: 15,
        duration: 1500,
      });
    }
  }, [initialCenter]);

  const [popupInfo, setPopupInfo] = useState<Venue | null>(null);
  const [spiderfyInfo, setSpiderfyInfo] = useState<{
    venues: Venue[];
    centerCoords: [number, number];
  } | null>(null);

  // 使用 OpenFreeMap 的免費地圖樣式（文藝感淺色風格）
  const mapStyle = 'https://tiles.openfreemap.org/styles/bright';

  // Marker 顏色根據音樂類型
  const getMarkerColor = useCallback((tags: string[]) => {
    if (tags.includes('Jazz') || tags.includes('爵士')) return '#4A5D4E';
    if (tags.includes('Rock') || tags.includes('搖滾') || tags.includes('Punk') || tags.includes('龐克')) return '#8B4513';
    if (tags.includes('Indie') || tags.includes('獨立')) return '#6B8272';
    if (tags.includes('Electronic') || tags.includes('電子') || tags.includes('Techno')) return '#5F9EA0';
    return '#4A5D4E';
  }, []);

  // 建立 Supercluster 實例
  const supercluster = useMemo(() => {
    const cluster = new Supercluster(CLUSTER_OPTIONS);
    const geoJSONFeatures = venuesToGeoJSON(venues);
    cluster.load(geoJSONFeatures);
    return cluster;
  }, [venues]);

  // 根據當前視圖獲取聚合點與單獨標記
  const { clusters, markers } = useMemo(() => {
    if (!supercluster) return { clusters: [], markers: [] };

    const zoom = Math.floor(viewState.zoom);
    const bounds = mapRef.current?.getBounds();

    if (!bounds) {
      return { clusters: [], markers: [] };
    }

    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];

    const clusterData = supercluster.getClusters(bbox, zoom);

    const clusterMarkers = [];
    const individualMarkers = [];

    for (const cluster of clusterData) {
      const [longitude, latitude] = cluster.geometry.coordinates;
      const properties = cluster.properties;

      if (properties.cluster) {
        // 這是一個聚合點
        clusterMarkers.push({
          id: `cluster-${cluster.id}`,
          longitude,
          latitude,
          pointCount: properties.point_count,
          clusterId: cluster.id,
        });
      } else {
        // 這是一個單獨標記
        individualMarkers.push(properties.venue);
      }
    }

    return {
      clusters: clusterMarkers,
      markers: individualMarkers,
    };
  }, [supercluster, viewState.zoom, mapRef.current?.getBounds()]);

  // 處理聚合點點擊（縮放或展開 Spiderfy）
  const handleClusterClick = useCallback(
    (clusterId: number, longitude: number, latitude: number) => {
      const zoom = Math.floor(viewState.zoom);

      // 檢查是否已經在最大縮放層級
      if (zoom >= CLUSTER_OPTIONS.maxZoom) {
        // 獲取聚合點內的所有場地
        const leaves = supercluster.getLeaves(clusterId, Infinity);
        const clusterVenues = leaves.map((leaf: any) => leaf.properties.venue);

        // 展開 Spiderfy
        setSpiderfyInfo({
          venues: clusterVenues,
          centerCoords: [longitude, latitude],
        });
      } else {
        // 計算聚合點的展開層級
        const expansionZoom = Math.min(
          supercluster.getClusterExpansionZoom(clusterId),
          CLUSTER_OPTIONS.maxZoom
        );

        // 平滑縮放到聚合點
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: expansionZoom,
          duration: 1000,
        });

        // 關閉 Spiderfy（如果有）
        setSpiderfyInfo(null);
      }
    },
    [supercluster, viewState.zoom]
  );

  // 處理單獨標記點擊
  const handleMarkerClick = useCallback(
    (venue: Venue) => {
      setPopupInfo(venue);
      onVenueClick?.(venue);
      setSpiderfyInfo(null); // 關閉 Spiderfy
    },
    [onVenueClick]
  );

  // 關閉地圖點擊時關閉 Spiderfy
  const handleMapClick = useCallback(() => {
    setSpiderfyInfo(null);
  }, []);

  // 計算 Spiderfy 位置
  const spiderfyPositions = useMemo(() => {
    if (!spiderfyInfo) return [];
    return calculateSpiderfyPositions(
      spiderfyInfo.centerCoords,
      spiderfyInfo.venues.length
    );
  }, [spiderfyInfo]);

  return (
    <div className="w-full h-full relative">
      <MapGL
        ref={mapRef}
        {...viewState}
        onMove={(evt) => {
          setViewState(evt.viewState);
          // 移動時關閉 Spiderfy
          if (spiderfyInfo) {
            setSpiderfyInfo(null);
          }
        }}
        onClick={handleMapClick}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        reuseMaps
        cooperativeGestures={true}
        touchZoomRotate={true}
        touchPitch={false}
      >
        {/* 渲染聚合標記 */}
        {clusters.map((cluster) => (
          <ClusterMarker
            key={cluster.id}
            longitude={cluster.longitude}
            latitude={cluster.latitude}
            pointCount={cluster.pointCount}
            onClick={() =>
              handleClusterClick(
                cluster.clusterId as number,
                cluster.longitude,
                cluster.latitude
              )
            }
          />
        ))}

        {/* 渲染單獨標記（非聚合） */}
        {markers.map((venue) => (
          <Marker
            key={venue.id}
            longitude={venue.coordinates[0]}
            latitude={venue.coordinates[1]}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              handleMarkerClick(venue);
            }}
          >
            <div
              className="cursor-pointer transform hover:scale-125 transition-transform duration-200"
              style={{
                width: selectedVenue?.id === venue.id ? '48px' : '40px',
                height: selectedVenue?.id === venue.id ? '48px' : '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill={getMarkerColor(venue.tags)}
                stroke="white"
                strokeWidth="2"
                className="drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
          </Marker>
        ))}

        {/* 渲染 Spiderfy 展開標記 */}
        {spiderfyInfo && spiderfyPositions.length > 0 && (
          <SpiderfyMarkers
            venues={spiderfyInfo.venues}
            positions={spiderfyPositions}
            centerCoords={spiderfyInfo.centerCoords}
            onVenueClick={handleMarkerClick}
            getMarkerColor={getMarkerColor}
          />
        )}

        {/* Popup */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.coordinates[0]}
            latitude={popupInfo.coordinates[1]}
            anchor="top"
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="venue-popup"
          >
            <div className="p-4 max-w-xs">
              <h3 className="font-serif text-lg font-bold text-accent mb-2">
                {popupInfo.name}
              </h3>
              <div className="flex flex-wrap gap-1 mb-2">
                {popupInfo.tags.map((tag) => (
                  <span key={tag} className="tag text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {popupInfo.original_review}
              </p>
              {popupInfo.minimum_charge && (
                <p className="text-xs text-gray-500 mt-2">
                  低消：{popupInfo.minimum_charge}
                </p>
              )}
            </div>
          </Popup>
        )}

        <div className="absolute top-4 right-4">
          <NavigationControl showCompass={false} />
        </div>
      </MapGL>
    </div>
  );
}
