import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import StatCard from './dashboard/StatCard';
import WorkOrderCard from './workorders/WorkOrderCard';
import EquipmentCard from './equipment/EquipmentCard';
import TeamMemberCard from './team/TeamMemberCard';
import TrainingModuleCard from './training/TrainingModuleCard';
import WorkOrderModal from './modals/WorkOrderModal';
import TrainingModal from './modals/TrainingModal';
import TimeTrackingPanel from './time/TimeTrackingPanel';
import VideoLibrary from './training/VideoLibrary';
import AssistantNudges from './assistant/AssistantNudges';
import { supabase } from '@/lib/supabase';
import PwaInstallNudge from './assistant/PwaInstallNudge';
import ZoomMeetingCenter from './zoom/ZoomMeetingCenter';
import MessagingPanel from './messaging/MessagingPanel';
import IncidentReportsPanel from './incidents/IncidentReportsPanel';
import { useAuth } from '@/contexts/AuthContext';
import AuthLandingCard from './auth/AuthLandingCard';
import TimeOffPanel from './timeoff/TimeOffPanel';
import HazardMapPanel from "./map/HazardMapPanel";
import { workOrders, equipment, team, trainingModules } from '@/data/mockData';
import AssistantBubble from "@/components/assistant/AssistantBubble";
import AssistantPanel from "@/components/assistant/AssistantPanel";
import { useAssistant } from "@/contexts/AssistantContext";



const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<any>(null);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trainingFilter, setTrainingFilter] = useState('all');
  const [aiOpen, setAiOpen] = useState(false);


  const handleWorkOrderClick = (workOrder: any) => {
    setSelectedWorkOrder(workOrder);
    setIsModalOpen(true);
  };

  const handleTrainingClick = (module: any) => {
    setSelectedTraining(module);
    setIsTrainingModalOpen(true);
  };

  const filteredWorkOrders = statusFilter === 'all' 
    ? workOrders 
    : workOrders.filter(wo => wo.status === statusFilter);

  const filteredTraining = trainingFilter === 'all'
    ? trainingModules
    : trainingModules.filter(tm => tm.status === trainingFilter);


  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-black via-zinc-900 to-black overflow-hidden">
        <div className="absolute top-4 right-4 z-20">
          {user && (
            <button
              type="button"
              onClick={async () => {
                try {
                  await supabase.auth.signOut();
                } catch (e) {
                  console.error("sign out error", e);
                }
              }}
              className="text-xs px-3 py-1.5 rounded-full border border-amber-500/40 text-amber-200 bg-black/70 hover:bg-amber-500 hover:text-black transition-colors"
            >
              Sign out
            </button>
          )}
          <AssistantBubble onOpen={() => setAiOpen(true)} />
