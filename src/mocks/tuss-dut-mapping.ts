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

  // Urgência/Emergência (M3) — RN 566/2022
  '10101039': 80, // Consulta em pronto socorro → DUT 80
  '10101047': 80, // Consulta em pronto atendimento → DUT 80
  '30202010': 81, // Internação de urgência → DUT 81
  '30202028': 81, // Internação emergencial em UTI → DUT 81

  // Oncologia (M3)
  '41101010': 70, // Quimioterapia antineoplásica EV → DUT 70
  '41101028': 70, // Quimioterapia oral protocolar → DUT 70
  '41101036': 70, // Hormonioterapia → DUT 70
  '41201019': 71, // Radioterapia conformacional 3D → DUT 71
  '41201027': 71, // IMRT (Radioterapia Modulada) → DUT 71
  '41201035': 71, // Radioterapia estereotáxica → DUT 71
  '40808125': 60, // PET-CT Oncológico → DUT 60 (já existente)
};

export function getDutNumberForTuss(tussCode: string): number | null {
  const num = tussDutMapping[tussCode];
  return num != null && num > 0 ? num : null;
}
