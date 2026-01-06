"use client"

import * as React from "react"
import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      richColors
      closeButton
      duration={4000}
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4 text-green-600" />,
        info: <Info className="h-4 w-4 text-blue-600" />,
        warning: <TriangleAlert className="h-4 w-4 text-yellow-600" />,
        error: <OctagonX className="h-4 w-4 text-red-600" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
          "group toast relative flex gap-3 rounded-xl border px-4 py-3 shadow-lg " +
          "bg-background text-foreground border-border " +
          "data-[state=open]:animate-in data-[state=closed]:animate-out " +
          "data-[state=closed]:fade-out-80 data-[state=open]:fade-in-80 " +
          "data-[state=closed]:slide-out-to-right-full " +
          "data-[state=open]:slide-in-from-top-full",


          title: "text-sm font-semibold",
          description: "text-sm text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton:
            "bg-muted text-muted-foreground hover:bg-muted/80",
          closeButton:
            "absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:text-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
