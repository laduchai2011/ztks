import { chromium, Browser } from "playwright";
import fs from "fs/promises";

const BASE_URL =
  "https://trangvangvietnam.com/categories/486298/pallet-go-san-xuat-va-cung-cap.html";

async function getTotalPages(): Promise<number> {
  console.log("🔎 Bước 1: Lấy tổng số trang...");

  const browser = await chromium.launch({
    headless: false,
  });

  try {
    const page = await browser.newPage();

    await page.goto(`${BASE_URL}?page=1`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    // Đợi trang load
    await page.waitForTimeout(30000);

    // Lấy tất cả link phân trang
    const totalPages = await page.locator("#paging a").evaluateAll((links) => {
      const pages = links
        .map((link) => {
          const href = link.getAttribute("href") || "";
          const match = href.match(/[?&]page=(\d+)/);

          return match ? Number(match[1]) : null;
        })
        .filter((page): page is number => page !== null);

      return Math.max(...pages);
    });

    // const maxPage = Math.max(...totalPages);

    console.log("📄 Các trang tìm được:", totalPages);
    // console.log("✅ Tổng số trang:", maxPage);

    // return maxPage;
    return totalPages;
  } finally {
    await browser.close();
    console.log("🔴 Đã đóng browser lấy tổng số trang");
  }
}

async function crawlPage(pageNumber: number): Promise<string[]> {
  let browser: Browser | null = null;

  try {
    console.log(`\n========================================`);
    console.log(`🚀 Đang crawl trang ${pageNumber}`);
    console.log(`========================================`);

    // Mỗi trang mở một browser mới
    browser = await chromium.launch({
      headless: false,
    });

    const page = await browser.newPage();

    const url = `${BASE_URL}?page=${pageNumber}`;

    console.log(`🌐 URL: ${url}`);

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    await page.waitForTimeout(30000);

    // Lấy toàn bộ text của trang
    const bodyText = await page.locator("body").innerText();

    // Tìm số điện thoại Việt Nam
    const phoneRegex = /(?:0|\+84)(?:[\s.-]*)(?:3|5|7|8|9)(?:[\s.-]*\d){8}/g;

    const matches = bodyText.match(phoneRegex) || [];

    const phones = matches.map((phone) => {
      // Xóa toàn bộ khoảng trắng, dấu . và -
      let normalized = phone.replace(/[\s.-]/g, "");

      // +84908254005 -> 0908254005
      if (normalized.startsWith("+84")) {
        normalized = "0" + normalized.slice(3);
      }

      return normalized;
    });

    // Loại trùng
    const uniquePhones = [...new Set(phones)];

    console.log(
      `📱 Trang ${pageNumber}: tìm được ${uniquePhones.length} số điện thoại`,
    );

    for (const phone of uniquePhones) {
      console.log(`   📞 ${phone}`);
    }

    return uniquePhones;
  } catch (error) {
    console.error(`❌ Lỗi khi crawl trang ${pageNumber}:`, error);

    return [];
  } finally {
    // Quan trọng: luôn đóng browser
    if (browser) {
      await browser.close();

      console.log(`🔴 Đã đóng browser trang ${pageNumber}`);
    }
  }
}

async function main() {
  // ==========================================
  // BƯỚC 1
  // ==========================================

  const totalPages = await getTotalPages();

  console.log(`\n📚 Tổng cộng: ${totalPages} trang`);

  // ==========================================
  // BƯỚC 2
  // ==========================================

  const allPhones = new Set<string>();

  for (let page = 1; page <= totalPages; page++) {
    const phones = await crawlPage(page);

    for (const phone of phones) {
      allPhones.add(phone);
    }

    await savePhonesToFile(phones);

    console.log(`📊 Tổng số điện thoại sau trang ${page}: ${allPhones.size}`);

    // Có thể nghỉ giữa các trang
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // ==========================================
  // KẾT QUẢ
  // ==========================================

  console.log("\n========================================");
  console.log("🎉 HOÀN THÀNH");
  console.log("========================================");

  console.log(`📄 Tổng số trang: ${totalPages}`);

  console.log(`📱 Tổng số điện thoại: ${allPhones.size}`);

  console.log("\nDanh sách:");

  for (const phone of allPhones) {
    console.log(phone);
  }
}

main().catch((error) => {
  console.error("🔥 Fatal error:", error);
  process.exit(1);
});

const OUTPUT_FILE = "./phones2.txt";
async function savePhonesToFile(phones: string[]) {
  if (phones.length === 0) {
    return;
  }

  // Mỗi số một dòng
  const content = phones.join("\n") + "\n";

  await fs.appendFile(OUTPUT_FILE, content, "utf8");

  console.log(`💾 Đã ghi ${phones.length} số vào ${OUTPUT_FILE}`);
}
