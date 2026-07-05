import { createServerFn } from "@tanstack/react-start";

export type Repo = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  goodFirstIssues: number;
  contributors: number;
  competition: "Low" | "Medium" | "High";
  language: string | null;
  updatedAt: string;
  pushedAt: string;
  topics: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  difficultyScore: number; // 0-100
  activityScore: number; // 0-100
  friendlinessScore: number; // 0-100
  owner: { login: string; avatar: string };
};

export const searchRepos = createServerFn({ method: "GET" })
  .inputValidator((d: { language: string; framework: string }) => ({
    language: String(d.language || "").slice(0, 40),
    framework: String(d.framework || "").slice(0, 40),
  }))
  .handler(async ({ data }): Promise<Repo[]> => {
    const { language, framework } = data;
    if (!language) return [];

    const apiBase = import.meta.env.PROD ? "https://opensourcescout.onrender.com" : "";
    const url = `${apiBase}/api/v1/repositories?language=${encodeURIComponent(
      language,
    )}&framework=${encodeURIComponent(framework || "")}`;

    const res = await fetch(url);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `API Error: ${res.status}`);
    }

    const responseJson = await res.json();
    return responseJson.data || [];
  });
