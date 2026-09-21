export function setCookie(key: string, value: string, days?: number): void {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }

    if (process.env.NODE_ENV === 'development') {
        document.cookie = `${key}=${encodeURIComponent(value)}${expires}; path=/; samesite=strict`;
    } else {
        document.cookie = `${key}=${encodeURIComponent(value)}${expires}; path=/; secure; samesite=strict`;
    }
}

export function getCookie(key: string): string | null {
    const nameEQ = key + '=';
    const cookies = document.cookie.split(';');

    for (let c of cookies) {
        c = c.trim();
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length));
        }
    }
    return null;
}

// export function deleteCookie(key: string): void {
//     document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict`;
// }
