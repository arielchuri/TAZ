import { useState, useEffect, useRef } from 'react'
import { 
  Home, 
  Package, 
  Users, 
  Gavel, 
  User, 
  Sun, 
  Droplets, 
  AlertTriangle,
  Activity,
  ArrowUpRight,
  Battery,
  Heart,
  Utensils,
  Wrench,
  Zap,
  MessageSquare,
  Filter,
  FileText, 
  FileCode, 
  BookOpen,
  Droplets as Water,
  Thermometer,
  Baby,
  Plus,
  ShieldAlert,
  Pill,
  Flame,
  BatteryCharging,
  Stethoscope
} from 'lucide-react'
import { Card, Button, cn, FileItem } from './components/BrutalBase'
import { Sheet } from './components/BrutalSheet'

function App() {
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'give' | 'take'>('take')
  
  // SOS State
  const [sosProgress, setSosProgress] = useState(0)
  const [isHoldingSos, setIsHoldingSos] = useState(false)
  const sosInterval = useRef<number | null>(null)

  const handleSosStart = () => {
    setIsHoldingSos(true)
    const startTime = Date.now()
    sosInterval.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min((elapsed / 3000) * 100, 100)
      setSosProgress(progress)
      if (progress >= 100) {
        if (sosInterval.current) clearInterval(sosInterval.current)
        alert("🚨 EMERGENCY SOS BROADCASTED TO MESH")
        // Reset after alert to allow reuse
        setIsHoldingSos(false)
        setSosProgress(0)
      }
    }, 50)
  }

  const handleSosEnd = () => {
    if (sosProgress < 100) {
      setIsHoldingSos(false)
      if (sosInterval.current) clearInterval(sosInterval.current)
      setSosProgress(0)
    }
  }

  const pins = [
    { id: 'need-1', x: '20%', y: '35%', icon: <Stethoscope size={20} />, label: "Doctor Needed", color: "bg-red-500", type: 'health', mode: 'take' },
    { id: 'need-2', x: '45%', y: '25%', icon: <Water size={20} />, label: "Water Filter Needed", color: "bg-green-500", type: 'food', mode: 'take' },
    { id: 'need-3', x: '10%', y: '15%', icon: <Baby size={20} />, label: "Baby Formula Needed", color: "bg-green-500", type: 'food', mode: 'take' },
    { id: 'need-4', x: '85%', y: '10%', icon: <Pill size={20} />, label: "Antibiotics Needed", color: "bg-red-500", type: 'health', mode: 'take' },
    { id: 'need-5', x: '55%', y: '55%', icon: <Plus size={20} />, label: "Wound Dressing Req", color: "bg-red-500", type: 'health', mode: 'take' },
    { id: 'need-6', x: '30%', y: '40%', icon: <ShieldAlert size={20} />, label: "Safety Escort Needed", color: "bg-yellow-500", type: 'labor', mode: 'take' },
    { id: 'need-7', x: '70%', y: '75%', icon: <Flame size={20} />, label: "Cooking Fuel Needed", color: "bg-blue-500", type: 'infra', mode: 'take' },
    { id: 'need-8', x: '90%', y: '50%', icon: <BatteryCharging size={20} />, label: "Battery Charge Req", color: "bg-blue-500", type: 'infra', mode: 'take' },
    
    { id: 'food-1', x: '60%', y: '20%', icon: <Utensils size={20} />, label: "Fresh Apples", color: "bg-green-500", type: 'food', mode: 'give' },
    { id: 'food-2', x: '75%', y: '45%', icon: <Utensils size={20} />, label: "Dry Rations", color: "bg-green-500", type: 'food', mode: 'give' },
    { id: 'food-3', x: '35%', y: '40%', icon: <Utensils size={20} />, label: "Potable Water (20L)", color: "bg-green-500", type: 'food', mode: 'give' },
    
    { id: 'labor-1', x: '40%', y: '70%', icon: <Wrench size={20} />, label: "Repair Crew", color: "bg-yellow-500", type: 'labor', mode: 'give' },
    { id: 'labor-2', x: '10%', y: '50%', icon: <Wrench size={20} />, label: "Electrical Help", color: "bg-yellow-500", type: 'labor', mode: 'give' },
    { id: 'labor-3', x: '90%', y: '30%', icon: <Wrench size={20} />, label: "Mechanical Skills", color: "bg-yellow-500", type: 'labor', mode: 'give' },
    
    { id: 'infra-1', x: '80%', y: '65%', icon: <Zap size={20} />, label: "Generator Node", color: "bg-blue-500", type: 'infra', mode: 'give' },
    { id: 'infra-2', x: '30%', y: '85%', icon: <Zap size={20} />, label: "Mesh Relay", color: "bg-blue-500", type: 'infra', mode: 'give' },
    { id: 'infra-3', x: '65%', y: '80%', icon: <Zap size={20} />, label: "LoRa Repeater", color: "bg-blue-500", type: 'infra', mode: 'give' },
    
    { id: 'assembly-1', x: '15%', y: '80%', icon: <Gavel size={20} />, label: "Meeting Point A", color: "bg-white", type: 'assembly', mode: 'shared' },
    { id: 'assembly-2', x: '50%', y: '10%', icon: <Gavel size={20} />, label: "Meeting Point B", color: "bg-white", type: 'assembly', mode: 'shared' },
  ]

  const filteredPins = pins.filter(p => {
    const modeMatch = p.mode === 'shared' || p.mode === viewMode;
    const typeMatch = activeFilter === 'all' || p.type === activeFilter;
    return modeMatch && typeMatch;
  })

  return (
    <div className="flex h-screen bg-dots font-sans text-black overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 bg-white border-r-8 border-black flex flex-col items-center py-8 gap-6 z-20">
        <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          T
        </div>
        
        <nav className="flex flex-col gap-4">
          <SidebarIcon icon={<Home size={28} />} active />
          <SidebarIcon icon={<Package size={28} />} />
          <SidebarIcon icon={<Users size={28} active={false} />} />
          <SidebarIcon icon={<Gavel size={28} />} />
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <button 
            onClick={() => setIsAccountOpen(true)}
            className="w-12 h-12 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <User size={28} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto p-4 gap-4">
        {/* Header */}
        <header className="flex justify-between items-end border-b-8 border-black pb-4 text-left">
          <div>
            <h1 className="text-7xl font-black uppercase tracking-tighter leading-none">Community Dashboard</h1>
            <p className="text-xl font-bold uppercase mt-2 border-l-4 border-black pl-3 bg-white inline-block pr-4">
              Our mesh is holding strong.
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <StatusBadge icon={<Activity size={20} />} label="Mesh" value="Online" />
            <StatusBadge icon={<Battery size={20} />} label="Power" value="82%" />
          </div>
        </header>

        {/* Top Section: Map & SOS */}
        <div className="grid grid-cols-12 gap-4">
          {/* Neighborhood Map */}
          <Card 
            className="col-span-8 h-[400px] p-0 overflow-hidden relative"
          >
            <div className="absolute inset-0">
              <img 
                src="/map.png" 
                alt="Neighborhood Map" 
                className="w-full h-full object-cover"
              />
              
              {/* Pins Container */}
              <div className="absolute inset-0 z-20">
                {filteredPins.map(pin => (
                  <MapPin key={pin.id} {...pin} />
                ))}
              </div>
              
              {/* Title Overlay */}
              <div className="absolute top-0 left-0 right-0 bg-black text-white p-3 border-b-4 border-black z-30 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Neighborhood Map</h2>
                  <div className="flex border-2 border-white p-0.5 bg-white/20">
                    <button 
                      onClick={() => setViewMode('give')}
                      className={cn("px-3 py-0.5 font-black text-[10px] uppercase transition-colors", viewMode === 'give' ? "bg-green-500 text-white" : "text-white hover:bg-white/10")}
                    >GIVE</button>
                    <button 
                      onClick={() => setViewMode('take')}
                      className={cn("px-3 py-0.5 font-black text-[10px] uppercase transition-colors", viewMode === 'take' ? "bg-red-500 text-white" : "text-white hover:bg-white/10")}
                    >TAKE</button>
                  </div>
                </div>

                <div className="flex gap-1">
                  <FilterBtn active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} icon={<Filter size={14} />} label="ALL" />
                  <FilterBtn active={activeFilter === 'health'} onClick={() => setActiveFilter('health')} icon={<Heart size={14} />} label="HEALTH" color="border-red-500" />
                  <FilterBtn active={activeFilter === 'food'} onClick={() => setActiveFilter('food')} icon={<Utensils size={14} />} label="FOOD" color="border-green-500" />
                  <FilterBtn active={activeFilter === 'labor'} onClick={() => setActiveFilter('labor')} icon={<Wrench size={14} />} label="LABOR" color="border-yellow-500" />
                  <FilterBtn active={activeFilter === 'infra'} onClick={() => setActiveFilter('infra')} icon={<Zap size={14} />} label="INFRA" color="border-blue-500" />
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-white border-4 border-black px-2 py-1 font-black text-xs uppercase z-30 shadow-brutal">
                {filteredPins.length} Local Updates
              </div>
            </div>
          </Card>

          {/* SOS Button - Intentional Hold */}
          <Card 
            title="Urgent Help" 
            hint="Hold for 3 seconds to broadcast emergency."
            className="col-span-4 bg-stripes flex flex-col items-center justify-center py-4"
          >
            <div className="text-center flex flex-col items-center gap-6 w-full px-6">
              <div className="relative w-48 h-48 group">
                <div className="absolute inset-0 bg-black rounded-full translate-x-2 translate-y-2" />
                
                <button 
                  onMouseDown={handleSosStart}
                  onMouseUp={handleSosEnd}
                  onMouseLeave={handleSosEnd}
                  onTouchStart={handleSosStart}
                  onTouchEnd={handleSosEnd}
                  className={cn(
                    "absolute inset-0 bg-white border-8 border-black rounded-full flex items-center justify-center transition-transform active:translate-x-1 active:translate-y-1 overflow-hidden select-none",
                    isHoldingSos ? "scale-95" : ""
                  )}
                >
                  {/* Pie Progress Fill */}
                  <div 
                    className="absolute inset-0 bg-red-600 origin-center transition-all ease-linear"
                    style={{ 
                      clipPath: `conic-gradient(white ${100 - sosProgress}%, transparent 0)`,
                      transform: 'rotate(-90deg)'
                    }}
                  />
                  
                  <span className={cn(
                    "relative text-6xl font-black uppercase z-10 transition-colors",
                    sosProgress > 50 ? "text-white" : "text-black"
                  )}>
                    {sosProgress >= 100 ? "!!!" : "SOS"}
                  </span>
                </button>
              </div>
              
              {/* Progress Bar Replacement */}
              <div className="w-full space-y-2">
                <div className="h-6 w-full border-4 border-black bg-white relative overflow-hidden">
                   <div 
                    className="absolute top-0 left-0 bottom-0 bg-red-600 transition-all ease-linear"
                    style={{ width: `${sosProgress}%` }}
                   />
                </div>
                <div className="uppercase font-black text-[10px] tracking-[0.2em] text-center">
                  {sosProgress >= 100 ? "BROADCAST ACTIVE" : isHoldingSos ? "HOLDING..." : "HOLD TO TRIGGER"}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Section: Core Modules */}
        <div className="grid grid-cols-12 gap-6">
          {/* Give/Take */}
          <Card title="Give / Take" accentColor="bg-green-600" className="col-span-4">
            <div className="space-y-3">
              <div className="border-l-4 border-red-600 pl-3 py-1 bg-red-50">
                <div className="font-black text-[9px] uppercase text-red-600 mb-0.5">Need:</div>
                <div className="font-bold uppercase text-sm leading-tight">Sterile Gauze</div>
              </div>
              <div className="border-l-4 border-green-600 pl-3 py-1 bg-green-50">
                <div className="font-black text-[9px] uppercase text-green-600 mb-0.5">Give:</div>
                <div className="font-bold uppercase text-sm leading-tight">5KG Flour (Jane)</div>
              </div>
              <Button variant="green" className="w-full text-xs py-1.5">Open Mutual Aid Ledger</Button>
            </div>
          </Card>

          {/* Governance */}
          <Card title="Governance" accentColor="bg-black text-white" className="col-span-4">
            <div className="space-y-3">
              <div className="border-2 border-black p-3 bg-gray-50">
                <div className="text-sm font-black uppercase mb-2">Solar Array Expansion</div>
                <div className="flex gap-1 h-8">
                  {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} className={`w-full border-2 border-black ${n <= 4 ? 'bg-black' : 'bg-white'}`} />
                  ))}
                </div>
                <div className="mt-1 font-black text-[9px] uppercase text-right">4/5 NEIGHBORS AGREED</div>
              </div>
              <Button variant="outline" className="w-full text-xs py-1.5">Enter Assembly</Button>
            </div>
          </Card>

          {/* Labor */}
          <Card title="Labor" accentColor="bg-yellow-500 text-black" className="col-span-4">
            <div className="space-y-3">
              <div className="border-2 border-black p-3 bg-yellow-50 flex items-center gap-3">
                <Wrench className="text-yellow-600" size={24} />
                <div className="font-black uppercase text-sm">Infrastructure Stable</div>
              </div>
              <p className="text-[10px] font-bold uppercase italic border-l-2 border-yellow-500 pl-2">No urgent repairs today.</p>
              <Button variant="yellow" className="w-full text-xs py-1.5">Check Task Board</Button>
            </div>
          </Card>

          {/* Network Health with Visualization */}
          <Card title="Network Health" accentColor="bg-blue-600" className="col-span-3">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b-4 border-black pb-1">
                <span className="uppercase font-black text-[10px]">Active Nodes</span>
                <span className="text-2xl font-black">42</span>
              </div>
              {/* Heartbeat Graph */}
              <div className="h-16 bg-black border-2 border-black flex items-end gap-0.5 p-1 relative overflow-hidden">
                {[40, 20, 60, 40, 90, 40, 70, 40, 20, 50, 40, 80, 40].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-400 opacity-60" style={{ height: `${h}%` }} />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-[8px] font-mono text-blue-400 font-bold tracking-widest uppercase">Mesh Heartbeat: Stable</div>
                </div>
              </div>
              <div className="p-2 bg-black text-white font-mono text-[9px] leading-tight border-2 border-black flex justify-between">
                <span>LORA: 98%</span> <span>PING: 42MS</span>
              </div>
            </div>
          </Card>

          {/* Nature's Clock with Visualization */}
          <Card title="Nature's Clock" accentColor="bg-black" className="col-span-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase mb-1">
                <span>Sunrise 06:12</span>
                <span>Sunset 19:42</span>
              </div>
              {/* Day/Night Timeline */}
              <div className="h-4 w-full border-2 border-black flex overflow-hidden">
                <div className="w-[20%] bg-black" /> {/* Pre-dawn */}
                <div className="w-[60%] bg-orange-400 relative"> {/* Day */}
                   <div className="absolute left-[70%] top-0 bottom-0 w-1 bg-white animate-pulse" /> {/* Now marker */}
                </div>
                <div className="w-[20%] bg-black" /> {/* Night */}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="border-2 border-black p-2 bg-orange-50 text-center">
                   <div className="text-[9px] font-black uppercase opacity-60">SUN</div>
                   <div className="text-lg font-black leading-none">DAY</div>
                </div>
                <div className="border-2 border-black p-2 bg-blue-50 text-center">
                   <div className="text-[9px] font-black uppercase opacity-60">TIDE</div>
                   <div className="text-lg font-black leading-none">+2.4m</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Local Comms */}
          <Card title="Local Comms" accentColor="bg-blue-400 text-black" className="col-span-3">
            <div className="h-16 flex items-center justify-center border-2 border-black border-dashed bg-blue-50">
              <MessageSquare size={24} className="text-blue-600" />
            </div>
            <Button variant="blue" className="w-full text-[9px] py-1 mt-1">Open Messenger</Button>
          </Card>

          {/* Library */}
          <Card title="Knowledge Base" accentColor="bg-gray-400 text-black" className="col-span-3">
             <div className="space-y-1">
              <FileItem name="Solar_Repair_v2.pdf" size="2.4MB" icon={<FileText size={14} />} />
              <FileItem name="Mesh_Protocol.md" size="12KB" icon={<FileCode size={14} />} />
              <FileItem name="Local_Herb_Guide.pdf" size="5.1MB" icon={<BookOpen size={14} />} />
            </div>
            <Button variant="outline" className="w-full text-[9px] py-1 mt-2 font-black uppercase">Browse All Files</Button>
          </Card>
        </div>
      </main>

      {/* Account Sheet */}
      <Sheet 
        isOpen={isAccountOpen} 
        onClose={() => setIsAccountOpen(false)} 
        title="Your Profile"
      >
        <div className="space-y-10 text-left">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-black border-4 border-black flex items-center justify-center text-white shadow-brutal">
              <User size={48} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase leading-none">Neighbor #742</h3>
              <p className="font-black text-[10px] uppercase bg-yellow-500 text-black px-2 py-1 inline-block mt-2 border-2 border-black">Role: Infrastructure</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b-4 border-black pb-4">
              <div className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">How You Help</div>
              <div className="flex flex-col gap-2">
                {['Electrician', 'Ham Radio', 'First Aid'].map(skill => (
                  <div key={skill} className="font-black uppercase text-lg border-l-8 border-yellow-500 pl-3">{skill}</div>
                ))}
              </div>
            </div>
          </div>

          <Button variant="danger" className="w-full">Sign Out</Button>
        </div>
      </Sheet>
    </div>
  )
}

