'use client';

import React, { useCallback, useState, useMemo } from 'react';
import MapGL, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import { Venue } from '@/types/venue';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  venues: Venue[];
  onVenueClick?: (venue: Venue) => void;
  selectedVenue?: Venue | null;
}

export default function Map({ venues, onVenueClick, selectedVenue }: MapProps) {
  const [viewState, setViewState] = useState({
    longitude: 121.5325,
    latitude: 25.0420,
    zoom: 12,
  });

  const [popupInfo, setPopupInfo] = useState<Venue | null>(null);

  const handleMarkerClick = useCallback((venue: Venue) => {
    setPopupInfo(venue);
    onVenueClick?.(venue);
  }, [onVenueClick]);

  // 使用 OpenFreeMap 的免費地圖樣式（文藝感淺色風格）
  const mapStyle = 'https://tiles.openfreemap.org/styles/bright';

  // Marker 顏色根據音樂類型
  const getMarkerColor = (tags: string[]) => {
    if (tags.includes('Jazz')) return '#4A5D4E';
    if (tags.includes('Rock') || tags.includes('Punk')) return '#8B4513';
    if (tags.includes('Indie')) return '#6B8272';
    if (tags.includes('Electronic')) return '#5F9EA0';
    return '#4A5D4E';
  };

  const markers = useMemo(
    () =>
      venues.map((venue) => (
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
            className="cursor-pointer transform hover:scale-110 transition-transform duration-200"
            style={{
              width: selectedVenue?.id === venue.id ? '36px' : '28px',
              height: selectedVenue?.id === venue.id ? '36px' : '28px',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill={getMarkerColor(venue.tags)}
              stroke="white"
              strokeWidth="1.5"
              className="drop-shadow-lg"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
        </Marker>
      )),
    [venues, selectedVenue, handleMarkerClick]
  );

  return (
    <div className="w-full h-full relative">
      <MapGL
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        {markers}

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
          <NavigationControl />
        </div>
      </MapGL>
    </div>
  );
}
