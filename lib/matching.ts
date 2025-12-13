import { Recruiter } from "@/types/recruiter";
import { UserProfile, MatchScore } from "@/types/user";

/**
 * Calculate match score between user profile and recruiter
 * Returns a score from 0-100 and reasons for the match
 */
export function calculateMatchScore(
  userProfile: UserProfile,
  recruiter: Recruiter
): MatchScore {
  let score = 0;
  const reasons: string[] = [];
  const maxScore = 100;

  // Specialization matching (40 points max)
  const userSpecializations = userProfile.preferredSpecializations.map((s) =>
    s.toLowerCase()
  );
  const recruiterSpecializations = recruiter.specialization.map((s) =>
    s.toLowerCase()
  );

  let specializationMatches = 0;
  userSpecializations.forEach((userSpec) => {
    recruiterSpecializations.forEach((recSpec) => {
      if (recSpec.includes(userSpec) || userSpec.includes(recSpec)) {
        specializationMatches++;
      }
    });
  });

  if (specializationMatches > 0) {
    const specializationScore = Math.min(
      (specializationMatches / userSpecializations.length) * 40,
      40
    );
    score += specializationScore;
    reasons.push(`Matches ${specializationMatches} of your specializations`);
  }

  // Skills matching (30 points max)
  // Check if recruiter's bio or specialization mentions user's skills
  const userSkills = userProfile.skills.map((s) => s.toLowerCase());
  const recruiterText = (
    recruiter.bio +
    " " +
    recruiter.specialization.join(" ")
  ).toLowerCase();

  let skillMatches = 0;
  userSkills.forEach((skill) => {
    if (recruiterText.includes(skill.toLowerCase())) {
      skillMatches++;
    }
  });

  if (skillMatches > 0) {
    const skillScore = Math.min((skillMatches / userSkills.length) * 30, 30);
    score += skillScore;
    reasons.push(`Matches ${skillMatches} of your skills`);
  }

  // Experience level matching (20 points max)
  const userExperience = extractYears(userProfile.experience);
  const recruiterExperience = extractYears(recruiter.experience);

  if (userExperience > 0 && recruiterExperience > 0) {
    const experienceDiff = Math.abs(userExperience - recruiterExperience);
    if (experienceDiff <= 2) {
      score += 20;
      reasons.push("Similar experience level");
    } else if (experienceDiff <= 5) {
      score += 10;
      reasons.push("Reasonable experience match");
    }
  }

  // Location matching (10 points max)
  if (
    userProfile.location &&
    recruiter.country &&
    userProfile.location.toLowerCase().includes(recruiter.country.toLowerCase())
  ) {
    score += 10;
    reasons.push("Same country/location");
  }

  // Normalize score to 0-100
  score = Math.min(Math.round(score), maxScore);

  return {
    recruiterId: recruiter.id,
    score,
    reasons: reasons.length > 0 ? reasons : ["Basic match"],
  };
}

/**
 * Get best matching recruiters for a user profile
 */
export function getBestMatches(
  userProfile: UserProfile,
  recruiters: Recruiter[],
  limit: number = 10
): Array<Recruiter & { matchScore: MatchScore }> {
  const matches = recruiters.map((recruiter) => ({
    ...recruiter,
    matchScore: calculateMatchScore(userProfile, recruiter),
  }));

  // Sort by match score (highest first)
  matches.sort((a, b) => b.matchScore.score - a.matchScore.score);

  // Filter out very low matches (below 20%)
  const filteredMatches = matches.filter((m) => m.matchScore.score >= 20);

  return filteredMatches.slice(0, limit);
}

/**
 * Extract years from experience string
 */
function extractYears(experience: string): number {
  const match = experience.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Get all available skills from recruiters
 */
export function getAllSkills(recruiters: Recruiter[]): string[] {
  const skillsSet = new Set<string>();

  recruiters.forEach((recruiter) => {
    // Extract skills from specializations
    recruiter.specialization.forEach((spec) => {
      // Split by common separators and add individual terms
      const terms = spec
        .split(/[,\s&]+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 2);
      terms.forEach((term) => skillsSet.add(term));
    });

    // Extract from bio (common tech terms)
    const bio = recruiter.bio.toLowerCase();
    const techTerms = [
      "react",
      "node",
      "python",
      "java",
      "javascript",
      "typescript",
      "angular",
      "vue",
      "aws",
      "azure",
      "docker",
      "kubernetes",
      "machine learning",
      "ai",
      "data science",
      "devops",
      "frontend",
      "backend",
      "full stack",
      "mobile",
      "ios",
      "android",
    ];

    techTerms.forEach((term) => {
      if (bio.includes(term)) {
        skillsSet.add(term);
      }
    });
  });

  return Array.from(skillsSet).sort();
}
