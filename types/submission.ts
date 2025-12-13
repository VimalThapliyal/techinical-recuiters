import { Recruiter } from "./recruiter";

export interface RecruiterSubmission extends Omit<Recruiter, "id"> {
  location?: string; // Optional location field
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  submittedBy?: string; // Email or name of person who submitted
}

export interface SubmissionFormData {
  name: string;
  linkedinUrl: string;
  company: string;
  country: string;
  location?: string;
  specialization: string[];
  experience: string;
  bio: string;
  imageUrl?: string;
  email?: string; // Optional contact email
}
