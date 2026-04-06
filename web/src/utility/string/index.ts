// export function isString(value: unknown): boolean {
//     return typeof value === 'string' || value instanceof String;
// }

export function isSpace(str: string): boolean {
    const hasSpace = str.includes(' ');
    return hasSpace;
}

export function isFirstNumber(str: string): boolean {
    const firstChar = str[0];
    const isNumber = !isNaN(Number(firstChar));
    return isNumber;
}

export function isNumber(str: string): boolean {
    const isNumber = !isNaN(Number(str));
    return isNumber;
}

// export function isPositiveInteger(str: string): boolean {
//     const num = Number(str);
//     return (
//         str.trim() !== '' && // không phải chuỗi rỗng
//         Number.isInteger(num) && // là số nguyên
//         num > 0 // lớn hơn 0
//     );
// }

export function isValidPhoneNumber(phone: string): boolean {
    const regex = /^(0|\+84)[1-9][0-9]{8}$/;
    return regex.test(phone.trim());
}

export function containsSpecialCharacters(str: string): boolean {
    // Regex kiểm tra ký tự không phải chữ cái (a-z, A-Z) hoặc số (0-9)
    return /[^a-zA-Z0-9 ]/.test(str);
}

// export const handleCutPXInString = (s: string): string => {
//     const arr: string[] = ['p', 'x'];
//     let s_new: string = '';
//     for (let i: number = 0; i < s.length; i++) {
//         if (arr.indexOf(s[i]) === -1) {
//             s_new = `${s_new}${s[i]}`;
//         }
//     }
//     return s_new.trim();
// };

type Part = { type: 'text'; value: string } | { type: 'link'; value: string };
const urlRegex = /https?:\/\/[^\s<>"']+[^\s<>"'.,!?;:)\]]/g;
export function parseTextToParts(text: string): Part[] {
    const matches = [...text.matchAll(urlRegex)];

    if (matches.length === 0) return [{ type: 'text', value: text }];

    const parts: Part[] = [];
    let lastIndex = 0;

    for (const match of matches) {
        const url = match[0];
        const index = match.index ?? 0;

        // text trước url
        if (index > lastIndex) {
            parts.push({
                type: 'text',
                value: text.slice(lastIndex, index),
            });
        }

        // url
        parts.push({ type: 'link', value: url });

        lastIndex = index + url.length;
    }

    // text sau cùng
    if (lastIndex < text.length) {
        parts.push({
            type: 'text',
            value: text.slice(lastIndex),
        });
    }

    return parts;
}

export const formatMoney = (value: string | number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(Number(value));
};

export const avatarnull =
    'https://www.shutterstock.com/image-vector/default-avatar-social-media-display-600nw-2632690107.jpg';

export function formatPhone(phone: string): string {
    if (phone.startsWith('0')) {
        return '+84' + phone.slice(1);
    }
    return phone;
}
