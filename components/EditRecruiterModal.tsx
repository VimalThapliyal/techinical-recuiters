"use client";

import { useState, useEffect } from "react";
import { Recruiter } from "@/types/recruiter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Save, Image as ImageIcon, Trash2, Power } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRY_INFO } from "@/lib/subdomain";
import { CountryCode } from "@/types/recruiter";

interface EditRecruiterModalProps {
  recruiter: Recruiter;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRecruiter: Recruiter) => Promise<void>;
  onDelete?: (recruiterId: string) => Promise<void>;
  onDeactivate?: (recruiterId: string, isActive: boolean) => Promise<void>;
}

const EXPERIENCE_OPTIONS = [
  "0-2 years",
  "2-5 years",
  "5-10 years",
  "10-15 years",
  "15+ years",
];

export function EditRecruiterModal({
  recruiter,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onDeactivate,
}: EditRecruiterModalProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<Recruiter>(recruiter);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActive, setIsActive] = useState(
    (recruiter as any).isActive !== false
  ); // Default to true if not set

  useEffect(() => {
    if (isOpen) {
      setFormData(recruiter);
      setNewSpecialization("");
    }
  }, [recruiter, isOpen]);

  if (!isOpen) return null;

  const handleAddSpecialization = () => {
    if (
      newSpecialization.trim() &&
      !formData.specialization.includes(newSpecialization.trim())
    ) {
      setFormData({
        ...formData,
        specialization: [...formData.specialization, newSpecialization.trim()],
      });
      setNewSpecialization("");
    }
  };

  const handleRemoveSpecialization = (spec: string) => {
    setFormData({
      ...formData,
      specialization: formData.specialization.filter((s) => s !== spec),
    });
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      addToast({
        title: "Validation Error",
        description: "Name is required",
        variant: "error",
      });
      return;
    }

    if (!formData.linkedinUrl.trim()) {
      addToast({
        title: "Validation Error",
        description: "LinkedIn URL is required",
        variant: "error",
      });
      return;
    }

    if (formData.specialization.length === 0) {
      addToast({
        title: "Validation Error",
        description: "At least one specialization is required",
        variant: "error",
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedData = { ...formData, isActive };
      await onSave(updatedData);
      addToast({
        title: "Success!",
        description: "Recruiter profile updated successfully",
        variant: "success",
      });
      onClose();
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to update recruiter profile",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    if (
      !confirm(
        `Are you sure you want to DELETE ${formData.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(recruiter.id);
      addToast({
        title: "Deleted!",
        description: `${formData.name} has been removed from the directory`,
        variant: "success",
      });
      onClose();
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to delete recruiter",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async () => {
    if (!onDeactivate) return;

    const newActiveState = !isActive;
    setIsActive(newActiveState);

    try {
      await onDeactivate(recruiter.id, newActiveState);
      addToast({
        title: newActiveState ? "Activated!" : "Deactivated!",
        description: `${formData.name} has been ${
          newActiveState ? "activated" : "deactivated"
        }`,
        variant: "success",
      });
    } catch (error) {
      setIsActive(!newActiveState); // Revert on error
      addToast({
        title: "Error",
        description: `Failed to ${
          newActiveState ? "activate" : "deactivate"
        } recruiter`,
        variant: "error",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="linkedin-card w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="h2">Edit Recruiter Profile</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>

            <div>
              <Label
                htmlFor="name"
                className="text-sm font-semibold mb-2 block"
              >
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label
                htmlFor="linkedinUrl"
                className="text-sm font-semibold mb-2 block"
              >
                LinkedIn Profile URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData({ ...formData, linkedinUrl: e.target.value })
                }
                placeholder="https://www.linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <Label
                htmlFor="imageUrl"
                className="text-sm font-semibold mb-2 block"
              >
                Profile Image URL{" "}
                <span className="text-[#666666] text-xs">Optional</span>
              </Label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://media.licdn.com/dms/image/..."
                  className="pl-10"
                />
              </div>
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border border-[#e0e0e0]"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Company & Location */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company & Location</h3>

            <div>
              <Label
                htmlFor="company"
                className="text-sm font-semibold mb-2 block"
              >
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="Your Company Name"
              />
            </div>

            <div>
              <Label
                htmlFor="country"
                className="text-sm font-semibold mb-2 block"
              >
                Country <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.country}
                onValueChange={(value) =>
                  setFormData({ ...formData, country: value as CountryCode })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(COUNTRY_INFO).map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Specializations */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Specializations</h3>

            <div className="flex gap-2">
              <Input
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="Add specialization (e.g., React, Python)"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSpecialization();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddSpecialization}
                variant="outline"
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.specialization.map((spec, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {spec}
                  <button
                    onClick={() => handleRemoveSpecialization(spec)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Experience & Bio */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Experience & Bio</h3>

            <div>
              <Label
                htmlFor="experience"
                className="text-sm font-semibold mb-2 block"
              >
                Years of Experience <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.experience}
                onValueChange={(value) =>
                  setFormData({ ...formData, experience: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map((exp) => (
                    <SelectItem key={exp} value={exp}>
                      {exp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bio" className="text-sm font-semibold mb-2 block">
                Professional Bio <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about your recruiting experience and expertise..."
                rows={6}
              />
            </div>
          </div>

          {/* Status Toggle */}
          {onDeactivate && (
            <div className="space-y-4 pt-4 border-t border-[#e0e0e0]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Account Status</h3>
                  <p className="text-sm text-[#666666]">
                    {isActive
                      ? "This recruiter is active and visible in the directory"
                      : "This recruiter is deactivated and hidden from the directory"}
                  </p>
                </div>
                <Button
                  variant={isActive ? "outline" : "default"}
                  onClick={handleToggleActive}
                  className={isActive ? "" : "bg-red-500 hover:bg-red-600"}
                >
                  <Power className="h-4 w-4 mr-2" />
                  {isActive ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#e0e0e0]">
            {onDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting || isSaving}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            )}
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || isDeleting}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
