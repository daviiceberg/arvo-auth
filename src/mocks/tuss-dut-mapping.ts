/**
 * Maps TUSS procedure codes to their associated DUT number.
 * Value of 0 or absence means "no DUT applicable".
 */
export const tussDutMapping: Record<string, number> = {
  // Terapias Especiais (TEA — CID F84)
  '50000470': 105, // Sessão Terapia ABA → DUT 105 (Sessão Psicólogo)
  '50000471': 105, // ABA (via psicólogo) → DUT 105
  '50000472': 107, // Terapia Ocupacional → DUT 107
  '50000450': 107, // Terapia Ocupacional → DUT 107
  '50000497': 107, // Terapia Ocupacional → DUT 107
  '50000321': 107, // Terapia Ocupacional → DUT 107
  '50000370': 102, // Fonoaudiologia → DUT 102
  '50000489': 102, // Fonoaudiologia → DUT 102
  '50000460': 108, // Psicoterapia → DUT 108
  '50000500': 108, // Psicoterapia → DUT 108
  '50000380': 109, // Fisioterapia → DUT 109
  '50000390': 106, // Psicopedagogia → DUT 106
  '50000387': 105, // Reavaliação Neuropsicológica → DUT 105
};

export function getDutNumberForTuss(tussCode: string): number | null {
  const num = tussDutMapping[tussCode];
  return num != null && num > 0 ? num : null;
}
