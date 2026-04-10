import { type ModuloType } from '../types';

export const moduloLabels: Record<ModuloType, string> = {
  internacao: 'Internação Hospitalar',
  urgencia: 'Urgência/Emergência',
  oncologia: 'Oncologia',
  terapias: 'Terapias Especiais',
  opme: 'OPME',
  exames: 'Exames de Alta Complexidade',
  cirurgias: 'Cirurgia Eletiva',
  homecare: 'Home Care',
};

export const getStep3Label = (modulo: ModuloType | ''): string => {
  switch (modulo) {
    case 'cirurgias':
      return 'Procedimentos e OPME';
    case 'internacao':
      return 'Acomodação e Diárias';
    case 'urgencia':
      return 'Classificação de Risco';
    case 'oncologia':
      return 'Protocolo Oncológico';
    case 'terapias':
      return 'Sessões de Terapia';
    case 'opme':
      return 'Materiais e OPME';
    case 'exames':
      return 'Exames Solicitados';
    case 'homecare':
      return 'Cuidados Domiciliares';
    default:
      return 'Procedimentos';
  }
};
