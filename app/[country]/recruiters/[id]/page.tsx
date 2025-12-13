"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRecruiterById, getRecruitersByCountry } from "@/lib/data";
import { isValidCountryCode } from "@/lib/subdomain";
import { Recruiter } from "@/types/recruiter";
import { CountryCode } from "@/types/recruiter";
import {
  ExternalLink,
  Briefcase,
  MapPin,
  ArrowLeft,
  Clock,
  Copy,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { RecruiterCard } from "@/components/RecruiterCard";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/ui/toast";
import {
  getRecruiterProfileUrl,
  copyToClipboard,
  shareContent,
  canShare,
} from "@/lib/share";

export default function RecruiterProfilePage() {
  const params = useParams();
  const router = useRouter();
  const countryParam = params?.country as string;
  const recruiterId = params?.id as string;
  const country = (
    isValidCountryCode(countryParam) ? countryParam : "us"
  ) as CountryCode;

  const { addToast } = useToast();
  const [recruiter, setRecruiter] = useState<Recruiter | null>(null);
  const [relatedRecruiters, setRelatedRecruiters] = useState<Recruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (recruiterId) {
      const foundRecruiter = getRecruiterById(recruiterId, country);
      if (foundRecruiter) {
        setRecruiter(foundRecruiter);

        // Get related recruiters (same country, different person)
        const allRecruiters = getRecruitersByCountry(country);
        const related = allRecruiters
          .filter((r) => r.id !== recruiterId)
          .slice(0, 3);
        setRelatedRecruiters(related);
      }
      setLoading(false);
    }
  }, [recruiterId, country]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentCountry={country} />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  if (!recruiter) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentCountry={country} />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Recruiter not found</h1>
            <Button asChild>
              <Link href={`/${country}`}>Back to Directory</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const initials = (recruiter.name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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

  return (
    <div className="min-h-screen bg-background">
      <Header currentCountry={country} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push(`/${country}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Directory
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={getAvatarUrl()}
                      alt={recruiter.name}
                      onError={(e) => {
                        // Hide the image on error, fallback will show
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">
                      {recruiter.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-base mb-1">
                      <Briefcase className="h-4 w-4" />
                      {recruiter.company}
                    </CardDescription>
                    <CardDescription className="flex items-center gap-2 text-base mb-4">
                      <MapPin className="h-4 w-4" />
                      {recruiter.country}
                      <span className="mx-1">•</span>
                      <Clock className="h-4 w-4" />
                      {recruiter.experience} experience
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleCopyLink}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </Button>
                      {canShare() && (
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={handleShare}
                          disabled={isSharing}
                          className="flex items-center gap-2"
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                      )}
                      <Button asChild size="lg" variant="default">
                        <a
                          href={recruiter.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-5 w-5" />
                          Contact on LinkedIn
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {recruiter.bio}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recruiter.specialization.map((spec, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm py-1 px-3"
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            {relatedRecruiters.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Other Recruiters</h2>
                <div className="space-y-4">
                  {relatedRecruiters.map((related) => (
                    <RecruiterCard
                      key={related.id}
                      recruiter={related}
                      country={country}
                      viewMode="list"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
