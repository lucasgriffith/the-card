"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/results", label: "Results" },
  { href: "/superstars", label: "Superstars" },
  { href: "/championships", label: "Championships" },
  { href: "/seasons", label: "Seasons" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        {/* Logo */}
        <Link href="/" className="mr-8 flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(212, 175, 55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="18" rx="2" />
              <path d="M8 7v10M16 7v10M2 12h20" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none gradient-text-gold">THE CARD</span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground leading-none mt-0.5">
              WWE Hub
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-all ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-1 -bottom-[13px] h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Admin
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem render={<Link href="/login" />}>
                Sign In / Sign Out
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/admin/events" />}>
                Manage Events
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/admin/superstars" />}>
                Manage Superstars
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/admin/championships" />}>
                Manage Championships
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/admin/seasons" />}>
                Manage Seasons
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/admin/shows" />}>
                Manage Shows
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground transition-colors">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="text-foreground">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-border/30 bg-background/95 backdrop-blur-xl">
              <div className="mt-8 flex flex-col gap-1">
                <div className="mb-4 flex items-center gap-2.5 px-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(212, 175, 55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="18" rx="2" />
                      <path d="M8 7v10M16 7v10M2 12h20" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold gradient-text-gold">THE CARD</span>
                </div>
                <nav className="flex flex-col gap-0.5">
                  {navLinks.map((link) => {
                    const active = isActive(pathname, link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                          active
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
