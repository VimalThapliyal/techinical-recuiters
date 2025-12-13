"use client";

import { useState } from "react";
import { Recruiter } from "@/types/recruiter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ExternalLink,
  Briefcase,
  MapPin,
  Copy,
  Share2,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
  getRecruiterProfileUrl,
  copyToClipboard,
  shareContent,
  canShare,
} from "@/lib/share";

interface RecruiterCardProps {
  recruiter: Recruiter;
  country: string;
  viewMode?: "grid" | "list";
  matchScore?: number;
  showMatchScore?: boolean;
}

export function RecruiterCard({
  recruiter,
  country,
  viewMode = "grid",
  matchScore,
  showMatchScore = false,
}: RecruiterCardProps) {
  const { addToast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const initials = (
    (recruiter.name || "?")
      .split(" ")
      .map((n) => n?.[0] || "")
      .join("")
      .toUpperCase() || "?"
  ).slice(0, 2);

  const profileUrl = getRecruiterProfileUrl(recruiter.id, country);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(profileUrl);
    if (success) {
      addToast({
        title: "Link copied!",
        description: "Recruiter profile link copied to clipboard",
        variant: "success",
      });
    } else {
      addToast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "error",
      });
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const success = await shareContent(
        `${recruiter.name} - Technical Recruiter`,
        `Check out ${recruiter.name}, a ${
          recruiter.company
        } recruiter specializing in ${recruiter.specialization.join(", ")}`,
        profileUrl
      );
      if (success) {
        addToast({
          title: "Shared successfully!",
          description: canShare()
            ? "Profile shared"
            : "Link copied to clipboard",
          variant: "success",
        });
      }
    } catch (error) {
      // User cancelled - no need to show error
    } finally {
      setIsSharing(false);
    }
  };

  // Generate avatar URL - prioritize real LinkedIn images
  const getAvatarUrl = () => {
    // If there's a valid external image URL (LinkedIn or other), use it
    if (
      recruiter.imageUrl &&
      (recruiter.imageUrl.startsWith("https://") ||
        recruiter.imageUrl.startsWith("http://"))
    ) {
      return recruiter.imageUrl;
    }
    // Use UI Avatars service to generate avatar with initials as fallback
    const name = encodeURIComponent(recruiter.name);
    // Generate a consistent color based on the name hash
    const colors = [
      "6366f1",
      "8b5cf6",
      "ec4899",
      "f43f5e",
      "ef4444",
      "f59e0b",
      "10b981",
      "06b6d4",
      "3b82f6",
      "14b8a6",
    ];
    const colorIndex =
      (recruiter.name || "Unknown")
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return `https://ui-avatars.com/api/?name=${name}&size=200&background=${colors[colorIndex]}&color=fff&bold=true&format=png`;
  };

  if (viewMode === "list") {
    return (
      <Card className="linkedin-card group hover:border-[#0077b5]/30 transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={getAvatarUrl()}
                alt={recruiter.name}
                onError={(e) => {
                  // Hide the image on error, fallback will show
                  e.currentTarget.style.display = "none";
                }}
              />
              <AvatarFallback className="text-lg bg-[#0077b5] text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="h4 mb-1.5">{recruiter.name}</h3>
                  <div className="flex items-center gap-2 text-small text-[#666666] mb-3 font-normal">
                    <Briefcase className="h-4 w-4" />
                    <span>{recruiter.company}</span>
                    <span className="mx-1">•</span>
                    <MapPin className="h-4 w-4" />
                    <span>{recruiter.country}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    title="Copy profile link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {canShare() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      disabled={isSharing}
                      title="Share profile"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button asChild variant="default" size="sm">
                    <a
                      href={recruiter.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Contact
                    </a>
                  </Button>
                </div>
              </div>
              <p className="text-small text-[#666666] mb-4 line-clamp-2 leading-relaxed">
                {recruiter.bio}
              </p>
              <div className="flex flex-wrap gap-2">
                {(recruiter.specialization || []).map((spec, index) => (
                  <Badge key={`${recruiter.id}-spec-${index}-${spec}`} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="linkedin-card group h-full flex flex-col relative hover:border-[#0077b5]/30 transition-all duration-200">
      {showMatchScore && matchScore !== undefined && matchScore > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#0077b5] to-[#004182] text-white text-xs font-semibold shadow-sm">
            <TrendingUp className="h-3 w-3" />
            {matchScore}%
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex items-start gap-4 mb-2">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={getAvatarUrl()}
              alt={recruiter.name}
              onError={(e) => {
                // Hide the image on error, fallback will show
                e.currentTarget.style.display = "none";
              }}
            />
            <AvatarFallback className="text-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="h5 mb-1.5">{recruiter.name}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 text-xs text-[#666666] mb-1 font-normal">
              <Briefcase className="h-3.5 w-3.5" />
              {recruiter.company}
            </CardDescription>
            <CardDescription className="flex items-center gap-1.5 text-xs text-[#666666] font-normal">
              <MapPin className="h-3.5 w-3.5" />
              {recruiter.country} • {recruiter.experience}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-small text-[#666666] mb-5 line-clamp-3 leading-relaxed">
          {recruiter.bio}
        </p>
        <div className="flex flex-wrap gap-2">
          {(recruiter.specialization || []).slice(0, 3).map((spec, index) => (
            <Badge key={`${recruiter.id}-spec-${index}-${spec}`} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
          {recruiter.specialization.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{recruiter.specialization.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex-1"
            title="Copy profile link"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          {canShare() && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
              className="flex-1"
              title="Share profile"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
        </div>
        <Button asChild className="w-full" variant="default">
          <a
            href={recruiter.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Contact on LinkedIn
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
