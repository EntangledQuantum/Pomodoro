import { chromium } from 'playwright';
import { preview } from 'vite';

(async () => {
  // Start vite dev server without electron plugin for web
  const server = await preview({
    preview: { port: 5173 },
    build: {
      outDir: 'dist'
    }
  });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  server.printUrls();
  await page.goto('http://localhost:5173');
  // Wait a bit for animations
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'public/screenshot.png' });
  await browser.close();
  // server close isn't directly exposed on preview server returned, we can just process.exit
  console.log('Screenshot saved to public/screenshot.png');
  process.exit(0);
})();