import mysql from "mysql2/promise";
import { 
  Brand, 
  InsertBrand, 
  SocialInstagramTiktok, 
  InsertInstagramTiktok,
  SocialLinkedinTwitter,
  InsertLinkedinTwitter,
  DashboardMetrics,
  PostWithBrand,
  BrandStats
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Brand operations
  getBrands(): Promise<Brand[]>;
  getBrandById(id: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand>;
  deleteBrand(id: string): Promise<void>;

  // Instagram/TikTok operations
  getInstagramTiktokPosts(filters?: {
    brand_id?: string;
    status?: string;
    date_range?: string;
  }): Promise<SocialInstagramTiktok[]>;
  getInstagramTiktokPostById(id: string): Promise<SocialInstagramTiktok | undefined>;
  createInstagramTiktokPost(post: InsertInstagramTiktok): Promise<SocialInstagramTiktok>;
  updateInstagramTiktokPost(id: string, post: Partial<InsertInstagramTiktok>): Promise<SocialInstagramTiktok>;
  deleteInstagramTiktokPost(id: string): Promise<void>;

  // LinkedIn/Twitter operations
  getLinkedinTwitterPosts(filters?: {
    brand_id?: string;
    status?: string;
    date_range?: string;
  }): Promise<SocialLinkedinTwitter[]>;
  getLinkedinTwitterPostById(id: string): Promise<SocialLinkedinTwitter | undefined>;
  createLinkedinTwitterPost(post: InsertLinkedinTwitter): Promise<SocialLinkedinTwitter>;
  updateLinkedinTwitterPost(id: string, post: Partial<InsertLinkedinTwitter>): Promise<SocialLinkedinTwitter>;
  deleteLinkedinTwitterPost(id: string): Promise<void>;

  // Dashboard metrics
  getDashboardMetrics(filters?: {
    brand_id?: string;
    date_range?: string;
  }): Promise<DashboardMetrics>;
  getLatestPosts(limit?: number): Promise<PostWithBrand[]>;
  getBrandStats(): Promise<BrandStats[]>;
}

export class MySQLStorage implements IStorage {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || "148.163.69.162",
      user: process.env.DB_USER || "vyrade_post_logs",
      password: process.env.DB_PASSWORD || "y,EzwtE)}ydd2Atg",
      database: process.env.DB_NAME || "vyrade_post_logs",
      port: parseInt(process.env.DB_PORT || "3306"),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  // Brand operations
  async getBrands(): Promise<Brand[]> {
    const [rows] = await this.pool.execute(
      "SELECT * FROM brands ORDER BY created_at DESC"
    );
    return rows as Brand[];
  }

  async getBrandById(id: string): Promise<Brand | undefined> {
    const [rows] = await this.pool.execute(
      "SELECT * FROM brands WHERE id = ?",
      [id]
    );
    const result = rows as Brand[];
    return result[0];
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const id = randomUUID();
    await this.pool.execute(
      "INSERT INTO brands (id, name) VALUES (?, ?)",
      [id, brand.name]
    );
    return this.getBrandById(id) as Promise<Brand>;
  }

  async updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand> {
    await this.pool.execute(
      "UPDATE brands SET name = ? WHERE id = ?",
      [brand.name, id]
    );
    return this.getBrandById(id) as Promise<Brand>;
  }

  async deleteBrand(id: string): Promise<void> {
    await this.pool.execute("DELETE FROM brands WHERE id = ?", [id]);
  }

  // Instagram/TikTok operations
  async getInstagramTiktokPosts(filters?: {
    brand_id?: string;
    status?: string;
    date_range?: string;
  }): Promise<SocialInstagramTiktok[]> {
    let query = `
      SELECT sit.*, b.name as brand_name 
      FROM social_instagram_tiktok sit 
      JOIN brands b ON sit.brand_id = b.id 
      WHERE sit.status = 'published'
    `;
    const params: any[] = [];

    if (filters?.brand_id) {
      query += " AND sit.brand_id = ?";
      params.push(filters.brand_id);
    }

    if (filters?.date_range) {
      if (filters.date_range === 'week') {
        query += " AND sit.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
      } else if (filters.date_range === 'month') {
        query += " AND sit.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
      }
    }

    query += " ORDER BY sit.created_at DESC";

    const [rows] = await this.pool.execute(query, params);
    return rows as SocialInstagramTiktok[];
  }

  async getInstagramTiktokPostById(id: string): Promise<SocialInstagramTiktok | undefined> {
    const [rows] = await this.pool.execute(
      "SELECT * FROM social_instagram_tiktok WHERE id = ?",
      [id]
    );
    const result = rows as SocialInstagramTiktok[];
    return result[0];
  }

  async createInstagramTiktokPost(post: InsertInstagramTiktok): Promise<SocialInstagramTiktok> {
    const id = randomUUID();
    await this.pool.execute(
      `INSERT INTO social_instagram_tiktok 
       (id, brand_id, generated_reel_video, instagram_content, tiktok_content, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, post.brand_id, post.generated_reel_video, post.instagram_content, post.tiktok_content, post.status]
    );
    return this.getInstagramTiktokPostById(id) as Promise<SocialInstagramTiktok>;
  }

  async updateInstagramTiktokPost(id: string, post: Partial<InsertInstagramTiktok>): Promise<SocialInstagramTiktok> {
    const fields = [];
    const values = [];

    if (post.generated_reel_video !== undefined) {
      fields.push("generated_reel_video = ?");
      values.push(post.generated_reel_video);
    }
    if (post.instagram_content !== undefined) {
      fields.push("instagram_content = ?");
      values.push(post.instagram_content);
    }
    if (post.tiktok_content !== undefined) {
      fields.push("tiktok_content = ?");
      values.push(post.tiktok_content);
    }
    if (post.status !== undefined) {
      fields.push("status = ?");
      values.push(post.status);
    }

    if (fields.length > 0) {
      values.push(id);
      await this.pool.execute(
        `UPDATE social_instagram_tiktok SET ${fields.join(", ")} WHERE id = ?`,
        values
      );
    }

    return this.getInstagramTiktokPostById(id) as Promise<SocialInstagramTiktok>;
  }

  async deleteInstagramTiktokPost(id: string): Promise<void> {
    await this.pool.execute("DELETE FROM social_instagram_tiktok WHERE id = ?", [id]);
  }

  // LinkedIn/Twitter operations
  async getLinkedinTwitterPosts(filters?: {
    brand_id?: string;
    status?: string;
    date_range?: string;
  }): Promise<SocialLinkedinTwitter[]> {
    let query = `
      SELECT slt.*, b.name as brand_name 
      FROM social_linkedin_twitter slt 
      JOIN brands b ON slt.brand_id = b.id 
      WHERE slt.status = 'published'
    `;
    const params: any[] = [];

    if (filters?.brand_id) {
      query += " AND slt.brand_id = ?";
      params.push(filters.brand_id);
    }

    if (filters?.date_range) {
      if (filters.date_range === 'week') {
        query += " AND slt.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
      } else if (filters.date_range === 'month') {
        query += " AND slt.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
      }
    }

    query += " ORDER BY slt.created_at DESC";

    const [rows] = await this.pool.execute(query, params);
    return rows as SocialLinkedinTwitter[];
  }

  async getLinkedinTwitterPostById(id: string): Promise<SocialLinkedinTwitter | undefined> {
    const [rows] = await this.pool.execute(
      "SELECT * FROM social_linkedin_twitter WHERE id = ?",
      [id]
    );
    const result = rows as SocialLinkedinTwitter[];
    return result[0];
  }

  async createLinkedinTwitterPost(post: InsertLinkedinTwitter): Promise<SocialLinkedinTwitter> {
    const id = randomUUID();
    await this.pool.execute(
      `INSERT INTO social_linkedin_twitter 
       (id, brand_id, twitter_content, linkedin_content, date_posted, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, post.brand_id, post.twitter_content, post.linkedin_content, post.date_posted, post.status]
    );
    return this.getLinkedinTwitterPostById(id) as Promise<SocialLinkedinTwitter>;
  }

  async updateLinkedinTwitterPost(id: string, post: Partial<InsertLinkedinTwitter>): Promise<SocialLinkedinTwitter> {
    const fields = [];
    const values = [];

    if (post.twitter_content !== undefined) {
      fields.push("twitter_content = ?");
      values.push(post.twitter_content);
    }
    if (post.linkedin_content !== undefined) {
      fields.push("linkedin_content = ?");
      values.push(post.linkedin_content);
    }
    if (post.date_posted !== undefined) {
      fields.push("date_posted = ?");
      values.push(post.date_posted);
    }
    if (post.status !== undefined) {
      fields.push("status = ?");
      values.push(post.status);
    }

    if (fields.length > 0) {
      values.push(id);
      await this.pool.execute(
        `UPDATE social_linkedin_twitter SET ${fields.join(", ")} WHERE id = ?`,
        values
      );
    }

    return this.getLinkedinTwitterPostById(id) as Promise<SocialLinkedinTwitter>;
  }

  async deleteLinkedinTwitterPost(id: string): Promise<void> {
    await this.pool.execute("DELETE FROM social_linkedin_twitter WHERE id = ?", [id]);
  }

  // Dashboard metrics
  async getDashboardMetrics(filters?: {
    brand_id?: string;
    date_range?: string;
  }): Promise<DashboardMetrics> {
    let dateFilter = "";
    const params: any[] = [];

    if (filters?.date_range) {
      if (filters.date_range === 'week') {
        dateFilter = " AND created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
      } else if (filters.date_range === 'month') {
        dateFilter = " AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
      }
    }

    let brandFilter = "";
    if (filters?.brand_id) {
      brandFilter = " AND brand_id = ?";
      params.push(filters.brand_id);
    }

    // Get Instagram posts count
    const [instagramRows] = await this.pool.execute(
      `SELECT COUNT(*) as count FROM social_instagram_tiktok 
       WHERE status = 'published' AND instagram_content IS NOT NULL${dateFilter}${brandFilter}`,
      params
    );
    const instagramPosts = (instagramRows as any[])[0].count;

    // Get TikTok posts count
    const [tiktokRows] = await this.pool.execute(
      `SELECT COUNT(*) as count FROM social_instagram_tiktok 
       WHERE status = 'published' AND tiktok_content IS NOT NULL${dateFilter}${brandFilter}`,
      params
    );
    const tiktokPosts = (tiktokRows as any[])[0].count;

    // Get LinkedIn posts count
    const [linkedinRows] = await this.pool.execute(
      `SELECT COUNT(*) as count FROM social_linkedin_twitter 
       WHERE status = 'published' AND linkedin_content IS NOT NULL${dateFilter}${brandFilter}`,
      params
    );
    const linkedinPosts = (linkedinRows as any[])[0].count;

    // Get Twitter posts count
    const [twitterRows] = await this.pool.execute(
      `SELECT COUNT(*) as count FROM social_linkedin_twitter 
       WHERE status = 'published' AND twitter_content IS NOT NULL${dateFilter}${brandFilter}`,
      params
    );
    const twitterPosts = (twitterRows as any[])[0].count;

    return {
      totalPosts: instagramPosts + tiktokPosts + linkedinPosts + twitterPosts,
      instagramPosts,
      tiktokPosts,
      linkedinPosts,
      twitterPosts,
    };
  }

  async getLatestPosts(limit = 10, filters?: { brand_id?: string; date_range?: string }): Promise<PostWithBrand[]> {
    let dateFilter = "";
    const params: any[] = [];

    if (filters?.date_range) {
      if (filters.date_range === 'week') {
        dateFilter = " AND created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
      } else if (filters.date_range === 'month') {
        dateFilter = " AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
      }
    }

    let brandFilter = "";
    if (filters?.brand_id) {
      brandFilter = " AND brand_id = ?";
      params.push(filters.brand_id);
    }

    const query = `
      SELECT 
        'instagram' as platform,
        CONCAT(sit.id, '_instagram') as id,
        b.name as brand_name,
        sit.instagram_content as content,
        sit.created_at as date,
        sit.status
      FROM social_instagram_tiktok sit
      JOIN brands b ON sit.brand_id = b.id
      WHERE sit.status = 'published' AND sit.instagram_content IS NOT NULL${dateFilter}${brandFilter}
      
      UNION ALL
      
      SELECT 
        'tiktok' as platform,
        CONCAT(sit.id, '_tiktok') as id,
        b.name as brand_name,
        sit.tiktok_content as content,
        sit.created_at as date,
        sit.status
      FROM social_instagram_tiktok sit
      JOIN brands b ON sit.brand_id = b.id
      WHERE sit.status = 'published' AND sit.tiktok_content IS NOT NULL${dateFilter}${brandFilter}
      
      UNION ALL
      
      SELECT 
        'linkedin' as platform,
        CONCAT(slt.id, '_linkedin') as id,
        b.name as brand_name,
        slt.linkedin_content as content,
        slt.created_at as date,
        slt.status
      FROM social_linkedin_twitter slt
      JOIN brands b ON slt.brand_id = b.id
      WHERE slt.status = 'published' AND slt.linkedin_content IS NOT NULL${dateFilter}${brandFilter}
      
      UNION ALL
      
      SELECT 
        'twitter' as platform,
        CONCAT(slt.id, '_twitter') as id,
        b.name as brand_name,
        slt.twitter_content as content,
        slt.created_at as date,
        slt.status
      FROM social_linkedin_twitter slt
      JOIN brands b ON slt.brand_id = b.id
      WHERE slt.status = 'published' AND slt.twitter_content IS NOT NULL${dateFilter}${brandFilter}
      
      ORDER BY date DESC
      LIMIT ?
    `;

    const [rows] = await this.pool.execute(query, [...params, ...params, ...params, ...params, limit]);
    return rows as PostWithBrand[];
  }

  async getBrandStats(): Promise<BrandStats[]> {
    const query = `
      SELECT 
        b.id as brand_id,
        b.name as brand_name,
        COALESCE(instagram_count, 0) + COALESCE(tiktok_count, 0) + 
        COALESCE(linkedin_count, 0) + COALESCE(twitter_count, 0) as post_count
      FROM brands b
      LEFT JOIN (
        SELECT 
          brand_id,
          SUM(CASE WHEN instagram_content IS NOT NULL AND status = 'published' THEN 1 ELSE 0 END) as instagram_count,
          SUM(CASE WHEN tiktok_content IS NOT NULL AND status = 'published' THEN 1 ELSE 0 END) as tiktok_count
        FROM social_instagram_tiktok 
        GROUP BY brand_id
      ) sit ON b.id = sit.brand_id
      LEFT JOIN (
        SELECT 
          brand_id,
          SUM(CASE WHEN linkedin_content IS NOT NULL AND status = 'published' THEN 1 ELSE 0 END) as linkedin_count,
          SUM(CASE WHEN twitter_content IS NOT NULL AND status = 'published' THEN 1 ELSE 0 END) as twitter_count
        FROM social_linkedin_twitter 
        GROUP BY brand_id
      ) slt ON b.id = slt.brand_id
      ORDER BY post_count DESC
    `;

    const [rows] = await this.pool.execute(query);
    return rows as BrandStats[];
  }
}

export const storage = new MySQLStorage();
