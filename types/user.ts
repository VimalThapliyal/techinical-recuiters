export interface UserProfile {
  skills: string[];
  experience: string;
  location: string;
  preferredSpecializations: string[];
  jobLevel?: "entry" | "mid" | "senior" | "executive";
  remotePreference?: "remote" | "hybrid" | "onsite" | "any";
}

export interface MatchScore {
  recruiterId: string;
  score: number;
  reasons: string[];
}