function SidebarIcon({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <div className={`w-12 h-12 flex items-center justify-center border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-pointer transition-all ${active ? 'bg-black text-white shadow-none translate-x-1 translate-y-1' : 'bg-white text-black hover:bg-gray-100'}`}>
      {icon}
    </div>
  )
}

function StatusBadge({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-2 border-4 border-black px-4 py-2 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
      <span className="text-black">{icon}</span>
      <span className="font-black uppercase text-xs">{label}:</span>
      <span className="font-black text-lg leading-none">{value}</span>
    </div>
  )
}

function MapPin({ icon, label, x, y, color }: { icon: React.ReactNode, label: string, x: string, y: string, color: string }) {
  return (
    <div 
      className="absolute group z-10" 
      style={{ left: x, top: y }}
    >
      <div className={cn("w-10 h-10 border-4 border-black flex items-center justify-center shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer", color)}>
        {icon}
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black text-white px-2 py-1 font-black text-[10px] uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none border-2 border-white">
        {label}
      </div>
    </div>
  )
}

function FilterBtn({ active, onClick, icon, label, color = "border-black" }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color?: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 border-2 px-2 py-0.5 font-black text-[9px] transition-all",
        color,
        active ? "bg-black text-white shadow-none translate-x-0.5 translate-y-0.5" : "bg-white text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-gray-100"
      )}
    >
      {icon}
      {label}
    </button>
  )
}

export default App
