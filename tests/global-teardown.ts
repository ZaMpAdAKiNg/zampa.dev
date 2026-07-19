import { execSync } from 'node:child_process';

// Stop the astro dev daemon started in global-setup.ts. Runs even when tests
// fail. Command is a static literal — no interpolated input, no shell-injection
// surface.
export default async function globalTeardown(): Promise<void> {
  try {
    execSync('npx astro dev stop', { stdio: 'ignore' });
  } catch {
    /* already stopped — fine */
  }
}