<AssistantPanel open={aiOpen} onClose={() => setAiOpen(false)} />

        </div>

        <img 
          src="https://d64gsuwffb70l.cloudfront.net/691a85289eef33309c99fc8f_1763468019992_735f8595.webp" 
          alt="Road Construction"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        {/* Amber glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="/wzos-logo.svg" 
                alt="WZOS Logo" 
                className="w-20 h-20 drop-shadow-[0_0_15px_rgba(255,179,0,0.5)]"
              />
              <h1 className="text-5xl font-bold text-white drop-shadow-lg">Work Zone OS</h1>
            </div>
            <p className="text-xl mb-6 max-w-2xl text-gray-200">The Operating System For Road Crews. Unified platform to manage work orders, equipment, training, and team performance in real-time.</p>

            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('workorders')}
                className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-all hover:shadow-[0_0_20px_rgba(255,179,0,0.5)]"
              >
                View Work Orders
              </button>
              <button className="bg-white/10 backdrop-blur-sm border border-amber-500/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all">
                Create New Order
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Navigation Tabs */}
      <div className="bg-black/40 backdrop-blur-md border-b border-amber-500/20 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto">
            {['overview', 'workorders', 'equipment', 'team', 'training', 'time', 'timeoff', 'incidents', 'messages', 'zoom', 'map'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'border-amber-500 text-amber-400' 
                    : 'border-transparent text-gray-400 hover:text-amber-300'
                }`}
              >
                {tab === 'workorders' ? 'Work Orders' : tab === 'time' ? 'Time Tracking' : tab === 'map' ? 'Map' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}

          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Sign in / Sign up helper when not authenticated */}
            {!user && (
              <AuthLandingCard />
            )}
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Active Work Orders" 
                value={workOrders.filter(w => w.status === 'in-progress').length}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                trend="+12% from last week"
                trendUp={true}
              />
              <StatCard 
                title="Equipment Available" 
                value={equipment.filter(e => e.status === 'available').length}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
              />
              <StatCard 
                title="Active Team Members" 
                value={team.filter(t => t.status === 'active').length}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
              />
              <StatCard 
                title="Total Hours Today" 
                value={team.reduce((sum, t) => sum + t.hoursToday, 0).toFixed(1)}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
            </div>

            {/* Quick access cards for key modules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('workorders')}
                className="group bg-black/50 border border-amber-500/40 rounded-xl px-4 py-3 flex flex-col items-start text-left hover:bg-black/70 hover:shadow-[0_0_18px_rgba(255,179,0,0.5)] transition-all"
              >
                <span className="text-xs text-amber-300 mb-1">Work Orders</span>
                <span className="text-[11px] text-gray-300">
                  View and manage active work zones, shifts, and job tickets.
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('equipment')}
                className="group bg-black/50 border border-amber-500/40 rounded-xl px-4 py-3 flex flex-col items-start text-left hover:bg-black/70 hover:shadow-[0_0_18px_rgba(255,179,0,0.5)] transition-all"
              >
                <span className="text-xs text-amber-300 mb-1">Equipment</span>
                <span className="text-[11px] text-gray-300">
                  Check fleet status and quickly spot what&apos;s down or available.
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('team')}
                className="group bg-black/50 border border-amber-500/40 rounded-xl px-4 py-3 flex flex-col items-start text-left hover:bg-black/70 hover:shadow-[0_0_18px_rgba(255,179,0,0.5)] transition-all"
              >
                <span className="text-xs text-amber-300 mb-1">Team</span>
                <span className="text-[11px] text-gray-300">
                  See who&apos;s on shift, their roles, and contact information.
                </span>
              </button>
            </div>

            {/* Recent Work Orders */}

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Recent Work Orders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workOrders.slice(0, 6).map(wo => (
                  <WorkOrderCard key={wo.id} {...wo} onClick={() => handleWorkOrderClick(wo)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workorders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-white">Work Orders</h2>
              <div className="flex gap-3">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-black/40 backdrop-blur-md border border-amber-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button className="bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-400 transition-all hover:shadow-[0_0_20px_rgba(255,179,0,0.5)]">
                  + New Order
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkOrders.map(wo => (
                <WorkOrderCard key={wo.id} {...wo} onClick={() => handleWorkOrderClick(wo)} />
              ))}
            </div>
          </div>
        )}


        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Equipment Fleet</h2>
              <button className="bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-400 transition-all hover:shadow-[0_0_20px_rgba(255,179,0,0.5)]">
                Add Equipment
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipment.map(eq => (
                <EquipmentCard key={eq.id} {...eq} onClick={() => alert(`Equipment: ${eq.name}`)} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Team Members</h2>
              <button className="bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-400 transition-all hover:shadow-[0_0_20px_rgba(255,179,0,0.5)]">
                Add Member
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map(member => (
                <TeamMemberCard key={member.id} {...member} onClick={() => alert(`Team Member: ${member.name}`)} />
              ))}
            </div>
          </div>
        )}



        
        {activeTab === 'time' && (
          <TimeTrackingPanel />
        )}

        {activeTab === 'timeoff' && (
          <TimeOffPanel />
        )}

        {activeTab === 'incidents' && (
          <IncidentReportsPanel />
        )}
       
       {activeTab === "map" && (
          <HazardMapPanel />
        )}

        {activeTab === 'messages' && (
          <MessagingPanel />
        )}

        {activeTab === 'zoom' && (
          <ZoomMeetingCenter />
        )}

        {activeTab === 'training' && (
          <>
          <div className="space-y-6">
            {/* Training Header with AI Badge */}
            <div className="bg-black/40 backdrop-blur-md border border-amber-500/30 text-white p-6 rounded-lg shadow-[0_0_30px_rgba(255,179,0,0.1)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">AI-Powered Training Academy</h2>
                  <p className="text-gray-300">Interactive learning with real-time AI assistance for work zone safety and compliance</p>
                </div>
                <div className="bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 px-4 py-2 rounded-lg">
                  <p className="text-sm font-semibold text-amber-400">AI Assistant Active</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">Available Training Modules</h3>
                <p className="text-gray-400 text-sm mt-1">Based on MUTCD standards and industry best practices</p>
              </div>
              <div className="flex gap-3">
                <select 
                  value={trainingFilter}
                  onChange={(e) => setTrainingFilter(e.target.value)}
                  className="px-4 py-2 bg-black/40 backdrop-blur-md border border-amber-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Courses</option>
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTraining.map(module => (
                <TrainingModuleCard key={module.id} {...module} onClick={() => handleTrainingClick(module)} />
              ))}
            </div>
          </div>
            <VideoLibrary />
          </>
        )}

        <AssistantNudges activeTab={activeTab} />
      <PwaInstallNudge />

      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-amber-500/20 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/wzos-logo.svg" 
                  alt="WZOS Logo" 
                  className="w-12 h-12 drop-shadow-[0_0_10px_rgba(255,179,0,0.3)]"
                />
                <h3 className="text-xl font-bold">Work Zone OS</h3>
              </div>
              <p className="text-gray-400">The Operating System For Road Crews. Complete management platform for construction teams.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-amber-400">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => setActiveTab('workorders')} className="hover:text-amber-400 transition-colors">Work Orders</button></li>
                <li><button onClick={() => setActiveTab('equipment')} className="hover:text-amber-400 transition-colors">Equipment Tracking</button></li>
                <li><button onClick={() => setActiveTab('team')} className="hover:text-amber-400 transition-colors">Team Management</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-amber-400">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-amber-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-amber-400">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-500/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Work Zone OS. All rights reserved.</p>
          </div>

        </div>
      </footer>

      <WorkOrderModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        workOrder={selectedWorkOrder}
      />
      <TrainingModal 
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        module={selectedTraining}
      />

    </div>
  );
};

export default AppLayout;