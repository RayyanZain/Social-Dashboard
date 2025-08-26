import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MetricsCards from "@/components/dashboard/metrics-cards";
import Charts from "@/components/dashboard/charts";
import PostsTable from "@/components/dashboard/posts-table";
import Filters from "@/components/dashboard/filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { DashboardMetrics, PostWithBrand, BrandStats } from "@shared/schema";

export default function Dashboard() {
  const [filters, setFilters] = useState({
    brand_id: "",
    date_range: "month",
    platform: "",
  });

  const { toast } = useToast();

  const {
    data: metrics,
    isLoading: metricsLoading,
    refetch: refetchMetrics,
  } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics", filters.brand_id, filters.date_range],
    enabled: true,
    queryFn: () =>
      fetch(
        `/api/dashboard/metrics?${new URLSearchParams({
          ...(filters.brand_id ? { brand_id: filters.brand_id } : {}),
          ...(filters.date_range ? { date_range: filters.date_range } : {}),
        })}`,
      ).then((r) => r.json()),
  });

  const {
    data: latestPosts,
    isLoading: postsLoading,
    refetch: refetchPosts,
  } = useQuery<PostWithBrand[]>({
    queryKey: [
      "/api/dashboard/latest-posts",
      filters.brand_id,
      filters.date_range,
    ],
    enabled: true,
    queryFn: () =>
      fetch(
        `/api/dashboard/latest-posts?${new URLSearchParams({
          ...(filters.brand_id ? { brand_id: filters.brand_id } : {}),
          ...(filters.date_range ? { date_range: filters.date_range } : {}),
        })}`,
      ).then((r) => r.json()),
  });

  const {
    data: brandStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery<BrandStats[]>({
    queryKey: ["/api/dashboard/brand-stats"],
    enabled: true,
  });

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchMetrics(), refetchPosts(), refetchStats()]);
      toast({
        title: "Data refreshed",
        description: "Dashboard data has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh dashboard data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Monitor your social media automation across all platforms
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Filters filters={filters} onFiltersChange={setFilters} />
          <Button onClick={handleRefresh} variant="outline" data-testid="button-refresh">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <MetricsCards metrics={metrics} loading={metricsLoading} />

      {/* Charts Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <Charts 
          brandStats={brandStats} 
          metrics={metrics}
          loading={statsLoading || metricsLoading} 
        />
      </div>

      {/* Latest Posts Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Latest Posts</CardTitle>
            <Button data-testid="button-add-post">
              <Plus className="h-4 w-4 mr-2" />
              Add Post
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PostsTable
            posts={latestPosts}
            loading={postsLoading}
            onFilterChange={(partial) =>
              setFilters((prev) => ({ ...prev, ...partial }))
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
