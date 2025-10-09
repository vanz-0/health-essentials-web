import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  sku: z.string().optional(),
  currency: z.string().default("KES"),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: any;
  onSuccess?: () => void;
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description || "",
      price: parseFloat(product.price),
      sku: product.sku || "",
      currency: product.currency || "KES",
      active: product.active ?? true,
      featured: product.featured ?? false,
    } : {
      currency: "KES",
      active: true,
      featured: false,
    }
  });

  const onSubmit = async (data: ProductFormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (product) {
        const { error } = await supabase
          .from('products')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', product.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{
            name: data.name,
            description: data.description,
            price: data.price,
            sku: data.sku,
            currency: data.currency,
            active: data.active,
            featured: data.featured,
            user_id: user.id,
          }]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Enter product name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Enter product description"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            {...register("currency")}
            placeholder="KES"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sku">SKU</Label>
        <Input
          id="sku"
          {...register("sku")}
          placeholder="Enter SKU (optional)"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="active">Active</Label>
        <Switch
          id="active"
          checked={watch("active")}
          onCheckedChange={(checked) => setValue("active", checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="featured">Featured</Label>
        <Switch
          id="featured"
          checked={watch("featured")}
          onCheckedChange={(checked) => setValue("featured", checked)}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
