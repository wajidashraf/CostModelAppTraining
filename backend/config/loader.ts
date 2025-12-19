/**
 * Configuration Loader
 *
 * Loads NRM2 default elements from JSON configuration file.
 * These defaults are used to pre-populate new cost models with standard NRM2 elements.
 *
 * Phase 4 - Commit 3: NRM2 configuration loading
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { NRM2Element } from '../types/models';

// Get current directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load NRM2 default elements from JSON file
 *
 * @returns Array of NRM2 elements
 * @throws Error if file cannot be read or JSON is invalid
 */
export function loadNRM2Defaults(): NRM2Element[] {
  try {
    const configPath = join(__dirname, 'nrm2-default-elements.json');
    const fileContent = readFileSync(configPath, 'utf-8');
    const json = JSON.parse(fileContent);

    // The JSON file has structure: { elements: [...] }
    const data = json.elements;

    if (!Array.isArray(data)) {
      throw new Error('NRM2 configuration must have an "elements" array');
    }

    console.log(`✓ Loaded ${data.length} NRM2 default elements`);
    return data as NRM2Element[];
  } catch (error) {
    if (error instanceof Error) {
      console.error('✗ Failed to load NRM2 defaults:', error.message);
      throw new Error(`Failed to load NRM2 configuration: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Cached NRM2 elements (loaded once at startup)
 * This avoids reading the file on every request
 */
let cachedNRM2Elements: NRM2Element[] | null = null;

/**
 * Get NRM2 defaults (uses cache after first load)
 *
 * @returns Array of NRM2 elements
 */
export function getNRM2Defaults(): NRM2Element[] {
  if (!cachedNRM2Elements) {
    cachedNRM2Elements = loadNRM2Defaults();
  }
  return cachedNRM2Elements;
}

/**
 * Clear the cache (useful for testing)
 */
export function clearNRM2Cache(): void {
  cachedNRM2Elements = null;
  console.log('✓ NRM2 cache cleared');
}
 