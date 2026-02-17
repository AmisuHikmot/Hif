import { createClient } from '@/lib/supabase/server';

export interface DailyReminder {
  id: string;
  day_number: number;
  reminder_type: string;
  title: string;
  arabic_text: string | null;
  english_text: string;
  transliteration: string | null;
  category: string | null;
  reference: string | null;
  image_url: string | null;
  author: string | null;
  tags: string[];
}

export interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string;
  category: string | null;
  difficulty_level: string;
  read_time_minutes: number | null;
  image_url: string | null;
  order_rank: number;
}

export interface Dua {
  id: string;
  title: string;
  category: string;
  arabic_text: string;
  arabic_transliteration: string | null;
  english_translation: string;
  reference: string | null;
  audio_url: string | null;
  is_featured: boolean;
  order_rank: number;
}

export interface ReflectionVerse {
  id: string;
  surah_number: number;
  ayah_number: number;
  arabic_text: string;
  english_translation: string;
  theme: string | null;
  reflection_note: string | null;
}

export interface CharityInfo {
  id: string;
  section_name: string;
  content: string;
  icon: string | null;
  order_rank: number;
}

export interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  account_type: string | null;
  currency: string;
  display_order: number;
}

class RamadanService {
  private supabase = createClient();

  /**
   * Get daily reminder for a specific day
   */
  async getDailyReminder(dayNumber: number): Promise<DailyReminder | null> {
    try {
      const { data, error } = await this.supabase
        .from('ramadan_daily_reminders')
        .select('*')
        .eq('day_number', dayNumber)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('[v0] Error fetching daily reminder:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('[v0] Unexpected error in getDailyReminder:', error);
      return null;
    }
  }

  /**
   * Get all daily reminders (paginated)
   */
  async getAllDailyReminders(limit = 30): Promise<DailyReminder[]> {
    try {
      const { data, error } = await this.supabase
        .from('ramadan_daily_reminders')
        .select('*')
        .eq('is_published', true)
        .order('day_number', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('[v0] Error fetching daily reminders:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('[v0] Unexpected error in getAllDailyReminders:', error);
      return [];
    }
  }

  /**
   * Get featured reflection verse (for home page)
   */
  async getFeaturedReflectionVerse(): Promise<ReflectionVerse | null> {
    try {
      const { data, error } = await this.supabase
        .from('ramadan_reflection_verses')
        .select('*')
        .eq('is_featured', true)
        .order('order_rank', { ascending: true })
        .limit(1)
        .single();

      if (error) {
        console.error('[v0] Error fetching reflection verse:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('[v0] Unexpected error in getFeaturedReflectionVerse:', error);
      return null;
    }
  }

  /**
   * Get all knowledge base articles
   */
  async getKnowledgeArticles(): Promise<KnowledgeArticle[]> {
    try {
      const { data, error } = await this.supabase
        .from('ramadan_knowledge_base')
        .select('*')
        .eq('is_published', true)
        .order('order_rank', { ascending: true });

      if (error) {
        console.error('[v0] Error fetching knowledge articles:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('[v0] Unexpected error in getKnowledgeArticles:', error);
      return [];
    }
  }

  /**
   * Get single knowledge article by slug
   */
  async getKnowledgeArticleBySlug(slug: string): Promise<KnowledgeArticle | null> {
    try {
      const { data, error } = await this.supabase
        .from('ramadan_knowledge_base')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('[v0] Error fetching knowledge article:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('[v0] Unexpected error in getKnowledgeArticleBySlug:', error);
      return null;
    }
  }

  /**
   * Get duas by category
   */
  async getDuasByCategory(category: string): Promise<Dua[]> {
    try {
      const { data, error } = await this.supabase
        .from('ramadan_duas')
        .select('*')
        .eq('category', category)
        .order('order_rank', { ascending: true });

      if (error) {
        console.error('[v0] Error fetching duas:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('[v0] Unexpected error in getDuasByCategory:', error);
      return [];
    }
  }

  /**
   * Get featured duas
   */
  async getFeaturedDuas(): Promise<Dua[]> {
    try {
      const { data, error } = await this.supabase
        .from('ramadan_duas')
        .select('*')
        .eq('is_featured', true)
        .order('order_rank', { ascending: true });

      if (error) {
        console.error('[v0] Error fetching featured duas:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('[v0] Unexpected error in getFeaturedDuas:', error);
      return [];
    }
  }

  /**
   * Get all duas
   */
  async getAllDuas(): Promise<Dua[]> {
    try {
      const { data, error } = await this.supabase
        .from('ramadan_duas')
        .select('*')
        .order('category', { ascending: true })
        .order('order_rank', { ascending: true });

      if (error) {
        console.error('[v0] Error fetching all duas:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('[v0] Unexpected error in getAllDuas:', error);
      return [];
    }
  }

  /**
   * Get charity information
   */
  async getCharityInfo(): Promise<CharityInfo[]> {
    try {
      const { data, error } = await this.supabase
        .from('ramadan_charity_info')
        .select('*')
        .eq('is_active', true)
        .order('order_rank', { ascending: true });

      if (error) {
        console.error('[v0] Error fetching charity info:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('[v0] Unexpected error in getCharityInfo:', error);
      return [];
    }
  }

  /**
   * Get bank account details
   */
  async getBankAccounts(): Promise<BankAccount[]> {
    try {
      const { data, error } = await this.supabase
        .from('ramadan_bank_accounts')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('[v0] Error fetching bank accounts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('[v0] Unexpected error in getBankAccounts:', error);
      return [];
    }
  }

  /**
   * Get Dua categories
   */
  async getDuaCategories(): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('ramadan_duas')
        .select('category')
        .eq('category', '!=null')
        .order('category', { ascending: true });

      if (error) {
        console.error('[v0] Error fetching dua categories:', error);
        return [];
      }

      // Remove duplicates
      const categories = data?.map(item => item.category) || [];
      return [...new Set(categories)];
    } catch (error) {
      console.error('[v0] Unexpected error in getDuaCategories:', error);
      return [];
    }
  }
}

export const ramadanService = new RamadanService();
