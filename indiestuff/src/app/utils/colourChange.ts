// pSBC - Shade Blend Convert - Version 4.0 - 02/18/2019
// https://github.com/PimpTrizkit/PJs/edit/master/pSBC.js

/* eslint-disable */
export const pSBC = (p: any, c0?: any, c1?: any, l?: any) => {
    let r,
        g,
        b,
        P,
        f,
        t,
        h,
        m = Math.round,
        a = typeof c1 == 'string';
    if (typeof p != 'number' || p < -1 || p > 1 || typeof c0 != 'string' || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
    (h = c0.length > 9),
        (h = a ? (c1.length > 9 ? true : c1 == 'c' ? !h : false) : h),
        (f = pSBC.pSBCr(c0)),
        (P = p < 0),
        (t = c1 && c1 != 'c' ? pSBC.pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }),
        (p = P ? p * -1 : p),
        (P = 1 - p);
    if (!f || !t) return null;
    if (l) (r = m(P * f.r + p * t.r)), (g = m(P * f.g + p * t.g)), (b = m(P * f.b + p * t.b));
    else (r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5)), (g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5)), (b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5));
    (a = f.a), (t = t.a), (f = (a as any) >= 0 || t >= 0), (a = f ? ((a as any) < 0 ? t : t < 0 ? a : (a as any) * P + t * p) : 0);
    if (h) return 'rgb' + (f ? 'a(' : '(') + r + ',' + g + ',' + b + (f ? ',' + m((a as any) * 1000) / 1000 : '') + ')';
    else return '#' + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m((a as any) * 255) : 0)).toString(16).slice(1, f ? undefined : -2);
};

pSBC.pSBCr = (d) => {
    const i = parseInt,
        m = Math.round;
    let n = d.length,
        x = {};
    if (n > 9) {
        const [r, g, b, a] = (d = d.split(','));
        n = d.length;
        if (n < 3 || n > 4) return null;
        ((x as any).r = i(r[3] == 'a' ? r.slice(5) : r.slice(4))), ((x as any).g = i(g)), ((x as any).b = i(b)), ((x as any).a = a ? parseFloat(a) : -1);
    } else {
        if (n == 8 || n == 6 || n < 4) return null;
        if (n < 6) d = '#' + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : '');
        d = i(d.slice(1), 16);
        if (n == 9 || n == 5) ((x as any).r = (d >> 24) & 255), ((x as any).g = (d >> 16) & 255), ((x as any).b = (d >> 8) & 255), ((x as any).a = m((d & 255) / 0.255) / 1000);
        else ((x as any).r = d >> 16), ((x as any).g = (d >> 8) & 255), ((x as any).b = d & 255), ((x as any).a = -1);
    }
    return x;
};

export const getBrightness = (color: string): number => {
    const c = color.substring(1); // strip #
    const rgb = parseInt(c, 16); // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff; // extract red
    const g = (rgb >> 8) & 0xff; // extract green
    const b = (rgb >> 0) & 0xff; // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    return luma;
};
