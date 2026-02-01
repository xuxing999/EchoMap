/**
 * 資料存取層 (Data Access Layer)
 *
 * 設計理念：
 * - 提供統一的資料存取介面
 * - 未來可無縫切換至 Supabase 或其他資料源
 * - 所有資料存取都通過這個層級，便於維護和擴展
 */

import { Venue, VenueFilter, VenueCollection } from '@/types/venue';
import venuesData from '@/data/venues.json';

// 類型斷言：確保 JSON 數據符合 VenueCollection 型別
const typedVenuesData = venuesData as VenueCollection;

/**
 * 資料源介面定義
 * 未來實作 Supabase 時，只需實作這個介面即可
 */
export interface IVenueDataSource {
  getAllVenues(): Promise<Venue[]>;
  getVenueById(id: string): Promise<Venue | null>;
  getFilteredVenues(filter: VenueFilter): Promise<Venue[]>;
  searchVenues(query: string): Promise<Venue[]>;
}

/**
 * JSON 檔案資料源實作
 * 目前使用本地 JSON 檔案作為資料來源
 */
class JSONVenueDataSource implements IVenueDataSource {
  private venues: Venue[];

  constructor() {
    // 過濾掉金絲雀數據（防爬蟲標記）
    this.venues = typedVenuesData.venues.filter(v => !v.is_canary);
  }

  async getAllVenues(): Promise<Venue[]> {
    // 模擬異步操作
    return Promise.resolve(this.venues);
  }

  async getVenueById(id: string): Promise<Venue | null> {
    const venue = this.venues.find(v => v.id === id);
    return Promise.resolve(venue || null);
  }

  async getFilteredVenues(filter: VenueFilter): Promise<Venue[]> {
    let filtered = this.venues;

    // 根據音樂流派標籤篩選
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(venue =>
        filter.tags!.some(tag => venue.tags.includes(tag))
      );
    }

    // 根據場景標籤篩選
    if (filter.scenario && filter.scenario.length > 0) {
      filtered = filtered.filter(venue =>
        filter.scenario!.some(scenario => venue.scenario.includes(scenario))
      );
    }

    return Promise.resolve(filtered);
  }

  async searchVenues(query: string): Promise<Venue[]> {
    const lowerQuery = query.toLowerCase();
    const results = this.venues.filter(venue =>
      venue.name.toLowerCase().includes(lowerQuery) ||
      venue.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      venue.scenario.some(s => s.toLowerCase().includes(lowerQuery)) ||
      venue.original_review.toLowerCase().includes(lowerQuery)
    );
    return Promise.resolve(results);
  }
}

/**
 * Supabase 資料源實作（預留）
 * 未來遷移時取消註解並實作
 */
/*
class SupabaseVenueDataSource implements IVenueDataSource {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async getAllVenues(): Promise<Venue[]> {
    const { data, error } = await this.supabase
      .from('venues')
      .select('*')
      .eq('is_canary', false);

    if (error) throw error;
    return data || [];
  }

  async getVenueById(id: string): Promise<Venue | null> {
    const { data, error } = await this.supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .eq('is_canary', false)
      .single();

    if (error) return null;
    return data;
  }

  async getFilteredVenues(filter: VenueFilter): Promise<Venue[]> {
    let query = this.supabase
      .from('venues')
      .select('*')
      .eq('is_canary', false);

    if (filter.tags && filter.tags.length > 0) {
      query = query.overlaps('tags', filter.tags);
    }

    if (filter.scenario && filter.scenario.length > 0) {
      query = query.overlaps('scenario', filter.scenario);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async searchVenues(query: string): Promise<Venue[]> {
    const { data, error } = await this.supabase
      .from('venues')
      .select('*')
      .eq('is_canary', false)
      .or(`name.ilike.%${query}%,original_review.ilike.%${query}%`);

    if (error) throw error;
    return data || [];
  }
}
*/

/**
 * 資料源工廠
 * 根據環境變數決定使用哪個資料源
 */
function createVenueDataSource(): IVenueDataSource {
  // 未來可以透過環境變數切換
  // const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
  // return useSupabase ? new SupabaseVenueDataSource() : new JSONVenueDataSource();

  return new JSONVenueDataSource();
}

// 導出單例實例
export const venueDataSource = createVenueDataSource();
