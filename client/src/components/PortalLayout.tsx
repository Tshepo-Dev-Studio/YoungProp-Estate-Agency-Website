import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Users,
  FileText,
  Home,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Settings,
  TrendingUp,
  ClipboardList,
} from "lucide-react";

const navItems = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/deals", label: "My Deals", icon: Briefcase },
  { href: "/portal/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/portal/leads", label: "Leads", icon: Users },
  { href: "/portal/valuations", label: "Valuations", icon: ClipboardList },
  { href: "/portal/listings", label: "Listings", icon: FileText },
  { href: "/portal/profile", label: "My Profile", icon: Settings },
];

const adminItems = [
  { href: "/portal/admin/agents", label: "Agents", icon: Users },
  { href: "/portal/admin/reports", label: "Reports", icon: TrendingUp },
];

interface PortalLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function PortalLayout({ children, title }: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0A1628] border-t-[#C9A84C] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <img
            src="https://static-assets.manus.computer/files/youngprop-logo.png"
            alt="YoungProp"
            className="h-16 mx-auto mb-6 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <h1 className="text-2xl font-bold text-[#0A1628] mb-2">Staff Portal</h1>
          <p className="text-gray-500 mb-6">Sign in to access your YoungProp agent dashboard.</p>
          <a href={getLoginUrl()}>
            <Button className="w-full bg-[#0A1628] hover:bg-[#0A1628]/90 text-white py-3 text-base">
              Sign In to Portal
            </Button>
          </a>
          <div className="mt-4">
            <Link href="/">
              <a className="text-sm text-gray-400 hover:text-[#C9A84C] flex items-center justify-center gap-1">
                <Home className="w-3 h-3" /> Back to Website
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "YP";

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
    const isActive = location === href || (href !== "/portal" && location.startsWith(href));
    return (
      <Link href={href}>
        <a
          onClick={() => setSidebarOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isActive
              ? "bg-[#C9A84C] text-white shadow-sm"
              : "text-gray-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          {label}
          {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
        </a>
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link href="/portal">
          <a className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C9A84C] rounded-lg flex items-center justify-center text-white font-bold text-sm">YP</div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">YoungProp</div>
              <div className="text-[#C9A84C] text-xs">Staff Portal</div>
            </div>
          </a>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs text-gray-500 uppercase tracking-wider px-3 mb-2 font-semibold">Main Menu</p>
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}

        {isAdmin && (
          <>
            <p className="text-xs text-gray-500 uppercase tracking-wider px-3 mt-5 mb-2 font-semibold">Admin</p>
            {adminItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </>
        )}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-[#C9A84C] text-white text-xs font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name ?? "Agent"}</p>
            <p className="text-gray-400 text-xs truncate">{user?.email ?? ""}</p>
          </div>
          {isAdmin && <Badge className="bg-[#C9A84C] text-white text-xs px-1.5 py-0.5">Admin</Badge>}
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <a className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
              <Home className="w-3 h-3" /> Website
            </a>
          </Link>
          <button
            onClick={() => logout()}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 bg-[#0A1628] flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-[#0A1628] flex flex-col z-10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            {title && <h1 className="text-lg font-semibold text-[#0A1628]">{title}</h1>}
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
            </button>
            <Avatar className="w-8 h-8 cursor-pointer">
              <AvatarFallback className="bg-[#0A1628] text-white text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
