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
