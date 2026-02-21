import { useState, useMemo } from 'react';
import { Plus, ArrowUpDown } from 'lucide-react';
import { Subscription, SortOption, PASTEL_COLORS } from './types/subscription';
import { SubscriptionCard } from './components/SubscriptionCard';
import { SubscriptionForm } from './components/SubscriptionForm';
import { CustomSelect } from './components/CustomSelect';
import { getMonthlyCost, getCostPerUsage, formatCurrency } from './utils/subscription-utils';

function App() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: '1',
      name: 'Netflix',
      category: 'Streamings',
      cost: 55.90,
      period: 'mensal',
      usagePerPeriod: 20
    },
    {
      id: '2',
      name: 'Spotify',
      category: 'Streamings',
      cost: 21.90,
      period: 'mensal',
      usagePerPeriod: 30
    },
    {
      id: '3',
      name: 'Adobe Creative Cloud',
      category: 'Softwares',
      cost: 299.00,
      period: 'mensal',
      usagePerPeriod: 12
    },
    {
      id: '4',
      name: 'Duolingo Plus',
      category: 'Educação',
      cost: 239.88,
      period: 'anual',
      usagePerPeriod: 25
    },
    {
      id: '5',
      name: 'Academia SmartFit',
      category: 'Fitness',
      cost: 89.90,
      period: 'mensal',
      usagePerPeriod: 12
    }
  ]);

  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>();
  const [sortOption, setSortOption] = useState<SortOption>('alphabetical');

  const totalMonthlySpend = useMemo(() => {
    return subscriptions.reduce((total, sub) => total + getMonthlyCost(sub), 0);
  }, [subscriptions]);

  const sortedAndGroupedSubscriptions = useMemo(() => {
    let sorted = [...subscriptions];

    switch (sortOption) {
      case 'cost-desc':
        sorted.sort((a, b) => getMonthlyCost(b) - getMonthlyCost(a));
        break;
      case 'cost-asc':
        sorted.sort((a, b) => getMonthlyCost(a) - getMonthlyCost(b));
        break;
      case 'usage-cost':
        sorted.sort((a, b) => getCostPerUsage(b) - getCostPerUsage(a));
        break;
      case 'alphabetical':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    // Group by category
    const grouped: Record<string, Subscription[]> = {};
    sorted.forEach((sub) => {
      if (!grouped[sub.category]) {
        grouped[sub.category] = [];
      }
      grouped[sub.category].push(sub);
    });

    return grouped;
  }, [subscriptions, sortOption]);

  const handleAddOrEdit = (data: Omit<Subscription, 'id'>) => {
    if (editingSubscription) {
      setSubscriptions(subs =>
        subs.map(sub =>
          sub.id === editingSubscription.id
            ? { ...data, id: editingSubscription.id }
            : sub
        )
      );
    } else {
      setSubscriptions(subs => [
        ...subs,
        { ...data, id: Date.now().toString() }
      ]);
    }
    setView('list');
    setEditingSubscription(undefined);
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setView('form');
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta assinatura?')) {
      setSubscriptions(subs => subs.filter(sub => sub.id !== id));
    }
  };

  const handleCancel = () => {
    setView('list');
    setEditingSubscription(undefined);
  };

  if (view === 'form') {
    return (
      <SubscriptionForm
        subscription={editingSubscription}
        onSubmit={handleAddOrEdit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div 
          className="p-8 rounded-[32px] mb-6"
          style={{ 
            backgroundColor: '#1A1C19',
            minHeight: '380px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div className="mb-8">
            <div className="mb-8">
              <p className="text-white/50 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
                Gasto Total Mensal
              </p>
              <p 
                className="text-white"
                style={{ fontFamily: 'Cambo, serif', fontSize: '3.5rem', fontWeight: 400, lineHeight: 1 }}
              >
                {formatCurrency(totalMonthlySpend)}
              </p>
            </div>

            <button
              onClick={() => setView('form')}
              className="w-full px-6 py-4 rounded-full bg-white text-black hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '1rem' }}
            >
              <Plus className="w-5 h-5" />
              Nova Assinatura
            </button>
          </div>

          <div>
            <label className="text-white/50 text-sm mb-3 block" style={{ fontFamily: 'Inter, sans-serif' }}>
              Ordenar por
            </label>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-white/50 flex-shrink-0" />
              <CustomSelect
                value={sortOption}
                onChange={(value) => setSortOption(value as SortOption)}
                options={[
                  { value: 'alphabetical', label: 'Ordem Alfabética' },
                  { value: 'cost-desc', label: 'Maior Custo Mensal' },
                  { value: 'cost-asc', label: 'Menor Custo Mensal' },
                  { value: 'usage-cost', label: 'Maior Custo por Uso' }
                ]}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <div 
            className="p-8 rounded-[24px] text-center"
            style={{ backgroundColor: '#1A1C19' }}
          >
            <p className="text-white/50" style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem' }}>
              Nenhuma assinatura cadastrada ainda.
            </p>
            <p className="text-white/30 mt-2" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
              Clique em "Nova Assinatura" para começar
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(sortedAndGroupedSubscriptions).map(([category, subs], categoryIndex) => {
              const categoryColor = PASTEL_COLORS[categoryIndex % PASTEL_COLORS.length];
              
              return (
                <div key={category}>
                  <h2 
                    className="text-white mb-3 ml-1"
                    style={{ fontFamily: 'Cambo, serif', fontSize: '1.5rem', fontWeight: 400 }}
                  >
                    {category}
                  </h2>
                  <div className="space-y-3">
                    {subs.map((subscription) => (
                      <SubscriptionCard
                        key={subscription.id}
                        subscription={subscription}
                        color={categoryColor}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;