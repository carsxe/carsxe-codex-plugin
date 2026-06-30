#!/usr/bin/env node
// Reads the saved CarsXE API key and injects it into the Codex session env.
// Falls back to a plain-text prompt if no key is found.
import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const configDir  = process.env.PLUGIN_DATA || process.env.CLAUDE_PLUGIN_DATA || join(homedir(), '.carsxe');
const configPath = join(configDir, 'config.json');

if (existsSync(configPath)) {
  try {
    const { api_key } = JSON.parse(readFileSync(configPath, 'utf8'));
    if (api_key && api_key.length > 0) {
      // Inject key into session env — Codex reads {"env":{...}} from hook stdout
      process.stdout.write(JSON.stringify({ env: { CARSXE_API_KEY: api_key } }));
      process.exit(0);
    }
  } catch {
    // malformed config — fall through to prompt
  }
}

// No key found — tell Codex to prompt the user
process.stdout.write(
  'CarsXE API key is not configured. ' +
  'Please ask the user to provide their CarsXE API key and run the auth skill: ' +
  '"Set my CarsXE API key to YOUR_KEY" or "@auth YOUR_KEY". ' +
  'Get a key at https://api.carsxe.com/dashboard/developer'
);
process.exit(0);
