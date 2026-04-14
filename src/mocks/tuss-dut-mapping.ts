/**
 * Maps TUSS procedure codes to their associated DUT number.
 * Value of 0 or absence means "no DUT applicable".
 */
export const tussDutMapping: Record<string, number> = {
  // Oncologia
  '90020040': 64, // Quimioterapia EV → DUT 64 (Terapia Antineoplásica)
  '90020055': 65, // Imunoterapia Pembrolizumabe → DUT 65 (Imunobiológica)
  '90020092': 64, // Oxaliplatina → DUT 64
  '90020018': 64, // Infusão EV hospital-dia → DUT 64
  '90020078': 64, // Carboplatina + Paclitaxel → DUT 64
  '90020101': 74, // Bevacizumabe → DUT 74 (Antiangiogênico)
  // Cardiologia
  '30911044': 3, // Cateterismo → DUT 3 (Angiotomografia)
  '30603015': 68, // Revascularização → DUT 68 (Teste Ergométrico)
  // OPME
  '30507026': 35, // Stent coronariano → DUT 35 (CDI/Implante)
  '70740015': 35, // Stent farmacológico → DUT 35
  // Terapias
  '50000472': 107, // Terapia Ocupacional → DUT 107
  '50000370': 102, // Fonoaudiologia → DUT 102 (Consulta Fisioterapeuta)
  '50000471': 105, // ABA (via psicólogo) → DUT 105 (Sessão Psicólogo)
  '50000321': 107, // Terapia Ocupacional → DUT 107
  '50000470': 105, // Sessão Terapia ABA → DUT 105
  '50000500': 108, // Psicoterapia → DUT 108
  '50000489': 102, // Fonoaudiologia → DUT 102
  '50000497': 107, // Terapia Ocupacional → DUT 107
  // Cirurgias
  '30913101': 18, // Artroplastia → DUT 18 (procedimento complexo)
  '30719138': 18, // Artroplastia total joelho → DUT 18
  // Exames
  '40901010': 60, // RNM Crânio → DUT 60 (PET-CT / Imagem avançada)
  '41001095': 60, // Angiorressonância → DUT 60
  // Internação
  '40301010': 109, // Internação enfermaria → DUT 109
  '40301020': 109, // Internação UTI → DUT 109
  // U/E
  '10101039': 0, // Atendimento U/E — sem DUT específica
};

export function getDutNumberForTuss(tussCode: string): number | null {
  const num = tussDutMapping[tussCode];
  return num != null && num > 0 ? num : null;
}
