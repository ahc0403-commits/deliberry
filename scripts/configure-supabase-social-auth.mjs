#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const envFiles = [".env.local", "customer-app/.env.local"];

for (const envFile of envFiles) {
  const path = resolve(root, envFile);
  if (!existsSync(path)) {
    continue;
  }

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }
    const [key, ...rawValue] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = rawValue.join("=").replace(/^["']|["']$/g, "");
    }
  }
}

const required = [
  "SUPABASE_ACCESS_TOKEN",
  "SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID",
  "SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET",
];

if (!process.env.SUPABASE_PROJECT_REF) {
  const localProjectRef = resolve(root, "supabase/.temp/project-ref");
  if (existsSync(localProjectRef)) {
    process.env.SUPABASE_PROJECT_REF = readFileSync(
      localProjectRef,
      "utf8",
    ).trim();
  }
}

required.push("SUPABASE_PROJECT_REF");

const missing = required.filter((key) => !process.env[key]?.trim());
if (missing.length > 0) {
  throw new Error(
    `Missing required OAuth configuration: ${missing.join(", ")}`,
  );
}

const projectRef = process.env.SUPABASE_PROJECT_REF;
const response = await fetch(
  `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
  {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      additional_redirect_urls: [
        "https://deliberry-customer.vercel.app",
        "https://go.deli-berry.com",
        "deliberry-customer-auth://zalo-callback/auth",
      ],
      external_google_enabled: true,
      external_google_client_id:
        process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID,
      external_google_secret:
        process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET,
      external_apple_enabled: false,
      external_apple_client_id: "",
      external_apple_secret: "",
    }),
  },
);

const text = await response.text();
if (!response.ok) {
  throw new Error(
    `Supabase auth provider update failed (${response.status}): ${text}`,
  );
}

console.log("Supabase Google auth provider enabled; Apple remains disabled.");
