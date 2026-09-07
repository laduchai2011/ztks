import { chromium, Page } from "playwright";
import path from "path";
import { promises as fs } from "fs";

const rootDir = path.resolve(__dirname, "..");
const SESSION_PATH = path.join(rootDir, "sessions", "zalo.json");
const CONTENT_PATH = path.join(rootDir, "content.txt");

async function sendZaloMessage(
  page: Page,
  phone: string,
  message: string,
): Promise<boolean> {
  try {
    // =========================
    // BƯỚC 1: TÌM SỐ ĐIỆN THOẠI
    // =========================

    const searchInput = page.locator("#contact-search-input");

    await searchInput.waitFor({
      state: "visible",
      timeout: 10_000,
    });

    await searchInput.click();
    await searchInput.fill("");
    await searchInput.fill(phone);

    await page.waitForTimeout(3000);

    // =========================
    // BƯỚC 2: TÌM NGƯỜI DÙNG
    // =========================

    const userItem = page
      .locator(".conv-item")
      .filter({
        has: page.locator(".txt-highlight", {
          hasText: phone,
        }),
      })
      .first();

    // Kiểm tra thay vì waitFor 10 giây
    const count = await userItem.count();

    if (count === 0) {
      console.log(`❌ ${phone}: Không tìm thấy người dùng`);
      return false;
    }

    console.log(`✅ Tìm thấy người dùng: ${phone}`);

    await userItem.click();

    await page.waitForTimeout(1000);

    // =========================
    // BƯỚC 3: NHẮN TIN
    // =========================

    const input = page.locator("#richInput");

    await input.waitFor({
      state: "visible",
      timeout: 10_000,
    });

    await input.click();

    await page.keyboard.insertText(message);

    await page.waitForTimeout(3000);

    await page.keyboard.press("Enter");

    // console.log(`📨 Đã gửi tin nhắn: ${phone}`);

    return true;
  } catch (error) {
    console.log(`⚠️ Lỗi với ${phone}:`, error);
    return false;
  }
}

async function main() {
  const browser = await chromium.launch({
    headless: false,
  });

  const context = await browser.newContext({
    storageState: SESSION_PATH,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  await page.goto("https://chat.zalo.me/", {
    waitUntil: "domcontentloaded",
  });

  // Đăng nhập Zalo thủ công nếu chưa có session

  await page.waitForTimeout(15000);
  await context.storageState({ path: SESSION_PATH });

  const content = await fs.readFile(CONTENT_PATH, "utf8");

  const phonetxt = await fs.readFile("phones.txt", "utf-8");

  const phones = phonetxt
    .split(/\r?\n/)
    .map((phone) => phone.trim())
    .filter((phone) => phone.length > 0);

  const phoneStop = "0919031379";
  const indexStop = phones.indexOf(phoneStop);
  const len = phones.length;

  for (let i = 0; i <= len; i++) {
    console.log(i, len);
    if (i >= indexStop) {
      const phone = phones[i];
      const randomNumber = Math.floor(Math.random() * 98) + 3;
      const waitTime = randomNumber * 1000;
      await page.waitForTimeout(waitTime);
      await sendZaloMessage(page, phone, content);
    }
  }

  // Không đóng browser để kiểm tra
}

main().catch(console.error);
