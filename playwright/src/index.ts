import { execSync } from 'child_process';
import { chromium, Page } from 'playwright';
import { consumeMessageVideo } from './messageQueue/Consumer';
import { my_log } from './log';
import path from 'path';
// import fs from 'fs';
import { downloadVideo, deleteVideo } from './connect/minio/service';

const SESSION_PATH = 'sessions/zalo-oa.json';

const isProduct = process.env.NODE_ENV === 'production';
const dev_prefix = isProduct ? '' : 'dev';

const videoPath = path.join(process.cwd(), 'data', 'video', 'input');
const basePath = isProduct ? videoPath : 'D:/zalo5k/backEnd/data/video/input';

function isContain(base: string, full: string): boolean {
    return full.includes(base);
}

(async () => {
    try {
        const browser = await chromium.launch({
            headless: false, // BẮT BUỘC false để login
            args: ['--disable-blink-features=AutomationControlled'],
        });
        const context = await browser.newContext({
            storageState: SESSION_PATH,
            userAgent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1280, height: 800 },
        });
        // const context = await browser.newContext();
        const pagetop = await context.newPage();
        // BẮT BUỘC load trang gốc trước
        await pagetop.goto('https://oa.zalo.me', { timeout: 0 });
        await pagetop.waitForTimeout(3000);
        // await pagetop.goto('https://oa.zalo.me/manage/oa', {
        //     // waitUntil: 'domcontentloaded',
        //     timeout: 5000,
        // });
        await pagetop.goto('https://oa.zalo.me/manage/oa', { timeout: 0 });
        await pagetop.waitForTimeout(3000);
        console.log('👉 Login Zalo OA thủ công (QR / password)...');
        // cutQrLogTerminal(pagetop);
        // ⏳ đợi bạn login xong
        await pagetop.waitForURL('https://oa.zalo.me/**', {
            timeout: 0,
        });
        // await pagetop.click('a[href^="https://oa.zalo.me/manage/register/service"]');
        await pagetop.waitForTimeout(5000);
        await context.storageState({ path: SESSION_PATH });
        console.log('✅ Session saved to', SESSION_PATH);

        consumeMessageVideo('sendVideo', (sendVideoBody) => {
            const zaloAppId: number = sendVideoBody.zaloAppId;
            const zaloOaId: number = sendVideoBody.zaloOaId;
            const chatRoomId: number = sendVideoBody.chatRoomId;
            const accountId: number = sendVideoBody.accountId;
            const payload: string = sendVideoBody.payload;
        });

        await new Promise(() => {});
    } catch (err) {
        console.error('❌ Playwright error:', err);
    }
})();
