import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Vercel monorepo builds: merchant-console imports from
  // repo-root shared/ via relative paths (e.g. ../../../../shared/utils/).
  // Without this, Vercel's file tracer cannot include those files in the
  // serverless function bundle, causing silent build failures.
  outputFileTracingRoot: path.join(__dirname, ".."),
};

export default nextConfig;

