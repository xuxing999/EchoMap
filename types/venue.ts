/**
 * 場地資料型別定義
 * 設計考量：結構化設計便於未來遷移至 Supabase
 */

export interface Venue {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  tags: string[]; // 音樂流派標籤：Jazz, Rock, Indie, Punk, Electronic, etc.
  scenario: string[]; // 場景標籤：適合一個人、一群人瘋、約會、平價、精緻等
  original_review: string; // 原創短評
  is_canary: boolean; // 金絲雀數據標記（用於防爬蟲）
  address?: string; // 地址（選填）
  opening_hours?: string; // 營業時間（選填）
  minimum_charge?: string; // 低消資訊（選填）
  phone?: string; // 電話（選填）
  website?: string; // 網站（選填）
}

export type VenueFilter = {
  tags?: string[];
  scenario?: string[];
};

export interface VenueCollection {
  venues: Venue[];
  last_updated: string;
  version: string;
}
