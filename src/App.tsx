import React, { useState, useRef, useEffect } from "react";
import { 
  Users, 
  User, 
  AlertTriangle,
  Heart,
  Utensils,
  Wrench,
  Zap,
  FileText, 
  FileCode, 
  BookOpen,
  Droplets as Water,
  Plus,
  ShieldAlert,
  Pill,
  Flame,
  Stethoscope,
  Radio,
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Calendar,
  MessageSquare,
  Pin,
  List,
  Grid,
  CheckCircle2,
  Hammer,
  Sparkles,
  Cpu,
  Scissors,
  Gavel,
  Vote,
  MessageCircle,
  Hash,
  Send,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw,
  Activity,
  Maximize2,
  X,
  HelpCircle
} from "lucide-react";
import { Card, Button, cn, FileItem } from "./components/BrutalBase";
import { Sheet } from "./components/BrutalSheet";
import { TonerMap } from "./components/TonerMap";
import { 
  TransportCard, 
  TransportExpandedView, 
  type TransportEntry, 
  INITIAL_TRANSPORT_ENTRIES 
} from "./components/TransportWidget";
import arielAvatar from "./assets/ariel.gif";

// Tooltip helper component
function Tip({ label, notImplemented = false, children }: { label: string; notImplemented?: boolean; children: React.ReactNode }) {
  return (
    <div className="relative group inline-flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
        <div className="bg-[#222D2C] text-[#FFFFFF] text-[9px] font-mono px-2 py-0.5 whitespace-nowrap border border-[#FFFFFF] shadow-md flex items-center gap-1">
          {notImplemented && <span className="bg-[#D35B50] text-white px-1 py-0.2 text-[8px] font-bold">[NOT IMPLEMENTED]</span>}
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
}

// Color Mapping for Help Mode Overlay Title Bar (matches section clicked)
const SECTION_COLOR_MAP: Record<string, { bg: string; text: string; accentBorder: string }> = {
  overview: { bg: "bg-[#1A66A6]", text: "text-white", accentBorder: "border-[#1A66A6]" },
  general: { bg: "bg-[#1A66A6]", text: "text-white", accentBorder: "border-[#1A66A6]" },
  map: { bg: "bg-[#222D2C]", text: "text-white", accentBorder: "border-[#222D2C]" },
  bulletin: { bg: "bg-[#1A66A6]", text: "text-white", accentBorder: "border-[#1A66A6]" },
  discussions: { bg: "bg-[#8F57CB]", text: "text-white", accentBorder: "border-[#8F57CB]" },
  about: { bg: "bg-[#222D2C]", text: "text-[#F4D35A]", accentBorder: "border-[#F4D35A]" },
  matcher: { bg: "bg-[#1A66A6]", text: "text-white", accentBorder: "border-[#1A66A6]" },
  transport: { bg: "bg-[#0F5257]", text: "text-white", accentBorder: "border-[#0F5257]" },
  ariel_projects: { bg: "bg-[#222D2C]", text: "text-[#F4D35A]", accentBorder: "border-[#F4D35A]" },
  calendar: { bg: "bg-[#54C93F]", text: "text-white", accentBorder: "border-[#54C93F]" },
  governance: { bg: "bg-[#0F3D64]", text: "text-white", accentBorder: "border-[#0F3D64]" },
  labor: { bg: "bg-[#F39D22]", text: "text-white", accentBorder: "border-[#F39D22]" },
  power: { bg: "bg-[#54C93F]", text: "text-white", accentBorder: "border-[#54C93F]" },
  water: { bg: "bg-[#3ABEAE]", text: "text-white", accentBorder: "border-[#3ABEAE]" },
  mesh: { bg: "bg-[#F39D22]", text: "text-white", accentBorder: "border-[#F39D22]" },
  nature: { bg: "bg-[#F4D35A]", text: "text-[#222D2C]", accentBorder: "border-[#F4D35A]" },
  comms: { bg: "bg-[#1A66A6]", text: "text-white", accentBorder: "border-[#1A66A6]" },
  knowledge: { bg: "bg-[#8F57CB]", text: "text-white", accentBorder: "border-[#8F57CB]" },
};

function App() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"take" | "give">("take");
  const [bulletinViewMode, setBulletinViewMode] = useState<"pinboard" | "list">("pinboard");

  // Window Management States: Expand & Shade
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [shadedSections, setShadedSections] = useState<{ [key: string]: boolean }>({});

  // Interactive Help Mode State
  const [isHelpMode, setIsHelpMode] = useState(false);
  const [helpOverlay, setHelpOverlay] = useState<{ title: string; sectionId: string } | null>(null);

  // Local Comms Filter & Message State
  const [commsFilter, setCommsFilter] = useState<"all" | "ariel" | "mesh" | "emergency">("all");
  const [newCommsMessage, setNewCommsMessage] = useState("");

  // Listen for Map navigation events
  useEffect(() => {
    const handleNav = (e: any) => {
      const sectionId = e.detail?.sectionId;
      if (!sectionId) return;
      if (expandedSection) {
        setExpandedSection(sectionId);
      } else {
        const el = document.getElementById(`section-${sectionId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-4", "ring-[#1A66A6]");
          setTimeout(() => el.classList.remove("ring-4", "ring-[#1A66A6]"), 2000);
        }
      }
    };
    window.addEventListener("taz-navigate-section", handleNav);
    return () => window.removeEventListener("taz-navigate-section", handleNav);
  }, [expandedSection]);

  const triggerSectionHelp = (title: string, sectionId: string, e?: React.MouseEvent) => {
    if (isHelpMode) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      setHelpOverlay({ title, sectionId });
    }
  };

  const toggleShade = (sectionKey: string) => {
    // Shading disabled if currently expanded
    if (expandedSection) return;
    setShadedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const toggleExpand = (sectionKey: string) => {
    if (expandedSection === sectionKey) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionKey);
      // Unshade when expanding
      setShadedSections(prev => ({ ...prev, [sectionKey]: false }));
    }
  };

  // SOS State
  const [sosProgress, setSosProgress] = useState(0);
  const [isHoldingSos, setIsHoldingSos] = useState(false);
  const sosInterval = useRef<number | null>(null);

  const handleSosStart = () => {
    setIsHoldingSos(true);
    const startTime = Date.now();
    sosInterval.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 3000) * 100, 100);
      setSosProgress(progress);
      if (progress >= 100) {
        if (sosInterval.current) clearInterval(sosInterval.current);
        alert("🚨 EMERGENCY SOS BROADCASTED TO MESH NETWORK");
        setIsHoldingSos(false);
        setSosProgress(0);
      }
    }, 50);
  };

  const handleSosEnd = () => {
    setIsHoldingSos(false);
    setSosProgress(0);
    if (sosInterval.current) clearInterval(sosInterval.current);
  };

  // Config for Dynamic Top Bar when any section expands
  const SECTION_CONFIGS: { [key: string]: { title: string; color: string; subtitle: string } } = {
    map: { title: "CARTOGRAPHY", color: "bg-[#222D2C] text-white", subtitle: "// LOCAL ZONE CARTOGRAPHY — UPPER MONTCLAIR / MSU / MILLS RESERVATION" },
    matcher: { title: "MUTUAL AID", color: "bg-[#1A66A6] text-white", subtitle: "// PEER-TO-PEER MUTUAL AID MATCHER — FULL DIRECTORY" },
    transport: { title: "TRANSPORT & DISPATCH", color: "bg-[#0F5257] text-white", subtitle: "// LOCAL ZONE RIDESHARE, PASSAGE & CARGO DISPATCH" },
    calendar: { title: "CALENDAR", color: "bg-[#54C93F] text-white", subtitle: "// COMMUNITY CALENDAR, BARN RAISING & FELLOWSHIP WORKSHOPS" },
    bulletin: { title: "BULLETIN", color: "bg-[#F4D35A] !text-[#222D2C]", subtitle: "// COMMUNITY BULLETIN & NEIGHBORHOOD PIN BOARD" },
    discussions: { title: "DISCUSSIONS", color: "bg-[#8F57CB] text-white", subtitle: "// TOPICAL DELIBERATION & WORKING GROUP HUBS" },
    governance: { title: "GOVERNANCE", color: "bg-[#0F3D64] text-white", subtitle: "// DIRECT CONSENSUS DEMOCRACY & GENERAL ASSEMBLY" },
    labor: { title: "LABOR", color: "bg-[#F39D22] text-white", subtitle: "// COLLECTIVE WORK ROSTER & INFRASTRUCTURE REPAIRS" },
    power: { title: "MICROGRID", color: "bg-[#54C93F] text-white", subtitle: "// MICROGRID TELEMETRY & SOLAR STORAGE BANK" },
    water: { title: "WATER", color: "bg-[#3ABEAE] text-white", subtitle: "// WATER RESERVES, PURITY TESTING & CATCHMENT GAUGES" },
    mesh: { title: "MESH NET", color: "bg-[#F39D22] text-white", subtitle: "// 915 MHz LORA MESH NETWORK TOPOLOGY & ROUTING" },
    nature: { title: "NATURE CLOCK", color: "bg-[#F4D35A] !text-[#222D2C]", subtitle: "// SOLAR EPHEMERIS, TIDAL CLOCK & REGIONAL WEATHER" },
    comms: { title: "COMMS", color: "bg-[#1A66A6] text-white", subtitle: "// ENCRYPTED LOCAL MESH RADIO MESSENGER" },
    knowledge: { title: "KNOWLEDGE", color: "bg-[#8F57CB] text-white", subtitle: "// OFFLINE EMERGENCY KNOWLEDGE BASE & MANUALS" },
    about: { title: "ABOUT TAZ", color: "bg-[#222D2C] text-white", subtitle: "// TEMPORARY AUTONOMOUS ZONE OS — ARCHITECTURAL MANIFESTO" },
  };

  const currentSectionConfig = expandedSection ? SECTION_CONFIGS[expandedSection] : null;

  // Data: Transport & Rideshare Dispatch
  const [transportEntries, setTransportEntries] = useState<TransportEntry[]>(INITIAL_TRANSPORT_ENTRIES);

  const handleAddTransport = (newEntry: Omit<TransportEntry, "id" | "timestamp">) => {
    const created: TransportEntry = {
      ...newEntry,
      id: `tr-${Date.now()}`,
      timestamp: "Just now"
    };
    setTransportEntries(prev => [created, ...prev]);
  };

  const handleClaimTransport = (id: string) => {
    setTransportEntries(prev => prev.map(item => item.id === id ? { ...item, claimed: true, claimedBy: "Ariel Churi (Node #742)" } : item));
  };

  // Data: Mutual Aid Matcher
  const needs = [
    { id: 1, type: "Water", icon: <Water size={13} />, title: "Potable Water (20L)", urgency: "Critical", user: "Camp 3", time: "10m ago", category: "water", color: "text-[#3ABEAE] border-[#3ABEAE]" },
    { id: 2, type: "Medical", icon: <Pill size={13} />, title: "Insulin (Refrigerated)", urgency: "Critical", user: "Sector B", time: "25m ago", category: "medical", color: "text-[#D35B50] border-[#D35B50]" },
    { id: 3, type: "Power", icon: <Zap size={13} />, title: "12V Battery Pack (LiFePO4)", urgency: "Medium", user: "Comms Tower", time: "1h ago", category: "power", color: "text-[#F39D22] border-[#F39D22]" },
    { id: 4, type: "Food", icon: <Utensils size={13} />, title: "Dry Grains / Rice (10kg)", urgency: "Low", user: "Kitchen 1", time: "2h ago", category: "food", color: "text-[#54C93F] border-[#54C93F]" },
    { id: 5, type: "Tools", icon: <Wrench size={13} />, title: "MC4 Solar Crimping Tool", urgency: "Medium", user: "Array #2", time: "3h ago", category: "power", color: "text-[#1A66A6] border-[#1A66A6]" },
  ];

  const offers = [
    { id: 1, type: "Skills", icon: <Wrench size={13} />, title: "Electrical & Inverter Diagnostics", user: "Alex (Eng)", available: "Immediate", category: "power", color: "text-[#1A66A6] border-[#1A66A6]" },
    { id: 2, type: "Medical", icon: <Stethoscope size={13} />, title: "Basic First Aid & Wound Dressing", user: "Nurse Sarah", available: "On-Call", category: "medical", color: "text-[#D35B50] border-[#D35B50]" },
    { id: 3, type: "Tools", icon: <Flame size={13} />, title: "Propane 2-Burner Stove + 2 Tanks", user: "Outpost 4", available: "Until Night", category: "food", color: "text-[#F39D22] border-[#F39D22]" },
    { id: 4, type: "Water", icon: <Water size={13} />, title: "Katadyn Gravity Filter (10L/hr)", user: "Shelter 7", available: "Shared", category: "water", color: "text-[#3ABEAE] border-[#3ABEAE]" },
  ];

  // Data: Calendar Events
  const calendarEvents = [
    {
      id: "ev-1",
      date: "SAT SEP 5",
      time: "08:00 - 13:00",
      title: "Amish-Style Timber Framing (Barn Raising)",
      type: "Group Volunteer Labor",
      tagColor: "bg-[#F39D22] text-white",
      location: "Upper Montclair Field #2",
      icon: <Hammer size={12} />,
      rsvpCount: 28,
    },
    {
      id: "ev-2",
      date: "SUN SEP 6",
      time: "17:30 - 19:30",
      title: "Weekly Fellowship & Potluck Circle",
      type: "Fellowship Meeting",
      tagColor: "bg-[#54C93F] text-white",
      location: "Mills Reservation Overlook",
      icon: <Heart size={12} />,
      rsvpCount: 45,
    },
    {
      id: "ev-3",
      date: "TUE SEP 8",
      time: "15:00 - 18:00",
      title: "Herbal Tinctures & Salve Making",
      type: "Handcraft Workshop",
      tagColor: "bg-[#8F57CB] text-white",
      location: "Yantacaw Herb Garden",
      icon: <Scissors size={12} />,
      rsvpCount: 16,
    },
    {
      id: "ev-4",
      date: "THU SEP 10",
      time: "18:00 - 21:00",
      title: "LoRa Mesh Node Assembly & Battery Re-Celling",
      type: "Advanced Tech Workshop",
      tagColor: "bg-[#1A66A6] text-white",
      location: "MSU Maker Lab (Richardson Hall)",
      icon: <Cpu size={12} />,
      rsvpCount: 22,
    },
  ];

  // Data: Bulletin / Social Board
  const bulletins = [
    {
      id: "b-1",
      title: "Community Honey & Apple Harvest",
      author: "Orchard Cooperative",
      date: "2h ago",
      tag: "COMMUNITY SURPLUS",
      tagColor: "bg-[#54C93F] text-white",
      content: "Picked 4 crates of Gala apples and fresh comb honey. Stored in Upper Montclair pantry. Free for all families.",
      isPinned: true,
    },
    {
      id: "b-2",
      title: "Nightly Ham Radio Net (146.520 MHz)",
      author: "W2NJ Amateur Net",
      date: "5h ago",
      tag: "COMMS NOTICE",
      tagColor: "bg-[#1A66A6] text-white",
      content: "Simplex check-in at 20:00. Practice emergency relay from Mills Reservation high point down to Valley Road.",
      isPinned: true,
    },
    {
      id: "b-3",
      title: "Seeking 24V Inverter for Solar Well Pump",
      author: "Water Squad",
      date: "1d ago",
      tag: "URGENT REQUEST",
      tagColor: "bg-[#D35B50] text-white",
      content: "Main pump tripped thermal fuse. Need 1000W pure sine wave inverter to keep irrigation pressurized.",
      isPinned: false,
    },
    {
      id: "b-4",
      title: "Handmade Wool Blankets Available",
      author: "Weavers Guild",
      date: "2d ago",
      tag: "HANDCRAFT",
      tagColor: "bg-[#8F57CB] text-white",
      content: "Finished 5 heavy wool blankets from local fleece. Available for infants or elders at Clinic 1.",
      isPinned: false,
    },
  ];

  // Data: Discussion Topic Areas
  const discussionTopics = [
    {
      id: "dt-1",
      name: "General Assembly & Direct Governance",
      desc: "Proposals, quorum consensus, neighborhood charters & resource allocation",
      activeMembers: 38,
      postsCount: 142,
      unreadCount: 3,
    },
    {
      id: "dt-2",
      name: "Microgrid & Off-Grid Energy Systems",
      desc: "Solar MPPT arrays, battery banks, load balancing & inverter maintenance",
      activeMembers: 24,
      postsCount: 89,
      unreadCount: 0,
    },
    {
      id: "dt-3",
      name: "Food Sovereignty & Permaculture",
      desc: "Community orchards, seed banking, compost heaters & seasonal foraging",
      activeMembers: 31,
      postsCount: 112,
      unreadCount: 7,
    },
    {
      id: "dt-4",
      name: "Emergency Medicine, Sanitation & Triage",
      desc: "First aid supplies, medicine refrigeration, water testing & hygiene protocol",
      activeMembers: 19,
      postsCount: 64,
      unreadCount: 1,
    },
    {
      id: "dt-5",
      name: "Mesh Networking & Open Hardware",
      desc: "LoRa packet routing, firmware, antenna tuning & encrypted local mail",
      activeMembers: 29,
      postsCount: 97,
      unreadCount: 4,
    },
    {
      id: "dt-6",
      name: "Craft, Tool Guilds & Barn Raising",
      desc: "Carpentry, blacksmithing, leatherwork, welding & collective labor rosters",
      activeMembers: 22,
      postsCount: 51,
      unreadCount: 0,
    },
  ];

  // Data: Ariel Churi's Community Projects & Work Orders
  const arielProjects = [
    {
      id: "proj-1",
      title: "MSU 50kW Emergency Solar Canopy & MPPT Intertie",
      location: "Montclair State University Campus [B7]",
      role: "Lead Electrical Engineer",
      progress: 75,
      status: "Configuring 48V MPPT charge controllers and DC-coupled battery isolation switches.",
      deadline: "In Progress (Due Friday)",
      volunteers: 4,
      priority: "CRITICAL",
      priorityColor: "bg-[#D35B50] text-white",
    },
    {
      id: "proj-2",
      title: "Mills Reservation High-Altitude LoRa Mast Maintenance",
      location: "Mills Normal Ave Basalt Overlook [A4]",
      role: "RF Systems Tech",
      progress: 90,
      status: "Quarterly inspection of solar mast, lightning arrestor, and 915MHz coax integrity.",
      deadline: "Scheduled Inspection",
      volunteers: 2,
      priority: "HIGH",
      priorityColor: "bg-[#F39D22] text-white",
    },
    {
      id: "proj-3",
      title: "Upper Montclair Timber Depot Framing & Joinery",
      location: "Valley Rd & Bellevue Ave Staging Yard [C4]",
      role: "Volunteer Crew Lead",
      progress: 40,
      status: "Staging volunteer timber framing, post mortises, and oak pegs for Saturday barn-raising.",
      deadline: "Saturday 09:00",
      volunteers: 8,
      priority: "COMMUNITY",
      priorityColor: "bg-[#54C93F] text-white",
    },
    {
      id: "proj-4",
      title: "Nishuane Springhead Charcoal Bio-Filter Upgrade",
      location: "Nishuane Park Springhouse [H4]",
      role: "Water Systems Designer",
      progress: 20,
      status: "Sourcing activated hardwood bio-char and food-grade HDPE cistern overflow valves.",
      deadline: "Planning Phase",
      volunteers: 3,
      priority: "PLANNED",
      priorityColor: "bg-[#1A66A6] text-white",
    },
  ];

  const filteredNeeds = activeFilter === "all" ? needs : needs.filter(n => n.category === activeFilter);
  const filteredOffers = activeFilter === "all" ? offers : offers.filter(o => o.category === activeFilter);

  return (
    <div className="min-h-screen w-full bg-[#EFECE6] text-[#222D2C] flex flex-col font-sans selection:bg-[#1A66A6] selection:text-white overflow-x-hidden">
      {/* ─── Top Sticky Navigation Bar (Height 40px, pinned at top) ──── */}
      <header 
        className={cn(
          "sticky top-0 z-50 h-[40px] border-b-2 border-[#222D2C] px-3 py-1 flex justify-between items-center shrink-0 select-none transition-colors duration-200 shadow-md",
          currentSectionConfig ? currentSectionConfig.color : "bg-[#1A66A6] text-[#FFFFFF]"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 bg-black/40 text-white tracking-widest uppercase h-[24px] flex items-center">
            {currentSectionConfig ? currentSectionConfig.title : "MESH NODE"}
          </span>
          <span className="text-sm font-black uppercase tracking-tight leading-none">
            TAZ OS
          </span>
          <span className="text-[11px] font-mono opacity-85 hidden md:inline px-1">
            {currentSectionConfig ? currentSectionConfig.subtitle : "// SECTOR 4 AUTONOMOUS GRID"}
          </span>
        </div>

        {/* Live Status Readout */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Tip label="Microgrid battery reserve level">
            <StatusBadge icon={<Zap size={12} className="text-[#F4D35A]" />} label="PWR" value="84%" />
          </Tip>
          <Tip label="Rain catchment potable reserves">
            <StatusBadge icon={<Water size={12} className="text-[#3ABEAE]" />} label="H2O" value="1.2kL" />
          </Tip>
          <Tip label="Active local mesh peers online">
            <StatusBadge icon={<Users size={12} className="text-[#54C93F]" />} label="PEERS" value="42" />
          </Tip>
          <Tip label="LoRa 915MHz packet reception quality">
            <StatusBadge icon={<Radio size={12} className="text-[#FFFFFF]" />} label="LORA" value="98%" />
          </Tip>
        </div>

        {/* Top Header Actions: Help Mode, SOS, Restore & Account Profile */}
        <div className="flex items-center gap-2">
          {/* Prominent Help Mode Toggle */}
          <button
            onClick={() => {
              const nextState = !isHelpMode;
              setIsHelpMode(nextState);
              if (!nextState) setHelpOverlay(null);
            }}
            className={cn(
              "h-[26px] px-2.5 font-mono text-[10px] font-black uppercase flex items-center gap-1.5 cursor-pointer border-2 transition-all shadow-sm",
              isHelpMode 
                ? "bg-[#F4D35A] text-[#222D2C] border-[#222D2C] ring-2 ring-[#222D2C]" 
                : "bg-[#FFFFFF] text-[#222D2C] border-[#222D2C] hover:bg-[#F4D35A]"
            )}
            data-help-toggle="true"
            title="Click to toggle Help Mode: click any section for tutorial info"
          >
            <HelpCircle size={13} className={isHelpMode ? "text-[#D35B50] animate-bounce" : "text-[#1A66A6]"} />
            <span>{isHelpMode ? "HELP: ACTIVE [ON]" : "HELP MODE [OFF]"}</span>
          </button>
          {expandedSection ? (
            <button
              onClick={() => setExpandedSection(null)}
              className="h-[24px] bg-[#FFFFFF] hover:bg-[#EFECE6] text-[#222D2C] border border-[#222D2C] px-2.5 font-mono text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer"
              style={{ borderRadius: 0 }}
              title="Restore to 3-column dashboard"
            >
              <X size={12} />
              <span>Restore View</span>
            </button>
          ) : (
            <div 
              onMouseDown={handleSosStart}
              onMouseUp={handleSosEnd}
              onMouseLeave={handleSosEnd}
              onTouchStart={handleSosStart}
              onTouchEnd={handleSosEnd}
              className="relative overflow-hidden cursor-pointer select-none"
            >
              <div 
                className="absolute inset-0 bg-black/40 transition-all duration-75"
                style={{ width: `${sosProgress}%` }}
              />
              <Button 
                variant="danger" 
                size="xs"
                className="relative z-10 flex items-center gap-1 bg-[#D35B50] px-2 py-0 text-[10px] h-[24px]"
              >
                <AlertTriangle size={12} />
                <span>{isHoldingSos ? `HOLD (${Math.round(sosProgress)}%)` : "SOS MESH"}</span>
              </Button>
            </div>
          )}

          {/* User Account Avatar (Ariel Churi pixel art avatar) */}
          <Tip label="Account Profile: Ariel Churi">
            <button 
              onClick={() => setIsAccountOpen(true)}
              className="w-[24px] h-[24px] flex items-center justify-center bg-[#FFFFFF] border border-[#222D2C] hover:scale-105 cursor-pointer p-0 overflow-hidden"
              style={{ borderRadius: 0 }}
              title="Ariel Churi — Account Profile"
            >
              <img src={arielAvatar} alt="Ariel Churi" className="w-full h-full object-cover" />
            </button>
          </Tip>
        </div>
      </header>

      {/* ─── WORKSPACE CONTENT ─────────────────────────────────────── */}
      {expandedSection ? (
        /* =========================================================
            EXPANDED FULL-SCREEN SECTION CONTENT
            Uses the EXACT same state & data sources as contracted views!
            ========================================================= */
        <main 
          onClickCapture={(e) => isHelpMode && triggerSectionHelp(currentSectionConfig?.title || expandedSection, expandedSection, e)}
          className={cn(
            "flex-1 w-full h-[calc(100vh-38px)] overflow-y-auto bg-[#EFECE6] p-4",
            isHelpMode && "cursor-help"
          )}
        id="main-dashboard-grid"
        >
          
          {/* EXPANDED: CARTOGRAPHY */}
          {expandedSection === "map" && (
            <div className="w-full h-full flex flex-col gap-2">
              <div className="flex-1 border border-[#222D2C] relative min-h-[500px]">
                <TonerMap isFullscreen={true} />
              </div>
              <div className="p-2.5 bg-[#FFFFFF] border border-[#222D2C] font-mono text-xs flex justify-between items-center">
                <span>SECTOR 4 COMMUNITY GRID // 8 ROWS (A-H) x 8 COLS (1-8) // CALIBRATED OSM GEOMETRY</span>
                <span className="text-[#5B6360]">UPPER MONTCLAIR, MSU, DOWNTOWN & MILLS RESERVATION</span>
              </div>
            </div>
          )}

          {/* EXPANDED: MUTUAL AID MATCHER */}
          {expandedSection === "matcher" && (
            <div className="max-w-5xl mx-auto flex flex-col gap-3">
              <div className="p-3 bg-[#1A66A6] text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase">MUTUAL AID MATCHER (SECTION 2.2)</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 font-mono">
                    {needs.length} NEEDS // {offers.length} OFFERS
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex border border-white/30 font-mono text-[10px]">
                    <button
                      onClick={() => setViewMode("take")}
                      className={cn(
                        "px-2.5 py-1 font-bold uppercase transition-colors cursor-pointer",
                        viewMode === "take" ? "bg-white text-[#1A66A6]" : "bg-transparent text-white hover:bg-white/10"
                      )}
                    >
                      NEEDS ({needs.length})
                    </button>
                    <button
                      onClick={() => setViewMode("give")}
                      className={cn(
                        "px-2.5 py-1 font-bold uppercase transition-colors cursor-pointer",
                        viewMode === "give" ? "bg-white text-[#1A66A6]" : "bg-transparent text-white hover:bg-white/10"
                      )}
                    >
                      OFFERS ({offers.length})
                    </button>
                  </div>
                  <Tip label="Post new request to local mesh" notImplemented={true}>
                    <Button variant="primary" size="xs" className="!bg-[#0F3D64]">
                      <Plus size={12} /> Post Listing
                    </Button>
                  </Tip>
                </div>
              </div>

              {/* Category Filter Bar */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 font-mono text-[10px]">
                {["all", "food", "medical", "tools", "energy", "comms"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={cn(
                      "px-2.5 py-1 font-bold uppercase border transition-colors cursor-pointer",
                      activeFilter === cat 
                        ? "bg-[#222D2C] text-white border-[#222D2C]" 
                        : "bg-white text-[#222D2C] border-[#222D2C] hover:bg-[#EFECE6]"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Listings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {viewMode === "take" ? (
                  filteredNeeds.length > 0 ? (
                    filteredNeeds.map((item) => (
                      <div key={item.id} className="p-3 bg-[#FFFFFF] border-2 border-[#222D2C] flex flex-col justify-between shadow-sm">
                        <div>
                          <div className="flex justify-between items-start mb-1.5">
                            <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase text-white", item.color)}>
                              {item.category}
                            </span>
                            <span className="font-mono text-[10px] text-[#5B6360] bg-[#EFECE6] px-1.5 py-0.5 border border-[#222D2C]/30">
                              {item.time} // {item.urgency}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-[#222D2C] mb-1">{item.title}</h4>
                          <p className="text-xs text-[#5B6360] leading-relaxed mb-2 font-mono">{item.type} request from Sector 4 peer node.</p>
                        </div>
                        <div className="pt-2 border-t border-[#222D2C]/20 flex justify-between items-center font-mono text-[10px]">
                          <span className="text-[#1A66A6] font-bold">BY: {item.user}</span>
                          <Tip label="Fulfill this community request" notImplemented={true}>
                            <Button variant="primary" size="xs" className="!bg-[#1A66A6]">Fulfill Need →</Button>
                          </Tip>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 p-6 text-center bg-white border border-[#222D2C] font-mono text-xs text-[#5B6360]">
                      No needs found matching category "{activeFilter.toUpperCase()}".
                    </div>
                  )
                ) : (
                  filteredOffers.length > 0 ? (
                    filteredOffers.map((item) => (
                      <div key={item.id} className="p-3 bg-[#FFFFFF] border-2 border-[#222D2C] flex flex-col justify-between shadow-sm">
                        <div>
                          <div className="flex justify-between items-start mb-1.5">
                            <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase text-white", item.color)}>
                              {item.category}
                            </span>
                            <span className="font-mono text-[10px] text-[#54C93F] font-bold bg-[#EFECE6] px-1.5 py-0.5 border border-[#222D2C]/30">
                              AVAIL: {item.available}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-[#222D2C] mb-1">{item.title}</h4>
                          <p className="text-xs text-[#5B6360] leading-relaxed mb-2 font-mono">{item.type} community surplus available for collection.</p>
                        </div>
                        <div className="pt-2 border-t border-[#222D2C]/20 flex justify-between items-center font-mono text-[10px]">
                          <span className="text-[#54C93F] font-bold">OFFERED BY: {item.user}</span>
                          <Tip label="Request this community offer" notImplemented={true}>
                            <Button variant="secondary" size="xs">Claim Offer →</Button>
                          </Tip>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 p-6 text-center bg-white border border-[#222D2C] font-mono text-xs text-[#5B6360]">
                      No offers found matching category "{activeFilter.toUpperCase()}".
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* EXPANDED: TRANSPORT & RIDESHARE */}
          {expandedSection === "transport" && (
            <TransportExpandedView
              entries={transportEntries}
              onAddEntry={handleAddTransport}
              onClaimEntry={handleClaimTransport}
            />
          )}

          {/* EXPANDED: CALENDAR & FELLOWSHIP */}
          {expandedSection === "calendar" && (
            <div className="max-w-5xl mx-auto flex flex-col gap-3">
              <div className="p-3 bg-[#54C93F] text-white flex justify-between items-center">
                <span className="font-mono text-xs font-bold uppercase">COMMUNITY CALENDAR & FELLOWSHIP SCHEDULE ({calendarEvents.length} EVENTS)</span>
                <Tip label="Add new community event" notImplemented={true}>
                  <Button variant="primary" size="xs" className="!bg-[#2e7a21]">
                    <Plus size={12} /> Propose Event
                  </Button>
                </Tip>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {calendarEvents.map((ev) => (
                  <div key={ev.id} className="p-3 bg-[#FFFFFF] border-2 border-[#222D2C] flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase", ev.tagColor)}>
                          {ev.type}
                        </span>
                        <span className="font-mono text-xs font-bold bg-[#EFECE6] border border-[#222D2C] px-2 py-0.5">
                          {ev.date}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#222D2C] mb-1">{ev.title}</h4>
                      <p className="font-mono text-xs text-[#5B6360] mb-2">{ev.time} • {ev.location}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#222D2C]/20 pt-2 font-mono text-xs">
                      <span className="font-bold text-[#54C93F]">{ev.rsvpCount} Neighbors Attending</span>
                      <Tip label="RSVP to event" notImplemented={true}>
                        <Button variant="primary" size="xs" className="!bg-[#54C93F]">Join / RSVP</Button>
                      </Tip>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPANDED: BULLETIN */}
          {expandedSection === "bulletin" && (
            <div className="max-w-5xl mx-auto flex flex-col gap-3">
              <div className="p-3 bg-[#F4D35A] text-[#222D2C] flex justify-between items-center font-bold">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase">NEIGHBORHOOD BULLETIN BOARD ({bulletins.length} FLYERS)</span>
                  <span className="text-[10px] bg-black/10 px-2 py-0.5 font-mono uppercase">{bulletinViewMode} MODE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex border border-[#222D2C]">
                    <button
                      onClick={() => setBulletinViewMode("pinboard")}
                      className={cn(
                        "px-2 py-1 font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer",
                        bulletinViewMode === "pinboard" ? "bg-[#222D2C] text-white" : "bg-white text-[#222D2C]"
                      )}
                    >
                      Pinboard
                    </button>
                    <button
                      onClick={() => setBulletinViewMode("list")}
                      className={cn(
                        "px-2 py-1 font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer",
                        bulletinViewMode === "list" ? "bg-[#222D2C] text-white" : "bg-white text-[#222D2C]"
                      )}
                    >
                      List View
                    </button>
                  </div>
                  <Tip label="Pin new flyer to board" notImplemented={true}>
                    <Button variant="primary" size="xs" className="!bg-[#222D2C] !text-white">
                      <Plus size={12} /> Pin Flyer
                    </Button>
                  </Tip>
                </div>
              </div>

              {bulletinViewMode === "pinboard" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {bulletins.map((b) => (
                    <div key={b.id} className={cn("p-3 border-2 flex flex-col justify-between shadow-sm", b.isPinned ? "bg-[#FFFFFF] border-[#222D2C]" : "bg-[#EFECE6] border-[#BCBCB8]")}>
                      <div>
                        <div className="flex justify-between items-start mb-1.5">
                          <span className={cn("text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase block", b.tagColor)}>{b.tag}</span>
                          {b.isPinned && <span className="text-[8px] font-mono uppercase bg-[#F4D35A] px-1 font-bold">PINNED</span>}
                        </div>
                        <h4 className="font-bold text-xs text-[#222D2C] mb-1">{b.title}</h4>
                        <p className="text-xs text-[#5B6360] leading-relaxed">{b.content}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#222D2C]/20 font-mono text-[9px] text-[#5B6360] flex justify-between">
                        <span>{b.author}</span>
                        <span>{b.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {bulletins.map((b) => (
                    <div key={b.id} className="p-3 bg-white border border-[#222D2C] flex justify-between items-center">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn("text-[8px] font-mono font-bold px-1 py-0.2 uppercase", b.tagColor)}>{b.tag}</span>
                          <span className="font-bold text-xs text-[#222D2C]">{b.title}</span>
                          {b.isPinned && <span className="text-[8px] font-mono bg-[#F4D35A] px-1 font-bold">PINNED</span>}
                        </div>
                        <p className="text-xs text-[#5B6360] truncate">{b.content}</p>
                      </div>
                      <div className="font-mono text-[10px] text-[#5B6360] shrink-0 pl-3">
                        {b.author} • {b.date}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EXPANDED: DISCUSSIONS */}
          {expandedSection === "discussions" && (
            <div className="max-w-5xl mx-auto flex flex-col gap-3">
              <div className="p-3 bg-[#8F57CB] text-white flex justify-between items-center">
                <span className="font-mono text-xs font-bold uppercase">TOPICAL WORKING GROUP DISCUSSIONS ({discussionTopics.length} TOPICS)</span>
                <Tip label="Create new working group topic" notImplemented={true}>
                  <Button variant="primary" size="xs" className="!bg-[#5e3191]">
                    <Plus size={12} /> New Topic
                  </Button>
                </Tip>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {discussionTopics.map((t) => (
                  <div key={t.id} className="p-3 bg-[#FFFFFF] border-2 border-[#222D2C] flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-[#222D2C]">#{t.name}</h4>
                        {t.unreadCount > 0 && <span className="bg-[#D35B50] text-white px-1.5 py-0.5 text-[9px] font-bold font-mono">{t.unreadCount} NEW</span>}
                      </div>
                      <p className="text-xs text-[#5B6360] leading-relaxed mb-2">{t.desc}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-[#222D2C]/20 pt-2 font-mono text-[10px]">
                      <span className="text-[#8F57CB] font-bold">{t.activeMembers} peers online • {t.postsCount} total posts</span>
                      <Tip label="Enter topic room" notImplemented={true}>
                        <Button variant="outline" size="xs">Enter Room →</Button>
                      </Tip>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPANDED: GOVERNANCE */}
          {expandedSection === "governance" && (
            <div className="max-w-4xl mx-auto flex flex-col gap-3">
              <div className="p-3 bg-[#0F3D64] text-white flex justify-between items-center">
                <span className="font-mono text-xs font-bold uppercase">DIRECT CONSENSUS GOVERNANCE & CHARTER</span>
                <Tip label="Submit referendum proposal" notImplemented={true}>
                  <Button variant="primary" size="xs" className="!bg-[#071f33]">
                    <Plus size={12} /> New Proposal
                  </Button>
                </Tip>
              </div>
              <div className="p-4 bg-[#FFFFFF] border-2 border-[#222D2C] space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono uppercase bg-[#54C93F] text-white px-1.5 py-0.5 font-bold">ACTIVE REFERENDUM</span>
                    <h3 className="font-bold text-base text-[#222D2C] mt-1">Solar Array Expansion Phase 2</h3>
                  </div>
                  <span className="font-mono text-xs bg-[#EFECE6] border border-[#222D2C] px-2 py-1 font-bold">48H REMAINING</span>
                </div>
                <p className="text-xs text-[#5B6360] leading-relaxed">
                  Proposal to allocate 12 surplus 400W bifacial panels to Upper Montclair Community Center and interconnect with Sector 4 Microgrid storage bank.
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-xs font-bold">
                    <span>VOTING QUORUM (42 / 45 ACTIVE PEERS)</span>
                    <span className="text-[#54C93F]">80% SUPERMAJORITY REACHED</span>
                  </div>
                  <div className="h-4 w-full bg-[#DFDDD7] border border-[#222D2C] flex">
                    <div className="h-full bg-[#0F3D64]" style={{ width: "80%" }} />
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-[#222D2C]/20">
                  <Tip label="Cast approval vote" notImplemented={true}><Button variant="primary" size="sm" className="!bg-[#54C93F]">Approve Proposal</Button></Tip>
                  <Tip label="Object with amendment" notImplemented={true}><Button variant="danger" size="sm">Object / Amend</Button></Tip>
                  <Tip label="Enter general assembly room" notImplemented={true}><Button variant="outline" size="sm">Enter Assembly Audio</Button></Tip>
                </div>
              </div>
            </div>
          )}

          {/* EXPANDED: LABOR & TOOL GUILDS */}
          {expandedSection === "labor" && (
            <div className="max-w-4xl mx-auto flex flex-col gap-3">
              <div className="p-3 bg-[#F39D22] text-white flex justify-between items-center">
                <span className="font-mono text-xs font-bold uppercase">COMMUNITY LABOR, WORK ORDERS & TOOL GUILDS</span>
                <Tip label="Log new work order" notImplemented={true}>
                  <Button variant="primary" size="xs" className="!bg-[#b86e0c]">
                    <Plus size={12} /> Log Work Order
                  </Button>
                </Tip>
              </div>
              <div className="p-4 bg-white border-2 border-[#222D2C] space-y-3">
                <div className="flex items-center justify-between border-b border-[#222D2C]/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="text-[#F39D22]" size={18} />
                    <div>
                      <div className="font-bold text-sm uppercase">Sector 4 Infrastructure Status: Stable</div>
                      <div className="font-mono text-[10px] text-[#5B6360]">0 critical work orders // 3 preventative maintenance tasks</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs bg-[#54C93F] text-white px-2 py-0.5 font-bold">ALL SYSTEMS NORMAL</span>
                </div>
                <div className="space-y-2 pt-1 font-mono text-xs">
                  <div className="p-2 bg-[#EFECE6] border border-[#222D2C] flex justify-between items-center">
                    <span>• Saturday Barn-Raising: Upper Montclair Timber Depot Framing</span>
                    <span className="font-bold text-[#F39D22]">SAT 09:00 (8 VOLUNTEERS)</span>
                  </div>
                  <div className="p-2 bg-[#EFECE6] border border-[#222D2C] flex justify-between items-center">
                    <span>• Mills Tower RF Coax Inspection & Solar Panel Washing</span>
                    <span className="font-bold text-[#1A66A6]">ASSIGNED TO: ARIEL CHURI</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXPANDED: POWER / MICROGRID */}
          {expandedSection === "power" && (
            <div className="max-w-4xl mx-auto flex flex-col gap-3">
              <div className="p-3 bg-[#54C93F] text-white flex justify-between items-center">
                <span className="font-mono text-xs font-bold uppercase">MICROGRID ENERGY & 48V STORAGE TELEMETRY</span>
                <span className="font-mono text-xs bg-white/20 px-2 py-0.5">8.4 / 10 kWh (84%)</span>
              </div>
              <div className="p-4 bg-white border-2 border-[#222D2C] space-y-4">
                <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 bg-[#EFECE6] border border-[#222D2C]">
                    <div className="text-[#5B6360]">SOLAR HARVEST</div>
                    <div className="text-base font-bold text-[#54C93F] mt-1">+1.2 kW (MPPT ACTIVE)</div>
                  </div>
                  <div className="p-3 bg-[#EFECE6] border border-[#222D2C]">
                    <div className="text-[#5B6360]">BASE LOAD CONSUMPTION</div>
                    <div className="text-base font-bold text-[#1A66A6] mt-1">-340 W (NOMINAL)</div>
                  </div>
                  <div className="p-3 bg-[#EFECE6] border border-[#222D2C]">
                    <div className="text-[#5B6360]">ESTIMATED RUNTIME</div>
                    <div className="text-base font-bold text-[#222D2C] mt-1">28.4 HOURS AT BASELOAD</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXPANDED: WATER RESERVES */}
          {expandedSection === "water" && (
            <div className="max-w-4xl mx-auto flex flex-col gap-3">
              <div className="p-3 bg-[#3ABEAE] text-white flex justify-between items-center">
                <span className="font-mono text-xs font-bold uppercase">WATER RESERVES & UV PURIFICATION TELEMETRY</span>
                <span className="font-mono text-xs bg-white/20 px-2 py-0.5">1,240 L (62% CAPACITY)</span>
              </div>
              <div className="p-4 bg-white border-2 border-[#222D2C] space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#EFECE6] border border-[#222D2C]">
                    <div className="text-[#5B6360]">FILTRATION PURITY</div>
                    <div className="text-base font-bold text-[#3ABEAE] mt-1">12 PPM TDS (SAFE POTABLE)</div>
                  </div>
                  <div className="p-3 bg-[#EFECE6] border border-[#222D2C]">
                    <div className="text-[#5B6360]">DAILY YIELD RATE</div>
                    <div className="text-base font-bold text-[#222D2C] mt-1">+420 L / DAY</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXPANDED: MESH NETWORK TELEMETRY */}
          {expandedSection === "mesh" && (
            <div className="max-w-4xl mx-auto flex flex-col gap-3">
              <div className="p-3 bg-[#F39D22] text-white flex justify-between items-center">
                <span className="font-mono text-xs font-bold uppercase">LORA 915MHz MESH TELEMETRY (42 NODES ACTIVE)</span>
                <span className="font-mono text-xs bg-white/20 px-2 py-0.5">CHANNEL 1 // 98% PACKET HEALTH</span>
              </div>
              <div className="p-4 bg-white border-2 border-[#222D2C] space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#EFECE6] border border-[#222D2C]">
                  <div className="font-bold text-sm text-[#222D2C] mb-2">MESH TOPOLOGY OVERVIEW</div>
                  <div className="text-xs text-[#5B6360] leading-relaxed">
                    Connected to 42 active neighbor nodes spanning Mills Mountain Ridge, Upper Montclair village, Watchung Plaza, and South End. Average packet hop latency: 140ms.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXPANDED: NATURE CLOCK & WEATHER */}
          {expandedSection === "nature" && (
            <div className="max-w-4xl mx-auto flex flex-col gap-3">
              <div className="p-3 bg-[#F4D35A] text-[#222D2C] flex justify-between items-center font-bold">
                <span className="font-mono text-xs uppercase">NATURE CLOCK & 5-DAY EPHEMERIS</span>
                <span className="font-mono text-xs bg-black/10 px-2 py-0.5">MONTCLAIR 40.82°N, 74.21°W</span>
              </div>
              <div className="p-4 bg-white border-2 border-[#222D2C] space-y-3 font-mono text-xs">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-[#EFECE6] border border-[#222D2C]">
                    <div className="text-[10px] text-[#5B6360]">SUNRISE</div>
                    <div className="font-bold text-sm mt-0.5">06:24</div>
                  </div>
                  <div className="p-2 bg-[#EFECE6] border border-[#222D2C]">
                    <div className="text-[10px] text-[#5B6360]">SOLAR NOON</div>
                    <div className="font-bold text-sm mt-0.5">13:02</div>
                  </div>
                  <div className="p-2 bg-[#EFECE6] border border-[#222D2C]">
                    <div className="text-[10px] text-[#5B6360]">SUNSET</div>
                    <div className="font-bold text-sm mt-0.5">19:41</div>
                  </div>
                  <div className="p-2 bg-[#EFECE6] border border-[#222D2C]">
                    <div className="text-[10px] text-[#5B6360]">LUNAR PHASE</div>
                    <div className="font-bold text-sm mt-0.5">WAXING GIBBOUS</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EXPANDED: COMMS */}
          {expandedSection === "comms" && (
            <div className="max-w-4xl mx-auto flex flex-col gap-3">
              <div className="p-3 bg-[#1A66A6] text-white flex justify-between items-center">
                <span className="font-mono text-xs font-bold uppercase">LOCAL MESH MESSENGER // SECTOR 4 GENERAL</span>
                <span className="font-mono text-xs bg-white/20 px-2 py-0.5">12 PEERS ONLINE</span>
              </div>
              <div className="p-4 bg-white border-2 border-[#222D2C] space-y-3">
                <div className="p-3 bg-[#EFECE6] border border-[#222D2C] font-mono text-xs space-y-2">
                  <div className="text-[#1A66A6] font-bold">[14:22] Mills Node #12: High-altitude repeater battery at 96% after morning sun.</div>
                  <div className="text-[#54C93F] font-bold">[15:04] Walnut Tool Guild: Welding kit returned and sanitized. Available for loan.</div>
                  <div className="text-[#222D2C] font-bold">[16:11] Ariel Churi (Node #742): Solar array intertie check completed at MSU.</div>
                </div>
              </div>
            </div>
          )}

          {/* EXPANDED: KNOWLEDGE BASE */}
          {expandedSection === "knowledge" && (
            <div className="max-w-4xl mx-auto flex flex-col gap-3">
              <div className="p-3 bg-[#8F57CB] text-white flex justify-between items-center">
                <span className="font-mono text-xs font-bold uppercase">OFFLINE KNOWLEDGE BASE & TECHNICAL MANUALS</span>
                <span className="font-mono text-xs bg-white/20 px-2 py-0.5">3 CORE MANUALS</span>
              </div>
              <div className="p-4 bg-white border-2 border-[#222D2C] space-y-2">
                <FileItem name="Solar_Repair_v2.pdf" size="2.4MB" icon={<FileText size={14} />} />
                <FileItem name="Mesh_Protocol.md" size="12KB" icon={<FileCode size={14} />} />
                <FileItem name="Local_Herb_Guide.pdf" size="5.1MB" icon={<BookOpen size={14} />} />
              </div>
            </div>
          )}

          {/* EXPANDED: ABOUT TAZ */}
          {expandedSection === "about" && (
            <div className="max-w-4xl mx-auto flex flex-col gap-3">
              <div className="p-3 bg-[#222D2C] text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase">TEMPORARY AUTONOMOUS ZONE (TAZ) OS</span>
                  <span className="text-[9px] font-mono uppercase bg-[#F4D35A] text-[#222D2C] px-1.5 py-0.2 font-bold">WIP // ALPHA v2.4</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/arielchuri/TAZ"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/20 hover:bg-white text-white hover:text-[#222D2C] px-2 py-0.5 font-mono text-[9px] font-bold uppercase transition-colors"
                  >
                    📂 GitHub Repo →
                  </a>
                </div>
              </div>

              {/* WIP Notice Banner */}
              <div className="p-3 bg-[#F4D35A]/20 border-2 border-[#222D2C] font-mono text-xs">
                <div className="flex items-center gap-2 text-[#222D2C] font-bold mb-1">
                  <span className="w-2.5 h-2.5 bg-[#F39D22] rounded-full animate-ping inline-block" />
                  <span>ACTIVE WORK IN PROGRESS: CALL FOR COLLABORATORS & TEST NODES</span>
                </div>
                <p className="text-[#3E4846] text-[11px] leading-relaxed">
                  TAZ OS is an evolving open-source prototype. We are actively refining peer synchronization protocols, mesh packet encoding, and local off-grid governance workflows. All source code is freely available under copyleft open-source licenses.
                </p>
              </div>

              <div className="p-5 bg-[#FFFFFF] border-2 border-[#222D2C] space-y-4 text-[#222D2C]">
                <div>
                  <h3 className="text-lg font-black uppercase text-[#1A66A6]">Manage Your Community Without Hierarchy</h3>
                  <p className="text-xs leading-relaxed text-[#3E4846] mt-1">
                    <strong>TAZ OS</strong> is an offline-first, peer-to-peer socio-technical operating system designed for neighborhood resilience, mutual aid, and direct horizontal self-governance. Built to operate without centralized ISP backbones, municipal power grids, or cloud intermediaries, TAZ OS fuses modern open hardware with ancestral collective labor patterns.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
                  <div className="p-3 bg-[#EFECE6] border border-[#222D2C]">
                    <h4 className="font-bold text-xs text-[#D35B50] uppercase mb-1">1. Direct Consensus Democracy</h4>
                    <p className="text-[11px] text-[#5B6360] leading-tight">Quorum-based local direct democracy, referendums, collective labor scheduling (barn raising), and fellowship circles without executive bosses.</p>
                  </div>
                  <div className="p-3 bg-[#EFECE6] border border-[#222D2C]">
                    <h4 className="font-bold text-xs text-[#1A66A6] uppercase mb-1">2. Peer-to-Peer Mutual Aid</h4>
                    <p className="text-[11px] text-[#5B6360] leading-tight">Direct bilateral matching of physical neighborhood needs against community surpluses without currency or middlemen.</p>
                  </div>
                  <div className="p-3 bg-[#EFECE6] border border-[#222D2C]">
                    <h4 className="font-bold text-xs text-[#8F57CB] uppercase mb-1">3. Barn-Raising Labor Brigades</h4>
                    <p className="text-[11px] text-[#5B6360] leading-tight">Amish-style volunteer collective labor brigades, reciprocal time-banking, and community tool lending libraries.</p>
                  </div>
                  <div className="p-3 bg-[#EFECE6] border border-[#222D2C]">
                    <h4 className="font-bold text-xs text-[#54C93F] uppercase mb-1">4. Zero-Cloud Local Mesh</h4>
                    <p className="text-[11px] text-[#5B6360] leading-tight">Local 915MHz LoRa & Wi-Fi mesh running on renewable solar microgrids independent of Big Tech telecom ISPs.</p>
                  </div>
                </div>

                {/* Open Source Hosting & Setup Guide Block */}
                <div className="p-4 bg-[#EFECE6] border-2 border-[#222D2C] space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-[#222D2C]/20 pb-2">
                    <h4 className="font-bold text-sm text-[#222D2C] uppercase flex items-center gap-1.5">
                      <Radio size={14} className="text-[#1A66A6]" />
                      <span>Open-Source Hosting & Node Setup Instructions</span>
                    </h4>
                    <span className="text-[10px] bg-[#F4D35A] text-[#222D2C] px-2 py-0.5 font-bold uppercase">COMING SOON</span>
                  </div>

                  <div className="space-y-2 text-[11px] text-[#3E4846]">
                    <p>
                      TAZ OS is designed to be self-hosted on inexpensive local hardware without recurring subscription fees or proprietary cloud backends:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px]">
                      <div className="p-2 bg-white border border-[#222D2C]">
                        <div className="font-bold text-[#1A66A6]">LOCAL RASPBERRY PI</div>
                        <p className="text-[#5B6360] mt-0.5">Run via Docker on Pi 4/5 or recycled PC attached to local home solar battery.</p>
                      </div>
                      <div className="p-2 bg-white border border-[#222D2C]">
                        <div className="font-bold text-[#54C93F]">OFFLINE WI-FI PORTAL</div>
                        <p className="text-[#5B6360] mt-0.5">Broadcast a captive Wi-Fi portal for neighbors to connect during grid outages.</p>
                      </div>
                      <div className="p-2 bg-white border border-[#222D2C]">
                        <div className="font-bold text-[#F39D22]">LORA PACKET BRIDGE</div>
                        <p className="text-[#5B6360] mt-0.5">Attach an ESP32 915MHz radio transceiver for long-range regional packet routing.</p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-white border border-[#222D2C] space-y-1 mt-2">
                      <div className="font-bold text-[#222D2C] text-[10px]">QUICK START CLI PREVIEW (COMING SOON):</div>
                      <pre className="text-[10px] bg-[#222D2C] text-[#54C93F] p-2 overflow-x-auto font-mono">
git clone https://github.com/arielchuri/TAZ.git
cd TAZ
npm install
npm run dev # Launches local peer mesh instance
                      </pre>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      ) : (
        /* =========================================================
            STANDARD 3-COLUMN DASHBOARD WORKSPACE
            ========================================================= */
        <main 
          className={cn(
            "flex-1 grid grid-cols-12 overflow-hidden p-2 gap-2 bg-[#EFECE6]",
            isHelpMode && "cursor-help"
          )}
        id="main-dashboard-grid"
        >
          
          {/* =========================================================
              COLUMN 1: CARTOGRAPHY, BULLETIN & DISCUSSIONS (4 Cols)
              ========================================================= */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-4">
            
            {/* 1. Local Zone Cartography (Toner Map) */}
            <div id="section-map" data-section-id="map" data-section-title="Local Zone Cartography">
            <Card 
              onClickCapture={(e) => isHelpMode && triggerSectionHelp("Local Zone Cartography", "map", e)}
              title="Local Zone Cartography" 
              accentColor="bg-[#222D2C]"
              badge={<span className="text-[9px] font-mono uppercase bg-white/20 px-1 py-0.2">TONER</span>}
              hint="Toner map of Upper Montclair, MSU, and Mills Reservation with fixed 500m letter/number grid."
              isShaded={shadedSections["map"]}
              onToggleShade={() => toggleShade("map")}
              isExpanded={expandedSection === "map"}
              onToggleExpand={() => toggleExpand("map")}
              noBodyPadding={true}
              className="h-[560px] min-h-[500px] shrink-0 flex flex-col"
            >
              <div className="w-full h-full m-0 p-0 overflow-hidden flex-1 relative">
                <TonerMap isFullscreen={false} />
              </div>
            </Card>
            </div>

            {/* 2. Social & Bulletin Board */}
            <Card
              onClickCapture={(e) => isHelpMode && triggerSectionHelp("Community Bulletin Board", "bulletin", e)}
              title="Community Bulletin Board"
              accentColor="bg-[#F4D35A] !text-[#222D2C]"
              badge={<span className="text-[9px] font-mono uppercase bg-black/10 px-1 py-0.2">{bulletinViewMode.toUpperCase()}</span>}
              headerActions={
                <div className="flex items-center gap-1">
                  <Tip label="Pin Board Grid View">
                    <button
                      onClick={() => setBulletinViewMode("pinboard")}
                      className={cn(
                        "w-[20px] h-[20px] flex items-center justify-center border transition-colors cursor-pointer",
                        bulletinViewMode === "pinboard" ? "bg-[#222D2C] text-white border-[#222D2C]" : "bg-white text-[#222D2C] border-[#222D2C]"
                      )}
                      style={{ borderRadius: 0 }}
                    >
                      <Grid size={11} />
                    </button>
                  </Tip>
                  <Tip label="Compact List View">
                    <button
                      onClick={() => setBulletinViewMode("list")}
                      className={cn(
                        "w-[20px] h-[20px] flex items-center justify-center border transition-colors cursor-pointer",
                        bulletinViewMode === "list" ? "bg-[#222D2C] text-white border-[#222D2C]" : "bg-white text-[#222D2C] border-[#222D2C]"
                      )}
                      style={{ borderRadius: 0 }}
                    >
                      <List size={11} />
                    </button>
                  </Tip>
                  <Tip label="Pin new flyer" notImplemented={true}>
                    <Button variant="outline" size="xs" className="h-[20px] px-1.5 text-[9px] !bg-white">
                      <Plus size={10} /> Pin
                    </Button>
                  </Tip>
                </div>
              }
              hint="Neighborhood notices, flyers, surplus announcements & pin board."
              isShaded={shadedSections["bulletin"]}
              onToggleShade={() => toggleShade("bulletin")}
              isExpanded={expandedSection === "bulletin"}
              onToggleExpand={() => toggleExpand("bulletin")}
            >
              {bulletinViewMode === "pinboard" ? (
                <div className="grid grid-cols-2 gap-1.5">
                  {bulletins.map((b) => (
                    <div
                      key={b.id}
                      className={cn(
                        "p-2 border flex flex-col justify-between relative transition-transform hover:-translate-y-0.5",
                        b.isPinned ? "bg-[#FFFFFF] border-[#222D2C]" : "bg-[#EFECE6] border-[#BCBCB8]"
                      )}
                      style={{ boxShadow: "1px 1px 1px 0 rgba(128,128,128,0.25)", borderRadius: 0 }}
                    >
                      <div>
                        {b.isPinned && (
                          <div className="absolute top-1.5 right-1.5 text-[#D35B50] flex items-center">
                            <Pin size={10} className="fill-[#D35B50]" />
                          </div>
                        )}
                        <span className={cn("text-[8px] font-mono font-bold px-1 py-0.2 inline-block uppercase mb-1", b.tagColor)}>
                          {b.tag}
                        </span>
                        <div className="font-bold text-[11px] text-[#222D2C] leading-tight mb-1">{b.title}</div>
                        <p className="text-[9px] text-[#5B6360] leading-snug line-clamp-3">{b.content}</p>
                      </div>
                      <div className="font-mono text-[8px] text-[#909390] mt-2 pt-1 border-t border-[#222D2C]/10 flex justify-between">
                        <span>{b.author}</span>
                        <span>{b.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {bulletins.map((b) => (
                    <div
                      key={b.id}
                      className="p-1.5 bg-[#FFFFFF] border border-[#222D2C] flex items-center justify-between gap-2 hover:border-[#1A66A6] transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Pin size={12} className={b.isPinned ? "text-[#D35B50] fill-[#D35B50]" : "text-[#909390]"} />
                        <div className="min-w-0">
                          <div className="font-bold text-[10px] text-[#222D2C] truncate leading-tight">{b.title}</div>
                          <div className="font-mono text-[8px] text-[#5B6360]">{b.author} • {b.date}</div>
                        </div>
                      </div>
                      <span className={cn("text-[8px] font-mono font-bold px-1 py-0.2 shrink-0", b.tagColor)}>
                        {b.tag}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* 3. Discussion Topic Areas */}
            <Card
              title="Discussion Topic Areas"
              accentColor="bg-[#8F57CB] text-white"
              badge={<span className="text-[9px] font-mono uppercase bg-white/20 px-1 py-0.2">FORUMS</span>}
              hint="Topical working groups across the mesh community."
              isShaded={shadedSections["discussions"]}
              onToggleShade={() => toggleShade("discussions")}
              isExpanded={expandedSection === "discussions"}
              onToggleExpand={() => toggleExpand("discussions")}
            >
              <div className="flex flex-col gap-1.5">
                {discussionTopics.map((topic) => (
                  <Tip key={topic.id} label={`Enter ${topic.name}`} notImplemented={true}>
                    <div className="w-full p-2 bg-[#EFECE6] border border-[#222D2C] hover:border-[#8F57CB] cursor-pointer transition-colors flex items-center justify-between gap-2">
                      <div className="min-w-0 flex items-start gap-2">
                        <div className="p-1 bg-[#FFFFFF] border border-[#222D2C] shrink-0 mt-0.5">
                          <Hash size={12} className="text-[#8F57CB]" />
                        </div>
                        <div className="min-w-0 text-left">
                          <div className="font-bold text-[11px] text-[#222D2C] leading-tight truncate">{topic.name}</div>
                          <p className="text-[9px] text-[#5B6360] truncate leading-tight mt-0.5">{topic.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 font-mono text-[9px]">
                        <span className="text-[#5B6360] bg-[#FFFFFF] border border-[#222D2C] px-1 py-0.5">{topic.activeMembers} peers</span>
                        {topic.unreadCount > 0 && <span className="bg-[#D35B50] text-white px-1 py-0.5 font-bold">{topic.unreadCount} new</span>}
                      </div>
                    </div>
                  </Tip>
                ))}
              </div>
            </Card>



          </div>

          {/* =========================================================
              COLUMNS 2 & 3: ABOUT (8 COLS WIDE) + BALANCED SUBGRID
              ========================================================= */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-4">
            
            {/* 1. About TAZ OS: Non-Hierarchical Community Self-Management (Spans 2 Columns: Col 2-3) */}
            <div id="section-about" data-section-id="about" data-section-title="About TAZ OS: Non-Hierarchical Self-Management">
              <Card
                onClickCapture={(e) => isHelpMode && triggerSectionHelp("About TAZ OS: Non-Hierarchical Self-Management", "about", e)}
                title="About TAZ OS: Non-Hierarchical Community Self-Management"
                accentColor="bg-[#222D2C] text-white"
                badge={<span className="text-[9px] font-mono uppercase bg-[#F4D35A] text-[#222D2C] px-1.5 py-0.2 font-bold">ALPHA // WIP</span>}
                hint="Decentralized peer-to-peer system for community self-management without mayors, bosses, or central authority."
                isShaded={shadedSections["about"]}
                onToggleShade={() => toggleShade("about")}
                isExpanded={expandedSection === "about"}
                onToggleExpand={() => toggleExpand("about")}
              >
                <div className="space-y-2.5 text-[10px] text-[#222D2C] leading-snug">
                  {/* Top WIP Callout */}
                  <div className="p-2 bg-[#F4D35A]/20 border border-[#F4D35A] flex flex-wrap items-center justify-between gap-2 font-mono text-[9px]">
                    <div className="flex items-center gap-2 text-[#222D2C]">
                      <span className="w-2.5 h-2.5 bg-[#F39D22] rounded-full animate-ping inline-block shrink-0" />
                      <span className="font-bold">ACTIVE WORK IN PROGRESS (WIP) // SECTOR 4 LOCAL NODE</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href="https://github.com/arielchuri/TAZ"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#222D2C] hover:bg-[#1A66A6] text-white px-2 py-0.5 font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>📂 GitHub Repo</span>
                      </a>
                      <button
                        data-help-toggle="true"
                        onClick={() => {
                          const next = !isHelpMode;
                          setIsHelpMode(next);
                          if (next) {
                            setHelpOverlay({ title: "TAZ OS Tutorial & Navigation", sectionId: "overview" });
                          } else {
                            setHelpOverlay(null);
                          }
                        }}
                        className={cn(
                          "px-2 py-0.5 font-bold uppercase border flex items-center gap-1 cursor-pointer transition-colors shadow-sm",
                          isHelpMode 
                            ? "bg-[#F4D35A] text-[#222D2C] border-[#222D2C] font-black animate-pulse" 
                            : "bg-[#222D2C] hover:bg-[#1A66A6] text-white border-[#222D2C]"
                        )}
                      >
                        <HelpCircle size={11} className={isHelpMode ? "text-[#D35B50]" : "text-[#F4D35A]"} />
                        <span>{isHelpMode ? "HELP: ACTIVE [ON]" : "❓ TUTORIAL HELP"}</span>
                      </button>
                    </div>
                  </div>

                  {/* 2-Column Balanced Interior: Left = Manifesto & Pillars, Right = Open Source Hosting & Instructions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Left: Manifesto & 4 Pillars */}
                    <div className="space-y-2">
                      <div className="p-2.5 bg-[#FFFFFF] border-2 border-[#222D2C] shadow-sm">
                        <div className="font-black text-[11px] text-[#222D2C] uppercase mb-1 flex items-center gap-1.5 font-mono">
                          <span className="w-2 h-2 bg-[#54C93F] inline-block" />
                          <span>Manage Your Community Without Hierarchy</span>
                        </div>
                        <p className="text-[#3E4846] text-[10px] leading-relaxed">
                          <strong>TAZ OS</strong> is an open-source tool for neighborhood self-management. There are <strong>no mayors, no bosses, and no centralized bureaucracies</strong>. Decisions are made through direct consensus democracy, resources are pooled through horizontal mutual aid, and labor is organized collectively (barn-raising).
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                        <div className="p-1.5 bg-[#FFFFFF] border border-[#222D2C]">
                          <div className="font-bold text-[#D35B50] flex items-center gap-1">
                            <Vote size={11} className="text-[#D35B50]" />
                            <span>1. DIRECT CONSENSUS</span>
                          </div>
                          <p className="text-[#5B6360] text-[8px] mt-0.5 leading-tight">
                            Horizontal decision-making with supermajority voting and no executive bosses.
                          </p>
                        </div>

                        <div className="p-1.5 bg-[#FFFFFF] border border-[#222D2C]">
                          <div className="font-bold text-[#1A66A6] flex items-center gap-1">
                            <Heart size={11} className="text-[#1A66A6]" />
                            <span>2. MUTUAL AID</span>
                          </div>
                          <p className="text-[#5B6360] text-[8px] mt-0.5 leading-tight">
                            Needs & offers matched bilaterally without currency, landlords, or middlemen.
                          </p>
                        </div>

                        <div className="p-1.5 bg-[#FFFFFF] border border-[#222D2C]">
                          <div className="font-bold text-[#8F57CB] flex items-center gap-1">
                            <Hammer size={11} className="text-[#8F57CB]" />
                            <span>3. BARN-RAISING</span>
                          </div>
                          <p className="text-[#5B6360] text-[8px] mt-0.5 leading-tight">
                            Volunteer collective labor brigades and community tool lending libraries.
                          </p>
                        </div>

                        <div className="p-1.5 bg-[#FFFFFF] border border-[#222D2C]">
                          <div className="font-bold text-[#54C93F] flex items-center gap-1">
                            <Radio size={11} className="text-[#54C93F]" />
                            <span>4. ZERO-CLOUD MESH</span>
                          </div>
                          <p className="text-[#5B6360] text-[8px] mt-0.5 leading-tight">
                            Local 915MHz LoRa & Wi-Fi mesh independent of Big Tech servers or telecom ISPs.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Open Source Hosting & Setup Guide */}
                    <div className="p-2.5 bg-[#EFECE6] border-2 border-[#222D2C] flex flex-col justify-between font-mono text-[9px] space-y-2">
                      <div>
                        <div className="flex justify-between items-center border-b border-[#222D2C]/20 pb-1 mb-1.5">
                          <span className="font-bold text-[#1A66A6] uppercase flex items-center gap-1">
                            <Radio size={12} className="text-[#F39D22]" />
                            <span>Open-Source Self-Hosting</span>
                          </span>
                          <span className="bg-[#F4D35A] text-[#222D2C] px-1 py-0.2 font-bold text-[8px]">SETUP: COMING SOON</span>
                        </div>
                        <p className="text-[#3E4846] text-[9px] leading-snug">
                          Run self-hosted on a Raspberry Pi, solar battery laptop, or local captive Wi-Fi portal without subscriptions or cloud dependencies.
                        </p>
                        <pre className="text-[8px] bg-[#222D2C] text-[#54C93F] p-1.5 mt-1.5 font-mono overflow-x-auto">
git clone https://github.com/arielchuri/TAZ.git
cd TAZ && npm install && npm run dev
                        </pre>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-[#222D2C]/15 text-[8px]">
                        <span className="text-[#1A66A6] font-bold">SECTOR 4 LOCAL PEER MESH</span>
                        <button 
                          onClick={() => toggleExpand("about")} 
                          className="underline font-bold hover:text-[#1A66A6] cursor-pointer"
                        >
                          {expandedSection === "about" ? "Collapse ↑" : "Full Manifesto & Guide →"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Subgrid: Column 2 (Left 4 cols) & Column 3 (Right 4 cols) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* SUBCOLUMN 1 (Col 2): Matcher, Ariel's Projects, Governance */}
              <div className="flex flex-col gap-4">
                
                {/* 1. Mutual Aid Matcher */}
                <div id="section-matcher" data-section-id="matcher" data-section-title="Peer-to-Peer Mutual Aid Matcher">
                  <Card 
                    onClickCapture={(e) => isHelpMode && triggerSectionHelp("Peer-to-Peer Mutual Aid Matcher", "matcher", e)}
                    title="Mutual Aid Matcher" 
                    accentColor="bg-[#1A66A6]"
                    badge={<span className="text-[9px] font-mono uppercase bg-white/20 px-1 py-0.2">SEC 2.2</span>}
                    headerActions={
                      <Tip label="Post need or offer to board" notImplemented={true}>
                        <Button variant="primary" size="xs" className="!bg-[#0F3D64] hover:!bg-[#08233a] px-2 py-0.5 text-[10px] h-[22px]">
                          <Plus size={11} /> Post
                        </Button>
                      </Tip>
                    }
                    hint="Decentralized give/take matching protocol. Operates offline over LoRa mesh."
                    isShaded={shadedSections["matcher"]}
                    onToggleShade={() => toggleShade("matcher")}
                    isExpanded={expandedSection === "matcher"}
                    onToggleExpand={() => toggleExpand("matcher")}
                  >
                    <div className="flex border-b border-[#222D2C] -mx-2.5 -mt-2.5 mb-2 bg-[#DFDDD7] shrink-0">
                      <button
                        onClick={() => setViewMode("take")}
                        className={cn(
                          "flex-1 py-1 px-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-none cursor-pointer flex items-center justify-center gap-1.5 font-mono leading-normal h-[28px]",
                          viewMode === "take" ? "bg-[#1A66A6] text-white" : "bg-transparent text-[#5B6360] hover:text-[#222D2C]"
                        )}
                        style={{ borderRadius: 0 }}
                      >
                        <ShieldAlert size={12} />
                        <span>Needs ({needs.length})</span>
                      </button>
                      <button
                        onClick={() => setViewMode("give")}
                        className={cn(
                          "flex-1 py-1 px-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-none cursor-pointer flex items-center justify-center gap-1.5 font-mono leading-normal h-[28px]",
                          viewMode === "give" ? "bg-[#1A66A6] text-white" : "bg-transparent text-[#5B6360] hover:text-[#222D2C]"
                        )}
                        style={{ borderRadius: 0 }}
                      >
                        <Heart size={12} />
                        <span>Offers ({offers.length})</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1 mb-2 overflow-x-auto pb-0.5 shrink-0">
                      <span className="text-[9px] font-mono font-bold text-[#5B6360] uppercase px-0.5 py-0.5">FILTER:</span>
                      <FilterChip active={activeFilter === "all"} onClick={() => setActiveFilter("all")} label="ALL" />
                      <FilterChip active={activeFilter === "water"} onClick={() => setActiveFilter("water")} icon={<Water size={10} />} label="H2O" />
                      <FilterChip active={activeFilter === "medical"} onClick={() => setActiveFilter("medical")} icon={<Pill size={10} />} label="MED" />
                      <FilterChip active={activeFilter === "power"} onClick={() => setActiveFilter("power")} icon={<Zap size={10} />} label="PWR" />
                      <FilterChip active={activeFilter === "food"} onClick={() => setActiveFilter("food")} icon={<Utensils size={10} />} label="FOOD" />
                    </div>

                    <div className="flex flex-col gap-1.5 overflow-y-auto max-h-72 pr-0.5">
                      {viewMode === "take" ? (
                        filteredNeeds.map((item) => (
                          <div 
                            key={item.id}
                            className="p-2 bg-[#EFECE6] border border-[#222D2C] hover:border-[#1A66A6] flex justify-between items-center gap-2 transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={cn("p-1 bg-white border shrink-0", item.color)}>{item.icon}</div>
                              <div className="min-w-0 py-0.5">
                                <div className="font-bold text-[11px] text-[#222D2C] leading-tight truncate">{item.title}</div>
                                <div className="font-mono text-[9px] text-[#5B6360] leading-tight mt-0.5">{item.user} • {item.time}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={cn(
                                "font-mono text-[9px] font-bold px-1.5 py-0.5 border uppercase tracking-wider h-[20px] flex items-center",
                                item.urgency === "Critical" ? "bg-[#D35B50]/15 text-[#D35B50] border-[#D35B50]" : "bg-[#F39D22]/15 text-[#9e5d00] border-[#F39D22]"
                              )}>
                                {item.urgency}
                              </span>
                              <Tip label="Fulfill request" notImplemented={true}>
                                <Button variant="primary" size="xs" className="h-[22px]">Fulfill</Button>
                              </Tip>
                            </div>
                          </div>
                        ))
                      ) : (
                        filteredOffers.map((item) => (
                          <div 
                            key={item.id}
                            className="p-2 bg-[#EFECE6] border border-[#222D2C] hover:border-[#1A66A6] flex justify-between items-center gap-2 transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={cn("p-1 bg-white border shrink-0", item.color)}>{item.icon}</div>
                              <div className="min-w-0 py-0.5">
                                <div className="font-bold text-[11px] text-[#222D2C] leading-tight truncate">{item.title}</div>
                                <div className="font-mono text-[9px] text-[#5B6360] leading-tight mt-0.5">{item.user} • AVAIL: {item.available}</div>
                              </div>
                            </div>
                            <Tip label="Request assistance" notImplemented={true}>
                              <Button variant="secondary" size="xs" className="shrink-0 h-[22px]">Request</Button>
                            </Tip>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </div>

                {/* 2. Transport & Rideshare Dispatch */}
                <TransportCard
                  entries={transportEntries}
                  onAddEntry={handleAddTransport}
                  onClaimEntry={handleClaimTransport}
                  isShaded={shadedSections["transport"]}
                  onToggleShade={() => toggleShade("transport")}
                  isExpanded={expandedSection === "transport"}
                  onToggleExpand={() => toggleExpand("transport")}
                  onHelpClick={(e) => isHelpMode && triggerSectionHelp("Transport & Rideshare Dispatch", "transport", e)}
                />

                {/* 3. Ariel's Community Projects & Work Orders */}
                <div id="section-ariel_projects" data-section-id="ariel_projects" data-section-title="Ariel's Community Projects">
                  <Card
                    onClickCapture={(e) => isHelpMode && triggerSectionHelp("Ariel's Community Projects", "ariel_projects", e)}
                    title="Ariel's Community Projects"
                    accentColor="bg-[#222D2C] text-white"
                    badge={<span className="text-[9px] font-mono uppercase bg-[#F4D35A] text-[#222D2C] px-1.5 py-0.2 font-bold">{arielProjects.length} ACTIVE INITIATIVES</span>}
                    headerActions={
                      <Tip label="Log project hours or request tools">
                        <Button variant="outline" size="xs" className="!bg-white text-[#222D2C] text-[9px] h-[20px] px-1.5 font-bold uppercase">
                          + Log Task
                        </Button>
                      </Tip>
                    }
                    hint="Lead engineering tasks, microgrid installs, RF maintenance & volunteer coordination assigned to Ariel Churi."
                    isShaded={shadedSections["ariel_projects"]}
                    onToggleShade={() => toggleShade("ariel_projects")}
                    isExpanded={expandedSection === "ariel_projects"}
                    onToggleExpand={() => toggleExpand("ariel_projects")}
                  >
                    <div className="space-y-2 font-mono text-[10px]">
                      {arielProjects.map((p) => (
                        <div key={p.id} className="p-2.5 bg-[#FFFFFF] border-2 border-[#222D2C] shadow-sm hover:border-[#1A66A6] transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className={cn("text-[8px] font-bold px-1.5 py-0.2 uppercase", p.priorityColor)}>
                                {p.priority}
                              </span>
                              <span className="font-bold text-xs text-[#222D2C]">{p.title}</span>
                            </div>
                            <span className="text-[9px] text-[#5B6360] bg-[#EFECE6] px-1.5 py-0.2 border border-[#222D2C]/20">{p.deadline}</span>
                          </div>
                          
                          <div className="text-[9px] text-[#1A66A6] font-bold mb-1 flex items-center gap-1">
                            <span>📍 {p.location}</span>
                            <span>• Role: {p.role}</span>
                          </div>

                          <p className="text-[9px] text-[#3E4846] leading-snug mb-2 font-sans">{p.status}</p>

                          <div className="space-y-1 pt-1 border-t border-[#222D2C]/15">
                            <div className="flex justify-between text-[8px] font-bold text-[#5B6360]">
                              <span>PROGRESS // {p.progress}% COMPLETE</span>
                              <span>{p.volunteers} VOLUNTEERS ON-CALL</span>
                            </div>
                            <div className="h-2 w-full bg-[#DFDDD7] border border-[#222D2C] p-0.2">
                              <div 
                                className="h-full bg-[#1A66A6] transition-all" 
                                style={{ width: `${p.progress}%` }} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* 3. Governance & Direct Consensus */}
                <div id="section-governance" data-section-id="governance" data-section-title="Governance & Consensus">
                  <Card
                    onClickCapture={(e) => isHelpMode && triggerSectionHelp("Governance & Consensus", "governance", e)}
                    title="Governance & Consensus"
                    accentColor="bg-[#0F3D64] text-white"
                    badge={<span className="text-[9px] font-mono uppercase bg-white/20 px-1 py-0.2">ASSEMBLY</span>}
                    hint="Direct consensus democracy: active neighborhood referendums & quorum voting."
                    isShaded={shadedSections["governance"]}
                    onToggleShade={() => toggleShade("governance")}
                    isExpanded={expandedSection === "governance"}
                    onToggleExpand={() => toggleExpand("governance")}
                  >
                    <div className="space-y-2">
                      <div className="p-2.5 bg-[#EFECE6] border border-[#222D2C]">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-[11px] text-[#222D2C]">Solar Array Expansion (Phase 2)</span>
                          <span className="font-mono text-[9px] bg-[#F4D35A] px-1 font-bold">48H LEFT</span>
                        </div>
                        <p className="text-[9px] text-[#5B6360] leading-snug mb-2">
                          Proposal to allocate 12 surplus 400W bifacial solar panels to Upper Montclair Community Center.
                        </p>
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[9px] font-bold">
                            <span>CONSENSUS PROGRESS (42/45 PEERS)</span>
                            <span className="text-[#54C93F]">80% REACHED</span>
                          </div>
                          <div className="h-2.5 w-full bg-[#DFDDD7] border border-[#222D2C] p-0.2">
                            <div className="h-full bg-[#0F3D64]" style={{ width: "80%" }} />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Tip label="Vote on referendum" notImplemented={true}><Button variant="outline" size="xs" className="flex-1 h-[24px]">Cast Vote</Button></Tip>
                        <Tip label="Enter general assembly" notImplemented={true}><Button variant="primary" size="xs" className="flex-1 h-[24px] !bg-[#0F3D64]">Enter Assembly</Button></Tip>
                      </div>
                    </div>
                  </Card>
                </div>

              </div>

              {/* SUBCOLUMN 2 (Col 3): Calendar, Labor, Telemetry & Comms */}
              <div className="flex flex-col gap-4">
                
                {/* 1. Community Calendar & Fellowship */}
                <div id="section-calendar" data-section-id="calendar" data-section-title="Community Calendar & Fellowship">
                  <Card
                    onClickCapture={(e) => isHelpMode && triggerSectionHelp("Community Calendar & Fellowship", "calendar", e)}
                    title="Community Calendar & Fellowship"
                    accentColor="bg-[#54C93F] text-white"
                    badge={<span className="text-[9px] font-mono uppercase bg-white/20 px-1 py-0.2">EVENTS</span>}
                    headerActions={
                      <Tip label="Add new gathering" notImplemented={true}>
                        <Button variant="primary" size="xs" className="!bg-[#3f9e2f] hover:!bg-[#2e7a21] px-2 py-0.5 text-[10px] h-[22px]">
                          <Plus size={11} /> Event
                        </Button>
                      </Tip>
                    }
                    hint="Wholesome gatherings, barn raising, fellowship potlucks & workshops."
                    isShaded={shadedSections["calendar"]}
                    onToggleShade={() => toggleShade("calendar")}
                    isExpanded={expandedSection === "calendar"}
                    onToggleExpand={() => toggleExpand("calendar")}
                  >
                    <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-0.5">
                      {calendarEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="p-2 bg-[#EFECE6] border border-[#222D2C] hover:border-[#54C93F] transition-colors flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-9 h-9 bg-[#FFFFFF] border border-[#222D2C] flex flex-col items-center justify-center shrink-0 font-mono">
                              <span className="text-[7px] font-bold text-[#D35B50] uppercase leading-none">{ev.date.split(" ")[0]}</span>
                              <span className="text-[11px] font-black text-[#222D2C] leading-none mt-0.5">{ev.date.split(" ")[2]}</span>
                            </div>
                            <div className="min-w-0">
                              <span className={cn("text-[7px] font-mono font-bold px-1 py-0.2 uppercase leading-none inline-block", ev.tagColor)}>
                                {ev.type}
                              </span>
                              <div className="font-bold text-[10px] text-[#222D2C] truncate leading-tight mt-0.5">{ev.title}</div>
                              <div className="font-mono text-[8px] text-[#5B6360] truncate">{ev.time} • {ev.location}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="font-mono text-[8px] text-[#54C93F] font-bold">{ev.rsvpCount} RSVP</span>
                            <Tip label="RSVP to event" notImplemented={true}>
                              <Button variant="primary" size="xs" className="h-[20px] px-2 text-[9px] !bg-[#54C93F]">Join</Button>
                            </Tip>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* 2. Labor & Infrastructure Tasks */}
                <div id="section-labor" data-section-id="labor" data-section-title="Labor & Tool Guilds">
                  <Card
                    onClickCapture={(e) => isHelpMode && triggerSectionHelp("Labor & Tool Guilds", "labor", e)}
                    title="Labor & Tool Guilds"
                    accentColor="bg-[#F39D22] text-white"
                    badge={<span className="text-[9px] font-mono uppercase bg-white/20 px-1 py-0.2">ROSTER</span>}
                    hint="Community work shifts, tool lending & scheduled repairs."
                    isShaded={shadedSections["labor"]}
                    onToggleShade={() => toggleShade("labor")}
                    isExpanded={expandedSection === "labor"}
                    onToggleExpand={() => toggleExpand("labor")}
                  >
                    <div className="space-y-1.5">
                      <div className="border border-[#222D2C] p-2 bg-[#EFECE6] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Wrench className="text-[#F39D22]" size={16} />
                          <div>
                            <div className="font-bold text-[11px] uppercase">Infrastructure Stable</div>
                            <div className="font-mono text-[9px] text-[#5B6360]">0 critical work orders today</div>
                          </div>
                        </div>
                        <span className="font-mono text-[9px] bg-[#54C93F] text-white px-1.5 py-0.5 font-bold">NORMAL</span>
                      </div>
                      <div className="flex gap-2">
                        <Tip label="View maintenance roster" notImplemented={true}><Button variant="yellow" size="xs" className="flex-1 h-[24px]">Check Task Board</Button></Tip>
                        <Tip label="Log volunteer hours" notImplemented={true}><Button variant="outline" size="xs" className="flex-1 h-[24px]">Log Labor Hours</Button></Tip>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* 3. Microgrid Power */}
                <div id="section-power" data-section-id="power" data-section-title="Microgrid Power">
                  <Card 
                    onClickCapture={(e) => isHelpMode && triggerSectionHelp("Microgrid Power", "power", e)}
                    title="Microgrid Power" 
                    accentColor="bg-[#54C93F] text-white"
                    isShaded={shadedSections["power"]}
                    onToggleShade={() => toggleShade("power")}
                    isExpanded={expandedSection === "power"}
                    onToggleExpand={() => toggleExpand("power")}
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-baseline font-mono border-b border-[#222D2C]/20 pb-1 px-0.5">
                        <span className="text-[9px] uppercase text-[#5B6360] font-semibold">Storage Bank</span>
                        <span className="text-xs font-bold text-[#222D2C] tabular-nums">8.4 / 10 kWh</span>
                      </div>
                      <div className="h-3 w-full bg-[#DFDDD7] border border-[#222D2C] p-0.5">
                        <div className="h-full bg-[#54C93F]" style={{ width: "84%" }} />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-center font-mono text-[9px]">
                        <div className="border border-[#222D2C] p-1 bg-[#EFECE6]">
                          <span className="text-[8px] text-[#5B6360] uppercase block font-semibold">GENERATING</span>
                          <span className="font-bold text-[#222D2C] text-[11px]">+420 W</span>
                        </div>
                        <div className="border border-[#222D2C] p-1 bg-[#EFECE6]">
                          <span className="text-[8px] text-[#5B6360] uppercase block font-semibold">LOAD</span>
                          <span className="font-bold text-[#222D2C] text-[11px]">-180 W</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* 4. Water Reserves */}
                <div id="section-water" data-section-id="water" data-section-title="Water Reserves">
                  <Card 
                    onClickCapture={(e) => isHelpMode && triggerSectionHelp("Water Reserves", "water", e)}
                    title="Water Reserves" 
                    accentColor="bg-[#3ABEAE] text-white"
                    isShaded={shadedSections["water"]}
                    onToggleShade={() => toggleShade("water")}
                    isExpanded={expandedSection === "water"}
                    onToggleExpand={() => toggleExpand("water")}
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-baseline font-mono border-b border-[#222D2C]/20 pb-1 px-0.5">
                        <span className="text-[9px] uppercase text-[#5B6360] font-semibold">Rain Catchment</span>
                        <span className="text-xs font-bold text-[#222D2C] tabular-nums">1,240 L</span>
                      </div>
                      <div className="h-3 w-full bg-[#DFDDD7] border border-[#222D2C] p-0.5">
                        <div className="h-full bg-[#3ABEAE]" style={{ width: "62%" }} />
                      </div>
                      <div className="flex justify-between items-center font-mono text-[9px] text-[#5B6360] px-0.5">
                        <span>TDS: 42 PPM (PURITY 99.4%)</span>
                        <span className="text-[#54C93F] font-bold">STABLE</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* 5. Mesh Network Telemetry */}
                <div id="section-mesh" data-section-id="mesh" data-section-title="Mesh Network Telemetry">
                  <Card 
                    onClickCapture={(e) => isHelpMode && triggerSectionHelp("Mesh Network Telemetry", "mesh", e)}
                    title="Mesh Network Telemetry" 
                    accentColor="bg-[#F39D22] text-white"
                    isShaded={shadedSections["mesh"]}
                    onToggleShade={() => toggleShade("mesh")}
                    isExpanded={expandedSection === "mesh"}
                    onToggleExpand={() => toggleExpand("mesh")}
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-baseline font-mono border-b border-[#222D2C]/20 pb-1 px-0.5">
                        <span className="text-[10px] uppercase text-[#5B6360] font-semibold">Connected Peers</span>
                        <span className="text-xs font-bold text-[#222D2C] tabular-nums">42 NODES ACTIVE</span>
                      </div>

                      <div className="h-9 bg-[#EFECE6] border border-[#222D2C] flex items-end gap-1 p-1">
                        {[40, 20, 60, 40, 90, 40, 70, 40, 20, 50, 40, 80, 40, 65, 30, 85].map((h, i) => (
                          <div key={i} className="flex-1 bg-[#F39D22]" style={{ height: `${h}%` }} />
                        ))}
                      </div>

                      <div className="p-1 bg-[#EFECE6] border border-[#222D2C] font-mono text-[9px] flex justify-between text-[#222D2C] px-1">
                        <span>LORA: 98% RX</span>
                        <span>PING: 42ms</span>
                        <span>915.0 MHz</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* 6. Nature's Clock & Day/5-Day Weather */}
                <div id="section-nature" data-section-id="nature" data-section-title="Nature Clock & Weather">
                  <Card 
                    onClickCapture={(e) => isHelpMode && triggerSectionHelp("Nature Clock & Weather", "nature", e)}
                    title="Nature Clock & Weather" 
                    accentColor="bg-[#F4D35A] !text-[#222D2C]"
                    isShaded={shadedSections["nature"]}
                    onToggleShade={() => toggleShade("nature")}
                    isExpanded={expandedSection === "nature"}
                    onToggleExpand={() => toggleExpand("nature")}
                  >
                    <div className="space-y-2">
                      <div className="p-1.5 bg-[#EFECE6] border border-[#222D2C] flex justify-between items-center font-mono">
                        <div className="flex items-center gap-1.5">
                          <CloudSun size={15} className="text-[#F39D22]" />
                          <div>
                            <div className="text-[11px] font-bold text-[#222D2C] leading-none">74°F (23°C)</div>
                            <div className="text-[8px] text-[#5B6360]">PARTLY CLOUDY</div>
                          </div>
                        </div>
                        <div className="text-right text-[8px] text-[#5B6360] leading-tight">
                          <div>WIND: WNW 8MPH</div>
                          <div>HUMIDITY: 48%</div>
                        </div>
                      </div>

                      <div>
                        <span className="text-[8px] font-mono text-[#5B6360] uppercase block mb-1 font-semibold">5-DAY REGIONAL FORECAST</span>
                        <div className="grid grid-cols-5 gap-1 font-mono text-[8px] text-center">
                          <div className="border border-[#222D2C] p-1 bg-[#EFECE6]">
                            <div className="font-bold text-[#5B6360]">MON</div>
                            <Sun size={10} className="mx-auto my-0.5 text-[#F39D22]" />
                            <div className="font-bold text-[#222D2C]">76°</div>
                          </div>
                          <div className="border border-[#222D2C] p-1 bg-[#EFECE6]">
                            <div className="font-bold text-[#5B6360]">TUE</div>
                            <CloudSun size={10} className="mx-auto my-0.5 text-[#F39D22]" />
                            <div className="font-bold text-[#222D2C]">78°</div>
                          </div>
                          <div className="border border-[#222D2C] p-1 bg-[#EFECE6]">
                            <div className="font-bold text-[#3ABEAE]">WED</div>
                            <CloudRain size={10} className="mx-auto my-0.5 text-[#3ABEAE]" />
                            <div className="font-bold text-[#222D2C]">68°</div>
                          </div>
                          <div className="border border-[#222D2C] p-1 bg-[#EFECE6]">
                            <div className="font-bold text-[#5B6360]">THU</div>
                            <Cloud size={10} className="mx-auto my-0.5 text-[#5B6360]" />
                            <div className="font-bold text-[#222D2C]">72°</div>
                          </div>
                          <div className="border border-[#222D2C] p-1 bg-[#EFECE6]">
                            <div className="font-bold text-[#5B6360]">FRI</div>
                            <Sun size={10} className="mx-auto my-0.5 text-[#F39D22]" />
                            <div className="font-bold text-[#222D2C]">75°</div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-[#222D2C]/20 font-mono text-[9px]">
                        <div className="flex justify-between items-center mb-1">
                          <span>SUNRISE: 06:14</span>
                          <span className="font-bold text-[#1A66A6]">SOLAR NOON: 13:02</span>
                          <span>SUNSET: 19:42</span>
                        </div>
                        <div className="h-2.5 w-full border border-[#222D2C] flex overflow-hidden">
                          <div className="w-[20%] bg-[#222D2C]" />
                          <div className="w-[60%] bg-[#F4D35A] relative">
                            <div className="absolute left-[65%] top-0 bottom-0 w-1 bg-white animate-pulse" />
                          </div>
                          <div className="w-[20%] bg-[#222D2C]" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* 7. Local Comms & Radio */}
                <div id="section-comms" data-section-id="comms" data-section-title="Local Comms & Messenger">
                  <Card
                    onClickCapture={(e) => isHelpMode && triggerSectionHelp("Local Comms & Messenger", "comms", e)}
                    title="Local Comms & Messenger"
                    accentColor="bg-[#1A66A6] text-white"
                    badge={<span className="text-[9px] font-mono uppercase bg-white/20 px-1 py-0.2 font-bold">LORA MESH</span>}
                    hint="Encrypted local mesh messaging channels, Ariel Churi's project logs & emergency broadcast dispatch."
                    isShaded={shadedSections["comms"]}
                    onToggleShade={() => toggleShade("comms")}
                    isExpanded={expandedSection === "comms"}
                    onToggleExpand={() => toggleExpand("comms")}
                  >
                    <div className="space-y-2 text-[10px] font-mono">
                      {/* Comms Channel Filter Bar */}
                      <div className="flex gap-1 overflow-x-auto pb-0.5">
                        <button
                          onClick={() => setCommsFilter("all")}
                          className={cn(
                            "px-1.5 py-0.5 text-[8px] font-bold uppercase border cursor-pointer transition-colors shrink-0",
                            commsFilter === "all" ? "bg-[#222D2C] text-white border-[#222D2C]" : "bg-white text-[#222D2C] border-[#222D2C]"
                          )}
                        >
                          ALL CHANNELS
                        </button>
                        <button
                          onClick={() => setCommsFilter("ariel")}
                          className={cn(
                            "px-1.5 py-0.5 text-[8px] font-bold uppercase border cursor-pointer transition-colors shrink-0 flex items-center gap-1",
                            commsFilter === "ariel" ? "bg-[#F4D35A] text-[#222D2C] border-[#222D2C] font-black" : "bg-white text-[#222D2C] border-[#222D2C] hover:bg-[#F4D35A]/30"
                          )}
                        >
                          <span>★ ARIEL'S THREADS</span>
                        </button>
                        <button
                          onClick={() => setCommsFilter("mesh")}
                          className={cn(
                            "px-1.5 py-0.5 text-[8px] font-bold uppercase border cursor-pointer transition-colors shrink-0",
                            commsFilter === "mesh" ? "bg-[#222D2C] text-white border-[#222D2C]" : "bg-white text-[#222D2C] border-[#222D2C]"
                          )}
                        >
                          MESH #1
                        </button>
                        <button
                          onClick={() => setCommsFilter("emergency")}
                          className={cn(
                            "px-1.5 py-0.5 text-[8px] font-bold uppercase border cursor-pointer transition-colors shrink-0",
                            commsFilter === "emergency" ? "bg-[#D35B50] text-white border-[#D35B50]" : "bg-white text-[#D35B50] border-[#D35B50]"
                          )}
                        >
                          ALERT
                        </button>
                      </div>

                      {/* Message Stream */}
                      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5">
                        {/* Thread 1: Ariel's MSU Telemetry */}
                        {(commsFilter === "all" || commsFilter === "ariel" || commsFilter === "mesh") && (
                          <div className="p-2 bg-[#FFFFFF] border border-[#222D2C] space-y-0.5">
                            <div className="flex justify-between items-center text-[8px]">
                              <span className="font-bold text-[#1A66A6] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-[#F4D35A] rounded-full inline-block" />
                                Ariel Churi (Node #742)
                              </span>
                              <span className="text-[#5B6360]">16:11 // [B7]</span>
                            </div>
                            <p className="text-[9px] text-[#222D2C] font-sans leading-tight">
                              MSU Solar Intertie testing at 48.2V MPPT. Feeding +1.2kW into campus storage bank.
                            </p>
                          </div>
                        )}

                        {/* Thread 2: Ariel's Mills Coax Log */}
                        {(commsFilter === "all" || commsFilter === "ariel" || commsFilter === "mesh") && (
                          <div className="p-2 bg-[#FFFFFF] border border-[#222D2C] space-y-0.5">
                            <div className="flex justify-between items-center text-[8px]">
                              <span className="font-bold text-[#1A66A6] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-[#F4D35A] rounded-full inline-block" />
                                Ariel Churi (Node #742)
                              </span>
                              <span className="text-[#5B6360]">14:22 // [A4]</span>
                            </div>
                            <p className="text-[9px] text-[#222D2C] font-sans leading-tight">
                              Mills high-altitude repeater coax checked. 98% packet RX on 915MHz channel 1.
                            </p>
                          </div>
                        )}

                        {/* Thread 3: Ariel's Tool Shed Log */}
                        {(commsFilter === "all" || commsFilter === "ariel") && (
                          <div className="p-2 bg-[#FFFFFF] border border-[#222D2C] space-y-0.5">
                            <div className="flex justify-between items-center text-[8px]">
                              <span className="font-bold text-[#1A66A6] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-[#F4D35A] rounded-full inline-block" />
                                Ariel Churi (Node #742)
                              </span>
                              <span className="text-[#5B6360]">Yesterday // [F5]</span>
                            </div>
                            <p className="text-[9px] text-[#222D2C] font-sans leading-tight">
                              Delivering spare soldering iron and multimeter to Walnut Street Repair Guild.
                            </p>
                          </div>
                        )}

                        {/* Thread 4: Elena Rostova */}
                        {(commsFilter === "all" || commsFilter === "mesh") && (
                          <div className="p-2 bg-[#EFECE6] border border-[#222D2C] space-y-0.5">
                            <div className="flex justify-between items-center text-[8px]">
                              <span className="font-bold text-[#222D2C]">Elena Rostova (Node #304)</span>
                              <span className="text-[#5B6360]">15:45 // [C6]</span>
                            </div>
                            <p className="text-[9px] text-[#3E4846] font-sans leading-tight">
                              First aid clinic restocked with trauma dressings on Valley Road.
                            </p>
                          </div>
                        )}

                        {/* Thread 5: Emergency Broadcast */}
                        {(commsFilter === "all" || commsFilter === "emergency") && (
                          <div className="p-2 bg-[#D35B50]/15 border border-[#D35B50] space-y-0.5">
                            <div className="flex justify-between items-center text-[8px]">
                              <span className="font-bold text-[#D35B50]">EMERGENCY BROADCAST</span>
                              <span className="text-[#5B6360]">12:00 // REGIONAL</span>
                            </div>
                            <p className="text-[9px] text-[#222D2C] font-sans leading-tight">
                              Weather ephemeris: Light evening showers approaching from WNW. Rain barrels open.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Quick Compose Input */}
                      <div className="flex gap-1 pt-1 border-t border-[#222D2C]/20">
                        <input
                          type="text"
                          placeholder="Broadcast to local mesh as Ariel Churi..."
                          value={newCommsMessage}
                          onChange={(e) => setNewCommsMessage(e.target.value)}
                          className="flex-1 bg-white border border-[#222D2C] px-2 py-1 text-[9px] font-sans focus:outline-none focus:border-[#1A66A6]"
                        />
                        <button
                          onClick={() => {
                            if (newCommsMessage.trim()) {
                              setNewCommsMessage("");
                            }
                          }}
                          className="bg-[#1A66A6] hover:bg-[#145082] text-white px-2 py-1 text-[9px] font-bold uppercase cursor-pointer"
                        >
                          <Send size={11} />
                        </button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* 8. Knowledge Base */}
                <div id="section-knowledge" data-section-id="knowledge" data-section-title="Knowledge Base">
                  <Card 
                    onClickCapture={(e) => isHelpMode && triggerSectionHelp("Knowledge Base", "knowledge", e)}
                    title="Knowledge Base" 
                    accentColor="bg-[#8F57CB] text-white"
                    isShaded={shadedSections["knowledge"]}
                    onToggleShade={() => toggleShade("knowledge")}
                    isExpanded={expandedSection === "knowledge"}
                    onToggleExpand={() => toggleExpand("knowledge")}
                  >
                    <div className="space-y-1">
                      <FileItem name="Solar_Repair_v2.pdf" size="2.4MB" icon={<FileText size={12} />} />
                      <FileItem name="Mesh_Protocol.md" size="12KB" icon={<FileCode size={12} />} />
                      <FileItem name="Local_Herb_Guide.pdf" size="5.1MB" icon={<BookOpen size={12} />} />
                    </div>
                    <Tip label="Search offline wiki documents" notImplemented={true}>
                      <Button variant="outline" size="xs" className="w-full mt-1 py-0.5 text-[10px] h-[22px]">Browse All Docs</Button>
                    </Tip>
                  </Card>
                </div>

              </div>

            </div>
          </div>

        </main>
      )}

            {/* ─── Persistent Floating Help Dock in Bottom-Right Corner ───── */}
      <div className="fixed bottom-4 right-4 z-[99998] flex flex-col items-end gap-2 pointer-events-auto">
        {!helpOverlay && (
          <button
            data-help-toggle="true"
            onClick={() => {
              setIsHelpMode(true);
              setHelpOverlay({ title: "TAZ OS Navigation & Help", sectionId: "overview" });
            }}
            className={cn(
              "px-3 py-1.5 font-mono text-xs font-black uppercase flex items-center gap-2 border-2 cursor-pointer transition-all shadow-xl",
              isHelpMode 
                ? "bg-[#F4D35A] text-[#222D2C] border-[#222D2C] ring-2 ring-[#222D2C] animate-pulse" 
                : "bg-[#222D2C] hover:bg-[#1A66A6] text-white border-[#222D2C]"
            )}
            style={{ boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.5)" }}
          >
            <HelpCircle size={14} className={isHelpMode ? "text-[#D35B50]" : "text-[#F4D35A]"} />
            <span>{isHelpMode ? "HELP MODE: ACTIVE" : "❓ TUTORIAL HELP"}</span>
          </button>
        )}
      </div>

      {/* ─── Floating Help Mode Active Top/Bottom Notification ───────── */}
      {isHelpMode && !helpOverlay && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[99998] bg-[#F4D35A] border-2 border-[#222D2C] px-4 py-2 shadow-2xl font-mono text-xs flex items-center gap-3 animate-bounce">
          <div className="flex items-center gap-2 font-bold text-[#222D2C]">
            <HelpCircle size={16} className="text-[#D35B50]" />
            <span>HELP MODE ACTIVE: Click anywhere on any card to view its tutorial!</span>
          </div>
          <button
            onClick={() => setIsHelpMode(false)}
            className="bg-[#222D2C] hover:bg-[#1A66A6] text-white px-2 py-0.5 text-[10px] font-bold uppercase cursor-pointer"
          >
            Exit ✕
          </button>
        </div>
      )}

      {/* ─── Interactive Help Mode Floating Corner Overlay ─────────── */}
      {helpOverlay && (
        <div 
          id="help-mode-overlay"
          className="fixed bottom-4 right-4 z-[99999] bg-[#FFFFFF] border-3 border-[#222D2C] p-4 shadow-2xl w-96 max-w-[calc(100vw-32px)] font-mono text-xs animate-in slide-in-from-bottom-2 duration-150"
          style={{ boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.6)" }}
        >
          {/* Overlay Header with Dynamic Section Theme Color */}
          {(() => {
            const theme = SECTION_COLOR_MAP[helpOverlay.sectionId] || { bg: "bg-[#1A66A6]", text: "text-white", accentBorder: "border-[#1A66A6]" };
            return (
              <div className={cn(
                "flex justify-between items-center border-b-2 border-[#222D2C] pb-2 mb-2 p-2.5 -m-4 mb-3 transition-colors duration-200 select-none shadow-sm",
                theme.bg,
                theme.text
              )}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 bg-black/30 border border-white/20 shrink-0">
                    <HelpCircle size={13} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-black text-xs uppercase tracking-tight block truncate">
                      HELP: {helpOverlay.title}
                    </span>
                    <span className="text-[8px] font-mono opacity-80 uppercase block">
                      // TARGET SECTION [{helpOverlay.sectionId.toUpperCase()}]
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setHelpOverlay(null);
                    setIsHelpMode(false);
                  }}
                  className="hover:opacity-80 p-1 cursor-pointer font-black text-sm transition-opacity bg-black/20 border border-white/20 hover:bg-black/40 ml-2"
                  title="Close Tutorial"
                >
                  ✕
                </button>
              </div>
            );
          })()}

          {/* Tutorial Body */}
          {(() => {
            const info = (() => {
              switch (helpOverlay.sectionId) {
                case "transport":
                  return {
                    summary: "Decentralized rideshare and item courier dispatch operating over local mesh networks.",
                    details: "Neighbors can broadcast requests for passenger passage or item delivery. Trips can be scheduled at a set time or marked flexible (anytime). Destinations can specify regional cities (Newark, NYC, Paterson) or community bounds coordinates [A-H, 1-8] on the local grid. Coordinated bilaterally without middlemen or corporate ride apps."
                  };
                case "matcher":
                  return {
                    summary: "Peer-to-Peer Mutual Aid Matcher (Section 2.2).",
                    details: "Direct bilateral exchange matching physical community needs against neighbor surpluses without currency, landlords, or corporate logistics."
                  };
                case "map":
                  return {
                    summary: "Local Zone Cartography & Toner Grid.",
                    details: "Calibrated 8x8 letter/number grid [A-H, 1-8] for Upper Montclair, Montclair State University, and Mills Reservation. Shows offline infrastructure, water filtration, and solar nodes."
                  };
                case "calendar":
                  return {
                    summary: "Community Calendar, Fellowship & Barn-Raising.",
                    details: "Collective labor schedules, Amish-style timber framing, workshops, and weekly fellowship potlucks."
                  };
                case "bulletin":
                  return {
                    summary: "Neighborhood Bulletin & Pinboard.",
                    details: "Local surplus notices, urgent repair alerts, and community announcements."
                  };
                case "governance":
                  return {
                    summary: "Direct Consensus Democracy & General Assembly.",
                    details: "Quorum-based referendum voting and non-hierarchical community self-management."
                  };
                case "labor":
                  return {
                    summary: "Collective Labor & Tool Guilds.",
                    details: "Work order rosters, tool lending libraries, and scheduled infrastructure maintenance."
                  };
                case "power":
                  return {
                    summary: "Solar Microgrid & 48V Battery Storage Telemetry.",
                    details: "Real-time battery reserve percentages, solar MPPT generation wattage, and load consumption."
                  };
                case "water":
                  return {
                    summary: "Potable Rain Catchment & UV Purification.",
                    details: "Reserves capacity, TDS purity readouts, and daily catchment yield rates."
                  };
                case "mesh":
                  return {
                    summary: "915MHz LoRa Mesh Network Telemetry.",
                    details: "Active peer node topology, packet health, signal-to-noise ratio, and hop latency."
                  };
                case "nature":
                  return {
                    summary: "Solar Ephemeris & Regional Weather.",
                    details: "Sunrise/sunset daylight curves, lunar phase, barometric trend, and 5-day forecast."
                  };
                case "comms":
                  return {
                    summary: "Encrypted Local Mesh Messenger.",
                    details: "Decentralized radio messenger channels for neighborhood announcements, Ariel Churi's project logs, and emergency dispatch."
                  };
                case "knowledge":
                  return {
                    summary: "Offline Technical Manuals & Herb Guides.",
                    details: "Locally cached emergency documentation, solar repair diagrams, and mesh firmware manuals."
                  };
                default:
                  return {
                    summary: "Temporary Autonomous Zone (TAZ) OS.",
                    details: "An offline-first, non-hierarchical operating system for neighborhood mutual aid, resilience, and direct consensus self-governance."
                  };
              }
            })();

            return (
              <div className="space-y-2 py-1">
                <div className="p-2 bg-[#F4D35A]/20 border border-[#F4D35A] text-[#222D2C] text-[10px] font-sans leading-relaxed">
                  <strong>Section Overview:</strong> {info.summary}
                </div>

                <div className="p-2.5 bg-[#EFECE6] border border-[#222D2C] text-[#3E4846] text-[11px] font-sans leading-relaxed">
                  {info.details}
                </div>

                <div className="flex justify-between items-center text-[9px] text-[#5B6360] font-mono pt-1">
                  <span>TARGET ID: [{helpOverlay.sectionId.toUpperCase()}]</span>
                  <span className="text-[#1A66A6] font-bold">CLICK ANY SECTION TO INSPECT</span>
                </div>
              </div>
            );
          })()}

          {/* Footer Dismiss / Navigation */}
          <div className="flex gap-2 pt-2 border-t border-[#222D2C]/20 mt-2">
            <button
              onClick={() => setIsHelpMode(!isHelpMode)}
              className="flex-1 bg-[#EFECE6] hover:bg-[#DFDDD7] text-[#222D2C] border border-[#222D2C] py-1 text-[9px] font-bold uppercase cursor-pointer"
            >
              {isHelpMode ? "Exit Help Mode" : "Keep Help On"}
            </button>
            <button
              onClick={() => setHelpOverlay(null)}
              className="flex-1 bg-[#1A66A6] hover:bg-[#145082] text-white py-1 text-[9px] font-bold uppercase cursor-pointer"
            >
              Dismiss ✕
            </button>
          </div>
        </div>
      )}

      {/* ─── Profile Slide-Over Sheet (Ariel Churi Account) ────────── */}
      <Sheet 
        isOpen={isAccountOpen} 
        onClose={() => setIsAccountOpen(false)} 
        title="Neighbor Identity"
      >
        <div className="space-y-4 text-left p-1">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#1A66A6] border-2 border-[#222D2C] flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              <img src={arielAvatar} alt="Ariel Churi" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-[#222D2C] leading-none mb-1">Ariel Churi</h3>
              <span className="font-mono text-[9px] font-bold uppercase bg-[#F4D35A] text-[#222D2C] px-1.5 py-0.5 border border-[#222D2C] inline-block">
                Role: Infrastructure & Grid Architecture
              </span>
              <div className="font-mono text-[9px] text-[#5B6360] mt-1">NODE ID: #742 // UPPER MONTCLAIR</div>
            </div>
          </div>

          <div className="space-y-2 border-t border-[#222D2C] pt-3">
            <span className="font-mono text-[10px] font-bold uppercase text-[#5B6360] block px-0.5">Registered Community Skills</span>
            <div className="flex flex-col gap-1.5">
              {[
                "Microgrid Engineering & Solar Inverters",
                "Ham Radio Operator (W2NJ Net Relay)",
                "LoRa Mesh Network Deployment",
                "Wilderness First Aid & Triage",
                "Timber Framing & Carpentry"
              ].map(skill => (
                <div key={skill} className="font-mono text-[11px] font-bold uppercase p-2 bg-white border border-[#222D2C] leading-normal flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-[#54C93F] shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <Tip label="Disconnect local node from mesh" notImplemented={true}>
            <Button variant="danger" size="sm" className="w-full mt-3 py-1.5">Disconnect Node</Button>
          </Tip>
        </div>
      </Sheet>
    </div>
  );
}

function StatusBadge({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center gap-1.5 border border-[#222D2C] px-2 py-0.5 bg-[#FFFFFF] font-mono text-[10px] h-[24px]">
      <span>{icon}</span>
      <span className="font-bold text-[#5B6360] uppercase">{label}:</span>
      <span className="font-bold text-[#222D2C]">{value}</span>
    </div>
  );
}

function FilterChip({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon?: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 border px-2 py-0.5 font-mono text-[9px] font-bold uppercase transition-colors cursor-pointer leading-normal h-[22px]",
        active
          ? "bg-[#1A66A6] text-white border-[#1A66A6]"
          : "bg-white text-[#222D2C] border-[#222D2C] hover:bg-[#EFECE6]"
      )}
      style={{ borderRadius: 0, boxShadow: "none" }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default App;
