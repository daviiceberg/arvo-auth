/**
 * @prototype
 * @status FAKE — awaiting real backend endpoint
 * @planned-endpoint GET /api/v1/anvisa/check
 *                   POST /api/v1/anvisa/batch-check
 *
 * Dataset com registros ANVISA representativos do mercado brasileiro de OPME:
 * próteses ortopédicas, cardíacas, oftálmicas, vasculares, placas/parafusos e
 * materiais cirúrgicos. Distribuição: válidos majoritários, vencidos e
 * inexistentes para cobrir os 3 status que a UI precisa apresentar.
 */

import { type AnvisaStatus } from '@/types/pedido';

export interface AnvisaFakeRecord {
  registration: string;
  status: Exclude<AnvisaStatus, 'not_checked'>;
  productName: string;
  manufacturer: string;
  category: string;
  validUntil?: string;
}

export const ANVISA_FAKE_RECORDS: AnvisaFakeRecord[] = [
  {
    registration: '10380700123',
    status: 'valid',
    productName: 'Prótese Total de Joelho Cimentada — Sistema PFC Sigma',
    manufacturer: 'DePuy Synthes',
    category: 'Ortopedia / Prótese',
    validUntil: '2029-12-31',
  },
  {
    registration: '10380700456',
    status: 'valid',
    productName: 'Prótese Total de Quadril — Sistema Corail / Pinnacle',
    manufacturer: 'DePuy Synthes',
    category: 'Ortopedia / Prótese',
    validUntil: '2028-08-31',
  },
  {
    registration: '80102510047',
    status: 'valid',
    productName: 'Stent Coronariano Farmacológico Xience Sierra',
    manufacturer: 'Abbott Vascular',
    category: 'Cardiologia / Stent',
    validUntil: '2029-06-30',
  },
  {
    registration: '80146170055',
    status: 'valid',
    productName: 'Marca-Passo Cardíaco Dupla Câmara Assurity MRI',
    manufacturer: 'Abbott / St. Jude Medical',
    category: 'Cardiologia / Marca-passo',
    validUntil: '2030-03-31',
  },
  {
    registration: '10381440089',
    status: 'valid',
    productName: 'Placa Bloqueada de Titânio LCP — Sistema 3.5mm',
    manufacturer: 'Synthes',
    category: 'Ortopedia / Osteossíntese',
    validUntil: '2028-11-30',
  },
  {
    registration: '10381440090',
    status: 'valid',
    productName: 'Parafuso Cortical Titânio 3.5mm (sortimento)',
    manufacturer: 'Synthes',
    category: 'Ortopedia / Osteossíntese',
    validUntil: '2028-11-30',
  },
  {
    registration: '80820100022',
    status: 'valid',
    productName: 'Lente Intraocular Acrílica Hidrofóbica Acrysof IQ',
    manufacturer: 'Alcon Laboratórios',
    category: 'Oftalmologia / LIO',
    validUntil: '2029-09-30',
  },
  {
    registration: '10145430011',
    status: 'valid',
    productName: 'Tela de Polipropileno para Hernioplastia Marlex',
    manufacturer: 'Bard / BD',
    category: 'Cirurgia Geral / Tela',
    validUntil: '2030-01-31',
  },
  {
    registration: '10333190034',
    status: 'valid',
    productName: 'Cateter Venoso Central Triplo Lúmen Arrow',
    manufacturer: 'Teleflex Medical',
    category: 'Acesso Vascular',
    validUntil: '2028-07-31',
  },
  {
    registration: '80048370121',
    status: 'valid',
    productName: 'Endoprótese Aórtica Abdominal Endurant II',
    manufacturer: 'Medtronic',
    category: 'Cirurgia Vascular / Endoprótese',
    validUntil: '2029-05-31',
  },
  {
    registration: '10380700999',
    status: 'invalid',
    productName: 'Prótese de Joelho — Modelo Legacy (descontinuado)',
    manufacturer: 'Fornecedor Genérico',
    category: 'Ortopedia / Prótese',
    validUntil: '2024-03-31',
  },
  {
    registration: '80102510888',
    status: 'invalid',
    productName: 'Stent Coronariano Convencional Geração Anterior',
    manufacturer: 'Fornecedor Genérico',
    category: 'Cardiologia / Stent',
    validUntil: '2023-12-31',
  },
  {
    registration: '10381440777',
    status: 'invalid',
    productName: 'Placa Reta de Aço Inox (linha descontinuada)',
    manufacturer: 'Fornecedor Genérico',
    category: 'Ortopedia / Osteossíntese',
    validUntil: '2024-09-30',
  },
  {
    registration: '80820100666',
    status: 'invalid',
    productName: 'Lente Intraocular Rígida PMMA (geração anterior)',
    manufacturer: 'Fornecedor Genérico',
    category: 'Oftalmologia / LIO',
    validUntil: '2023-05-31',
  },
];
