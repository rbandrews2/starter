# Button & Input Components

Reusable form components matching your glass-morphism aesthetic.

## File: `src/components/ui/Button.tsx`

```typescript
import { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  children: ReactNode
}

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  const baseStyles = "px-5 py-2.5 rounded-lg font-semibold transition-all duration-200"
  
  const variants = {
    primary: "bg-wz_yellow text-black hover:bg-wz_yellow_glow hover:shadow-glow",
    secondary: "border border-wz_yellow text-wz_yellow hover:bg-wz_yellow hover:text-black",
    ghost: "text-gray-300 hover:text-wz_yellow hover:bg-wz_glass"
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

## File: `src/components/ui/Input.tsx`

```typescript
import { InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-wz_glass backdrop-blur-md
            border border-wz_border
            text-white placeholder-gray-500
            focus:outline-none focus:border-wz_yellow focus:ring-1 focus:ring-wz_yellow
            transition-all
            ${error ? "border-red-500" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
```

## Usage Example

```typescript
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
/>

<Button variant="primary">Submit</Button>
<Button variant="secondary">Cancel</Button>
```
