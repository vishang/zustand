import { PixelRatio, useWindowDimensions } from "react-native";


const BASE_WIDTH = 390;

export function useResponsiveFont(
    base: number,
    opts?: { factor?: number; min?: number, max?: number; ally?: boolean }
) {
    const { width, height } = useWindowDimensions();
    const shortest = Math.min(width, height);
    const deviceScale = shortest / BASE_WIDTH;
    const factor = opts?.factor ?? 0.5;
    let size = base + (base * deviceScale - base) * factor;

    if (opts?.ally !== false) size *= PixelRatio.getFontScale(); // respect user setting
    if (opts?.min) size = Math.max(opts.min, size);
    if (opts?.max) size = Math.min(opts.max, size);

    return Math.round(size);
}

export const lh = (fs: number, percent: number) => Math.ceil(fs * (percent / 100));