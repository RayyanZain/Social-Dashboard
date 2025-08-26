import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Brand } from "@shared/schema";

interface FiltersProps {
  filters: {
    brand_id: string;
    date_range: string;
    platform: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function Filters({ filters, onFiltersChange }: FiltersProps) {
  const { data: brands } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
    enabled: true,
  });

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? "" : value,
    });
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Brand Filter */}
      <div className="space-y-1">
        <Label htmlFor="brand-filter" className="text-xs">Brand</Label>
        <Select
          value={filters.brand_id}
          onValueChange={(value) => handleFilterChange("brand_id", value)}
        >
          <SelectTrigger className="w-40" id="brand-filter" data-testid="select-brand-filter">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands?.map((brand: any) => (
              <SelectItem key={brand.id} value={brand.id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Filter */}
      <div className="space-y-1">
        <Label htmlFor="date-filter" className="text-xs">Date Range</Label>
        <Select
          value={filters.date_range}
          onValueChange={(value) => handleFilterChange("date_range", value)}
        >
          <SelectTrigger className="w-40" id="date-filter" data-testid="select-date-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Platform Filter */}
      <div className="space-y-1">
        <Label htmlFor="platform-filter" className="text-xs">Platform</Label>
        <Select
          value={filters.platform}
          onValueChange={(value) => handleFilterChange("platform", value)}
        >
          <SelectTrigger className="w-40" id="platform-filter" data-testid="select-platform-filter">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
