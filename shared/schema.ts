import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Brand types
export interface Brand {
  id: string;
  name: string;
  created_at: Date;
}

export const insertBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(255, "Brand name too long"),
});

export type InsertBrand = z.infer<typeof insertBrandSchema>;

// Instagram/TikTok post types
export interface SocialInstagramTiktok {
  id: string;
  brand_id: string;
  generated_reel_video: string | null;
  instagram_content: string | null;
  tiktok_content: string | null;
  status: 'published' | 'scheduled' | 'draft' | 'failed';
  created_at: Date;
  updated_at: Date;
}

export const insertInstagramTiktokSchema = z.object({
  brand_id: z.string().min(1, "Brand is required"),
  generated_reel_video: z.string().optional(),
  instagram_content: z.string().optional(),
  tiktok_content: z.string().optional(),
  status: z.enum(['published', 'scheduled', 'draft', 'failed']).default('draft'),
});

export type InsertInstagramTiktok = z.infer<typeof insertInstagramTiktokSchema>;

// LinkedIn/Twitter post types
export interface SocialLinkedinTwitter {
  id: string;
  brand_id: string;
  twitter_content: string | null;
  linkedin_content: string | null;
  date_posted: Date | null;
  status: 'published' | 'scheduled' | 'draft' | 'failed';
  created_at: Date;
  updated_at: Date;
}

export const insertLinkedinTwitterSchema = z.object({
  brand_id: z.string().min(1, "Brand is required"),
  twitter_content: z.string().optional(),
  linkedin_content: z.string().optional(),
  date_posted: z.string().optional(),
  status: z.enum(['published', 'scheduled', 'draft', 'failed']).default('draft'),
});

export type InsertLinkedinTwitter = z.infer<typeof insertLinkedinTwitterSchema>;

// Dashboard metrics types
export interface DashboardMetrics {
  totalPosts: number;
  instagramPosts: number;
  tiktokPosts: number;
  linkedinPosts: number;
  twitterPosts: number;
}

export interface PostWithBrand {
  id: string;
  brand_name: string;
  content: string;
  platform: string;
  date: string;
  status: string;
}

export interface BrandStats {
  brand_id: string;
  brand_name: string;
  post_count: number;
}
