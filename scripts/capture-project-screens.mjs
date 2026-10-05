/**
 * Captures project cover JPEGs via Playwright (system Chrome).
 * - ResumeJobMatcher: production build from GitHub repo
 * - QueryMind / chatbot / BI: HTML previews derived from repo UI source or portfolio stack
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const portfolioRoot = path.resolve(scriptDir, "..");
const outDir = path.join(portfolioRoot, "assets", "projects");
const previewsDir = path.join(scriptDir, "previews");
const clonesRoot = path.resolve(portfolioRoot, "..", "_repo-clones");
const resumeRepo = path.join(clonesRoot, "Resume-Based-Jobs");

const VIEWPORT = { width: 1280, height: 720 };

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      env: process.env,
      shell: process.platform === "win32",
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    child.stdout?.on("data", (d) => { out += d; });
    child.stderr?.on("data", (d) => { out += d; });
    child.on("close", (code) => {
      if (code === 0) resolve(out);
      else reject(new Error(`${cmd} ${args.join(" ")} failed (${code}):\n${out}`));
    });
  });
}

function startServer(cmd, args, cwd) {
  return spawn(cmd, args, {
    cwd,
    env: process.env,
    shell: process.platform === "win32",
    stdio: "ignore",
  });
}

async function waitForUrl(url, attempts = 90) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch (_) {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server did not respond: ${url}`);
}

async function capture(page, targetPath, url, options = {}) {
  await page.setViewportSize(options.viewport || VIEWPORT);
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  if (options.waitMs) await page.waitForTimeout(options.waitMs);
  await page.screenshot({ path: targetPath, type: "jpeg", quality: 88, fullPage: false });
  console.log("Wrote", targetPath);
}

async function captureFile(page, htmlName, outName, waitMs = 800) {
  const fileUrl = "file:///" + path.join(previewsDir, htmlName).replace(/\\/g, "/");
  await capture(page, path.join(outDir, outName), fileUrl, { waitMs });
}

async function launchBrowser() {
  for (const channel of ["chrome", "msedge"]) {
    try {
      return await chromium.launch({ channel });
    } catch (_) {}
  }
  return chromium.launch();
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  console.log("Building ResumeJobMatcher…");
  await run("npm", ["ci"], resumeRepo);
  await run("npx", ["ng", "build", "--configuration", "development"], resumeRepo);

  const resumePreview = startServer("npx", ["serve", "-l", "3002", "dist/resume-job-matcher/browser"], resumeRepo);

  try {
    await waitForUrl("http://127.0.0.1:3002/");

    const browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("http://127.0.0.1:3002/", { waitUntil: "networkidle", timeout: 120000 });
    await page.waitForFunction(function () { return document.title.indexOf("ResumeJobMatcher") !== -1; }, { timeout: 30000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, "resume-matcher.jpg"), type: "jpeg", quality: 88 });
    console.log("Wrote", path.join(outDir, "resume-matcher.jpg"));

    await captureFile(page, "querymind-workspace.html", "querymind.jpg", 400);
    await captureFile(page, "querymind-login.html", "querymind-login.jpg", 500);
    await captureFile(page, "role-chatbot.html", "role-chatbot.jpg", 300);
    await captureFile(page, "bi-dashboard.html", "bi-dashboard.jpg", 400);
    await captureFile(page, "resume-results.html", "resume-matcher-results.jpg", 600);

    await browser.close();
  } finally {
    try { resumePreview.kill(); } catch (_) {}
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
