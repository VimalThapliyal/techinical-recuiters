"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { UserProfileModal } from "@/components/UserProfileModal";
import { BestMatches } from "@/components/BestMatches";
import { Footer } from "@/components/Footer";
import { UserProfile } from "@/types/user";
import { Recruiter } from "@/types/recruiter";
import { getRecruitersByCountry } from "@/lib/data";
import { getCountryFromSubdomain, isValidCountryCode } from "@/lib/subdomain";
import { CountryCode } from "@/types/recruiter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Sparkles,
  Edit,
  MapPin,
  Briefcase,
  Award,
  Clock,
  Globe,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [country, setCountry] = useState<CountryCode>("in");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get country from subdomain or default
    let detectedCountry: CountryCode = "in";
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const countryFromSubdomain = getCountryFromSubdomain(hostname);
      if (isValidCountryCode(countryFromSubdomain)) {
        detectedCountry = countryFromSubdomain;
      }
      setCountry(detectedCountry);
    }

    // Load recruiters for matching
    const countryRecruiters = getRecruitersByCountry(detectedCountry);
    setRecruiters(countryRecruiters);

    // Load user profile from localStorage
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to load user profile:", e);
      }
    }

    setLoading(false);
  }, [country]);

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem("userProfile", JSON.stringify(profile));
  };

  const handleDeleteProfile = () => {
    if (confirm("Are you sure you want to delete your profile?")) {
      setUserProfile(null);
      localStorage.removeItem("userProfile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentCountry={country} />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-[#666666]">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentCountry={country} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="h1 mb-2">My Profile</h1>
            <p className="text-large text-[#666666] leading-relaxed">
              Create your profile to get personalized recruiter recommendations
            </p>
          </div>

          {/* Profile Card */}
          {userProfile && userProfile.skills.length > 0 ? (
            <div className="space-y-6">
              <Card className="linkedin-card border-[#e0e0e0]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#e7f3f8] flex items-center justify-center">
                        <User className="h-6 w-6 text-[#0077b5]" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-[#000000]">
                          Your Profile
                        </CardTitle>
                        <p className="text-sm text-[#666666] mt-1">
                          Active profile for personalized matching
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsProfileModalOpen(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeleteProfile}
                        className="text-[#d11124] hover:text-[#d11124] hover:bg-[#fee]"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Skills */}
                  {userProfile.skills.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-[#0077b5]" />
                        <span className="text-sm font-medium text-[#000000]">
                          Skills
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.skills.map((skill, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-sm px-3 py-1"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userProfile.experience && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#666666]" />
                        <div>
                          <p className="text-xs text-[#666666]">Experience</p>
                          <p className="text-sm font-medium text-[#000000]">
                            {userProfile.experience}
                          </p>
                        </div>
                      </div>
                    )}
                    {userProfile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#666666]" />
                        <div>
                          <p className="text-xs text-[#666666]">Location</p>
                          <p className="text-sm font-medium text-[#000000]">
                            {userProfile.location}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preferred Specializations */}
                  {userProfile.preferredSpecializations.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="h-4 w-4 text-[#0077b5]" />
                        <span className="text-sm font-medium text-[#000000]">
                          Preferred Specializations
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.preferredSpecializations.map(
                          (spec, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-sm px-3 py-1"
                            >
                              {spec}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#e0e0e0]">
                    {userProfile.jobLevel && (
                      <div>
                        <p className="text-xs text-[#666666] mb-1">Job Level</p>
                        <p className="text-sm font-medium text-[#000000] capitalize">
                          {userProfile.jobLevel}
                        </p>
                      </div>
                    )}
                    {userProfile.remotePreference && (
                      <div>
                        <p className="text-xs text-[#666666] mb-1">
                          Remote Preference
                        </p>
                        <p className="text-sm font-medium text-[#000000] capitalize">
                          {userProfile.remotePreference}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Best Matches Section */}
              <BestMatches
                userProfile={userProfile}
                recruiters={recruiters}
                country={country}
              />
            </div>
          ) : (
            /* Empty State - No Profile */
            <Card className="linkedin-card border-[#e0e0e0]">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-[#e7f3f8] flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-10 w-10 text-[#0077b5]" />
                </div>
                <h2 className="text-2xl font-semibold text-[#000000] mb-3">
                  Create Your Profile
                </h2>
                <p className="text-[#666666] mb-6 max-w-md mx-auto">
                  Build your profile with your skills, experience, and
                  preferences to get personalized recruiter recommendations that
                  match your needs.
                </p>
                <Button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="bg-[#0077b5] hover:bg-[#004182]"
                  size="lg"
                >
                  <User className="h-5 w-5 mr-2" />
                  Create Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
        currentProfile={userProfile}
        country={country}
        recruiters={recruiters}
      />
    </div>
  );
}
