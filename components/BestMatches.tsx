"use client";

import { Recruiter } from "@/types/recruiter";
import { UserProfile, MatchScore } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp } from "lucide-react";
import { RecruiterCard } from "@/components/RecruiterCard";
import { getBestMatches } from "@/lib/matching";

interface BestMatchesProps {
  userProfile: UserProfile | null;
  recruiters: Recruiter[];
  country: string;
  onRecruiterClick?: (recruiter: Recruiter) => void;
}

export function BestMatches({
  userProfile,
  recruiters,
  country,
  onRecruiterClick,
}: BestMatchesProps) {
  if (!userProfile || userProfile.skills.length === 0) {
    return null;
  }

  const bestMatches = getBestMatches(userProfile, recruiters, 6);

  if (bestMatches.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0077b5] to-[#004182] flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[#000000]">
            Best Matches for You
          </h2>
          <p className="text-sm text-[#666666]">
            Recruiters that match your skills and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bestMatches.map((match) => (
          <Card
            key={match.id}
            className="linkedin-card border-[#e0e0e0] relative overflow-hidden"
          >
            {/* Match Score Badge */}
            <div className="absolute top-4 right-4 z-10">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#0077b5] to-[#004182] text-white text-xs font-semibold shadow-lg">
                <TrendingUp className="h-3 w-3" />
                {match.matchScore.score}% Match
              </div>
            </div>

            <CardContent className="p-0">
              <div className="p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#000000] mb-1">
                    {match.name}
                  </h3>
                  <p className="text-sm text-[#666666] mb-3">{match.company}</p>

                  {/* Match Reasons */}
                  <div className="space-y-1.5 mb-3">
                    {match.matchScore.reasons.slice(0, 2).map((reason, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 text-xs text-[#0077b5]"
                      >
                        <div className="w-1 h-1 rounded-full bg-[#0077b5]" />
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(match.specialization || []).slice(0, 3).map((spec, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs px-2 py-0.5"
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>

                {/* View Profile Button */}
                <a
                  href={match.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 px-4 rounded-lg bg-[#0077b5] text-white font-medium text-sm hover:bg-[#004182] transition-colors"
                >
                  View Profile
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
