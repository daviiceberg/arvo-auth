import { type DutEntry } from '@/types/dut';

export const dutDatabase: Record<number, DutEntry> = {
  1: {
    number: 1,
    title: 'Ablação por Radiofrequência/Crioablação do Câncer Primário Hepático',
    criteria: 'Cobertura obrigatória para pacientes Child A ou B com carcinoma hepático primário.',
    source: 'Anexo II — RN 465/2021',
  },
  3: {
    number: 3,
    title: 'Angiotomografia Coronariana',
    criteria:
      'Cobertura obrigatória quando preenchido pelo menos um dos seguintes critérios (realização apenas em aparelhos multislice com 64 colunas de detectores ou mais): a) avaliação inicial de pacientes sintomáticos com probabilidade pré-teste de 10 a 70%; b) dor torácica aguda com TIMI RISK 1 e 2; c) avaliação de patência de enxertos coronarianos; d) avaliação de artérias coronárias em pacientes com indicação de cirurgia de valva aórtica.',
    source: 'Anexo II — RN 465/2021',
  },
  8: {
    number: 8,
    title:
      'Bloqueio com Toxina Botulínica Tipo A para Distonias Focais, Espasmo Hemifacial e Espasticidade',
    criteria:
      'Cobertura obrigatória para distonias focais e segmentares (blefaroespasmo, distonia laríngea, espasmo hemifacial, distonia cervical). Também obrigatória para espasticidade focal intensa com sintomas incapacitantes após tratamento medicamentoso e fisioterápico.',
    source: 'Anexo II — RN 465/2021',
  },
  12: {
    number: 12,
    title: 'Cirurgia de Esterilização Masculina (Vasectomia)',
    criteria:
      'Cobertura obrigatória quando preenchidos todos os critérios: homens com capacidade civil plena; maiores de 25 anos ou com pelo menos 2 filhos vivos; prazo mínimo de 60 dias entre manifestação da vontade e o ato cirúrgico; manifestação registrada em documento escrito e firmado.',
    source: 'Anexo II — RN 465/2021',
  },
  18: {
    number: 18,
    title: 'Abdominoplastia',
    criteria:
      'Cobertura obrigatória em casos de pacientes que apresentem abdome em avental decorrente de grande perda ponderal (em consequência de tratamento clínico para obesidade mórbida ou após cirurgia de redução de estômago).',
    source: 'Anexo II — RN 465/2021',
  },
  19: {
    number: 19,
    title: 'Dímero-D',
    criteria:
      'Cobertura obrigatória quando: a) avaliação de pacientes adultos com sinais e sintomas de trombose venosa profunda dos membros inferiores; b) avaliação hospitalar ou em emergência de pacientes com sinais e sintomas de embolia pulmonar.',
    source: 'Anexo II — RN 465/2021',
  },
  27: {
    number: 27,
    title: 'Gastroplastia (Cirurgia Bariátrica)',
    criteria:
      'Cobertura obrigatória quando preenchido critérios de idade (Grupo I: >18 anos, ou 16-18 com escore-z >+4) e critérios clínicos (Grupo II: IMC 35-39,9 com comorbidades e falha no tratamento clínico por 2 anos; IMC 40-49,9 com ou sem comorbidades; IMC ≥50). Não coberto para pacientes com transtorno psiquiátrico não controlado ou uso de álcool/drogas.',
    source: 'Anexo II — RN 465/2021',
  },
  30: {
    number: 30,
    title: 'HER-2',
    criteria:
      'Cobertura obrigatória para diagnóstico de elegibilidade de pacientes com indicação de uso de medicação em que a bula determine a análise do HER-2 para início do tratamento.',
    source: 'Anexo II — RN 465/2021',
  },
  33: {
    number: 33,
    title: 'Implante Coclear',
    criteria:
      'Cobertura obrigatória unilateral ou bilateral. Para crianças até 4 anos: perda auditiva neurossensorial severa/profunda bilateral com experiência prévia de AASI. Para crianças de 4-7 anos: mesmos critérios com desenvolvimento adequado de linguagem oral. Para maiores de 7 anos e adultos: perda auditiva neurossensorial severa/profunda bilateral pós-lingual.',
    source: 'Anexo II — RN 465/2021',
  },
  35: {
    number: 35,
    title: 'Implante de Cardiodesfibrilador Implantável — CDI',
    criteria:
      'Cobertura obrigatória quando: a) sobreviventes de parada cardíaca por TV/FV espontânea de causa não reversível; b) TV sustentada hemodinamicamente instável espontânea; c) síncope de origem indeterminada com TV sustentada induzida; d) FEVE ≤35% com expectativa de vida >1 ano.',
    source: 'Anexo II — RN 465/2021',
  },
  52: {
    number: 52,
    title: 'Mamografia Digital',
    criteria: 'Cobertura obrigatória para mulheres na faixa etária entre 40 e 69 anos.',
    source: 'Anexo II — RN 465/2021',
  },
  54: {
    number: 54,
    title: 'Medicamentos para Controle de Efeitos Adversos de Tratamentos Antineoplásicos',
    criteria:
      'Inclui sub-diretrizes para: anemia (54.1), infecções (54.2), diarreia (54.3), dor (54.4), neutropenia (54.5), náusea e vômito (54.6), rash cutâneo (54.7) e tromboembolismo (54.8) relacionados ao uso de antineoplásicos. Cada sub-diretriz tem critérios específicos de cobertura.',
    source: 'Anexo II — RN 465/2021',
  },
  58: {
    number: 58,
    title: 'Oxigenoterapia Hiperbárica',
    criteria:
      'Cobertura obrigatória quando: a) doença descompressiva; b) embolia traumática pelo ar; c) embolia gasosa; d) envenenamento por CO ou inalação de fumaça; e) envenenamento por gás cianídrico/sulfídrico; f) gangrena gasosa; g) síndrome de Fournier; h) infecções necrotizantes de tecidos moles; i) isquemias agudas traumáticas; j) lesão por radiação; k) osteomielite crônica refratária; l) pé diabético com úlcera Wagner ≥3.',
    source: 'Anexo II — RN 465/2021',
  },
  60: {
    number: 60,
    title: 'PET-CT Oncológico',
    criteria:
      'Cobertura obrigatória para: 1) câncer pulmonar de células não pequenas (caracterização, estadiamento, recorrências); 2) linfoma (estadiamento, resposta terapêutica, recidiva); 3) câncer colo-retal (recidiva ressecável, CEA elevado sem lesão em imagem); 4) nódulo pulmonar solitário >1cm sem calcificações; 5) câncer de mama metastático com achados equívocos; 6) melanoma (estadiamento, recidiva); 7) câncer de esôfago (estadiamento); 8) tumores de cabeça e pescoço.',
    source: 'Anexo II — RN 465/2021',
  },
  64: {
    number: 64,
    title: 'Terapia Antineoplásica Oral para Tratamento do Câncer',
    criteria:
      'Cobertura obrigatória conforme tabela de substâncias, localizações e indicações. Inclui medicações como Abemaciclibe (mama), Abiraterona (próstata), Capecitabina (mama, colo-retal, gástrico), Erlotinibe (pulmão, pâncreas), Imatinibe (GIST, LMC), Lenalidomida (mieloma), entre outros.',
    source: 'Anexo II — RN 465/2021',
  },
  65: {
    number: 65,
    title: 'Terapia Imunobiológica EV, IM ou SC',
    criteria:
      'Cobertura obrigatória para: 65.1 Artrite Reumatóide; 65.2 Artrite Idiopática Juvenil; 65.3 Espondiloartrite Axial; 65.4 Artrite Psoriásica; 65.5 Psoríase; 65.6 Doença de Crohn; 65.7 Colite Ulcerativa; 65.8 Hidradenite Supurativa; 65.9 Asma Eosinofílica Grave; 65.10 Asma Alérgica Grave; 65.11 Urticária Crônica; 65.12 Uveíte; 65.13 Esclerose Múltipla. Cada sub-diretriz tem critérios específicos.',
    source: 'Anexo II — RN 465/2021',
  },
  68: {
    number: 68,
    title: 'Teste Ergométrico (inclui ECG basal convencional)',
    criteria:
      'Cobertura obrigatória para: a) avaliação de dor torácica em pacientes com probabilidade intermediária; b) avaliação de capacidade funcional e prognóstico em pacientes com DAC; c) estratificação de risco pós-infarto; d) avaliação de resposta terapêutica; e) avaliação pré-participação em programas de exercícios para coronariopatas.',
    source: 'Anexo II — RN 465/2021',
  },
  74: {
    number: 74,
    title: 'Tratamento Ocular Quimioterápico com Antiangiogênico',
    criteria:
      'Cobertura obrigatória para DMRI quando o olho tratado preencher todos os critérios do Grupo I (lesão ativa subfoveal, acuidade ≥20/400, ausência de fibrose ou atrofia macular extensa) e nenhum do Grupo II (cirurgia intraocular recente, infecção ocular ativa). Também para edema macular diabético, oclusão venosa retiniana e neovascularização coroidal miópica.',
    source: 'Anexo II — RN 465/2021',
  },
  75: {
    number: 75,
    title: 'Ultrassonografia Obstétrica Morfológica',
    criteria:
      'Cobertura obrigatória para gestantes com idade gestacional entre 18 e 24 semanas no momento da solicitação de autorização.',
    source: 'Anexo II — RN 465/2021',
  },
  102: {
    number: 102,
    title: 'Consulta com Fisioterapeuta',
    criteria:
      'Cobertura obrigatória de 2 consultas de fisioterapia por ano de contrato, para cada CID apresentado pelo paciente.',
    source: 'Anexo II — RN 465/2021',
  },
  105: {
    number: 105,
    title: 'Sessão com Psicólogo',
    criteria:
      'Cobertura mínima obrigatória de 12 sessões por ano de contrato. Critérios incluem: candidatos a cirurgia de esterilização, candidatos a gastroplastia, gestantes de alto risco, pacientes com diagnóstico de TEA e outros transtornos do neurodesenvolvimento.',
    source: 'Anexo II — RN 465/2021',
  },
  107: {
    number: 107,
    title: 'Sessão com Terapeuta Ocupacional',
    criteria:
      'Cobertura mínima obrigatória de 12 sessões por ano de contrato. Critérios: pacientes com demência (F00-F03), retardo (F70-F79), transtornos específicos do desenvolvimento (F80-F89 incluindo TEA), deficiência física ou cognitiva decorrente de AVC, TCE, lesão medular.',
    source: 'Anexo II — RN 465/2021',
  },
  108: {
    number: 108,
    title: 'Sessão de Psicoterapia',
    criteria:
      'Cobertura mínima obrigatória de 18 sessões por ano de contrato. Critérios: transtornos neuróticos (F40-F48), transtornos alimentares (F50), transtornos de personalidade (F60-F69), transtornos do comportamento adulto (F90-F98), esquizofrenia e delírios (F20-F29), transtornos de humor (F30-F39).',
    source: 'Anexo II — RN 465/2021',
  },
  109: {
    number: 109,
    title: 'Atendimento/Acompanhamento em Hospital-Dia Psiquiátrico',
    criteria:
      'Cobertura obrigatória de programas de atenção e cuidados intensivos por equipe multiprofissional, inclusive administração de medicamentos. Critérios: transtornos mentais por uso de substâncias, esquizofrenia, transtornos de humor, transtornos alimentares graves.',
    source: 'Anexo II — RN 465/2021',
  },
  143: {
    number: 143,
    title: 'Implante Transcateter de Prótese Valvar Aórtica (TAVI)',
    criteria:
      'Cobertura obrigatória quando: paciente ≥75 anos, sintomático, expectativa de vida >1 ano, inoperável ou alto risco cirúrgico (STS >8% ou EuroSCORE >20%); avaliação por equipe multiprofissional com experiência em TAVI.',
    source: 'Anexo II — RN 465/2021',
  },
  148: {
    number: 148,
    title: 'Terapia por Pressão Negativa',
    criteria:
      'Cobertura obrigatória para pacientes com úlcera de pé diabético grau ≥3 pela classificação de Wagner.',
    source: 'Anexo II — RN 465/2021',
  },
  70: {
    number: 70,
    title: 'Quimioterapia Antineoplásica Endovenosa',
    criteria:
      'Cobertura obrigatória para protocolos oncológicos com indicação clínica documentada (laudo oncológico, estadiamento TNM, linha de tratamento). Protocolo deve constar nas diretrizes da SBOC ou NCCN. Ciclos sequenciais autorizados conjuntamente quando há protocolo definido. Suspensão por toxicidade requer reavaliação.',
    source: 'Anexo II — RN 465/2021',
    sourceType: 'ANS',
  },
  71: {
    number: 71,
    title: 'Radioterapia Conformacional 3D / IMRT',
    criteria:
      'Cobertura obrigatória quando há indicação oncológica (laudo radioterápico, planejamento dosimétrico). Número de frações conforme prescrição (varia de 5 a 40). IMRT obrigatória para câncer de cabeça/pescoço, próstata e SNC; demais sítios: 3D conformacional como padrão. Reavaliação após 50% das frações.',
    source: 'Anexo II — RN 465/2021',
    sourceType: 'ANS',
  },
  80: {
    number: 80,
    title: 'Atendimento de Urgência/Emergência Ambulatorial',
    criteria:
      'Cobertura obrigatória conforme RN 566/2022 art. 3º — atendimento imediato (≤2h) sem necessidade de autorização prévia. CID obrigatório no laudo. Justificativa clínica do quadro de urgência/emergência exigida. Não admite negativa por carência (RN 195/2009 art. 11).',
    source: 'RN 566/2022 art. 3º',
    sourceType: 'ANS',
  },
  81: {
    number: 81,
    title: 'Internação de Urgência/Emergência',
    criteria:
      'Cobertura obrigatória sem autorização prévia para risco iminente de morte ou lesão irreparável (RN 566/2022 art. 3º §1º). Comunicação à operadora em até 24h. Carência reduzida a 24h conforme RN 195/2009 art. 11. Necessidade de UTI segue protocolo específico do nível de auditoria HOSPITALAR/UTI.',
    source: 'RN 566/2022 art. 3º §1º',
    sourceType: 'ANS',
  },
};

export function getDutByNumber(num: number): DutEntry | undefined {
  return dutDatabase[num];
}
