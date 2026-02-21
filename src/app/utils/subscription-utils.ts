import { Subscription } from '../types/subscription';

export function getMonthlyCost(subscription: Subscription): number {
  switch (subscription.period) {
    case 'mensal':
      return subscription.cost;
    case 'anual':
      return subscription.cost / 12;
    case 'semanal':
      return subscription.cost * 4.33; // média de semanas por mês
    default:
      return subscription.cost;
  }
}

export function getCostPerUsage(subscription: Subscription): number {
  const monthlyCost = getMonthlyCost(subscription);
  if (subscription.usagePerPeriod === 0) return monthlyCost;
  
  const monthlyUsage = subscription.period === 'mensal' 
    ? subscription.usagePerPeriod
    : subscription.period === 'semanal'
    ? subscription.usagePerPeriod * 4.33
    : subscription.usagePerPeriod / 12;
    
  return monthlyCost / monthlyUsage;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function getPeriodLabel(period: string): string {
  switch (period) {
    case 'mensal':
      return '/mês';
    case 'anual':
      return '/ano';
    case 'semanal':
      return '/semana';
    default:
      return '';
  }
}
