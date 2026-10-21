export const site = {
  name: "RootY Team",
  // Canonical origin, no trailing slash. Set SITE_URL on Render.
  url: (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
};
