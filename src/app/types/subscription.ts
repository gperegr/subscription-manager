export interface Subscription {
  id: string;
  name: string;
  category: string;
  cost: number;
  period: 'mensal' | 'anual' | 'semanal';
  usagePerPeriod: number;
}

export type SortOption = 'cost-desc' | 'cost-asc' | 'usage-cost' | 'alphabetical';

export const CATEGORIES = [
  'Streamings',
  'Softwares',
  'Educação',
  'Saúde',
  'Fitness',
  'Outros'
] as const;

export const PASTEL_COLORS = [
  '#B9CFFE', // Azul
  '#EDE1F5', // Roxo
  '#FFE0E1', // Rosa
  '#F4EFE6'  // Bege
] as const;
