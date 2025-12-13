"use client";

import { Recruiter } from "@/types/recruiter";
import { RecruiterCard } from "./RecruiterCard";
import { Skeleton } from "@/components/ui/skeleton";

interface RecruiterGridProps {
  recruiters: Recruiter[];
  country: string;
  viewMode?: "grid" | "list";
  loading?: boolean;
  matchScores?: Map<string, number>;
  showMatchScores?: boolean;
}

export function RecruiterGrid({
  recruiters,
  country,
  viewMode = "grid",
  loading = false,
  matchScores,
  showMatchScores = false,
}: RecruiterGridProps) {
  if (loading) {
    return (
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className={viewMode === "grid" ? "" : ""}>
            <Skeleton className="h-64 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (recruiters.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No recruiters found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }
    >
      {recruiters.map((recruiter) => (
        <RecruiterCard
          key={recruiter.id}
          recruiter={recruiter}
          country={country}
          viewMode={viewMode}
          matchScore={matchScores?.get(recruiter.id)}
          showMatchScore={showMatchScores}
        />
      ))}
    </div>
  );
}
