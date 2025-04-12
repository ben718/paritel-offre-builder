
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          {icon && (
            <div className="h-8 w-8 rounded-md flex items-center justify-center bg-gray-100">
              {icon}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-baseline">
          <h3 className="text-2xl font-semibold text-foreground">{value}</h3>
          {trend && (
            <span
              className={cn(
                "ml-2 text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground flex items-center">
            <Info className="h-3 w-3 mr-1" />
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
