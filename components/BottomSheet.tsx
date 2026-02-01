'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Venue, VenueFilter } from '@/types/venue';
import VenueCard from './VenueCard';
import SearchBar from './SearchBar';

interface BottomSheetProps {
  venues: Venue[];
  selectedVenue: Venue | null;
  onVenueClick: (venue: Venue) => void;
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  onFilterClick: () => void;
  activeFilterCount: number;
  onHeightChange?: (height: number) => void; // 回報當前高度給父元件（用於定位按鈕）
}

/**
 * 底部抽屜元件（Mobile Only）
 * 支援拖曳手勢，可展開/收起/關閉三種狀態
 */
export default function BottomSheet({
  venues,
  selectedVenue,
  onVenueClick,
  isOpen,
  onClose,
  onSearch,
  onFilterClick,
  activeFilterCount,
  onHeightChange,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [sheetHeight, setSheetHeight] = useState<'collapsed' | 'half' | 'full'>('half'); // 預設半開
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // 根據狀態計算底部抽屜的高度
  const getSheetTransform = () => {
    if (!isOpen) return 'translateY(100%)';

    switch (sheetHeight) {
      case 'collapsed':
        return 'translateY(calc(100% - 80px))'; // 只顯示手把與標題
      case 'half':
        return 'translateY(50%)'; // 半螢幕
      case 'full':
        return 'translateY(0%)'; // 全螢幕
      default:
        return 'translateY(100%)';
    }
  };

  // 處理觸控開始（僅在手把區域）
  const handleTouchStart = (e: React.TouchEvent) => {
    // 檢查是否點擊在按鈕上，如果是則不處理拖曳
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  // 處理觸控移動
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentY(e.touches[0].clientY);
  };

  // 處理觸控結束
  const handleTouchEnd = () => {
    if (!isDragging) return;

    const deltaY = currentY - startY;

    // 根據滑動方向與距離判斷下一個狀態
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        // 向下滑動
        if (sheetHeight === 'full') {
          setSheetHeight('half');
        } else if (sheetHeight === 'half') {
          setSheetHeight('collapsed');
        }
        // collapsed 狀態下向下滑不做任何事（保持在 collapsed）
      } else {
        // 向上滑動
        if (sheetHeight === 'collapsed') {
          setSheetHeight('half');
        } else if (sheetHeight === 'half') {
          setSheetHeight('full');
        }
      }
    }

    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };

  // 點擊手把切換狀態
  const handleHandleClick = () => {
    if (sheetHeight === 'collapsed') {
      setSheetHeight('half');
    } else if (sheetHeight === 'half') {
      setSheetHeight('full');
    } else {
      setSheetHeight('collapsed');
    }
  };

  // 計算並回報當前實際高度（用於定位按鈕動態調整）
  useEffect(() => {
    if (!sheetRef.current || !onHeightChange) return;

    const updateHeight = () => {
      const viewportHeight = window.innerHeight;
      let visibleHeight = 0;

      switch (sheetHeight) {
        case 'collapsed':
          visibleHeight = 80; // collapsed 僅顯示手把
          break;
        case 'half':
          visibleHeight = viewportHeight * 0.5; // 半螢幕
          break;
        case 'full':
          visibleHeight = viewportHeight * 0.9; // 90% 螢幕
          break;
      }

      onHeightChange(visibleHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [sheetHeight, onHeightChange]);

  return (
    <>
      {/* 遮罩層（僅在 half/full 時顯示） */}
      {isOpen && sheetHeight !== 'collapsed' && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSheetHeight('collapsed')}
        />
      )}

      {/* 底部抽屜 */}
      <div
        ref={sheetRef}
        className="fixed left-0 right-0 bottom-0 bg-white/95 backdrop-blur-md rounded-t-3xl shadow-2xl z-[100] md:hidden transition-transform duration-300 ease-out flex flex-col"
        style={{
          transform: getSheetTransform(),
          maxHeight: '90vh',
          // iOS Safe Area 避讓
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Sticky 頂部區域：拖曳手把 + 搜尋欄 + 篩選按鈕 */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-gray-200/50">
          {/* 拖曳手把 */}
          <div
            className="flex flex-col items-center pt-3 pb-2"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="w-12 h-1.5 bg-gray-300 rounded-full mb-3 cursor-grab active:cursor-grabbing"
              onClick={handleHandleClick}
            />
          </div>

          {/* 搜尋欄與篩選按鈕 */}
          <div className="px-3 sm:px-4 pb-3">
            <div className="flex items-center gap-3">
              {/* 搜尋框 */}
              <div className="flex-1 min-w-0">
                <SearchBar onSearch={onSearch} placeholder="搜尋店家、流派、場景..." />
              </div>

              {/* 篩選按鈕 */}
              <button
                onClick={onFilterClick}
                className="relative flex-shrink-0 bg-white border border-gray-200 rounded-full p-3 hover:bg-gray-50 active:scale-95 transition-all duration-300 min-h-[48px] min-w-[48px] flex items-center justify-center shadow-md hover:shadow-lg"
                aria-label="開啟篩選"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-accent"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* 場地計數 */}
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-600 font-sans">
                共 <span className="font-bold text-accent">{venues.length}</span> 個場地
              </p>
              {sheetHeight !== 'collapsed' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSheetHeight('collapsed');
                  }}
                  className="text-xs text-gray-500 hover:text-accent transition-colors px-2 py-1"
                  type="button"
                >
                  收起
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 場地列表內容區域（可滾動） */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          style={{
            // 阻止內容區域的觸控事件冒泡到拖曳處理
            touchAction: 'pan-y',
          }}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {venues.length === 0 ? (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500 font-sans">找不到符合條件的場地</p>
              <p className="text-sm text-gray-400 mt-2">試著調整搜尋或篩選條件</p>
            </div>
          ) : (
            venues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onClick={() => onVenueClick(venue)}
                isSelected={selectedVenue?.id === venue.id}
                source="bottomsheet"
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
