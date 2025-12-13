"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmissionFormData } from "@/types/submission";
import { COUNTRY_INFO } from "@/lib/subdomain";
import { CountryCode } from "@/types/recruiter";
import {
  User,
  Briefcase,
  MapPin,
  Award,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Linkedin,
  Mail,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

const TOTAL_STEPS = 5;

const SPECIALIZATION_OPTIONS = [
  "Technical Recruiting",
  "IT Recruitment",
  "Talent Acquisition",
  "Software Engineering Recruitment",
  "Data Science Recruitment",
  "DevOps Recruitment",
  "Cloud Engineering Recruitment",
  "Product Management Recruitment",
  "UI/UX Recruitment",
  "Mobile Development Recruitment",
  "Full Stack Development",
  "Backend Development",
  "Frontend Development",
  "Cybersecurity Recruitment",
  "AI/ML Recruitment",
  "Blockchain Recruitment",
  "Other",
];

const EXPERIENCE_OPTIONS = [
  "0-2 years",
  "2-5 years",
  "5-10 years",
  "10-15 years",
  "15+ years",
];

export function RecruiterSubmissionForm() {
  const { addToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState<SubmissionFormData>({
    name: "",
    linkedinUrl: "",
    company: "",
    country: "IN",
    location: "",
    specialization: [],
    experience: "5+ years",
    bio: "",
    imageUrl: "",
    email: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SubmissionFormData, string>>
  >({});

  // Step validation
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof SubmissionFormData, string>> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
      if (!formData.linkedinUrl.trim()) {
        newErrors.linkedinUrl = "LinkedIn URL is required";
      } else if (
        !formData.linkedinUrl.includes("linkedin.com/in/") &&
        !formData.linkedinUrl.includes("linkedin.com/in/")
      ) {
        newErrors.linkedinUrl = "Please enter a valid LinkedIn profile URL";
      }
    }

    if (step === 2) {
      if (!formData.company.trim()) {
        newErrors.company = "Company name is required";
      }
      if (!formData.country) {
        newErrors.country = "Country is required";
      }
    }

    if (step === 3) {
      if (formData.specialization.length === 0) {
        newErrors.specialization = "Please select at least one specialization";
      }
      if (!formData.experience) {
        newErrors.experience = "Experience level is required";
      }
    }

    if (step === 4) {
      if (!formData.bio.trim()) {
        newErrors.bio = "Bio is required (minimum 50 characters)";
      } else if (formData.bio.trim().length < 50) {
        newErrors.bio = "Bio must be at least 50 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setCurrentStep(4); // Go back to bio step if invalid
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-recruiter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setSubmitted(true);
      addToast({
        title: "Submission successful!",
        description:
          "Your profile has been submitted for review. We'll notify you once it's approved.",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="linkedin-card">
        <CardContent className="p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="h2 mb-4">Thank You for Submitting!</h2>
          <p className="text-large text-[#666666] mb-6 max-w-md mx-auto">
            Your recruiter profile has been submitted successfully. Our team
            will review it and get back to you within 2-3 business days.
          </p>
          <div className="space-y-4">
            <p className="text-small text-[#666666]">What happens next?</p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-small text-[#666666]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>We'll verify your LinkedIn profile and information</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Your profile will be added to our directory</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>You'll receive a confirmation email once approved</span>
              </li>
            </ul>
            <div className="pt-6">
              <Button asChild variant="outline">
                <a href="/">Back to Directory</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    isCompleted
                      ? "bg-[#0077b5] text-white"
                      : isActive
                      ? "bg-[#0077b5] text-white ring-4 ring-[#0077b5]/20"
                      : "bg-[#f3f2ef] text-[#666666]"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : step}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    isActive || isCompleted
                      ? "text-[#0077b5]"
                      : "text-[#666666]"
                  }`}
                >
                  {step === 1 && "Basic Info"}
                  {step === 2 && "Company"}
                  {step === 3 && "Expertise"}
                  {step === 4 && "Bio"}
                  {step === 5 && "Review"}
                </span>
              </div>
              {step < TOTAL_STEPS && (
                <div
                  className={`h-0.5 flex-1 mx-2 -mt-5 ${
                    isCompleted ? "bg-[#0077b5]" : "bg-[#e0e0e0]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <Card className="linkedin-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentStep === 1 && (
              <>
                <User className="h-5 w-5 text-[#0077b5]" />
                Step 1: Basic Information
              </>
            )}
            {currentStep === 2 && (
              <>
                <Briefcase className="h-5 w-5 text-[#0077b5]" />
                Step 2: Company & Location
              </>
            )}
            {currentStep === 3 && (
              <>
                <Award className="h-5 w-5 text-[#0077b5]" />
                Step 3: Specializations & Experience
              </>
            )}
            {currentStep === 4 && (
              <>
                <FileText className="h-5 w-5 text-[#0077b5]" />
                Step 4: Bio & Additional Info
              </>
            )}
            {currentStep === 5 && (
              <>
                <CheckCircle2 className="h-5 w-5 text-[#0077b5]" />
                Step 5: Review & Submit
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
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
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="linkedinUrl"
                  className="text-sm font-semibold mb-2 block"
                >
                  LinkedIn Profile URL <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
                  <Input
                    id="linkedinUrl"
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedinUrl: e.target.value })
                    }
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    className={`pl-10 ${
                      errors.linkedinUrl ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.linkedinUrl && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.linkedinUrl}
                  </p>
                )}
                <p className="text-xs text-[#666666] mt-1">
                  Make sure your LinkedIn profile is public and up to date
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Company & Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
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
                  className={errors.company ? "border-red-500" : ""}
                />
                {errors.company && (
                  <p className="text-xs text-red-500 mt-1">{errors.company}</p>
                )}
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
                    setFormData({ ...formData, country: value })
                  }
                >
                  <SelectTrigger
                    className={errors.country ? "border-red-500" : ""}
                  >
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
                {errors.country && (
                  <p className="text-xs text-red-500 mt-1">{errors.country}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="location"
                  className="text-sm font-semibold mb-2 block"
                >
                  Location (City, State){" "}
                  <span className="text-[#666666] text-xs">Optional</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
                  <Input
                    id="location"
                    value={formData.location || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., Bangalore, Karnataka"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Specializations & Experience */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-semibold mb-3 block">
                  Specializations <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-[#666666] mb-4">
                  Select all that apply (minimum 1 required)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border border-[#e0e0e0] rounded-lg">
                  {SPECIALIZATION_OPTIONS.map((spec) => (
                    <div key={spec} className="flex items-center space-x-2">
                      <Checkbox
                        id={spec}
                        checked={formData.specialization.includes(spec)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              specialization: [
                                ...formData.specialization,
                                spec,
                              ],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              specialization: formData.specialization.filter(
                                (s) => s !== spec
                              ),
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor={spec}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {spec}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.specialization.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {formData.specialization.map((spec) => (
                      <Badge key={spec} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                )}
                {errors.specialization && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.specialization}
                  </p>
                )}
              </div>

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
                  <SelectTrigger
                    className={errors.experience ? "border-red-500" : ""}
                  >
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
                {errors.experience && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.experience}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Bio & Additional Info */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="bio"
                  className="text-sm font-semibold mb-2 block"
                >
                  Professional Bio <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell us about your recruiting experience, expertise, and what makes you unique. Minimum 50 characters."
                  rows={6}
                  className={errors.bio ? "border-red-500" : ""}
                />
                <div className="flex justify-between mt-1">
                  {errors.bio && (
                    <p className="text-xs text-red-500">{errors.bio}</p>
                  )}
                  <p
                    className={`text-xs ml-auto ${
                      formData.bio.length < 50
                        ? "text-[#666666]"
                        : "text-green-600"
                    }`}
                  >
                    {formData.bio.length} / 50 characters minimum
                  </p>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold mb-2 block"
                >
                  Contact Email{" "}
                  <span className="text-[#666666] text-xs">Optional</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your.email@example.com"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-[#666666] mt-1">
                  We'll use this to notify you when your profile is approved
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-[#f9fafb] rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg mb-4">
                  Review Your Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-[#666666] uppercase tracking-wide">
                      Name
                    </Label>
                    <p className="text-base font-medium mt-1">
                      {formData.name}
                    </p>
                  </div>

                  <div>
                    <Label className="text-xs text-[#666666] uppercase tracking-wide">
                      LinkedIn URL
                    </Label>
                    <a
                      href={formData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-[#0077b5] hover:underline mt-1 block"
                    >
                      {formData.linkedinUrl}
                    </a>
                  </div>

                  <div>
                    <Label className="text-xs text-[#666666] uppercase tracking-wide">
                      Company
                    </Label>
                    <p className="text-base font-medium mt-1">
                      {formData.company}
                    </p>
                  </div>

                  <div>
                    <Label className="text-xs text-[#666666] uppercase tracking-wide">
                      Location
                    </Label>
                    <p className="text-base font-medium mt-1">
                      {formData.location || "Not specified"},{" "}
                      {COUNTRY_INFO[formData.country as CountryCode]?.name}
                    </p>
                  </div>

                  <div>
                    <Label className="text-xs text-[#666666] uppercase tracking-wide">
                      Specializations
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.specialization.map((spec) => (
                        <Badge key={spec} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-[#666666] uppercase tracking-wide">
                      Experience
                    </Label>
                    <p className="text-base font-medium mt-1">
                      {formData.experience}
                    </p>
                  </div>

                  <div>
                    <Label className="text-xs text-[#666666] uppercase tracking-wide">
                      Bio
                    </Label>
                    <p className="text-base text-[#666666] mt-1">
                      {formData.bio}
                    </p>
                  </div>

                  {formData.email && (
                    <div>
                      <Label className="text-xs text-[#666666] uppercase tracking-wide">
                        Contact Email
                      </Label>
                      <p className="text-base font-medium mt-1">
                        {formData.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Your submission will be reviewed by our
                  team before being added to the directory. This typically takes
                  2-3 business days.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-[#e0e0e0]">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Submit for Review
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
