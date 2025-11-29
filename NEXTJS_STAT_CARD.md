# StatCard Component

Dashboard statistics card with glass-morphism effect and amber accents.

## File: `src/components/dashboard/StatCard.tsx`

```typescript
import { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  subtitle?: string
}

export function StatCard({ title, value, icon, trend, subtitle }: StatCardProps) {
  return (
    <div className="
      bg-wz_glass
      backdrop-blur-md
      border border-wz_border
      rounded-xl
      shadow-glow
      p-6
      text-white
      transition-all
      hover:shadow-[0_0_25px_rgba(255,204,0,0.45)]
      hover:border-wz_yellow/30
    ">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">
          {title}
        </h3>
        {icon && (
          <div className="text-wz_yellow">
            {icon}
          </div>
        )}
      </div>

      <div className="mb-2">
        <p className="text-3xl font-bold text-white">
          {value}
        </p>
      </div>

      {(trend || subtitle) && (
        <div className="flex items-center gap-2 text-sm">
          {trend && (
            <span className={trend.isPositive ? "text-green-400" : "text-red-400"}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
          )}
          {subtitle && (
            <span className="text-gray-400">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  )
}
```

## Usage Example

```typescript
import { StatCard } from "@/components/dashboard/StatCard"

<StatCard
  title="Active Projects"
  value={24}
  trend={{ value: 12, isPositive: true }}
  subtitle="vs last month"
/>
```
