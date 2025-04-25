const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
    console.log("Start scraping...");
  const browser = await puppeteer.launch({ headless: true });
  console.log("Browser opened");
  const page = await browser.newPage();
    console.log("New page opened");
  await page.goto("https://school.borntodev.com/search/bundle", {
    waitUntil: "networkidle0"
  });
  console.log("Page loaded");

  // รอข้อมูลโหลด
  await page.waitForSelector(".MuiTypography-root.MuiTypography-h3.css-2xb0qk");
  console.log("Data loaded");

  const bundles = await page.evaluate(() => {
    const cards = document.querySelectorAll(".MuiGrid-item");
    return Array.from(cards).map(card => {
      const titleEl = card.querySelector(".MuiCardContent-root .MuiBox-root h6.css-5p3e6g");
      const priceEl = card.querySelector(".MuiCardContent-root .css-4hmnaw");

      const title = titleEl ? titleEl.textContent.trim() : "ไม่ทราบชื่อ";
      const priceText = priceEl ? priceEl.textContent.trim() : "ฟรี";

      const price = priceText.includes("ฟรี") ? 0 : parseInt(priceText.replace(/[^\d]/g, ""));

      return {
        title,
        // category,
        price
      };
    });
  });

  fs.writeFileSync("data.json", JSON.stringify(bundles, null, 2), "utf-8");
  console.log("✅ ดึงข้อมูล bundle พร้อมหมวดหมู่และราคาสำเร็จ!");
  await browser.close();
})();
