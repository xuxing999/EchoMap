'use client';

import React from 'react';
import { Venue } from '@/types/venue';
import { trackVenueClick } from '@/lib/analytics';

interface VenueCardProps {
  venue: Venue;
  onClick?: () => void;
  isSelected?: boolean;
  source?: 'list' | 'bottomsheet'; // 追蹤點擊來源
}

export default function VenueCard({ venue, onClick, isSelected, source = 'list' }: VenueCardProps) {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    // 追蹤場地卡片點擊
    trackVenueClick({
      name: venue.name,
      id: venue.id,
      tags: venue.tags,
      source: source,
    });

    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      onTouchEnd={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`card p-4 cursor-pointer transition-all duration-200 active:scale-98 ${
        isSelected ? 'ring-2 ring-accent shadow-xl' : ''
      }`}
      role="button"
      tabIndex={0}
    >
      {/* 店名 */}
      <h3 className="font-serif text-xl font-bold text-accent mb-2">
        {venue.name}
      </h3>

      {/* 標籤 */}
      <div className="flex flex-wrap gap-1 mb-3">
        {venue.tags.map((tag) => (
          <span key={tag} className="tag text-xs">
            {tag}
          </span>
        ))}
        {venue.scenario.slice(0, 2).map((scenario) => (
          <span
            key={scenario}
            className="inline-block bg-accent-light/10 text-accent-dark px-2 py-1 rounded-full text-xs font-sans"
          >
            {scenario}
          </span>
        ))}
      </div>

      {/* 短評 */}
      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
        {venue.original_review}
      </p>

      {/* 詳細資訊 */}
      <div className="space-y-1 text-xs text-gray-600">
        {venue.address && (
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 flex-shrink-0 text-accent"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{venue.address}</span>
          </div>
        )}

        {venue.opening_hours && (
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 flex-shrink-0 text-accent"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>{venue.opening_hours}</span>
          </div>
        )}

        {venue.minimum_charge && (
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 flex-shrink-0 text-accent"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
            <span>低消：{venue.minimum_charge}</span>
          </div>
        )}

        {venue.phone && (
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 flex-shrink-0 text-accent"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span>{venue.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
}
