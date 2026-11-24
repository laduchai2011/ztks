//const src_video = 'http://192.168.5.100:3007/api/service_video/get/watch?id=video.mp4';

/* eslint-disable import/no-unused-modules */
export function CutId(url: string): string {
    const equal = '=';
    let id = '';
    let isBeginGetId = false;
    for (let i = 0; i < url.length; i++) {
        if (isBeginGetId) {
            id = id + url[i];
        }

        if (url[i] === equal) {
            isBeginGetId = true;
        }
    }

    return id;
}
