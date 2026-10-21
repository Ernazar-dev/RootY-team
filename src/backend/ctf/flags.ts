import "server-only";
import { challenges } from "@/frontend/ctf/catalog";

// The CTF answer key. `import "server-only"` guarantees this module is never
// bundled into the browser, so the flags stay secret. The frontend only
// learns "right" or "wrong" through the checkFlag server action.

const flags: Record<string, string> = {
  "osint-metadata": "ROOTY{metadata_leaks}",
  "osint-dns": "ROOTY{forgotten_dns_record}",
  "web-headers": "ROOTY{headers_tell_tales}",
  "web-jwt": "ROOTY{jwt_is_only_base64}",
  "web-robots": "ROOTY{robots_is_not_security}",
  "forensics-authlog": "ROOTY{203.0.113.45}",
  "forensics-hex": "ROOTY{raw_bytes_hide_text}",
  "forensics-stego-photo": "csec{b69a5704-6e4b-49eb-99dd-24cadcaef046}",
  "forensics-stego-binwalk": "csec{b1nw4lk_f0und_wh4t_str1ngs_m1ss3d}",
  "crypto-layers": "ROOTY{layers_peel_away}",
  "crypto-common-modulus": "CTF4{935d2777d63121c5e9720b}",
  "crypto-impossible-vault": "CTF4{wh3n_m4th_b3tr4ys_y0ur_crypt0_its_g4m3_0v3r}",
};

// OSINT geolocation challenges aren't checked by an exact string: the answer
// is a place, so the solver enters coordinates and we accept anything within
// `radiusKm` of the true spot (tolerant of rounding and which corner of the
// city they clicked).
const geoTargets: Record<string, { lat: number; lon: number; radiusKm: number }> = {
  "osint-geolocation": { lat: 39.6542, lon: 66.9597, radiusKm: 12 }, // Registan, Samarkand
};

/** Flags are matched loosely: case and surrounding spaces don't matter. */
function normalize(flag: string) {
  return flag.trim().toLowerCase();
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function isCorrect(challengeId: string, guess: string) {
  const geo = geoTargets[challengeId];
  if (geo) {
    // Pull the first two numbers out of e.g. "39.65, 66.96" or "39.65 66.96".
    const nums = (guess.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    if (nums.length < 2) return false;
    return haversineKm(nums[0], nums[1], geo.lat, geo.lon) <= geo.radiusKm;
  }
  const flag = flags[challengeId];
  return flag !== undefined && normalize(guess) === normalize(flag);
}

/** Every challenge in the catalog must have an answer here — checked by a test. */
export function missingFlags() {
  return challenges.filter((c) => !(c.id in flags) && !(c.id in geoTargets)).map((c) => c.id);
}

export function flagCount() {
  return Object.keys(flags).length;
}
