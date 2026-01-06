import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

// ---------------- Alert Variants ----------------
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 pl-12 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default:
          "bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100",
        destructive:
          "bg-red-50 border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200 [&>svg]:text-red-700",
        success:
          "bg-green-50 border-green-300 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200 [&>svg]:text-green-700",
        warning:
          "bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200 [&>svg]:text-yellow-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// ---------------- Alert Component ----------------
interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: ReactNode // optional icon
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ variant }),
          "transition-all duration-200 ease-in-out shadow-sm hover:shadow-md",
          className
        )}
        {...props}
      >
        {icon && <span className="absolute left-4 top-4">{icon}</span>}
        <div>{children}</div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

// ---------------- Alert Title ----------------
const AlertTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn(
        "mb-1 text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
)
AlertTitle.displayName = "AlertTitle"

// ---------------- Alert Description ----------------
const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-gray-600 dark:text-gray-300 [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
