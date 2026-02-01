'use client';

import React, { useState } from 'react';

interface LocateButtonProps {
  onLocate: (coords: { latitude: number; longitude: number }) => void;
  bottomOffset?: number; // 動態底部偏移量（避開 BottomSheet）
}

/**
 * 定位按鈕 (Floating Action Button)
 * 響應式位置：隨 BottomSheet 高度動態調整
 */
export default function LocateButton({ onLocate, bottomOffset = 24 }: LocateButtonProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('您的瀏覽器不支援定位功能');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        onLocate(coords);
        setIsLocating(false);
      },
      (err) => {
        let errorMessage = '定位失敗';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = '請允許存取您的位置';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = '無法取得位置資訊';
            break;
          case err.TIMEOUT:
            errorMessage = '定位逾時';
            break;
        }
        setError(errorMessage);
        setIsLocating(false);
        setTimeout(() => setError(null), 3000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  return (
    <>
      {/* 定位按鈕 */}
      <button
        onClick={handleLocate}
        disabled={isLocating}
        className="fixed right-4 bg-white shadow-xl rounded-full p-3 hover:bg-gray-50 active:scale-95 transition-all duration-200 z-30"
        style={{
          bottom: `${bottomOffset}px`,
          minWidth: '48px',
          minHeight: '48px',
        }}
        aria-label="定位我的位置"
        type="button"
      >
        {isLocating ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-accent animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
      </button>

      {/* 錯誤提示 Toast */}
      {error && (
        <div
          className="fixed right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-xl z-50 animate-bounce-in"
          style={{
            bottom: `${bottomOffset + 64}px`,
            maxWidth: '240px',
          }}
        >
          <p className="text-sm font-sans">{error}</p>
        </div>
      )}
    </>
  );
}
