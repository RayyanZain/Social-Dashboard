import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Filters from "@/components/dashboard/filters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import type { SocialInstagramTiktok } from "@shared/schema";

export default function InstagramTiktok() {
  const [filters, setFilters] = useState({
    brand_id: "",
    date_range: "month",
    platform: "",
  });

  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<SocialInstagramTiktok[]>({
    queryKey: [
      "/api/instagram-tiktok",
      filters.brand_id,
      filters.date_range,
    ],
    enabled: true,
    retry: 3,
    staleTime: 30000,
    queryFn: () =>
      fetch(
        `/api/instagram-tiktok?${new URLSearchParams({
          ...(filters.brand_id ? { brand_id: filters.brand_id } : {}),
          ...(filters.date_range ? { date_range: filters.date_range } : {}),
        })}`,
      ).then((r) => r.json()),
  });

  if (error) {
    console.error("Instagram/TikTok posts error:", error);
    return (
      <div className="flex-1 p-6">
        <div className="text-center">
          <p className="text-red-500">Failed to load Instagram/TikTok posts</p>
          <p className="text-sm text-gray-500 mt-2">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Instagram & TikTok Logs</h2>
          <p className="text-muted-foreground">
            Manage your Instagram and TikTok posts
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Filters filters={filters} onFiltersChange={setFilters} />
          <Button data-testid="button-add-instagram-post">
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Button>
        </div>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Instagram & TikTok Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Video</TableHead>
                <TableHead>Instagram Content</TableHead>
                <TableHead>TikTok Content</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : posts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No Instagram/TikTok posts found. Create your first post to get started.
                  </TableCell>
                </TableRow>
              ) : (
                posts?.map((post: any) => (
                  <TableRow key={post.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary font-semibold text-sm">
                            {post.brand_name?.charAt(0) || 'B'}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900" data-testid={`text-brand-${post.id}`}>
                          {post.brand_name || 'Unknown Brand'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-gray-500">
                        <span className="text-sm" data-testid={`text-video-${post.id}`}>
                          {post.generated_reel_video || 'No video'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm" data-testid={`text-instagram-content-${post.id}`}>
                        {post.instagram_content || 'No content'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm" data-testid={`text-tiktok-content-${post.id}`}>
                        {post.tiktok_content || 'No content'}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500" data-testid={`text-created-${post.id}`}>
                      {post.created_at ? format(new Date(post.created_at), 'MMM dd, yyyy HH:mm') : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={post.status === 'published' ? 'default' : 'secondary'}
                        data-testid={`badge-status-${post.id}`}
                      >
                        {post.status || 'Unknown'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`button-edit-${post.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`button-view-${post.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          data-testid={`button-delete-${post.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
