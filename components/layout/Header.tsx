"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Anvil,
  Bell,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

export function Header() {
  const { user, activeRole, setActiveRole, logout, getUserNotifications, markAllNotificationsRead } = useApp();
  const [authOpen, setAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState<UserRole>("talent");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = getUserNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { href: "/tasks", label: "Tasks", icon: Anvil },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...(activeRole === "employer" ? [{ href: "/post", label: "Post Task", icon: Plus }] : []),
  ];

  const openAuth = (role: UserRole) => {
    setAuthRole(role);
    setAuthOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <Anvil className="h-4 w-4 text-white" />
            </div>
            <span className="hidden sm:inline">TaskForge</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user && (
              <>
                <div className="hidden sm:flex items-center rounded-lg border border-border bg-secondary/50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setActiveRole("talent")}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      activeRole === "talent" ? "bg-indigo-600 text-white" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Talent
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRole("employer")}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      activeRole === "employer" ? "bg-violet-600 text-white" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Employer
                  </button>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(!notifOpen);
                      if (!notifOpen) markAllNotificationsRead();
                    }}
                    className="relative rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-card shadow-xl">
                      <div className="border-b border-border px-4 py-3 text-sm font-medium">Notifications</div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-6 text-center text-sm text-muted-foreground">No notifications yet</p>
                        ) : (
                          notifications.slice(0, 10).map((n) => (
                            <Link
                              key={n.id}
                              href={n.link ?? "#"}
                              onClick={() => setNotifOpen(false)}
                              className="block border-b border-border/50 px-4 py-3 text-sm hover:bg-secondary/50"
                            >
                              <p className={cn(!n.read && "font-medium")}>{n.message}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {new Date(n.createdAt).toLocaleDateString()}
                              </p>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <Link href={`/devs/${user.username}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    aria-label="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}

            {!user && (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => openAuth("talent")}>
                  For Talent
                </Button>
                <Button size="sm" onClick={() => openAuth("employer")}>
                  For Employers
                </Button>
              </div>
            )}

            <button
              type="button"
              className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-secondary"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-border px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href={`/devs/${user.username}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <button type="button" onClick={logout} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary text-left">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="mt-2" onClick={() => { openAuth("talent"); setMobileOpen(false); }}>
                    For Talent
                  </Button>
                  <Button className="mt-2" onClick={() => { openAuth("employer"); setMobileOpen(false); }}>
                    For Employers
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultRole={authRole} />
    </>
  );
}