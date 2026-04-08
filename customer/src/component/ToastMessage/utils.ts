export const handleCutPXInString = (s: string): string => {
    const arr: string[] = ['p', 'x'];
    let s_new: string = '';
    for (let i: number = 0; i < s.length; i++) {
        if (arr.indexOf(s[i]) === -1) {
            s_new = `${s_new}${s[i]}`;
        }
    }
    return s_new.trim();
};
