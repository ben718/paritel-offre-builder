
import * as React from "react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface CustomLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  error?: boolean;
}

const CustomLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  CustomLabelProps
>(({ className, error, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      {...props}
    />
  )
})
CustomLabel.displayName = "CustomLabel"

export { CustomLabel }
