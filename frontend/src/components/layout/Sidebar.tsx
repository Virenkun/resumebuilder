import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus2,
  Target,
  Sparkles,
  LayoutTemplate,
  Settings,
  LogOut,
  FileCheck2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/create", label: "Create new", icon: FilePlus2 },
  { to: "/tailor", label: "Tailor to JD", icon: Target },
  { to: "/score", label: "ATS score", icon: Sparkles },
  { to: "/templates", label: "Templates", icon: LayoutTemplate },
];

function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const initial = (user?.email ?? "?").charAt(0).toUpperCase();
  const display = user?.user_metadata?.full_name || user?.email || "Account";

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-[rgba(14,15,12,0.08)] bg-card">
      {/* Brand */}
      <div className="flex items-center gap-2.5 border-b border-[rgba(14,15,12,0.06)] px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <FileCheck2 className="size-4" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-base text-foreground">Resume</div>
          <div className="text-[11px] font-medium text-muted-foreground">
            AI · ATS · LaTeX
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="editor-scroll flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/75 hover:bg-[rgba(22,51,0,0.06)] hover:text-foreground",
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer: profile dropdown */}
      <div className="border-t border-[rgba(14,15,12,0.06)] p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-full px-2 py-2 text-left transition-colors hover:bg-[rgba(22,51,0,0.06)]"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-[#163300]">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">
                  {display}
                </div>
                <div className="truncate text-[11px] text-muted-foreground">
                  Manage account
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="truncate">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate("/settings")}>
              <Settings className="size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleSignOut}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

export default Sidebar;
