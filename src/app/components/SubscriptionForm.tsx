import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Subscription, CATEGORIES } from '../types/subscription';
import { CustomSelect } from './CustomSelect';

interface SubscriptionFormProps {
  subscription?: Subscription;
  onSubmit: (subscription: Omit<Subscription, 'id'>) => void;
  onCancel: () => void;
}

export function SubscriptionForm({ subscription, onSubmit, onCancel }: SubscriptionFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Streamings',
    cost: '',
    period: 'mensal' as const,
    usagePerPeriod: ''
  });

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        category: subscription.category,
        cost: subscription.cost.toString(),
        period: subscription.period,
        usagePerPeriod: subscription.usagePerPeriod.toString()
      });
    }
  }, [subscription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      category: formData.category,
      cost: parseFloat(formData.cost),
      period: formData.period,
      usagePerPeriod: parseInt(formData.usagePerPeriod) || 0
    });
  };

  return (
    <div className="min-h-screen flex items-start" style={{ backgroundColor: '#000000' }}>
      <div className="w-full max-w-md mx-auto px-4 py-6">
        <div
          className="w-full p-6 rounded-[24px]"
          style={{ backgroundColor: '#1A1C19' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-white"
              style={{ fontFamily: 'Bookmania, serif', fontSize: '1.75rem', fontWeight: 400 }}
            >
              {subscription ? 'Editar Assinatura' : 'Nova Assinatura'}
            </h2>
            <button
              onClick={onCancel}
              className="w-9 h-9 rounded-full bg-white/10 active:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" style={{ fontFamily: 'Boston, sans-serif' }}>
            <div>
              <label className="block text-white/70 mb-2 text-sm">Nome do Serviço</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl text-white border border-white/10 transition-colors focus:border-white/30 focus:outline-none"
                style={{ backgroundColor: '#080808', fontSize: '1rem' }}
                placeholder="Ex: Netflix, Spotify..."
              />
            </div>

            <div>
              <label className="block text-white/70 mb-2 text-sm">Categoria</label>
              <CustomSelect
                value={formData.category}
                onChange={(value) => setFormData({ ...formData, category: value })}
                options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 mb-2 text-sm">Valor</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl text-white border border-white/10 transition-colors focus:border-white/30 focus:outline-none"
                  style={{ backgroundColor: '#080808', fontSize: '1rem' }}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-2 text-sm">Período</label>
                <CustomSelect
                  value={formData.period}
                  onChange={(value) => setFormData({ ...formData, period: value as any })}
                  options={[
                    { value: 'mensal', label: 'Mensal' },
                    { value: 'anual', label: 'Anual' },
                    { value: 'semanal', label: 'Semanal' }
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 mb-2 text-sm">
                Quantas vezes usa no período? (opcional)
              </label>
              <input
                type="number"
                min="0"
                value={formData.usagePerPeriod}
                onChange={(e) => setFormData({ ...formData, usagePerPeriod: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl text-white border border-white/10 transition-colors focus:border-white/30 focus:outline-none"
                style={{ backgroundColor: '#080808', fontSize: '1rem' }}
                placeholder="Ex: 12 (vezes por mês)"
              />
              <p className="text-white/50 mt-2" style={{ fontSize: '0.8125rem' }}>
                Isso ajudará a calcular o custo por uso
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-white text-black active:bg-white/90 transition-colors"
                style={{ fontFamily: 'Boston, sans-serif', fontWeight: 600 }}
              >
                {subscription ? 'Salvar Alterações' : 'Adicionar Assinatura'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-3 rounded-full bg-white/10 text-white active:bg-white/20 transition-colors"
                style={{ fontFamily: 'Boston, sans-serif', fontWeight: 600 }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}