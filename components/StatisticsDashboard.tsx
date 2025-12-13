"use client";

import { useState } from "react";
import { Statistics } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Building2,
  Briefcase,
  ChevronDown,
  ChevronUp,
  TrendingUp,
} from "lucide-react";

interface StatisticsDashboardProps {
  statistics: Statistics;
  onCompanyClick?: (company: string) => void;
  onSpecializationClick?: (specialization: string) => void;
}

export function StatisticsDashboard({
  statistics,
  onCompanyClick,
  onSpecializationClick,
}: StatisticsDashboardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const photoPercentage =
    statistics.total > 0
      ? Math.round((statistics.withPhotos / statistics.total) * 100)
      : 0;

  return (
    <Card className="linkedin-card border-[#e0e0e0]">
      <CardContent className="p-0">
        {/* Compact Summary View */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e7f3f8] flex items-center justify-center">
                <Users className="h-5 w-5 text-[#0077b5]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#000000]">
                  Directory Overview
                </h3>
                <p className="text-xs text-[#666666]">
                  {statistics.total} recruiters •{" "}
                  {statistics.topCompanies.length} companies
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#0077b5] hover:text-[#004182]"
            >
              {isExpanded ? (
                <>
                  <span className="hidden sm:inline">Show Less</span>
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">View Stats</span>
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Quick Stats Bar */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-[#666666]">Total:</span>
              <span className="font-semibold text-[#000000]">
                {statistics.total}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#666666]">Photos:</span>
              <span className="font-semibold text-[#000000]">
                {photoPercentage}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#666666]">Companies:</span>
              <span className="font-semibold text-[#000000]">
                {statistics.topCompanies.length}
              </span>
            </div>
          </div>
        </div>

        {/* Expanded Detailed View */}
        {isExpanded && (
          <div className="border-t border-[#e0e0e0] p-5 space-y-6 bg-[#fafafa]">
            {/* Top Companies - Compact List */}
            {statistics.topCompanies.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-[#0077b5]" />
                  <h4 className="text-sm font-semibold text-[#000000]">
                    Top Companies
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statistics.topCompanies.slice(0, 8).map((item) => (
                    <button
                      key={item.company}
                      onClick={() => onCompanyClick?.(item.company)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e0e0e0] hover:border-[#0077b5] hover:bg-[#e7f3f8] transition-colors text-sm font-medium text-[#000000]"
                    >
                      <span>{item.company}</span>
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0 h-5"
                      >
                        {item.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Top Specializations - Compact List */}
            {statistics.topSpecializations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="h-4 w-4 text-[#0077b5]" />
                  <h4 className="text-sm font-semibold text-[#000000]">
                    Top Specializations
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {statistics.topSpecializations.slice(0, 8).map((item) => (
                    <button
                      key={item.specialization}
                      onClick={() =>
                        onSpecializationClick?.(item.specialization)
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#e0e0e0] hover:border-[#0077b5] hover:bg-[#e7f3f8] transition-colors text-sm font-medium text-[#000000]"
                    >
                      <span>{item.specialization}</span>
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0 h-5"
                      >
                        {item.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Distribution - Compact */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-[#0077b5]" />
                <h4 className="text-sm font-semibold text-[#000000]">
                  Experience Distribution
                </h4>
              </div>
              <div className="space-y-2.5">
                {Object.entries(statistics.experienceDistribution).map(
                  ([range, count]) => {
                    const percentage =
                      statistics.total > 0
                        ? Math.round((count / statistics.total) * 100)
                        : 0;
                    return (
                      <div key={range} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#000000]">
                            {range} years
                          </span>
                          <span className="text-[#666666]">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#f3f2ef] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0077b5] rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
