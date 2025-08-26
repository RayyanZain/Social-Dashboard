import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import BrandForm from "@/components/forms/brand-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import type { Brand } from "@shared/schema";

export default function Brands() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const { toast } = useToast();

  const {
    data: brands,
    isLoading,
    error,
  } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
    enabled: true,
  });

  const deleteBrandMutation = useMutation({
    mutationFn: async (brandId: string) => {
      await apiRequest("DELETE", `/api/brands/${brandId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      toast({
        title: "Brand deleted",
        description: "Brand has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Failed to delete brand. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (brand: any) => {
    setEditingBrand(brand);
    setIsDialogOpen(true);
  };

  const handleDelete = async (brandId: string, brandName: string) => {
    if (window.confirm(`Are you sure you want to delete "${brandName}"? This action cannot be undone.`)) {
      deleteBrandMutation.mutate(brandId);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingBrand(null);
  };

  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="text-center">
          <p className="text-red-500">Failed to load brands</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Brand Management</h2>
          <p className="text-muted-foreground">
            Create and manage your brands
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-brand">
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
            </DialogHeader>
            <BrandForm 
              brand={editingBrand}
              onSuccess={handleDialogClose}
              onCancel={handleDialogClose}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : brands?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">No brands found. Create your first brand to get started.</p>
            <Button onClick={() => setIsDialogOpen(true)} data-testid="button-create-first-brand">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Brand
            </Button>
          </div>
        ) : (
          brands?.map((brand: any) => (
            <Card key={brand.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg" data-testid={`text-brand-initial-${brand.id}`}>
                      {brand.name?.charAt(0).toUpperCase() || 'B'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(brand)}
                      data-testid={`button-edit-brand-${brand.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(brand.id, brand.name)}
                      data-testid={`button-delete-brand-${brand.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2" data-testid={`text-brand-name-${brand.id}`}>
                  {brand.name}
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Created:</span>
                    <span className="font-medium" data-testid={`text-brand-created-${brand.id}`}>
                      {brand.created_at ? format(new Date(brand.created_at), 'MMM yyyy') : 'Unknown'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
