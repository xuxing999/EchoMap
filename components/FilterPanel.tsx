'use client';

import React from 'react';
import { VenueFilter } from '@/types/venue';

interface FilterPanelProps {
  filter: VenueFilter;
  onFilterChange: (filter: VenueFilter) => void;
}

// 可選的音樂流派標籤
const MUSIC_TAGS = ['Jazz', 'Rock', 'Indie', 'Punk', 'Electronic', 'Blues', 'Folk', 'Live', 'Vinyl'];

// 可選的場景標籤
const SCENARIO_TAGS = ['適合一個人', '一群人瘋', '約會', '平價', '精緻', '文藝', '演唱會', '挖寶'];

export default function FilterPanel({ filter, onFilterChange }: FilterPanelProps) {
  const toggleTag = (tag: string, type: 'tags' | 'scenario') => {
    const currentTags = filter[type] || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];

    onFilterChange({
      ...filter,
      [type]: newTags.length > 0 ? newTags : undefined,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = (filter.tags && filter.tags.length > 0) || (filter.scenario && filter.scenario.length > 0);

  return (
    <div className="p-4 space-y-6">
      {/* 標題與清除按鈕 */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-accent">篩選條件</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-accent transition-colors"
          >
            清除全部
          </button>
        )}
      </div>

      {/* 音樂流派 */}
      <div>
        <h3 className="font-serif text-lg text-foreground mb-3">音樂流派</h3>
        <div className="flex flex-wrap gap-2">
          {MUSIC_TAGS.map((tag) => {
            const isActive = filter.tags?.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag, 'tags')}
                className={`px-4 py-2 rounded-full text-sm font-sans transition-all duration-200 ${
                  isActive
                    ? 'bg-accent text-white shadow-md'
                    : 'bg-white text-accent border border-accent/30 hover:border-accent'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* 場景 */}
      <div>
        <h3 className="font-serif text-lg text-foreground mb-3">場景氛圍</h3>
        <div className="flex flex-wrap gap-2">
          {SCENARIO_TAGS.map((tag) => {
            const isActive = filter.scenario?.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag, 'scenario')}
                className={`px-4 py-2 rounded-full text-sm font-sans transition-all duration-200 ${
                  isActive
                    ? 'bg-accent text-white shadow-md'
                    : 'bg-white text-accent border border-accent/30 hover:border-accent'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* 已選擇的篩選條件摘要 */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            已選擇 {(filter.tags?.length || 0) + (filter.scenario?.length || 0)} 個條件
          </p>
        </div>
      )}
    </div>
  );
}
