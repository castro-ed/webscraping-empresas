import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Playwright é usado apenas server-side nas API routes.
  // Para evitar que o bundler tente empacotar módulos nativos do Playwright no client:
  serverExternalPackages: ["playwright"],
};

export default nextConfig;
