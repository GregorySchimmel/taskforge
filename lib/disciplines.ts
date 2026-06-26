import type { TalentDiscipline } from "@/types";

export const TALENT_DISCIPLINES: {
  value: TalentDiscipline;
  label: string;
  description: string;
  portfolioLabel: string;
  portfolioPlaceholder: string;
}[] = [
  {
    value: "development",
    label: "Development",
    description: "Frontend, backend, fullstack, DevOps",
    portfolioLabel: "GitHub username",
    portfolioPlaceholder: "your-github-username",
  },
  {
    value: "web_design",
    label: "Web Design",
    description: "UI/UX, landing pages, design systems",
    portfolioLabel: "Portfolio URL",
    portfolioPlaceholder: "https://behance.net/yourname",
  },
  {
    value: "video_editing",
    label: "Video Editing",
    description: "Short-form, long-form, motion graphics",
    portfolioLabel: "Reel / portfolio URL",
    portfolioPlaceholder: "https://vimeo.com/yourreel",
  },
];

export function getDisciplineLabel(d: TalentDiscipline): string {
  return TALENT_DISCIPLINES.find((x) => x.value === d)?.label ?? d;
}

export function getPortfolioLabel(disciplines: TalentDiscipline[]): string {
  if (disciplines.length === 1) {
    return TALENT_DISCIPLINES.find((x) => x.value === disciplines[0])!.portfolioLabel;
  }
  return "Portfolio URL";
}