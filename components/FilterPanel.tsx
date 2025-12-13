"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { SortOption } from "@/lib/data";

interface FilterPanelProps {
  specializations: string[];
  selectedSpecialization: string;
  onSpecializationChange: (value: string) => void;
  companies: string[];
  selectedCompany: string;
  onCompanyChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  hasUserProfile?: boolean;
}

export function FilterPanel({
  specializations,
  selectedSpecialization,
  onSpecializationChange,
  companies,
  selectedCompany,
  onCompanyChange,
  sortBy,
  onSortChange,
  hasUserProfile = false,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5 mb-6">
        <Filter className="h-4 w-4 text-[#6b7280]" />
        <Label className="text-base font-semibold text-[#111827] tracking-tight">Filters</Label>
      </div>

      <div className="space-y-5">
        <div className="space-y-2.5">
          <Label htmlFor="sort" className="text-sm text-[#111827] font-medium block">
            Sort by
          </Label>
          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            <SelectTrigger id="sort" className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {hasUserProfile && (
                <SelectItem value="match-desc">Best Match First</SelectItem>
              )}
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="company-asc">Company (A-Z)</SelectItem>
              <SelectItem value="company-desc">Company (Z-A)</SelectItem>
              <SelectItem value="experience-desc">
                Experience (High to Low)
              </SelectItem>
              <SelectItem value="experience-asc">
                Experience (Low to High)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="specialization" className="text-sm text-[#111827] font-medium">
            Specialization
          </Label>
          <Select
            value={selectedSpecialization}
            onValueChange={onSpecializationChange}
          >
            <SelectTrigger id="specialization" className="w-full">
              <SelectValue placeholder="All specializations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All specializations</SelectItem>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="company" className="text-sm text-[#111827] font-medium">
            Company
          </Label>
          <Select value={selectedCompany} onValueChange={onCompanyChange}>
            <SelectTrigger id="company" className="w-full">
              <SelectValue placeholder="All companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All companies</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
