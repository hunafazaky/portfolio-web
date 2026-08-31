// Runs before `react-router build` (see package.json's "build" script).
// Fetches every public endpoint from the live API and writes the results
// to app/data/*.json, which lib/data.ts statically imports in production
// builds. This is the entire mechanism that keeps visitors off the live
// (Render, cold-start-prone) API — see portfolio-frontend-context.md.
//
// Bilingual entities are fetched once per language, since the static
// build can't call the API again at runtime to switch languages.

import { writeFile } from "node:fs/promises";
import path from "node:path";

const API_URL = process.env.VITE_API_URL;
if (!API_URL) {
  console.error("fetch-data: VITE_API_URL is not set — aborting build");
  process.exit(1);
}

const DATA_DIR = path.join(import.meta.dirname, "..", "app", "data");

async function fetchJSON(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) {
    throw new Error(`fetch-data: ${endpoint} returned ${res.status}`);
  }
  const body = await res.json();
  return body.data;
}

async function writeData(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  await writeFile(filePath, JSON.stringify(data, null, 2) + "\n");
  console.log(`fetch-data: wrote ${filename}`);
}

async function fetchBilingual(name, endpoint) {
  const [en, id] = await Promise.all([
    fetchJSON(`${endpoint}?lang=en`),
    fetchJSON(`${endpoint}?lang=id`),
  ]);
  await Promise.all([
    writeData(`${name}.en.json`, en),
    writeData(`${name}.id.json`, id),
  ]);
}

async function main() {
  console.log(`fetch-data: fetching from ${API_URL}`);

  await Promise.all([
    fetchBilingual("profile", "/api/profile"),
    fetchBilingual("experiences", "/api/experiences"),
    fetchBilingual("projects", "/api/projects"),
    fetchBilingual("education", "/api/education"),
    fetchJSON("/api/skills").then((data) => writeData("skills.json", data)),
    fetchJSON("/api/certificates").then((data) =>
      writeData("certificates.json", data),
    ),
  ]);

  console.log("fetch-data: done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
