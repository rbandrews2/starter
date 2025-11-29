# Complete Dashboard Page Example

## Full Implementation

```typescript
// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import StatCard from '@/components/StatCard';
import WorkOrderCard from '@/components/WorkOrderCard';
import EquipmentCard from '@/components/EquipmentCard';
import TeamMemberCard from '@/components/TeamMemberCard';
import TrainingModuleCard from '@/components/TrainingModuleCard';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-black via-zinc-900 to-black overflow-hidden">
        <img 
          src="/hero-construction.jpg" 
          alt="Construction" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">Work Zone OS</h1>
            <p className="text-xl text-gray-200 mb-6 max-w-2xl">
              The Operating System For Road Crews
            </p>
            <button className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold 
                             hover:bg-amber-400 transition-all hover:shadow-[0_0_20px_rgba(255,179,0,0.5)]">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Active Orders" 
            value={12}
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>}
            trend="+12%"
            trendUp
          />
        </div>

        {/* Work Orders */}
        <h2 className="text-2xl font-bold text-white mb-4">Recent Work Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WorkOrderCard
            id="WO-001"
            title="Road Repair"
            location="I-81 Mile 45"
            status="in-progress"
            priority="high"
            assignedTo="John Doe"
          />
        </div>
      </div>
    </div>
  );
}
```

## Key Features
- Glass-morphism cards with backdrop blur
- Amber accent colors (#FFB300)
- Smooth hover effects with glow
- Fully responsive grid layouts
- Dark theme with gradient backgrounds
