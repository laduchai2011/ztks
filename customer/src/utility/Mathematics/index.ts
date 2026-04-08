// f(x)= (a/bX^2+a)
// b: điều chỉnh độ cong (0 - 1), (ax, ay): cuc tri
export const rational = (x: number, ax: number, ay: number, b: number): number => {
    const tuso = 1;
    const mauso = b * (x - ax) * (x - ax) + 1;

    return ay * (tuso / mauso);
};
