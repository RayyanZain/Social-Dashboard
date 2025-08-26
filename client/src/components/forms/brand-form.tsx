import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertBrandSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface BrandFormProps {
  brand?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function BrandForm({ brand, onSuccess, onCancel }: BrandFormProps) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertBrandSchema),
    defaultValues: {
      name: brand?.name || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (brand?.id) {
        return await apiRequest("PUT", `/api/brands/${brand.id}`, data);
      } else {
        return await apiRequest("POST", "/api/brands", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/brand-stats"] });
      toast({
        title: brand?.id ? "Brand updated" : "Brand created",
        description: brand?.id 
          ? "Brand has been successfully updated." 
          : "Brand has been successfully created.",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: brand?.id 
          ? "Failed to update brand. Please try again."
          : "Failed to create brand. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter brand name"
                  {...field}
                  data-testid="input-brand-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            data-testid="button-cancel-brand"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            data-testid="button-save-brand"
          >
            {mutation.isPending
              ? "Saving..."
              : brand?.id
              ? "Update Brand"
              : "Create Brand"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
