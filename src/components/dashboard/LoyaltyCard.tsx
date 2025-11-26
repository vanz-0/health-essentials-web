import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, TrendingUp, Award } from "lucide-react";
import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoyaltyCard() {
  const { loyaltyPoints, transactions, isLoading } = useLoyaltyPoints();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const pointsBalance = loyaltyPoints?.points_balance || 0;
  const totalEarned = loyaltyPoints?.total_earned || 0;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Loyalty Points
        </CardTitle>
        <CardDescription>Earn 1 point per KSh 100 spent</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Available Points</p>
            <p className="text-3xl font-bold text-primary">{pointsBalance}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Earned</p>
            <p className="text-3xl font-bold">{totalEarned}</p>
          </div>
        </div>

        {transactions && transactions.length > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recent Activity
            </p>
            <div className="space-y-2 max-h-48 overflow-auto">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between text-sm p-2 bg-background/50 rounded"
                >
                  <div className="flex-1">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={transaction.type === "earned" ? "default" : "secondary"}
                    className="ml-2"
                  >
                    {transaction.type === "earned" ? "+" : "-"}
                    {Math.abs(transaction.points)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg">
          <Gift className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Redeem your points</p>
            <p className="text-muted-foreground">
              Contact us to redeem points for discounts on future purchases!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
