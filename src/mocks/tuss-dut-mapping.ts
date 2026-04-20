/**
 * Maps TUSS procedure codes to their associated DUT number.
 * Value of 0 or absence means "no DUT applicable".
 */
export const tussDutMapping: Record<string, number> = {
  // Terapias Especiais (TEA — CID F84) — aligned with procedure-codes.ts
  '50000470': 105, // ABA → DUT 105
  '50000370': 102, // Fonoaudiologia → DUT 102
  '50000489': 107, // Terapia Ocupacional → DUT 107
  '50000497': 109, // Fisioterapia → DUT 109
  '50000438': 108, // Psicoterapia Individual → DUT 108
  '50000500': 106, // Psicopedagogia → DUT 106
  // Aliases and variants (keep if used elsewhere)
  '50000471': 105, // ABA via psicólogo → DUT 105
  '50000472': 107, // TO alt → DUT 107
  '50000450': 107, // TO alt → DUT 107
  '50000321': 107, // TO alt → DUT 107
  '50000460': 108, // Psicoterapia alt → DUT 108
  '50000380': 109, // Fisio alt → DUT 109
  '50000390': 106, // Psicopedagogia alt → DUT 106
  '50000387': 105, // Reavaliação Neuropsicológica → DUT 105
};

export function getDutNumberForTuss(tussCode: string): number | null {
  const num = tussDutMapping[tussCode];
  return num != null && num > 0 ? num : null;
}
