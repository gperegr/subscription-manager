import { Pencil, Trash2 } from 'lucide-react';
import { Subscription } from '../types/subscription';
import { getMonthlyCost, getCostPerUsage, formatCurrency, getPeriodLabel } from '../utils/subscription-utils';

interface SubscriptionCardProps {
  subscription: Subscription;
  color: string;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export function SubscriptionCard({ subscription, color, onEdit, onDelete }: SubscriptionCardProps) {
  const monthlyCost = getMonthlyCost(subscription);
  const costPerUsage = getCostPerUsage(subscription);

  return (
    <div 
      className="relative p-5 rounded-[24px] transition-transform active:scale-[0.98]"
      style={{ backgroundColor: color }}
    >
      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={() => onEdit(subscription)}
          className="w-9 h-9 rounded-full bg-black/10 active:bg-black/20 flex items-center justify-center transition-colors"
          style={{ color: '#1A1C19' }}
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(subscription.id)}
          className="w-9 h-9 rounded-full bg-black/10 active:bg-black/20 flex items-center justify-center transition-colors"
          style={{ color: '#1A1C19' }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="pr-24">
        <h3 
          className="mb-3"
          style={{ 
            color: '#1A1C19',
            fontFamily: 'Cambo, serif',
            fontSize: '1.375rem',
            fontWeight: 400,
            lineHeight: 1.3
          }}
        >
          {subscription.name}
        </h3>

        <div className="space-y-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          <div className="flex justify-between items-baseline gap-2">
            <span style={{ color: '#1A1C19', opacity: 0.7, fontSize: '0.8125rem' }}>
              Custo Original:
            </span>
            <span style={{ color: '#1A1C19', fontWeight: 500, fontSize: '0.9375rem' }}>
              {formatCurrency(subscription.cost)}{getPeriodLabel(subscription.period)}
            </span>
          </div>

          <div className="flex justify-between items-baseline gap-2">
            <span style={{ color: '#1A1C19', opacity: 0.7, fontSize: '0.8125rem' }}>
              Custo Mensal:
            </span>
            <span style={{ color: '#1A1C19', fontWeight: 600, fontSize: '1.125rem' }}>
              {formatCurrency(monthlyCost)}
            </span>
          </div>

          {subscription.usagePerPeriod > 0 && (
            <>
              <div className="flex justify-between items-baseline gap-2">
                <span style={{ color: '#1A1C19', opacity: 0.7, fontSize: '0.8125rem' }}>
                  Uso no período:
                </span>
                <span style={{ color: '#1A1C19', fontWeight: 500, fontSize: '0.9375rem' }}>
                  {subscription.usagePerPeriod}x
                </span>
              </div>

              <div className="flex justify-between items-baseline gap-2 pt-2 border-t border-black/10">
                <span style={{ color: '#1A1C19', opacity: 0.7, fontSize: '0.8125rem' }}>
                  Custo por Uso:
                </span>
                <span style={{ color: '#1A1C19', fontWeight: 600, fontSize: '1.125rem' }}>
                  {formatCurrency(costPerUsage)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}