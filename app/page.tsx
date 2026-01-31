'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Venue, VenueFilter } from '@/types/venue';
import { venueDataSource } from '@/lib/data-source';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import VenueCard from '@/components/VenueCard';

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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* 標題列 - 磨砂玻璃效果 */}
      <header className="absolute top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo - Noto Sans TC Bold */}
            <h1 className="font-noto-tc text-2xl md:text-3xl font-black text-accent whitespace-nowrap tracking-wider">
              台北音樂地圖
            </h1>

            {/* 搜尋欄 */}
            <div className="flex-1 max-w-md">
              <SearchBar onSearch={setSearchQuery} />
            </div>

            {/* 操作按鈕 */}
            <div className="flex items-center gap-2">
              {/* 篩選按鈕 */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="relative btn-secondary rounded-full flex items-center gap-2 whitespace-nowrap transition-transform hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden md:inline">篩選</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* 列表按鈕 */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="btn-secondary rounded-full flex items-center gap-2 whitespace-nowrap transition-transform hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden md:inline">列表</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 地圖 */}
      <div className="absolute inset-0 pt-20">
        <Map
          venues={filteredVenues}
          onVenueClick={handleVenueClick}
          selectedVenue={selectedVenue}
        />
      </div>

      {/* 篩選面板 */}
      <div
        className={`absolute top-20 left-0 bottom-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto scrollbar-thin ${
          isFilterOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-accent">篩選條件</h2>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-gray-500 hover:text-accent transition-colors"
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

      {/* 側邊欄列表 */}
      <div
        className={`absolute top-20 right-0 bottom-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-30 overflow-y-auto scrollbar-thin ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-accent">
            場地列表 <span className="text-sm text-gray-500">({filteredVenues.length})</span>
          </h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500 hover:text-accent transition-colors"
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

        <div className="p-4 space-y-4">
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

      {/* 浮動統計資訊 */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 z-20">
        <p className="text-sm font-sans text-gray-600">
          顯示 <span className="font-bold text-accent">{filteredVenues.length}</span> / {allVenues.length} 個場地
        </p>
      </div>
    </div>
  );
}
