import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertInstagramTiktokSchema } from "@shared/schema";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Brand } from "@shared/schema";

interface PostFormProps {
  post?: any;
  postType?: "instagram-tiktok" | "linkedin-twitter";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PostForm({ post, postType = "instagram-tiktok", onSuccess, onCancel }: PostFormProps) {
  const { toast } = useToast();

  const { data: brands } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
    enabled: true,
  });

  const form = useForm({
    resolver: zodResolver(insertInstagramTiktokSchema),
    defaultValues: {
      brand_id: post?.brand_id || "",
      generated_reel_video: post?.generated_reel_video || "",
      instagram_content: post?.instagram_content || "",
      tiktok_content: post?.tiktok_content || "",
      status: post?.status || "draft",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = postType === "instagram-tiktok" ? "/api/instagram-tiktok" : "/api/linkedin-twitter";
      
      if (post?.id) {
        return await apiRequest("PUT", `${endpoint}/${post.id}`, data);
      } else {
        return await apiRequest("POST", endpoint, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${postType}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/latest-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: post?.id ? "Post updated" : "Post created",
        description: post?.id 
          ? "Post has been successfully updated." 
          : "Post has been successfully created.",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: post?.id 
          ? "Failed to update post. Please try again."
          : "Failed to create post. Please try again.",
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
          name="brand_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-brand">
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands?.map((brand: any) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {postType === "instagram-tiktok" && (
          <>
            <FormField
              control={form.control}
              name="generated_reel_video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video File</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter video file name or URL"
                      {...field}
                      data-testid="input-video-file"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instagram_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Instagram post content..."
                      rows={3}
                      {...field}
                      data-testid="textarea-instagram-content"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tiktok_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TikTok Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter TikTok post content..."
                      rows={3}
                      {...field}
                      data-testid="textarea-tiktok-content"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            data-testid="button-cancel-post"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            data-testid="button-save-post"
          >
            {mutation.isPending
              ? "Saving..."
              : post?.id
              ? "Update Post"
              : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
