"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecruiterSubmission } from "@/types/submission";
import { CountryCode } from "@/types/recruiter";
import {
  CheckCircle2,
  X,
  ExternalLink,
  Clock,
  Briefcase,
  Search,
  Filter,
  LogOut,
  CheckSquare,
  Square,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Footer } from "@/components/Footer";
import { isAdminAuthenticated, logoutAdmin } from "@/lib/admin-auth";
import { COUNTRY_INFO } from "@/lib/subdomain";

export default function AdminPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [submissions, setSubmissions] = useState<RecruiterSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCountry] = useState<CountryCode>("in");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(
    new Set()
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAdminAuthenticated()) {
      router.push("/admin/login");
      return;
    }
    setIsAuthenticated(true);
    fetchSubmissions();
  }, [router]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/submissions");
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search submissions
  const filteredSubmissions = useMemo(() => {
    let filtered = [...submissions];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((s) => s.status === statusFilter);
    }

    // Country filter
    if (countryFilter !== "all") {
      filtered = filtered.filter(
        (s) => s.country.toLowerCase() === countryFilter.toLowerCase()
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.company.toLowerCase().includes(query) ||
          s.bio.toLowerCase().includes(query) ||
          s.specialization.some((spec) => spec.toLowerCase().includes(query)) ||
          (s.submittedBy && s.submittedBy.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [submissions, statusFilter, countryFilter, searchQuery]);

  const handleSelectAll = () => {
    if (selectedSubmissions.size === filteredSubmissions.length) {
      setSelectedSubmissions(new Set());
    } else {
      setSelectedSubmissions(
        new Set(filteredSubmissions.map((s) => s.submittedAt))
      );
    }
  };

  const handleSelectSubmission = (submissionId: string) => {
    const newSelected = new Set(selectedSubmissions);
    if (newSelected.has(submissionId)) {
      newSelected.delete(submissionId);
    } else {
      newSelected.add(submissionId);
    }
    setSelectedSubmissions(newSelected);
  };

  const handleBulkApprove = async () => {
    if (selectedSubmissions.size === 0) {
      addToast({
        title: "No selections",
        description: "Please select at least one submission",
        variant: "error",
      });
      return;
    }

    if (!confirm(`Approve ${selectedSubmissions.size} submission(s)?`)) {
      return;
    }

    setIsProcessing(true);
    const selected = Array.from(selectedSubmissions);
    let successCount = 0;
    let failCount = 0;

    for (const submissionId of selected) {
      const submission = submissions.find(
        (s) => s.submittedAt === submissionId
      );
      if (submission) {
        try {
          const response = await fetch("/api/admin/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ submission }),
          });

          if (response.ok) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }
      }
    }

    setSelectedSubmissions(new Set());
    addToast({
      title: "Bulk approval complete",
      description: `${successCount} approved, ${failCount} failed`,
      variant: successCount > 0 ? "success" : "error",
    });
    fetchSubmissions();
    setIsProcessing(false);
  };

  const handleBulkReject = async () => {
    if (selectedSubmissions.size === 0) {
      addToast({
        title: "No selections",
        description: "Please select at least one submission",
        variant: "error",
      });
      return;
    }

    if (!confirm(`Reject ${selectedSubmissions.size} submission(s)?`)) {
      return;
    }

    setIsProcessing(true);
    const selected = Array.from(selectedSubmissions);
    let successCount = 0;
    let failCount = 0;

    for (const submissionId of selected) {
      try {
        const response = await fetch("/api/admin/reject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionId }),
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
      }
    }

    setSelectedSubmissions(new Set());
    addToast({
      title: "Bulk rejection complete",
      description: `${successCount} rejected, ${failCount} failed`,
      variant: successCount > 0 ? "success" : "error",
    });
    fetchSubmissions();
    setIsProcessing(false);
  };

  const handleApprove = async (submission: RecruiterSubmission) => {
    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission }),
      });

      if (response.ok) {
        addToast({
          title: "Approved!",
          description: `${submission.name} has been added to the directory`,
          variant: "success",
        });
        fetchSubmissions();
      } else {
        throw new Error("Failed to approve");
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to approve submission",
        variant: "error",
      });
    }
  };

  const handleReject = async (submission: RecruiterSubmission) => {
    if (!confirm(`Are you sure you want to reject ${submission.name}?`)) {
      return;
    }

    try {
      const response = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: submission.submittedAt }),
      });

      if (response.ok) {
        addToast({
          title: "Rejected",
          description: "Submission has been rejected",
          variant: "success",
        });
        fetchSubmissions();
      } else {
        throw new Error("Failed to reject");
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to reject submission",
        variant: "error",
      });
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin/login");
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header currentCountry={currentCountry} />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-[#666666]">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentCountry={currentCountry} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="h1 mb-2">Admin - Submissions</h1>
              <p className="text-large text-[#666666]">
                Review and manage recruiter profile submissions
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Search and Filters */}
          <Card className="linkedin-card mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
                    <Input
                      placeholder="Search by name, company, bio, specialization..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value: any) => setStatusFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {Object.values(COUNTRY_INFO).map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              {filteredSubmissions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#e0e0e0] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      {selectedSubmissions.size ===
                      filteredSubmissions.length ? (
                        <CheckSquare className="h-4 w-4 mr-2" />
                      ) : (
                        <Square className="h-4 w-4 mr-2" />
                      )}
                      Select All ({selectedSubmissions.size}/
                      {filteredSubmissions.length})
                    </Button>
                    {selectedSubmissions.size > 0 && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleBulkApprove}
                          disabled={isProcessing}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve Selected ({selectedSubmissions.size})
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBulkReject}
                          disabled={isProcessing}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject Selected ({selectedSubmissions.size})
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-[#666666]">
                    Showing {filteredSubmissions.length} of {submissions.length}{" "}
                    submissions
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {filteredSubmissions.length === 0 ? (
            <Card className="linkedin-card">
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-[#666666] mx-auto mb-4" />
                <h2 className="h3 mb-2">No Submissions Found</h2>
                <p className="text-[#666666]">
                  {searchQuery ||
                  statusFilter !== "all" ||
                  countryFilter !== "all"
                    ? "Try adjusting your filters"
                    : "All submissions have been reviewed."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredSubmissions.map((submission) => (
                <Card key={submission.submittedAt} className="linkedin-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <Checkbox
                          checked={selectedSubmissions.has(
                            submission.submittedAt
                          )}
                          onCheckedChange={() =>
                            handleSelectSubmission(submission.submittedAt)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {submission.name}
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-[#666666]">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {submission.company}
                            </span>
                            <span>{submission.country}</span>
                            {submission.location && (
                              <span>{submission.location}</span>
                            )}
                            <span>{submission.experience}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          submission.status === "pending"
                            ? "secondary"
                            : submission.status === "approved"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {submission.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">LinkedIn</h4>
                      <a
                        href={submission.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0077b5] hover:underline flex items-center gap-1"
                      >
                        {submission.linkedinUrl}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Bio</h4>
                      <p className="text-sm text-[#666666]">{submission.bio}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">
                        Specializations
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {submission.specialization.map((spec, idx) => (
                          <Badge key={idx} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {submission.submittedBy && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">
                          Submitted By
                        </h4>
                        <p className="text-sm text-[#666666]">
                          {submission.submittedBy}
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-[#999999]">
                      Submitted:{" "}
                      {new Date(submission.submittedAt).toLocaleString()}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-[#e0e0e0]">
                      <Button
                        onClick={() => handleApprove(submission)}
                        className="flex-1"
                        disabled={isProcessing}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleReject(submission)}
                        className="flex-1"
                        disabled={isProcessing}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
