import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Sparkles } from "lucide-react";
import { CatalogueProduct } from "@/hooks/useCatalogueProducts";

interface BeautyTipCardProps {
  product: CatalogueProduct;
  onImageClick: () => void;
}

export function BeautyTipCard({ product, onImageClick }: BeautyTipCardProps) {
  const [isUseCaseOpen, setIsUseCaseOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div 
        className="relative h-56 overflow-hidden cursor-pointer group bg-muted"
        onClick={onImageClick}
      >
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-xs text-muted-foreground">Image unavailable</p>
            </div>
          </div>
        )}
        {product.category && (
          <Badge className="absolute top-2 right-2 capitalize">
            {product.category}
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-base mb-2 line-clamp-2">{product.name}</h3>
        
        {product.funFact && (
          <div className="bg-accent/30 rounded-lg p-3 mb-3">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-xs mb-1">Did You Know?</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{product.funFact}</p>
              </div>
            </div>
          </div>
        )}

        {product.instructions && (
          <Collapsible open={isUseCaseOpen} onOpenChange={setIsUseCaseOpen} className="mt-auto">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <span className="font-semibold text-sm">How to Use</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isUseCaseOpen ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <p className="text-xs text-muted-foreground whitespace-pre-line pl-2 border-l-2 border-primary/20">
                {product.instructions}
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
