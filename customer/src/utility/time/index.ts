export function timeAgoSmart(dateInput: string | Date) {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();

    const diffMs = now.getTime() - date.getTime(); // dương = quá khứ
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 10) return 'vừa xong';
    if (diffSec < 60) return `${diffSec} giây `;

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} phút `;

    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} giờ `;

    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay} ngày `;

    // >= 7 ngày: hiện ngày cụ thể
    return date.toLocaleDateString('vi-VN');
}
