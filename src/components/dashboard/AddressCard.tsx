import { MapPin, Edit, Trash2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Address } from "@/hooks/useAddresses";

type AddressCardProps = {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
};

export default function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{address.label}</CardTitle>
            {address.is_default && (
              <Badge variant="secondary" className="ml-2">
                <Star className="h-3 w-3 mr-1" />
                Default
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(address)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(address.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p className="font-medium">{address.full_name}</p>
          <p className="text-muted-foreground">{address.address_line1}</p>
          {address.address_line2 && (
            <p className="text-muted-foreground">{address.address_line2}</p>
          )}
          <p className="text-muted-foreground">
            {address.city}, {address.state_province} {address.postal_code}
          </p>
          <p className="text-muted-foreground">{address.country}</p>
          <p className="text-muted-foreground">{address.phone_number}</p>
        </div>
        {!address.is_default && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => onSetDefault(address.id)}
          >
            Set as Default
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
