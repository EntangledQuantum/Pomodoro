import { chromium } from 'playwright';
import { preview } from 'vite';

(async () => {
  // Start vite dev server without electron plugin for web
  const server = await preview({
    preview: { port: 5174 },
    build: {
      outDir: 'dist'
    }
  });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5174');
  // Wait a bit for animations
  await page.waitForTimeout(1000);

  // Setup Wizard is initially visible. Take screenshot.
  await page.screenshot({ path: 'public/screenshot-setup.png' });
  console.log('Saved public/screenshot-setup.png');

  // Click "Skip for now (Local only mode)"
  await page.getByText('Skip for now (Local only mode)').click();
  await page.waitForTimeout(1000);

  // Take screenshot of main timer
  await page.screenshot({ path: 'public/screenshot-main.png' });
  console.log('Saved public/screenshot-main.png');

  // Click "Start"
  await page.getByRole('button', { name: 'Start' }).click();
  // Wait for 3 seconds so timer counts down
  await page.waitForTimeout(3000);

  // Take screenshot of running timer
  await page.screenshot({ path: 'public/screenshot-running.png' });
  console.log('Saved public/screenshot-running.png');

  // Click "Pause"
  await page.getByRole('button', { name: 'Pause' }).click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'public/screenshot-paused.png' });
  console.log('Saved public/screenshot-paused.png');

  // Click "Reset" (Square button)
  await page.getByLabel('Reset').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'public/screenshot-reset.png' });
  console.log('Saved public/screenshot-reset.png');

  await browser.close();
  console.log('Done capturing screenshots.');
  process.exit(0);
})();