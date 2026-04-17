import { execSync } from 'child_process';
import { chromium, Page } from 'playwright';
import { my_log } from './log';
import { io } from 'socket.io-client';
import path from 'path';
import fs from 'fs';
import { BASE_URL } from './const/api/baseUrl';
import { PlaywightGetZaloAppField } from './dataStruct/zalo';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import { VideoMessageBodyField } from './dataStruct/message_v1/body';

const rootDir = process.cwd();
const loginFilePath = path.join(rootDir, 'login.txt');
const videosDir = path.join(rootDir, 'data', 'videos');

const SESSION_PATH = 'sessions/zalo-oa.json';

const isProduct = process.env.NODE_ENV === 'production';
const dev_prefix = isProduct ? '' : 'dev';
const apiString = isProduct ? '' : '/api';

const videoPath = path.join(process.cwd(), 'data', 'video', 'input');
const basePath = isProduct ? videoPath : 'D:/zalo5k/backEnd/data/video/input';

(async () => {
    try {
        const loginInfor = login(loginFilePath);
        console.log(loginInfor);
        if (!loginInfor) {
            console.log('Đăng nhập không thành công');
            return;
        }

        const playwightGetZaloApp = await getZaloApp(loginInfor.account, loginInfor.password);

        if (!playwightGetZaloApp) {
            console.log('Không thể lấy được thông tin Zalo App');
            return;
        }

        // connect socket
        const socket = connectSocket(playwightGetZaloApp.token);

        const onConnect = () => {
            socket.emit('joinRoom', `playwright_${playwightGetZaloApp.zaloApp.id}`);
        };
        socket.on('connect', onConnect);

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

        socket.on('playwrightOnline-playwightOn', ({ zaloAppId, accountId }) => {
            // console.log('Playwright is online on app, zaloAppId:', zaloAppId, 'accountId:', accountId);
            socket.emit('playwrightOnline-onPlaywright', {
                zaloAppId: zaloAppId,
                accountId: accountId,
            });
        });

        socket.on('sendVideo_with_zalo_app_id', async (videoMessageBody: VideoMessageBodyField) => {
            console.log('Received sendVideo event:', videoMessageBody);

            const page = await context.newPage();

            await page.goto(`https://oa.zalo.me/chat?uid=${videoMessageBody.userId}&oaid=${videoMessageBody.oaId}`, {
                // waitUntil: 'domcontentloaded',
                timeout: 0,
            });
            await page.waitForTimeout(6000);

            let isSent: boolean = false;
            let isFinish: boolean = false;

            page.on('response', async (response) => {
                const url = response.url();
                console.log(videoMessageBody.videoName, 'url', url);
                if (url === 'https://oa.zalo.me/chatv2/message/send-video?platform=web') {
                    isSent = true;
                    console.log('✅ Video sent successfully!');
                } else if (isSent && url && !isFinish) {
                    isFinish = true;

                    const urlVideo = url;

                    // // 1. Scroll xuống cuối
                    // await page.locator('.ScrollAreaViewport').evaluate((el) => {
                    //     el.scrollTop = el.scrollHeight;
                    // });

                    // 2. Lấy message cuối
                    const lastMessage = page.locator('.section-item').last();

                    // 3. Hover để hiện nút quote
                    await lastMessage.hover();

                    // 4. Click nút quote (fix strict mode)
                    await lastMessage
                        .locator('.btn_quote')
                        .filter({ has: page.locator(':visible') })
                        .first()
                        .click();

                    // // 5. Tìm ô input
                    // const input = page.locator('textarea, [contenteditable="true"]');

                    // // 6. Đợi input focus
                    // await input.waitFor();

                    // // 7. Nhập nội dung
                    // await input.fill('Nội dung reply của tôi');

                    // // 8. Gửi (Enter)
                    // await input.press('Enter');
                    const input = page.getByRole('textbox', {
                        name: 'Nhập nội dung tin nhắn...',
                    });

                    await input.click();

                    await input.fill(`ma:${videoMessageBody.videoName},duongdan:${urlVideo}`);
                    await input.press('Enter');

                    console.log('✅ Video reply sent successfully!');
                }
            });

            const videoName = videoMessageBody.videoName;
            const videoUrl = `${BASE_URL}${apiString}/service_video_v1/query/downloadVideo/${videoName}`;
            const res = await fetch(videoUrl);
            // const blob = await res.blob();
            // console.log(111111, blob);

            if (!res.body) throw new Error('No response body');

            const videoFilePath = path.join(videosDir, videoName);
            await pipeline(Readable.fromWeb(res.body as any), createWriteStream(videoFilePath));

            const [fileChooser] = await Promise.all([
                page.waitForEvent('filechooser'), // Playwright sẽ bắt sự kiện file chooser
                // page.click('[aria-describedby="tippy-tooltip-11"]'), // click vào icon video để bật file chooser
                await page.locator('i.icon_bar.icon_video.on').locator('xpath=ancestor::div[@data-tooltipped]').click(),
            ]);

            await fileChooser.setFiles(videoFilePath);

            // Optional: chờ video upload xong, có thể bấm nút gửi nếu cần
            await page.waitForTimeout(3000); // đợi 3s upload hoàn tất
            await page.keyboard.press('Enter'); // gửi tin nhắn

            setTimeout(() => {
                page.close();
            }, 20000); // xóa video sau 1 phút
        });

        await new Promise(() => {});
    } catch (err) {
        console.error('❌ Playwright error:', err);
    }
})();

function login(filePath: string) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');

        const lines = content.split('\n');

        const data: Record<string, string> = {};

        for (const line of lines) {
            const [key, value] = line.split('=');
            if (key && value) {
                data[key.trim()] = value.trim();
            }
        }

        const taiKhoan = data['tai_khoan'];
        const matKhau = data['mat_khau'];

        return { account: taiKhoan, password: matKhau };
    } catch (error) {
        console.error(error);
        return;
    }
}

async function getZaloApp(userName: string, password: string) {
    const res = await fetch(`${BASE_URL}${apiString}/service_zalo/query/playwightGetZaloApp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userName: userName,
            password: password,
        }),
    });

    const data = await res.json();

    return data.data as PlaywightGetZaloAppField;
}

function connectSocket(token: string) {
    const SOCKET_URL = isProduct ? process.env.SOCKET_URL : 'http://zalo5k.local.com:1000';

    const socket = io(SOCKET_URL || '', {
        auth: {
            token: token,
        },
        reconnection: true, // mặc định đã true
        reconnectionAttempts: Infinity, // thử lại vô hạn
        reconnectionDelay: 1000, // delay lần đầu (1s)
        reconnectionDelayMax: 5000, // max delay
        timeout: 20000, // timeout connect
    });

    socket.on('connect', () => {
        console.log('socket connected', socket?.id);
    });

    socket.on('connect_error', (err: any) => {
        console.log('socket connect error', err);
    });

    socket.on('disconnect', (reason) => {
        console.log('disconnect:', reason);
    });

    socket.io.on('reconnect_attempt', () => {
        console.log('reconnecting...');
    });

    socket.io.on('reconnect', () => {
        console.log('reconnected!');
    });

    socket.io.on('reconnect_error', (err) => {
        console.log('reconnect error:', err.message);
    });

    return socket;
}
