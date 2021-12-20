import puppeteer from 'puppeteer';

const defaultWidth = 1200;
const defaultHeight = 800;

async function getPageScreenshot(url) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
    ]
  });
  const page = await browser.newPage();

  page.setViewport({
    width: defaultWidth,
    height: defaultHeight,
  });

  await page.goto(url, {
    waitUntil: 'networkidle0',
  });

  await page.waitForSelector('body.data-updated');

  const screenshot = await page.screenshot();

  await browser.close();

  return screenshot;
}

function getScreenshotFilename() {
  const currentDateTime = new Date().toISOString().replace(/[:\.]/g, '-');

  return `screenshots/${currentDateTime}.png`;
}

export {
  getPageScreenshot,
};