import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PostsTableProps {
  posts?: Array<{
    id: string;
    brand_name: string;
    content: string;
    platform: string;
    date: string;
    status: string;
  }>;
  loading?: boolean;
  onFilterChange?: (filters: { brand_id?: string; date_range?: string }) => void;
  brands?: Array<{ id: string; name: string }>;
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return '📷';
    case 'tiktok':
      return '🎵';
    case 'linkedin':
      return '💼';
    case 'twitter':
      return '🐦';
    default:
      return '📱';
  }
};

export default function PostsTable({ posts, loading, onFilterChange, brands }: PostsTableProps) {
  const safePosts = Array.isArray(posts) ? posts : [];
  if (loading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Brand</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-48" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell><Skeleton className="h-8 w-24" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (!safePosts.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No posts found. Create your first post to get started.</p>
      </div>
    );
  }

  const handleChange = (key: string, value: string) => {
    onFilterChange?.({ [key]: value === 'all' ? '' : value });
  };

  return (
    <>
      {onFilterChange && (
        <div className="flex items-end gap-4 pb-4">
          <div className="space-y-1">
            <Label className="text-xs">Brand</Label>
            <Select onValueChange={(v) => handleChange('brand_id', v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands?.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Date Range</Label>
            <Select onValueChange={(v) => handleChange('date_range', v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="This Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      <Table data-testid="posts-table">
        <TableHeader>
          <TableRow>
            <TableHead>Brand</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safePosts.map((post) => (
            <TableRow key={post.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold text-sm">
                      {post.brand_name?.charAt(0) || 'B'}
                    </span>
                  </div>
                  <span className="font-medium" data-testid={`text-brand-${post.id}`}>
                    {post.brand_name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="mr-2">{getPlatformIcon(post.platform)}</span>
                  <span className="capitalize" data-testid={`text-platform-${post.id}`}>
                    {post.platform}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate" data-testid={`text-content-${post.id}`}>
                  {post.content}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground" data-testid={`text-date-${post.id}`}>
                {post.date ? format(new Date(post.date), 'MMM dd, HH:mm') : 'Unknown'}
              </TableCell>
              <TableCell>
                <Badge 
                  variant={post.status === 'published' ? 'default' : 'secondary'}
                  data-testid={`badge-status-${post.id}`}
                >
                  {post.status}
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
          ))}
        </TableBody>
      </Table>
    </>
  );
}
