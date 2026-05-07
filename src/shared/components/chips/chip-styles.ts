/**
 * Chip styling tokens — single source of truth for chip dimensions.
 *
 * Toda variação fica em cor (bg + color). Tamanho, peso e altura são fixos
 * para preservar consistência visual entre módulos.
 */

export const CHIP_FONT_SIZE = 11;
export const CHIP_HEIGHT = 22;
export const CHIP_FONT_WEIGHT = 700;
export const CHIP_ICON_FONT_SIZE = 12;

export const CHIP_BASE_SX = {
  fontSize: CHIP_FONT_SIZE,
  height: CHIP_HEIGHT,
  fontWeight: CHIP_FONT_WEIGHT,
} as const;
