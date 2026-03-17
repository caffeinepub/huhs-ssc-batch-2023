import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { GraduationCap, Menu, Search, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetVisitorCount,
} from "../hooks/useQueries";
import { useRouter } from "../router";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Friends", path: "/friends" },
  { label: "Photos", path: "/photos" },
  { label: "Videos", path: "/videos" },
  { label: "PDFs", path: "/pdfs" },
  { label: "Social", path: "/social" },
];

interface HeaderProps {
  onLoginClick: () => void;
  searchTerm: string;
  onSearchChange: (v: string) => void;
}

export default function Header({
  onLoginClick,
  searchTerm,
  onSearchChange,
}: HeaderProps) {
  const { currentPath, navigate } = useRouter();
  const { identity, clear, isLoggingIn } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: profile } = useGetCallerUserProfile();
  const { data: visitorCount } = useGetVisitorCount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const userInitials = profile?.name
    ? profile.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-50 bg-card shadow-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Title */}
          <button
            type="button"
            className="flex items-center gap-3 min-w-0"
            onClick={() => navigate("/")}
            data-ocid="nav.home.link"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="block text-left min-w-0 max-w-[140px] sm:max-w-[200px] lg:max-w-none">
              <p className="text-xs sm:text-sm font-semibold text-foreground leading-tight truncate">
                Harishchar Union High School
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                SSC Batch 2023
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            data-ocid="nav.links"
          >
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.path}
                onClick={() => navigate(link.path)}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPath === link.path
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {visitorCount !== undefined && (
              <div className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                <Users className="w-3 h-3" />
                <span>{visitorCount.toString()} visitors</span>
              </div>
            )}

            <button
              type="button"
              className="p-2 rounded-full hover:bg-muted transition-colors"
              onClick={() => setSearchOpen((v) => !v)}
              data-ocid="nav.search_input"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="rounded-full"
                    data-ocid="nav.user.button"
                  >
                    <Avatar className="w-8 h-8 ring-2 ring-primary/30">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48"
                  data-ocid="nav.user.dropdown_menu"
                >
                  <div className="px-3 py-2 text-sm font-medium text-foreground border-b border-border">
                    {profile?.name ?? "User"}
                  </div>
                  <DropdownMenuItem
                    onClick={() => navigate("/admin")}
                    data-ocid="nav.admin.link"
                  >
                    Admin Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                    data-ocid="nav.logout.button"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                onClick={onLoginClick}
                disabled={isLoggingIn}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4"
                data-ocid="nav.login.button"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            )}

            <button
              type="button"
              className="md:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setMenuOpen((v) => !v)}
              data-ocid="nav.menu.button"
              aria-label="Menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-3"
            >
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="max-w-lg"
                data-ocid="header.search_input"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-card border-t border-border"
          >
            <nav
              className="flex flex-col px-4 pb-4 pt-2 gap-1"
              data-ocid="nav.mobile.panel"
            >
              {NAV_LINKS.map((link) => (
                <button
                  type="button"
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setMenuOpen(false);
                  }}
                  data-ocid={`nav.mobile.${link.label.toLowerCase()}.link`}
                  className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPath === link.path
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
