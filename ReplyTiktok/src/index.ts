import { chromium } from 'playwright';

// const SESSION_PATH = 'sessions/zalo-oa.json';

(async () => {
    try {
        const browser = await chromium.launch({
            headless: false, // BẮT BUỘC false để login
            args: ['--disable-blink-features=AutomationControlled'],
        });

        // const context = await browser.newContext({
        //     storageState: SESSION_PATH,
        //     userAgent:
        //         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        //     viewport: { width: 1280, height: 800 },
        // });
        const context = await browser.newContext();

        const pagetop = await context.newPage();

        // BẮT BUỘC load trang gốc trước
        await pagetop.goto('https://www.tiktok.com', { timeout: 0 });
        await pagetop.waitForTimeout(3000);

        // let i: number = 0;
        setTimeout(async () => {
            console.log(1111111111111);
            const messageItem = pagetop.locator('div[data-index="1"]');

            const ownerName = await messageItem.locator('[data-e2e="message-owner-name"]').innerText();

            console.log(ownerName); // Sang Dương
        }, 10000);

        console.log('✅ Truy cập tiktok thành công !');
    } catch (err) {
        console.error('❌ Playwright error:', err);
    }
})();
