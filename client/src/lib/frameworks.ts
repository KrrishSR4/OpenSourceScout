export type Framework = {
  name: string;
  topic: string; // GitHub topic / search keyword
  blurb: string;
};

export const LANGUAGES: { name: string; key: string; color: string }[] = [
  { name: "JavaScript", key: "javascript", color: "#f1e05a" },
  { name: "TypeScript", key: "typescript", color: "#3178c6" },
  { name: "Python", key: "python", color: "#3572A5" },
  { name: "Java", key: "java", color: "#b07219" },
  { name: "Go", key: "go", color: "#00ADD8" },
  { name: "Rust", key: "rust", color: "#dea584" },
  { name: "C++", key: "cpp", color: "#f34b7d" },
  { name: "PHP", key: "php", color: "#4F5D95" },
  { name: "Ruby", key: "ruby", color: "#701516" },
  { name: "Swift", key: "swift", color: "#F05138" },
  { name: "Kotlin", key: "kotlin", color: "#A97BFF" },
];

export const FRAMEWORKS: Record<string, Framework[]> = {
  javascript: [
    { name: "React", topic: "react", blurb: "Component-driven UI library" },
    { name: "Next.js", topic: "nextjs", blurb: "Full-stack React framework" },
    { name: "Vue", topic: "vue", blurb: "Progressive UI framework" },
    { name: "Angular", topic: "angular", blurb: "Opinionated app framework" },
    { name: "Express", topic: "express", blurb: "Minimal Node.js server" },
    { name: "Svelte", topic: "svelte", blurb: "Compile-time reactivity" },
  ],
  typescript: [
    { name: "Next.js", topic: "nextjs", blurb: "Full-stack React framework" },
    { name: "NestJS", topic: "nestjs", blurb: "Scalable Node.js backend" },
    { name: "Remix", topic: "remix", blurb: "Web fundamentals first" },
    { name: "TanStack", topic: "tanstack", blurb: "Headless utilities suite" },
    { name: "tRPC", topic: "trpc", blurb: "End-to-end typesafe APIs" },
    { name: "Astro", topic: "astro", blurb: "Content-driven web framework" },
  ],
  python: [
    { name: "Django", topic: "django", blurb: "Batteries-included web" },
    { name: "Flask", topic: "flask", blurb: "Micro WSGI framework" },
    { name: "FastAPI", topic: "fastapi", blurb: "Modern async APIs" },
    { name: "PyTorch", topic: "pytorch", blurb: "Deep learning framework" },
    { name: "Pandas", topic: "pandas", blurb: "Data analysis toolkit" },
  ],
  java: [
    { name: "Spring Boot", topic: "spring-boot", blurb: "Production-grade JVM apps" },
    { name: "Quarkus", topic: "quarkus", blurb: "Kubernetes-native Java" },
    { name: "Micronaut", topic: "micronaut", blurb: "Modular microservices" },
  ],
  go: [
    { name: "Gin", topic: "gin", blurb: "High-perf HTTP framework" },
    { name: "Fiber", topic: "fiber", blurb: "Express-inspired router" },
    { name: "Echo", topic: "echo", blurb: "Minimalist Go web" },
    { name: "Cobra", topic: "cobra", blurb: "CLI builder" },
  ],
  rust: [
    { name: "Axum", topic: "axum", blurb: "Ergonomic web framework" },
    { name: "Actix", topic: "actix", blurb: "Powerful actor system" },
    { name: "Tauri", topic: "tauri", blurb: "Native desktop apps" },
    { name: "Tokio", topic: "tokio", blurb: "Async runtime" },
  ],
  cpp: [
    { name: "Qt", topic: "qt", blurb: "Cross-platform UI" },
    { name: "Boost", topic: "boost", blurb: "Peer-reviewed libraries" },
    { name: "OpenCV", topic: "opencv", blurb: "Computer vision" },
  ],
  php: [
    { name: "Laravel", topic: "laravel", blurb: "Elegant PHP framework" },
    { name: "Symfony", topic: "symfony", blurb: "Reusable components" },
  ],
  ruby: [
    { name: "Rails", topic: "rails", blurb: "Convention over config" },
    { name: "Sinatra", topic: "sinatra", blurb: "DSL for quick web apps" },
  ],
  swift: [
    { name: "Vapor", topic: "vapor", blurb: "Server-side Swift" },
    { name: "SwiftUI", topic: "swiftui", blurb: "Declarative iOS UI" },
  ],
  kotlin: [
    { name: "Ktor", topic: "ktor", blurb: "Async Kotlin services" },
    { name: "Compose", topic: "jetpack-compose", blurb: "Modern Android UI" },
  ],
};
