// Custom Dropdown Logic
function setupCustomDropdowns() {
    document.querySelectorAll('.custom-select').forEach(dropdown => {
        const button = dropdown.querySelector('.select-button');
        const label = button.querySelector('.select-label');
        const optionsMenu = dropdown.querySelector('.select-options');
        const options = optionsMenu.querySelectorAll('.select-option');
        const hiddenInput = dropdown.querySelector('input[type="hidden"]');
        const arrow = button.querySelector('.fa-chevron-down');

        const isSortSelect = dropdown.dataset.id === 'sort-select';

        // Fix: Ensure dropdown styles are correct
        if (isSortSelect) {
            optionsMenu.style.backgroundColor = '#F5F5F5';
            optionsMenu.style.border = '1px solid rgba(0, 0, 0, 0.05)';
        } else {
            optionsMenu.style.backgroundColor = '#1A1C19';
            optionsMenu.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        }
        optionsMenu.style.width = '100%';
        optionsMenu.style.zIndex = '100';

        // Toggle menu
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !optionsMenu.classList.contains('hidden');

            // Close all others
            document.querySelectorAll('.select-options').forEach(menu => menu.classList.add('hidden'));
            document.querySelectorAll('.select-button').forEach(btn => {
                const p = btn.closest('.custom-select');
                if (p && p.dataset.id === 'sort-select') {
                    btn.style.borderColor = 'rgba(0, 0, 0, 0.05)';
                } else {
                    btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });
            document.querySelectorAll('.fa-chevron-down').forEach(icon => icon.style.transform = 'rotate(0deg)');

            if (!isOpen) {
                optionsMenu.classList.remove('hidden');
                if (isSortSelect) {
                    button.style.borderColor = 'rgba(0, 0, 0, 0.2)';
                } else {
                    button.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }
                arrow.style.transform = 'rotate(180deg)';
            }
        });

        // Select option
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                // Update UI
                label.textContent = option.querySelector('span').textContent.trim();

                // Handle styles
                options.forEach(opt => {
                    if (isSortSelect) {
                        opt.style.color = 'rgba(0, 0, 0, 0.6)';
                    } else {
                        opt.style.color = 'rgba(255, 255, 255, 0.7)';
                    }
                    opt.classList.remove('font-semibold');
                    const check = opt.querySelector('.fa-check');
                    if (check) check.remove();
                });

                if (isSortSelect) {
                    option.style.color = '#000000';
                    option.innerHTML += ' <i class="fa-solid fa-check ml-2 text-black"></i>';
                } else {
                    option.style.color = '#FFFFFF';
                    option.innerHTML += ' <i class="fa-solid fa-check ml-2 text-white"></i>';
                }
                option.classList.add('font-semibold');

                // Update value
                hiddenInput.value = option.dataset.value;

                // Trigger change event if needed
                const event = new Event('change');
                hiddenInput.dispatchEvent(event);

                // Close dropdown
                optionsMenu.classList.add('hidden');
                if (isSortSelect) {
                    button.style.borderColor = 'rgba(0, 0, 0, 0.05)';
                } else {
                    button.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
                arrow.style.transform = 'rotate(0deg)';
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.select-options').forEach(menu => menu.classList.add('hidden'));
        document.querySelectorAll('.select-button').forEach(btn => {
            const p = btn.closest('.custom-select');
            if (p && p.dataset.id === 'sort-select') {
                btn.style.borderColor = 'rgba(0, 0, 0, 0.05)';
            } else {
                btn.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
        document.querySelectorAll('.fa-chevron-down').forEach(icon => icon.style.transform = 'rotate(0deg)');
    });
}

function setDropdownValue(dropdownId, value) {
    const hiddenInput = document.getElementById(dropdownId);
    if (!hiddenInput) return;
    const dropdown = hiddenInput.closest('.custom-select');
    if (!dropdown) return;
    const options = dropdown.querySelectorAll('.select-option');
    const label = dropdown.querySelector('.select-label');
    const isSortSelect = dropdown.dataset.id === 'sort-select';

    const optionToSelect = Array.from(options).find(opt => opt.dataset.value === value) || options[0];

    if (optionToSelect) {
        // Manually trigger the click logic without opening
        label.textContent = optionToSelect.querySelector('span').textContent.trim();

        options.forEach(opt => {
            if (isSortSelect) {
                opt.style.color = 'rgba(0, 0, 0, 0.6)';
            } else {
                opt.style.color = 'rgba(255, 255, 255, 0.7)';
            }
            opt.classList.remove('font-semibold');
            const check = opt.querySelector('.fa-check');
            if (check) check.remove();
        });

        if (isSortSelect) {
            optionToSelect.style.color = '#000000';
            optionToSelect.innerHTML += ' <i class="fa-solid fa-check ml-2 text-black"></i>';
        } else {
            optionToSelect.style.color = '#FFFFFF';
            optionToSelect.innerHTML += ' <i class="fa-solid fa-check ml-2 text-white"></i>';
        }
        optionToSelect.classList.add('font-semibold');

        hiddenInput.value = optionToSelect.dataset.value;
    }
}

// Estado inicial
// Constante para o LocalStorage
const STORAGE_KEY = '@subscription-manager:subs';
const SORT_KEY = '@subscription-manager:sort';

// Dados iniciais padrão (usados apenas na primeira vez)
const defaultSubscriptions = [
    {
        id: 1,
        name: "Netflix",
        category: "Streamings",
        price: 55.90,
        period: "monthly",
        usageCount: 20,
        usagePeriod: "monthly"
    },
    {
        id: 2,
        name: "Spotify",
        category: "Streamings",
        price: 21.90,
        period: "monthly",
        usageCount: 30,
        usagePeriod: "monthly"
    },
    {
        id: 3,
        name: "Adobe Creative Cloud",
        category: "Softwares",
        price: 299.00,
        period: "monthly",
        usageCount: 12,
        usagePeriod: "monthly"
    },
    {
        id: 4,
        name: "Duolingo Plus",
        category: "Educação",
        price: 239.88,
        period: "yearly",
        usageCount: 25,
        usagePeriod: "yearly"
    }
];

// Carregar do LocalStorage ou usar os padrões
let subscriptions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultSubscriptions;

// Função para salvar no LocalStorage
const saveSubscriptions = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
};

// Formatador de Moeda
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Traduções visuais
const periodTranslations = {
    'monthly': '/mês',
    'yearly': '/ano',
    'weekly': '/sem',
    'daily': '/dia'
};

const usagePeriodLabels = {
    'daily': 'por dia',
    'weekly': 'por semana',
    'monthly': 'por mês',
    'yearly': 'por ano'
};

// Cores pastéis baseadas no App.tsx
const PASTEL_COLORS = ['#B9CFFE', '#EDE1F5', '#FFE0E1', '#F4EFE6'];
const DARK_TEXT_COLORS = ['#091F4D', '#240D33', '#3D0A0C', '#2E2719'];

// Estado da interface
let editingId = null;
let currentSort = localStorage.getItem(SORT_KEY) || 'cost-desc';

// Gerenciamento de Telas
window.toggleView = (viewName) => {
    const mainView = document.getElementById('main-view');
    const formView = document.getElementById('form-view');

    const entering = viewName === 'form' ? formView : mainView;
    const leaving = viewName === 'form' ? mainView : formView;

    leaving.classList.remove('anim-enter');
    leaving.classList.add('anim-exit');

    setTimeout(() => {
        leaving.classList.add('hidden');
        leaving.classList.remove('anim-exit');

        entering.classList.remove('hidden');
        entering.classList.add('anim-enter');
    }, 280);
};

window.changeSort = (sortValue) => {
    currentSort = sortValue;
    localStorage.setItem(SORT_KEY, sortValue);
    window.renderSubscriptions(); // Call the wrapped renderSubscriptions
};

// Lógica de Cálculo aprimorada (unificando com uso e período original)
const calculateMetrics = (sub) => {
    let monthlyCost = 0;
    let costPerUse = 0;

    if (sub.period === 'monthly') monthlyCost = sub.price;
    else if (sub.period === 'yearly') monthlyCost = sub.price / 12;
    else if (sub.period === 'weekly') monthlyCost = sub.price * 4.33;

    if (sub.usageCount > 0) {
        // Cálculo adaptado: Se usagePeriod for igual ao period, calculamos por período (igual a App.tsx)
        let usagesPerMonth = 0;
        if (sub.usagePeriod === 'daily') usagesPerMonth = sub.usageCount * 30;
        else if (sub.usagePeriod === 'weekly') usagesPerMonth = sub.usageCount * 4.33;
        else if (sub.usagePeriod === 'monthly') usagesPerMonth = sub.usageCount;
        else if (sub.usagePeriod === 'yearly') usagesPerMonth = sub.usageCount / 12;

        costPerUse = monthlyCost / usagesPerMonth;
    }

    return {
        monthlyCost,
        costPerUse
    };
};

// Renderizar Lista e Totais
const renderSubscriptions = () => {
    const listEl = document.getElementById('subscriptions-list');
    const totalEl = document.getElementById('total-monthly-cost');

    listEl.innerHTML = '';
    let totalMonthlyCost = 0;

    if (subscriptions.length === 0) {
        listEl.innerHTML = `
            <div class="p-8 rounded-[24px] text-center" style="background-color: #1A1C19;">
                <p class="text-white/50 text-base">Nenhuma assinatura cadastrada ainda.</p>
                <p class="text-white/30 mt-2 text-sm">Clique em "Nova Assinatura" para começar</p>
            </div>
        `;
        totalEl.textContent = formatCurrency(0);
        return;
    }

    // Aplicar ordenação
    let sortedSubs = [...subscriptions];
    sortedSubs.sort((a, b) => {
        const metricsA = calculateMetrics(a);
        const metricsB = calculateMetrics(b);
        if (currentSort === 'cost-desc') return metricsB.monthlyCost - metricsA.monthlyCost;
        if (currentSort === 'cost-asc') return metricsA.monthlyCost - metricsB.monthlyCost;
        if (currentSort === 'use-desc') return metricsB.costPerUse - metricsA.costPerUse;
        if (currentSort === 'name-asc') return a.name.localeCompare(b.name);
        return 0;
    });

    // Agrupar assinaturas por categoria
    const groupedSubs = sortedSubs.reduce((acc, sub) => {
        if (!acc[sub.category]) acc[sub.category] = [];
        acc[sub.category].push(sub);

        const metrics = calculateMetrics(sub);
        totalMonthlyCost += metrics.monthlyCost;

        return acc;
    }, {});

    let categoryIndex = 0;

    // Renderizar cada grupo
    Object.entries(groupedSubs).forEach(([category, subs]) => {
        const colorIndex = categoryIndex % PASTEL_COLORS.length;
        const categoryColor = PASTEL_COLORS[colorIndex];
        const textColor = DARK_TEXT_COLORS[colorIndex];
        categoryIndex++;

        const categoryTotal = subs.reduce((sum, sub) => sum + calculateMetrics(sub).monthlyCost, 0);
        const categorySection = document.createElement('div');

        // Header da Categoria
        const categoryHTML = `
            <div class="flex justify-between items-end mb-3 ml-1">
                <h2 class="text-white font-bookmania text-2xl font-normal">
                    ${category}
                </h2>
                <span class="text-white/50 text-sm font-medium mb-1">
                    ${formatCurrency(categoryTotal)}
                </span>
            </div>
            <div class="space-y-3" id="cat-list-${category.replace(/[^a-zA-Z0-9]/g, '-')}" style="margin-bottom: 12px;"></div>
        `;
        categorySection.innerHTML = categoryHTML;
        listEl.appendChild(categorySection);

        const catListEl = categorySection.querySelector(`#cat-list-${category.replace(/[^a-zA-Z0-9]/g, '-')}`);

        // Cartões de Assinatura
        subs.forEach((sub) => {
            const metrics = calculateMetrics(sub);
            // Contêiner principal do Card
            const cardContainer = document.createElement('div');
            cardContainer.className = `scroll-reveal swipe-container`;

            // Ajuste de apresentação de custo de uso e vezes (igual ao react App.tsx)
            let usageHtml = '';
            if (sub.usageCount > 0) {
                const usageLabel = usagePeriodLabels[sub.usagePeriod] || 'no período';
                usageHtml = `
                    <div class="flex justify-between items-baseline gap-2">
                        <span style="color: ${textColor}; opacity: 0.7; font-size: 0.8125rem;">Uso:</span>
                        <span style="color: ${textColor}; font-weight: 500; font-size: 0.9375rem;">${sub.usageCount}x ${usageLabel}</span>
                    </div>
                    <div class="flex justify-between items-baseline gap-2 pt-2 border-t border-black/10">
                        <span style="color: ${textColor}; opacity: 0.7; font-size: 0.8125rem;">Custo por Uso:</span>
                        <span style="color: ${textColor}; font-weight: 600; font-size: 1.125rem;">${formatCurrency(metrics.costPerUse)}</span>
                    </div>
                `;
            }

            cardContainer.innerHTML = `
                <!-- Background Actions -->
                <div class="swipe-actions">
                    <div class="swipe-action-left">
                        <i class="fa-solid fa-pen"></i>
                    </div>
                    <div class="swipe-action-right">
                        <i class="fa-solid fa-trash"></i>
                    </div>
                </div>

                <!-- Swipeable Content -->
                <div class="swipe-content relative p-5 flex flex-col justify-between" style="background-color: ${categoryColor}; color: ${textColor}; min-height: 140px;">
                    <h3 class="mb-3 font-bookmania" style="color: ${textColor}; font-size: 1.375rem; font-weight: 400; line-height: 1.3;">
                        ${sub.name}
                    </h3>
                    <div class="space-y-2">
                        <div class="flex justify-between items-baseline gap-2">
                            <span style="color: ${textColor}; opacity: 0.7; font-size: 0.8125rem;">Custo Original:</span>
                            <span style="color: ${textColor}; font-weight: 500; font-size: 0.9375rem;">${formatCurrency(sub.price)}${periodTranslations[sub.period]}</span>
                        </div>
                        <div class="flex justify-between items-baseline gap-2">
                            <span style="color: ${textColor}; opacity: 0.7; font-size: 0.8125rem;">Custo Mensal:</span>
                            <span style="color: ${textColor}; font-weight: 600; font-size: 1.125rem;">${formatCurrency(metrics.monthlyCost)}</span>
                        </div>
                        ${usageHtml}
                    </div>
                </div>
            `;

            // Swipe Logic Attachments
            const swipeContent = cardContainer.querySelector('.swipe-content');
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            let isSwipingHorizontally = false;
            let startY = 0;
            const threshold = 100; // pixels to trigger action

            const handleStart = (e) => {
                isDragging = true;
                isSwipingHorizontally = false;

                if (e.type.includes('touch')) {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                } else {
                    startX = e.clientX;
                    startY = e.clientY;
                }

                swipeContent.classList.add('swiping');

                if (e.type.includes('pointer') || e.type.includes('mouse')) {
                    if (e.pointerId) swipeContent.setPointerCapture(e.pointerId);
                }
            };

            const handleMove = (e) => {
                if (!isDragging) return;

                const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

                const deltaX = clientX - startX;
                const deltaY = clientY - startY;

                // Determine scroll direction on first move
                if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
                    isSwipingHorizontally = true;
                }

                if (isSwipingHorizontally) {
                    // Prevent vertical scroll on mobile if swiping horizontally
                    if (e.cancelable) e.preventDefault();

                    currentX = deltaX;

                    // Add resistance when pulling
                    const resistance = 0.5;
                    const translateVal = currentX * resistance;

                    swipeContent.style.transform = `translateX(${translateVal}px)`;

                    // Opacity Logic
                    const progress = Math.min(Math.abs(translateVal) / threshold, 1);
                    const activeOpacity = 0.3 + (0.7 * progress);
                    const inactiveOpacity = 0.3 - (0.3 * progress);

                    const leftIcon = cardContainer.querySelector('.swipe-action-left i');
                    const rightIcon = cardContainer.querySelector('.swipe-action-right i');

                    if (translateVal > 0 && leftIcon) {
                        leftIcon.style.opacity = activeOpacity;
                        if (rightIcon) rightIcon.style.opacity = inactiveOpacity;
                    } else if (translateVal < 0 && rightIcon) {
                        rightIcon.style.opacity = activeOpacity;
                        if (leftIcon) leftIcon.style.opacity = inactiveOpacity;
                    }
                } else if (Math.abs(deltaY) > 10) {
                    // Let the browser scroll and cancel our swipe Drag
                    isDragging = false;
                    swipeContent.classList.remove('swiping');
                    swipeContent.style.transform = 'translateX(0)';
                    currentX = 0;
                }
            };

            const handleEnd = (e) => {
                if (!isDragging) return;
                isDragging = false;
                swipeContent.classList.remove('swiping');

                // Reset icon opacity
                cardContainer.querySelectorAll('.swipe-actions i').forEach(i => i.style.opacity = '');

                if (e.pointerId) swipeContent.releasePointerCapture(e.pointerId);

                const resistance = 0.5;
                const translateVal = currentX * resistance;

                if (translateVal > threshold) {
                    // Swipe Right -> Edit
                    swipeContent.style.transform = `translateX(100%)`; // Slide off visually
                    setTimeout(() => {
                        window.editSubscription(sub.id);
                        swipeContent.style.transform = ''; // Reset for when it re-renders
                    }, 200);
                } else if (translateVal < -threshold) {
                    // Swipe Left -> Delete
                    swipeContent.style.transform = `translateX(-100%)`; // Slide off visually
                    setTimeout(() => {
                        window.deleteSubscription(sub.id);
                    }, 200);
                } else {
                    // Snap back
                    swipeContent.style.transform = 'translateX(0)';
                }
                currentX = 0;
                isSwipingHorizontally = false;
            };

            // Unified handlers where possible, but distinct touch for better passive control
            swipeContent.addEventListener('touchstart', handleStart, { passive: false });
            swipeContent.addEventListener('touchmove', handleMove, { passive: false });
            swipeContent.addEventListener('touchend', handleEnd);
            swipeContent.addEventListener('touchcancel', handleEnd);

            swipeContent.addEventListener('mousedown', handleStart);
            window.addEventListener('mousemove', handleMove, { passive: false });
            window.addEventListener('mouseup', handleEnd);

            catListEl.appendChild(cardContainer);
        });
    });

    totalEl.textContent = formatCurrency(totalMonthlyCost);
};

// Adicionar / Editar Assinatura
document.getElementById('subscription-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const form = e.target;

    // Validação Visual
    if (!form.checkValidity()) {
        Array.from(form.elements).forEach(field => {
            if ((field.tagName === 'INPUT' || field.tagName === 'SELECT') && !field.checkValidity()) {
                field.classList.remove('input-error');
                void field.offsetWidth;
                field.classList.add('input-error');
                field.addEventListener('input', () => field.classList.remove('input-error'), { once: true });
            }
        });
        return;
    }

    const usagePeriodVal = document.getElementById('sub-usage-period').value;
    const periodSelected = document.getElementById('sub-period').value;

    const newSub = {
        id: editingId ? editingId : Date.now(),
        name: document.getElementById('sub-name').value,
        category: document.getElementById('sub-category').value,
        price: parseFloat(document.getElementById('sub-price').value),
        period: periodSelected,
        usageCount: document.getElementById('sub-usage-count').value ? parseInt(document.getElementById('sub-usage-count').value) : 0,
        usagePeriod: usagePeriodVal
    };

    if (editingId) {
        const index = subscriptions.findIndex(s => s.id === editingId);
        if (index !== -1) subscriptions[index] = newSub;
        cancelEdit();
    } else {
        subscriptions.push(newSub);
        document.getElementById('sub-name').value = '';
        document.getElementById('sub-price').value = '';
        document.getElementById('sub-usage-count').value = '';
    }

    saveSubscriptions();

    // Select elements do not automatically reset empty on some browsers manually set to initial
    setDropdownValue('sub-category', "Streamings");
    setDropdownValue('sub-period', "monthly");
    setDropdownValue('sub-usage-period', "monthly");

    toggleView('main');

    setTimeout(() => {
        window.renderSubscriptions();
    }, 280);
});

