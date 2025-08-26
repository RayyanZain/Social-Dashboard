// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import mysql from "mysql2/promise";
import { randomUUID } from "crypto";
var MySQLStorage = class {
  pool;
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || "148.163.69.162",
      user: process.env.DB_USER || "vyrade_post_logs",
      password: process.env.DB_PASSWORD || "y,EzwtE)}ydd2Atg",
      database: process.env.DB_NAME || "vyrade_post_logs",
      port: parseInt(process.env.DB_PORT || "3306"),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  // Brand operations
  async getBrands() {
    const [rows] = await this.pool.execute(
      "SELECT * FROM brands ORDER BY created_at DESC"
    );
    return rows;
  }
  async getBrandById(id) {
    const [rows] = await this.pool.execute(
      "SELECT * FROM brands WHERE id = ?",
      [id]
    );
    const result = rows;
    return result[0];
  }
  async createBrand(brand) {
    const id = randomUUID();
    await this.pool.execute(
      "INSERT INTO brands (id, name) VALUES (?, ?)",
      [id, brand.name]
    );
    return this.getBrandById(id);
  }
  async updateBrand(id, brand) {
    await this.pool.execute(
      "UPDATE brands SET name = ? WHERE id = ?",
      [brand.name, id]
    );
    return this.getBrandById(id);
  }
  async deleteBrand(id) {
    await this.pool.execute("DELETE FROM brands WHERE id = ?", [id]);
  }
  // Instagram/TikTok operations
  async getInstagramTiktokPosts(filters) {
    let query = `
      SELECT sit.*, b.name as brand_name 
      FROM social_instagram_tiktok sit 
      JOIN brands b ON sit.brand_id = b.id 
      WHERE sit.status = 'published'
    `;
    const params = [];
    if (filters?.brand_id) {
      query += " AND sit.brand_id = ?";
      params.push(filters.brand_id);
    }
    if (filters?.date_range) {
      if (filters.date_range === "week") {
        query += " AND sit.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
      } else if (filters.date_range === "month") {
        query += " AND sit.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
      }
    }
    query += " ORDER BY sit.created_at DESC";
    const [rows] = await this.pool.execute(query, params);
    return rows;
  }
  async getInstagramTiktokPostById(id) {
    const [rows] = await this.pool.execute(
      "SELECT * FROM social_instagram_tiktok WHERE id = ?",
      [id]
    );
    const result = rows;
    return result[0];
  }
  async createInstagramTiktokPost(post) {
    const id = randomUUID();
    await this.pool.execute(
      `INSERT INTO social_instagram_tiktok 
       (id, brand_id, generated_reel_video, instagram_content, tiktok_content, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, post.brand_id, post.generated_reel_video, post.instagram_content, post.tiktok_content, post.status]
    );
    return this.getInstagramTiktokPostById(id);
  }
  async updateInstagramTiktokPost(id, post) {
    const fields = [];
    const values = [];
    if (post.generated_reel_video !== void 0) {
      fields.push("generated_reel_video = ?");
      values.push(post.generated_reel_video);
    }
    if (post.instagram_content !== void 0) {
      fields.push("instagram_content = ?");
      values.push(post.instagram_content);
    }
    if (post.tiktok_content !== void 0) {
      fields.push("tiktok_content = ?");
      values.push(post.tiktok_content);
    }
    if (post.status !== void 0) {
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
    return this.getInstagramTiktokPostById(id);
  }
  async deleteInstagramTiktokPost(id) {
    await this.pool.execute("DELETE FROM social_instagram_tiktok WHERE id = ?", [id]);
  }
  // LinkedIn/Twitter operations
  async getLinkedinTwitterPosts(filters) {
    let query = `
      SELECT slt.*, b.name as brand_name 
      FROM social_linkedin_twitter slt 
      JOIN brands b ON slt.brand_id = b.id 
      WHERE slt.status = 'published'
    `;
    const params = [];
    if (filters?.brand_id) {
      query += " AND slt.brand_id = ?";
      params.push(filters.brand_id);
    }
    if (filters?.date_range) {
      if (filters.date_range === "week") {
        query += " AND slt.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
      } else if (filters.date_range === "month") {
        query += " AND slt.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
      }
    }
    query += " ORDER BY slt.created_at DESC";
    const [rows] = await this.pool.execute(query, params);
    return rows;
  }
  async getLinkedinTwitterPostById(id) {
    const [rows] = await this.pool.execute(
      "SELECT * FROM social_linkedin_twitter WHERE id = ?",
      [id]
    );
    const result = rows;
    return result[0];
  }
  async createLinkedinTwitterPost(post) {
    const id = randomUUID();
    await this.pool.execute(
      `INSERT INTO social_linkedin_twitter 
       (id, brand_id, twitter_content, linkedin_content, date_posted, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, post.brand_id, post.twitter_content, post.linkedin_content, post.date_posted, post.status]
    );
    return this.getLinkedinTwitterPostById(id);
  }
  async updateLinkedinTwitterPost(id, post) {
    const fields = [];
    const values = [];
    if (post.twitter_content !== void 0) {
      fields.push("twitter_content = ?");
      values.push(post.twitter_content);
    }
    if (post.linkedin_content !== void 0) {
      fields.push("linkedin_content = ?");
      values.push(post.linkedin_content);
    }
    if (post.date_posted !== void 0) {
      fields.push("date_posted = ?");
      values.push(post.date_posted);
    }
    if (post.status !== void 0) {
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
    return this.getLinkedinTwitterPostById(id);
  }
  async deleteLinkedinTwitterPost(id) {
    await this.pool.execute("DELETE FROM social_linkedin_twitter WHERE id = ?", [id]);
  }
  // Dashboard metrics
  async getDashboardMetrics(filters) {
    let dateFilter = "";
    const params = [];
    if (filters?.date_range) {
      if (filters.date_range === "week") {
        dateFilter = " AND created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
      } else if (filters.date_range === "month") {
        dateFilter = " AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
      }
    }
    let brandFilter = "";
    if (filters?.brand_id) {
      brandFilter = " AND brand_id = ?";
      params.push(filters.brand_id);
    }
    const [instagramRows] = await this.pool.execute(
      `SELECT COUNT(*) as count FROM social_instagram_tiktok 
       WHERE status = 'published' AND instagram_content IS NOT NULL${dateFilter}${brandFilter}`,
      params
    );
    const instagramPosts = instagramRows[0].count;
    const [tiktokRows] = await this.pool.execute(
      `SELECT COUNT(*) as count FROM social_instagram_tiktok 
       WHERE status = 'published' AND tiktok_content IS NOT NULL${dateFilter}${brandFilter}`,
      params
    );
    const tiktokPosts = tiktokRows[0].count;
    const [linkedinRows] = await this.pool.execute(
      `SELECT COUNT(*) as count FROM social_linkedin_twitter 
       WHERE status = 'published' AND linkedin_content IS NOT NULL${dateFilter}${brandFilter}`,
      params
    );
    const linkedinPosts = linkedinRows[0].count;
    const [twitterRows] = await this.pool.execute(
      `SELECT COUNT(*) as count FROM social_linkedin_twitter 
       WHERE status = 'published' AND twitter_content IS NOT NULL${dateFilter}${brandFilter}`,
      params
    );
    const twitterPosts = twitterRows[0].count;
    return {
      totalPosts: instagramPosts + tiktokPosts + linkedinPosts + twitterPosts,
      instagramPosts,
      tiktokPosts,
      linkedinPosts,
      twitterPosts
    };
  }
  async getLatestPosts(limit = 10) {
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
      WHERE sit.status = 'published' AND sit.instagram_content IS NOT NULL
      
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
      WHERE sit.status = 'published' AND sit.tiktok_content IS NOT NULL
      
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
      WHERE slt.status = 'published' AND slt.linkedin_content IS NOT NULL
      
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
      WHERE slt.status = 'published' AND slt.twitter_content IS NOT NULL
      
      ORDER BY date DESC
      LIMIT ?
    `;
    const [rows] = await this.pool.execute(query, [limit]);
    return rows;
  }
  async getBrandStats() {
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
    return rows;
  }
};
var storage = new MySQLStorage();

// shared/schema.ts
import { z } from "zod";
var insertBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(255, "Brand name too long")
});
var insertInstagramTiktokSchema = z.object({
  brand_id: z.string().min(1, "Brand is required"),
  generated_reel_video: z.string().optional(),
  instagram_content: z.string().optional(),
  tiktok_content: z.string().optional(),
  status: z.enum(["published", "scheduled", "draft", "failed"]).default("draft")
});
var insertLinkedinTwitterSchema = z.object({
  brand_id: z.string().min(1, "Brand is required"),
  twitter_content: z.string().optional(),
  linkedin_content: z.string().optional(),
  date_posted: z.string().optional(),
  status: z.enum(["published", "scheduled", "draft", "failed"]).default("draft")
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });
  app2.get("/api/brands/:id", async (req, res) => {
    try {
      const brand = await storage.getBrandById(req.params.id);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error) {
      console.error("Error fetching brand:", error);
      res.status(500).json({ message: "Failed to fetch brand" });
    }
  });
  app2.post("/api/brands", async (req, res) => {
    try {
      const validatedData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(validatedData);
      res.status(201).json(brand);
    } catch (error) {
      console.error("Error creating brand:", error);
      res.status(400).json({ message: "Failed to create brand" });
    }
  });
  app2.put("/api/brands/:id", async (req, res) => {
    try {
      const validatedData = insertBrandSchema.partial().parse(req.body);
      const brand = await storage.updateBrand(req.params.id, validatedData);
      res.json(brand);
    } catch (error) {
      console.error("Error updating brand:", error);
      res.status(400).json({ message: "Failed to update brand" });
    }
  });
  app2.delete("/api/brands/:id", async (req, res) => {
    try {
      await storage.deleteBrand(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting brand:", error);
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });
  app2.get("/api/instagram-tiktok", async (req, res) => {
    try {
      const filters = {
        brand_id: req.query.brand_id,
        status: req.query.status,
        date_range: req.query.date_range
      };
      const posts = await storage.getInstagramTiktokPosts(filters);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching Instagram/TikTok posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });
  app2.post("/api/instagram-tiktok", async (req, res) => {
    try {
      const validatedData = insertInstagramTiktokSchema.parse(req.body);
      const post = await storage.createInstagramTiktokPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating Instagram/TikTok post:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });
  app2.put("/api/instagram-tiktok/:id", async (req, res) => {
    try {
      const validatedData = insertInstagramTiktokSchema.partial().parse(req.body);
      const post = await storage.updateInstagramTiktokPost(req.params.id, validatedData);
      res.json(post);
    } catch (error) {
      console.error("Error updating Instagram/TikTok post:", error);
      res.status(400).json({ message: "Failed to update post" });
    }
  });
  app2.delete("/api/instagram-tiktok/:id", async (req, res) => {
    try {
      await storage.deleteInstagramTiktokPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting Instagram/TikTok post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });
  app2.get("/api/linkedin-twitter", async (req, res) => {
    try {
      const filters = {
        brand_id: req.query.brand_id,
        status: req.query.status,
        date_range: req.query.date_range
      };
      const posts = await storage.getLinkedinTwitterPosts(filters);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching LinkedIn/Twitter posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });
  app2.post("/api/linkedin-twitter", async (req, res) => {
    try {
      const validatedData = insertLinkedinTwitterSchema.parse(req.body);
      const post = await storage.createLinkedinTwitterPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating LinkedIn/Twitter post:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });
  app2.put("/api/linkedin-twitter/:id", async (req, res) => {
    try {
      const validatedData = insertLinkedinTwitterSchema.partial().parse(req.body);
      const post = await storage.updateLinkedinTwitterPost(req.params.id, validatedData);
      res.json(post);
    } catch (error) {
      console.error("Error updating LinkedIn/Twitter post:", error);
      res.status(400).json({ message: "Failed to update post" });
    }
  });
  app2.delete("/api/linkedin-twitter/:id", async (req, res) => {
    try {
      await storage.deleteLinkedinTwitterPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting LinkedIn/Twitter post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });
  app2.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const filters = {
        brand_id: req.query.brand_id,
        date_range: req.query.date_range
      };
      const metrics = await storage.getDashboardMetrics(filters);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });
  app2.get("/api/dashboard/latest-posts", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const posts = await storage.getLatestPosts(limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching latest posts:", error);
      res.status(500).json({ message: "Failed to fetch latest posts" });
    }
  });
  app2.get("/api/dashboard/brand-stats", async (req, res) => {
    try {
      const stats = await storage.getBrandStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching brand stats:", error);
      res.status(500).json({ message: "Failed to fetch brand stats" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
