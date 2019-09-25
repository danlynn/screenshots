const puppeteer = require('puppeteer-core');
const fsp = require('fs').promises;
const fs = require('fs');
const readline = require('readline');


/**
 * Save a screenshot of the page specified by 'url' to the local
 * 'screenshots/screenshots-<format>/' dir.
 *
 * Note that chrome MUST be launched --headless in order to create pdf files
 *
 * @param page {Page} page instance to be re-used by subsequent screenshots
 * @param url {string} url of page to render and take a screenshot of
 * @param format {string} one of {'png', 'pdf'} - defaults to 'png'
 * @return {Promise<void>}
 */
async function screenshot(page, url, format = 'png') {
  // go to specified 'url' then wait for network activity to finish before continuing
  await page.goto(url, {waitUntil: 'networkidle0'});
  // force off-screen images to be loaded
  await page.evaluate(() => {window.scrollBy(0, window.innerHeight)})
  const path = `screenshots/screenshots-${format}/${url.match(/[^/]*$/)[0]}.${format}`
  if (format === 'png')
    await page.screenshot({path: path, fullPage: true});
  else {
    let height = await page.evaluate(() => document.documentElement.offsetHeight);
    let width = await page.evaluate(() => document.documentElement.offsetWidth);
    await page.pdf({path: path, height: height + 'px', width: width + 'px'});
  }
}

async function open_browser_tab() {
  const dev_tools_url = await fsp.readFile(".dev_tools_url", "binary");
  console.log("dev_tools_url:", dev_tools_url);

  const browser = await puppeteer.connect({browserWSEndpoint: dev_tools_url});
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200, // use 800 for png - 1200 for pdf
    height: 6000
  });
  return page;
}

(async () => {
  // If resuming from a failure or testing then set the startIdx and
  // endIdx as desired.  Otherwise, leave them both at 0 to process the
  // full RecipePages.txt file.
  const startIdx = 1129;
  const endIdx = 0;
  const format = 'pdf'

  const startTime = Date.now();
  const page = await open_browser_tab();

  const fileStream = fs.createReadStream('RecipePages.txt');
  const readlineInterface = readline.createInterface({
    input: fileStream
  });
  let lineIdx = 0;
  let elapsed = null;

  try {
    for await (const url of readlineInterface) {
      lineIdx += 1;
      if (lineIdx > startIdx && (endIdx === 0 || lineIdx <= endIdx)) {
        elapsed = ('        ' + (Date.now() - startTime)).slice(-8)
        console.log(`${lineIdx} ${elapsed}: ${url}`);
        await screenshot(page, url, format);
      }
    }
  } catch(err) {
    console.error(err);
  }
  console.log('=== complete')
  readlineInterface.close();
  page.browser().disconnect(); // release - but leave browser running
})();



// await page.goto('https://www.yummly.com/recipe/A_1_-Sweet-Fire-Porterhouse-Pork-Chops-1005664', {waitUntil: 'networkidle0'});
// console.log("--- goto complete")
// // await page.waitFor(2000);
// await page.evaluate(() => {window.scrollBy(0, window.innerHeight)})
// await page.screenshot({path: 'example.png', fullPage: true});
// console.log("--- screenshot complete");


// // Save a screenshot of just one element of the page
//
// await page.setViewport({
//   width: 800,
//   height: 1000,
// });
//
// const example = await page.$('#example');
// const bounding_box = await example.boundingBox();
//
// await example.screenshot({
//   path: 'example.png',
//   clip: {
//     x: bounding_box.x,
//     y: bounding_box.y,
//     width: Math.min(bounding_box.width, page.viewport().width),
//     height: Math.min(bounding_box.height, page.viewport().height),
//   },
// });
