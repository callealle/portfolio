import profileData from "@content/profile.json";

export interface Achievement {
  id: string;
  text: string;
  metric?: { value: string; label: string };
  caseStudy?: {
    problem: string;
    investigation: string | null;
    solution: string;
    result: string;
  };
}

export interface ExperienceEntry {
  company: string;
  title: string;
  location: string | null;
  product: string | null;
  startDate: string | null;
  endDate: string | null;
  /** Clean, user-facing date range -- render this, not durationNote. */
  durationDisplay: string;
  /** Internal editorial caveat about how startDate/endDate were derived from
   * the source resume; not meant for display (see PRODUCT.md's anti-fabrication
   * rule -- this documents an inference, it isn't itself a fact to show). */
  durationNote: string;
  achievements: Achievement[];
  techStack: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  type: string;
  dateRange?: string;
  description: string;
  techStack: string[];
  recognition: string | null;
}

export interface Profile {
  person: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string | null;
  };
  summary: string;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: { school: string; degree: string; years: string };
  skills: Record<string, string[]>;
  hobbies: unknown[];
}

export const profile = profileData as Profile;

export function firstName(fullName: string) {
  return fullName.split(" ")[0];
}
