"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRY_INFO } from "@/lib/subdomain";
import { CountryCode } from "@/types/recruiter";
import { Globe, Grid3x3, List, User } from "lucide-react";

interface HeaderProps {
  currentCountry: CountryCode;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
}

export function Header({
  currentCountry,
  viewMode,
  onViewModeChange,
}: HeaderProps) {
  const pathname = usePathname();
  const currentCountryInfo = COUNTRY_INFO[currentCountry];
  const isProfilePage = pathname === "/profile";

  const handleCountryChange = (value: string) => {
    if (value === currentCountry) return;

    // Use path-based routing instead of subdomain routing
    // This works better with Vercel and custom domains
    const newPath = `/${value}`;
    window.location.href = newPath;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e5e7eb] bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/${currentCountry}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
              aria-label="Recruiter Directory Home"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#0077b5] to-[#004182] shadow-sm group-hover:shadow-md transition-shadow">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-[#111827] tracking-tight">
                Recruiter Directory
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f9fafb] text-sm text-[#6b7280] font-medium">
              <span className="text-base">{currentCountryInfo.flag}</span>
              <span>{currentCountryInfo.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onViewModeChange && !isProfilePage && (
              <div className="hidden sm:flex items-center gap-1 border border-[#e5e7eb] rounded-lg p-1 bg-[#f9fafb]">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange("grid")}
                  className="h-9 min-w-9"
                  aria-label="Grid view"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange("list")}
                  className="h-9 min-w-9"
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button
              variant={isProfilePage ? "default" : "ghost"}
              size="sm"
              asChild
              className={
                isProfilePage ? "" : "text-[#6b7280] hover:text-[#111827]"
              }
            >
              <Link href="/profile" aria-label="My Profile">
                <User className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">My Profile</span>
              </Link>
            </Button>
            <Select value={currentCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-[160px] sm:w-[180px] border-[#e5e7eb] bg-white hover:bg-[#f9fafb] h-9">
                <SelectValue>
                  <span className="flex items-center gap-2 text-[#111827] font-medium text-sm">
                    <span className="text-base">{currentCountryInfo.flag}</span>
                    <span className="hidden sm:inline">
                      {currentCountryInfo.name}
                    </span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border-[#e5e7eb]">
                {Object.values(COUNTRY_INFO).map((country) => (
                  <SelectItem
                    key={country.code}
                    value={country.code}
                    className="hover:bg-[#f9fafb] cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-[#111827]">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
}
