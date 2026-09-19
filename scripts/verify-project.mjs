import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import english from "../src/i18n/en.js";
import portugueseBrazil from "../src/i18n/pt-BR.js";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

function flattenKeys(value, prefix = "") {
  return Object.entries(value).flatMap(([key, nestedValue]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return nestedValue && typeof nestedValue === "object" && !Array.isArray(nestedValue)
      ? flattenKeys(nestedValue, path)
      : [path];
  });
}

function compareKeys(left, right, leftName, rightName) {
  const leftKeys = new Set(flattenKeys(left));
  const rightKeys = new Set(flattenKeys(right));
  const missingFromRight = [...leftKeys].filter((key) => !rightKeys.has(key));
  const missingFromLeft = [...rightKeys].filter((key) => !leftKeys.has(key));

  if (missingFromRight.length || missingFromLeft.length) {
    const details = [
      missingFromRight.length
        ? `${rightName} is missing: ${missingFromRight.join(", ")}`
        : null,
      missingFromLeft.length
        ? `${leftName} is missing: ${missingFromLeft.join(", ")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    throw new Error(`Translation dictionaries are inconsistent.\n${details}`);
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(root, path), "utf8"));
}

async function ensureFiles(paths) {
  await Promise.all(paths.map((path) => access(resolve(root, path))));
}

async function main() {
  const packageJson = await readJson("package.json");
  const manifest = await readJson("public/manifest.json");

  if (packageJson.name !== "alterkey") {
    throw new Error(`Expected package name "alterkey", found "${packageJson.name}".`);
  }

  if (packageJson.version !== manifest.version) {
    throw new Error(
      `Version mismatch: package.json is ${packageJson.version}, manifest.json is ${manifest.version}.`,
    );
  }

  compareKeys(english, portugueseBrazil, "en", "pt-BR");

  await ensureFiles([
    "index.html",
    "settings.html",
    "variants.html",
    "public/icons/alterkey.svg",
    "public/manifest.json",
  ]);

  console.log("AlterKey project checks passed.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
