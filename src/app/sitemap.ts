import type { MetadataRoute } from "next";
import { ALL_LESSONS } from "@/lib/demo/syllabus";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/register", priority: 0.8 },
  { path: "/login", priority: 0.5 },
  { path: "/dashboard", priority: 0.6 },
  { path: "/mocks", priority: 0.7 },
  { path: "/practice", priority: 0.7 },
  { path: "/learn", priority: 0.8 },
  { path: "/analytics", priority: 0.5 },
];

const LESSON_PRIORITY = 0.6;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = STATIC_ROUTES.map(({ path, priority }) => ({ url: `${SITE_URL}${path}`, priority }));
  const lessons = ALL_LESSONS.map((lesson) => ({ url: `${SITE_URL}/learn/${lesson.slug}`, priority: LESSON_PRIORITY }));
  return [...pages, ...lessons];
}