// Entrar no modo de edição
window.editSubscription = (id) => {
    const sub = subscriptions.find(s => s.id === id);
    if (!sub) return;

    document.getElementById('sub-name').value = sub.name;
    setDropdownValue('sub-category', sub.category);
    document.getElementById('sub-price').value = sub.price;
    setDropdownValue('sub-period', sub.period);
    document.getElementById('sub-usage-count').value = sub.usageCount > 0 ? sub.usageCount : '';
    setDropdownValue('sub-usage-period', sub.usagePeriod || sub.period || 'monthly');

    editingId = id;

    document.getElementById('form-title').innerText = 'Editar Assinatura';
    document.getElementById('submit-btn').innerText = 'Salvar Alterações';

    toggleView('form');
};

// Cancelar modo de edição
window.cancelEdit = () => {
    editingId = null;
    document.getElementById('sub-name').value = '';
    document.getElementById('sub-price').value = '';
    document.getElementById('sub-usage-count').value = '';

    document.getElementById('form-title').innerText = 'Nova Assinatura';
    document.getElementById('submit-btn').innerText = 'Adicionar Assinatura';

    // force defaults
    setDropdownValue('sub-category', "Streamings");
    setDropdownValue('sub-period', "monthly");
    setDropdownValue('sub-usage-period', "monthly");

    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    toggleView('main');
};

// Remover Assinatura
window.deleteSubscription = (id) => {
    subscriptions = subscriptions.filter(sub => sub.id !== id);
    saveSubscriptions();
    if (editingId === id) cancelEdit();
    window.renderSubscriptions();
};


// --- Initialization & Interactions ---

// MutationObserver to reveal cards as they are added to the list
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.1 });

const observeCards = () => {
    document.querySelectorAll('.scroll-reveal').forEach(card => observer.observe(card));
};

// Wrap renderSubscriptions to trigger observer
const baseRender = renderSubscriptions;
window.renderSubscriptions = () => {
    baseRender();
    observeCards();
};

document.addEventListener('DOMContentLoaded', () => {
    setupCustomDropdowns();

    // Setup sort input change
    const sortInput = document.getElementById('sort-input');
    if (sortInput) {
        sortInput.addEventListener('change', (e) => {
            window.changeSort(e.target.value);
        });
    }

    // Default values
    setDropdownValue('sub-category', "Streamings");
    setDropdownValue('sub-period', "monthly");
    setDropdownValue('sort-input', currentSort);

    // Initial render
    window.renderSubscriptions();
});
