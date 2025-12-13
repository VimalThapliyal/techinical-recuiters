"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/types/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, User, Save } from "lucide-react";
import { getAllSpecializations } from "@/lib/data";
import { getAllSkills } from "@/lib/matching";
import { CountryCode } from "@/types/recruiter";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  currentProfile?: UserProfile | null;
  country: CountryCode;
  recruiters: any[];
}

export function UserProfileModal({
  isOpen,
  onClose,
  onSave,
  currentProfile,
  country,
  recruiters,
}: UserProfileModalProps) {
  const [skills, setSkills] = useState<string[]>(currentProfile?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [experience, setExperience] = useState(
    currentProfile?.experience || ""
  );
  const [location, setLocation] = useState(currentProfile?.location || "");
  const [preferredSpecializations, setPreferredSpecializations] = useState<
    string[]
  >(currentProfile?.preferredSpecializations || []);
  const [jobLevel, setJobLevel] = useState<
    "entry" | "mid" | "senior" | "executive" | ""
  >(currentProfile?.jobLevel || "");
  const [remotePreference, setRemotePreference] = useState<
    "remote" | "hybrid" | "onsite" | "any" | ""
  >(currentProfile?.remotePreference || "");

  const availableSpecializations = getAllSpecializations(country);
  const availableSkills = getAllSkills(recruiters);

  useEffect(() => {
    if (currentProfile) {
      setSkills(currentProfile.skills || []);
      setExperience(currentProfile.experience || "");
      setLocation(currentProfile.location || "");
      setPreferredSpecializations(
        currentProfile.preferredSpecializations || []
      );
      setJobLevel(currentProfile.jobLevel || "");
      setRemotePreference(currentProfile.remotePreference || "");
    }
  }, [currentProfile]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleToggleSpecialization = (spec: string) => {
    if (preferredSpecializations.includes(spec)) {
      setPreferredSpecializations(
        preferredSpecializations.filter((s) => s !== spec)
      );
    } else {
      setPreferredSpecializations([...preferredSpecializations, spec]);
    }
  };

  const handleSave = () => {
    const profile: UserProfile = {
      skills,
      experience,
      location,
      preferredSpecializations,
      jobLevel: jobLevel || undefined,
      remotePreference: remotePreference || undefined,
    };
    onSave(profile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto linkedin-card border-[#e0e0e0]">
        <CardHeader className="sticky top-0 bg-white z-10 border-b border-[#e0e0e0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e7f3f8] flex items-center justify-center">
                <User className="h-5 w-5 text-[#0077b5]" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-[#000000]">
                  Your Profile
                </CardTitle>
                <CardDescription className="text-sm text-[#666666]">
                  Help us find the best matching recruiters for you
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Skills */}
          <div className="space-y-3">
            <Label
              htmlFor="skills"
              className="text-sm font-medium text-[#000000]"
            >
              Your Skills
            </Label>
            <div className="flex gap-2">
              <Input
                id="skills"
                placeholder="e.g., React, Node.js, Python"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSkill}
                className="flex-shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:bg-[#d0e7f0] rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {availableSkills.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-[#666666] mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {availableSkills
                    .filter((s) => !skills.includes(s))
                    .slice(0, 10)
                    .map((skill) => (
                      <button
                        key={skill}
                        onClick={() => {
                          if (!skills.includes(skill)) {
                            setSkills([...skills, skill]);
                          }
                        }}
                        className="text-xs px-2 py-1 rounded-full border border-[#e0e0e0] hover:border-[#0077b5] hover:bg-[#e7f3f8] text-[#666666] hover:text-[#0077b5] transition-colors"
                      >
                        + {skill}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label
              htmlFor="experience"
              className="text-sm font-medium text-[#000000]"
            >
              Years of Experience
            </Label>
            <Input
              id="experience"
              placeholder="e.g., 5+ years, 3-5 years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label
              htmlFor="location"
              className="text-sm font-medium text-[#000000]"
            >
              Location
            </Label>
            <Input
              id="location"
              placeholder="e.g., India, Bangalore, Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Preferred Specializations */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#000000]">
              Preferred Specializations
            </Label>
            <div className="flex flex-wrap gap-2">
              {availableSpecializations.slice(0, 10).map((spec) => (
                <button
                  key={spec}
                  onClick={() => handleToggleSpecialization(spec)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    preferredSpecializations.includes(spec)
                      ? "bg-[#0077b5] text-white"
                      : "bg-white border border-[#e0e0e0] text-[#000000] hover:border-[#0077b5] hover:bg-[#e7f3f8]"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Job Level */}
          <div className="space-y-2">
            <Label
              htmlFor="jobLevel"
              className="text-sm font-medium text-[#000000]"
            >
              Job Level
            </Label>
            <Select
              value={jobLevel}
              onValueChange={(value) =>
                setJobLevel(value as "entry" | "mid" | "senior" | "executive")
              }
            >
              <SelectTrigger id="jobLevel" className="w-full">
                <SelectValue placeholder="Select job level (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Remote Preference */}
          <div className="space-y-2">
            <Label
              htmlFor="remote"
              className="text-sm font-medium text-[#000000]"
            >
              Remote Preference
            </Label>
            <Select
              value={remotePreference}
              onValueChange={(value) =>
                setRemotePreference(
                  value as "remote" | "hybrid" | "onsite" | "any"
                )
              }
            >
              <SelectTrigger id="remote" className="w-full">
                <SelectValue placeholder="Select preference (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote Only</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
                <SelectItem value="any">Any</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e0e0e0]">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#0077b5] hover:bg-[#004182]"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
