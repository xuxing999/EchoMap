'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Venue, VenueFilter } from '@/types/venue';
import { venueDataSource } from '@/lib/data-source';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import VenueCard from '@/components/VenueCard';
import BottomSheet from '@/components/BottomSheet';
import LocateButton from '@/components/LocateButton';

// 動態導入地圖組件（避免 SSR 問題）
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-accent font-sans">載入地圖中...</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [filter, setFilter] = useState<VenueFilter>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0); // BottomSheet 當前高度（用於定位按鈕）
  const [mapCenter, setMapCenter] = useState<{ longitude: number; latitude: number } | null>(null);

  // 載入所有場地資料
  useEffect(() => {
    const loadVenues = async () => {
      const venues = await venueDataSource.getAllVenues();
      setAllVenues(venues);
      setFilteredVenues(venues);
    };
    loadVenues();
  }, []);

  // 處理搜尋和篩選
  useEffect(() => {
    const applyFiltersAndSearch = async () => {
      let results = allVenues;

      // 先套用篩選器
      if (filter.tags || filter.scenario) {
        results = await venueDataSource.getFilteredVenues(filter);
      }

      // 再套用搜尋
      if (searchQuery.trim()) {
        const searchResults = await venueDataSource.searchVenues(searchQuery);
        const searchIds = new Set(searchResults.map(v => v.id));
        results = results.filter(v => searchIds.has(v.id));
      }

      setFilteredVenues(results);
    };

    applyFiltersAndSearch();
  }, [filter, searchQuery, allVenues]);

  const handleVenueClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsSidebarOpen(true);
  };

  const activeFilterCount = useMemo(() => {
    return (filter.tags?.length || 0) + (filter.scenario?.length || 0);
  }, [filter]);

  // 處理定位
  const handleLocate = useCallback((coords: { latitude: number; longitude: number }) => {
    setMapCenter({ longitude: coords.longitude, latitude: coords.latitude });
    // 重置 mapCenter 以避免重複觸發（由 Map 元件處理）
    setTimeout(() => setMapCenter(null), 100);
  }, []);

  // 計算定位按鈕的底部偏移量（避開 BottomSheet）
  const locateButtonOffset = useMemo(() => {
    // Mobile: bottomSheetHeight + 24px 間距
    // Desktop: 24px 固定
    return bottomSheetHeight > 0 ? bottomSheetHeight + 24 : 24;
  }, [bottomSheetHeight]);

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-background">
      {/* 標題列 - 磨砂玻璃效果 */}
      <header className="absolute top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
            {/* Logo - Noto Sans TC Bold */}
            <h1 className="font-noto-tc text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-accent whitespace-nowrap tracking-wider">
              台北音樂地圖
            </h1>

            {/* 搜尋欄 - 隱藏於小螢幕，MD+ 顯示 */}
            <div className="hidden md:flex flex-1 max-w-md">
              <SearchBar onSearch={setSearchQuery} />
            </div>

            {/* 操作按鈕 - 最小 44x44px 觸控目標 */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* 篩選按鈕 */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="relative btn-secondary rounded-full flex items-center gap-2 whitespace-nowrap transition-transform hover:scale-105 min-h-[44px] min-w-[44px] justify-center"
                aria-label="篩選場地"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden lg:inline">篩選</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* 列表按鈕 - 僅 MD+ 顯示（行動版用 BottomSheet） */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden md:flex btn-secondary rounded-full items-center gap-2 whitespace-nowrap transition-transform hover:scale-105 min-h-[44px] min-w-[44px] justify-center"
                aria-label="場地列表"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden lg:inline">列表</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 地圖 */}
      <div className="absolute inset-0 pt-14 sm:pt-16 md:pt-20">
        <Map
          venues={filteredVenues}
          onVenueClick={handleVenueClick}
          selectedVenue={selectedVenue}
          initialCenter={mapCenter}
        />
      </div>

      {/* 定位按鈕（全平台顯示，動態避開 BottomSheet） */}
      <LocateButton onLocate={handleLocate} bottomOffset={locateButtonOffset} />

      {/* 篩選面板 - 響應式寬度 */}
      <div
        className={`absolute top-14 sm:top-16 md:top-20 left-0 bottom-0 w-full sm:w-80 md:w-80 lg:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto scrollbar-thin ${
          isFilterOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between">
          <h2 className="font-serif text-lg sm:text-xl text-accent">篩選條件</h2>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-gray-500 hover:text-accent transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="關閉篩選面板"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <FilterPanel filter={filter} onFilterChange={setFilter} />
      </div>

      {/* 側邊欄列表 - 僅 MD+ 顯示（Desktop） */}
      <div
        className={`hidden md:block absolute top-14 sm:top-16 md:top-20 right-0 bottom-0 w-80 md:w-96 lg:w-[400px] xl:w-[440px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto scrollbar-thin ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between">
          <h2 className="font-serif text-lg sm:text-xl text-accent">
            場地列表 <span className="text-sm text-gray-500">({filteredVenues.length})</span>
          </h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500 hover:text-accent transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="關閉場地列表"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          {filteredVenues.length === 0 ? (
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
            filteredVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onClick={() => handleVenueClick(venue)}
                isSelected={selectedVenue?.id === venue.id}
              />
            ))
          )}
        </div>
      </div>

      {/* 底部抽屜 - 僅 Mobile 顯示（< MD），預設半開，含 Sticky 搜尋欄 */}
      <BottomSheet
        venues={filteredVenues}
        selectedVenue={selectedVenue}
        onVenueClick={handleVenueClick}
        isOpen={true}
        onClose={() => setSelectedVenue(null)}
        onSearch={setSearchQuery}
        onFilterClick={() => setIsFilterOpen(true)}
        activeFilterCount={activeFilterCount}
        onHeightChange={setBottomSheetHeight}
      />

      {/* 浮動統計資訊 - 避開 BottomSheet */}
      <div className="absolute bottom-24 md:bottom-6 left-3 sm:left-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 sm:px-4 py-2 z-20">
        <p className="text-xs sm:text-sm font-sans text-gray-600">
          顯示 <span className="font-bold text-accent">{filteredVenues.length}</span> / {allVenues.length} 個場地
        </p>
      </div>
    </div>
  );
}
