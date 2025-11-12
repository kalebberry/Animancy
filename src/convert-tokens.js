import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOKENS_PATH = path.join(__dirname, "../src/design-tokens/tokens.json");
const FONT_SIZES_OUTPUT_PATH = path.join(__dirname, "../src/styles/abstracts/_font-sizes.scss");
const THEME_OUTPUT_PATH = path.join(__dirname, "../src/styles/abstracts/_theme.scss");

// Settings
const BASE_SIZE = 16; // px to rem
const MIN_VIEWPORT = 375;
const MAX_VIEWPORT = 1440;
const SCOPE = "vi"; // vi or vw depending on preference

function round(val) {
  return parseFloat(val.toFixed(4)).toString();
}

/**
 * Recursively gets a value from a nested object based on a path string.
 * @param {object} obj The object to search.
 * @param {string} path The path to the value (e.g., 'color.base.black').
 * @returns {any}
 */
function get(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

/**
 * Resolves aliases in the token values.
 * @param {object} tokens The full token object.
 * @param {object} originalTokens The original, unmodified token object for lookups.
 */
function resolveAliases(tokens, originalTokens) {
  for (const k in tokens) {
    if (typeof tokens[k] === "object" && tokens[k] !== null) {
      if (tokens[k].value && typeof tokens[k].value === "string" && tokens[k].value.startsWith("{")) {
        const aliasPath = tokens[k].value.slice(1, -1);
        const resolvedValue = get(originalTokens, aliasPath);
        if (resolvedValue && resolvedValue.value) {
          tokens[k].value = resolvedValue.value;
        }
      } else {
        resolveAliases(tokens[k], originalTokens);
      }
    }
  }
}

async function generateFontTokens(tokens) {
  const fontSizes = tokens.size?.font || {};
  let output = `$font-sizes: (\n`;

  for (const key in fontSizes) {
    const minPx = fontSizes[key].min;
    const maxPx = fontSizes[key].max;
    const minRem = minPx / BASE_SIZE;
    const maxRem = maxPx / BASE_SIZE;

    const slope = (maxPx - minPx) / (MAX_VIEWPORT - MIN_VIEWPORT);
    const slopeScoped = slope * 100;
    const interceptPx = minPx - slope * MIN_VIEWPORT;
    const interceptRem = interceptPx / BASE_SIZE;

    const clamp = `clamp(${round(minRem)}rem, ${round(interceptRem)}rem + ${round(slopeScoped)}${SCOPE}, ${round(maxRem)}rem)`;
    output += `  '${key}': ${clamp},\n`;
  }
  output += `);\n`;

  await fs.writeFile(FONT_SIZES_OUTPUT_PATH, output);
  console.log(`✅ Generated font size tokens: ${FONT_SIZES_OUTPUT_PATH}`);
}

async function generateThemeTokens(tokens) {
  const lightTheme = tokens.color?.light || {};
  const darkTheme = tokens.color?.dark || {};
  let output = `// This file is auto-generated. Do not edit.\n\n`;

  output += `:root {\n`;
  output += `  color-scheme: normal;\n`;
  for (const key in lightTheme) {
    output += `  --${key}: ${lightTheme[key].value};\n`;
  }
  output += `}\n\n`;

  // Dark theme for OS preference
  output += `@media (prefers-color-scheme: dark) {\n`;
  output += `  :root {\n`;
  for (const key in darkTheme) {
    output += `    --${key}: ${darkTheme[key].value};\n`;
  }
  output += `  }\n`;
  output += `}\n`;

  await fs.writeFile(THEME_OUTPUT_PATH, output);
  console.log(`✅ Generated theme tokens: ${THEME_OUTPUT_PATH}`);
}

async function main() {
  const raw = await fs.readFile(TOKENS_PATH, "utf8");
  const json = JSON.parse(raw);

  resolveAliases(json, JSON.parse(raw)); // Pass a deep copy for lookups

  await generateFontTokens(json);
  await generateThemeTokens(json);
}

main().catch(console.error);
