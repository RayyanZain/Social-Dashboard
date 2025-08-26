import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBrandSchema, insertInstagramTiktokSchema, insertLinkedinTwitterSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Brand routes
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  app.get("/api/brands/:id", async (req, res) => {
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

  app.post("/api/brands", async (req, res) => {
    try {
      const validatedData = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(validatedData);
      res.status(201).json(brand);
    } catch (error) {
      console.error("Error creating brand:", error);
      res.status(400).json({ message: "Failed to create brand" });
    }
  });

  app.put("/api/brands/:id", async (req, res) => {
    try {
      const validatedData = insertBrandSchema.partial().parse(req.body);
      const brand = await storage.updateBrand(req.params.id, validatedData);
      res.json(brand);
    } catch (error) {
      console.error("Error updating brand:", error);
      res.status(400).json({ message: "Failed to update brand" });
    }
  });

  app.delete("/api/brands/:id", async (req, res) => {
    try {
      await storage.deleteBrand(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting brand:", error);
      res.status(500).json({ message: "Failed to delete brand" });
    }
  });

  // Instagram/TikTok routes
  app.get("/api/instagram-tiktok", async (req, res) => {
    try {
      const filters = {
        brand_id: req.query.brand_id as string,
        status: req.query.status as string,
        date_range: req.query.date_range as string,
      };
      const posts = await storage.getInstagramTiktokPosts(filters);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching Instagram/TikTok posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/instagram-tiktok", async (req, res) => {
    try {
      const validatedData = insertInstagramTiktokSchema.parse(req.body);
      const post = await storage.createInstagramTiktokPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating Instagram/TikTok post:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });

  app.put("/api/instagram-tiktok/:id", async (req, res) => {
    try {
      const validatedData = insertInstagramTiktokSchema.partial().parse(req.body);
      const post = await storage.updateInstagramTiktokPost(req.params.id, validatedData);
      res.json(post);
    } catch (error) {
      console.error("Error updating Instagram/TikTok post:", error);
      res.status(400).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/instagram-tiktok/:id", async (req, res) => {
    try {
      await storage.deleteInstagramTiktokPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting Instagram/TikTok post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // LinkedIn/Twitter routes
  app.get("/api/linkedin-twitter", async (req, res) => {
    try {
      const filters = {
        brand_id: req.query.brand_id as string,
        status: req.query.status as string,
        date_range: req.query.date_range as string,
      };
      const posts = await storage.getLinkedinTwitterPosts(filters);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching LinkedIn/Twitter posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/linkedin-twitter", async (req, res) => {
    try {
      const validatedData = insertLinkedinTwitterSchema.parse(req.body);
      const post = await storage.createLinkedinTwitterPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating LinkedIn/Twitter post:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });

  app.put("/api/linkedin-twitter/:id", async (req, res) => {
    try {
      const validatedData = insertLinkedinTwitterSchema.partial().parse(req.body);
      const post = await storage.updateLinkedinTwitterPost(req.params.id, validatedData);
      res.json(post);
    } catch (error) {
      console.error("Error updating LinkedIn/Twitter post:", error);
      res.status(400).json({ message: "Failed to update post" });
    }
  });

  app.delete("/api/linkedin-twitter/:id", async (req, res) => {
    try {
      await storage.deleteLinkedinTwitterPost(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting LinkedIn/Twitter post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Dashboard metrics routes
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const filters = {
        brand_id: req.query.brand_id as string,
        date_range: req.query.date_range as string,
      };
      const metrics = await storage.getDashboardMetrics(filters);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  app.get("/api/dashboard/latest-posts", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const brandId = req.query.brand_id as string | undefined;
      const dateRange = req.query.date_range as string | undefined;
      const posts = await storage.getLatestPosts(limit, { brand_id: brandId, date_range: dateRange });
      res.json(posts);
    } catch (error) {
      console.error("Error fetching latest posts:", error);
      res.status(500).json({ message: "Failed to fetch latest posts" });
    }
  });

  app.get("/api/dashboard/brand-stats", async (req, res) => {
    try {
      const stats = await storage.getBrandStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching brand stats:", error);
      res.status(500).json({ message: "Failed to fetch brand stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
