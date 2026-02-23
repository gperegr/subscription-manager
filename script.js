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
        const isTypeSelect = dropdown.dataset.id === 'type-select';

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

                // Special logic for Plan Type
                if (isTypeSelect) {
                    toggleMembersInput(option.dataset.value);
                }

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

// Logic for Plan Type Toggle
function setupPlanTypeToggle() {
    const buttons = document.querySelectorAll('.plan-type-btn');
    const hiddenInput = document.getElementById('sub-type');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.dataset.value;
            setPlanType(value);
        });
    });
}

function setPlanType(value) {
    const hiddenInput = document.getElementById('sub-type');
    const buttons = document.querySelectorAll('.plan-type-btn');
    const glider = document.getElementById('plan-type-glider');

    hiddenInput.value = value;
    toggleMembersInput(value);

    // Move glider
    if (glider) {
        glider.style.transform = value === 'family' ? 'translateX(100%)' : 'translateX(0)';
    }

    buttons.forEach(btn => {
        if (btn.dataset.value === value) {
            // Active State
            btn.classList.remove('text-white/50', 'hover:text-white');
            btn.classList.add('text-black');
        } else {
            // Inactive State
            btn.classList.remove('text-black');
            btn.classList.add('text-white/50', 'hover:text-white');
        }
    });
}

// Toggle Members Input Visibility
function toggleMembersInput(type) {
    const container = document.getElementById('members-container');
    const input = document.getElementById('sub-members');
    
    if (type === 'family') {
        container.classList.add('open');
        input.setAttribute('required', 'true');
        input.setAttribute('min', '2');
    } else {
        container.classList.remove('open');
        input.removeAttribute('required');
        input.removeAttribute('min');
        input.value = '';
    }
}

function setDropdownValue(dropdownId, value) {
    const hiddenInput = document.getElementById(dropdownId);
    if (!hiddenInput) return;
    const dropdown = hiddenInput.closest('.custom-select');
    if (!dropdown) return;
    const options = dropdown.querySelectorAll('.select-option');
    const label = dropdown.querySelector('.select-label');
    const isSortSelect = dropdown.dataset.id === 'sort-select';
    const isTypeSelect = dropdown.dataset.id === 'type-select';

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

        if (isTypeSelect) {
            toggleMembersInput(optionToSelect.dataset.value);
        }
    }
}

function setupNumericValidation() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === '-' || e.key === 'e') {
                e.preventDefault();
            }
        });
        input.addEventListener('input', () => {
            if (input.value < 0) input.value = Math.abs(input.value);
        });
    });
}

function setupCurrencyMask() {
    const input = document.getElementById('sub-price');
    
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value === '') {
            e.target.value = '';
            return;
        }
        
        const floatValue = parseFloat(value) / 100;
        e.target.value = floatValue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    });
}

const parseCurrencyInput = (value) => {
    if (!value) return 0;
    return parseFloat(value.replace(/\D/g, '')) / 100;
};

// Autocomplete Logic
const knownServices = [
    { name: 'Netflix', category: 'Streamings', icon: 'fa-brands fa-netflix' },
    { name: 'Spotify', category: 'Streamings', icon: 'fa-brands fa-spotify' },
    { name: 'Deezer', category: 'Streamings', icon: 'fa-brands fa-deezer' },
    { name: 'Apple Music', category: 'Streamings', icon: 'fa-brands fa-apple' },
    { name: 'YouTube Premium', category: 'Streamings', icon: 'fa-brands fa-youtube' },
    { name: 'Amazon Prime', category: 'Compras', icon: 'fa-brands fa-amazon' },
    { name: 'Apple TV+', category: 'Streamings', icon: 'fa-brands fa-apple' },
    { name: 'iCloud', category: 'Softwares', icon: 'fa-brands fa-apple' },
    { name: 'Google One', category: 'Softwares', icon: 'fa-brands fa-google' },
    { name: 'Microsoft 365', category: 'Softwares', icon: 'fa-brands fa-microsoft' },
    { name: 'Xbox Game Pass', category: 'Streamings', icon: 'fa-brands fa-xbox' },
    { name: 'Nintendo Switch Online', category: 'Streamings', icon: 'fa-brands fa-nintendo-switch' },
    { name: 'Adobe Creative Cloud', category: 'Softwares', icon: 'fa-brands fa-adobe' },
    { name: 'Dropbox', category: 'Softwares', icon: 'fa-brands fa-dropbox' },
    { name: 'PlayStation Plus', category: 'Streamings', icon: 'fa-brands fa-playstation' },
    { name: 'Steam', category: 'Streamings', icon: 'fa-brands fa-steam' },
    { name: 'Twitch', category: 'Streamings', icon: 'fa-brands fa-twitch' },
    { name: 'GitHub Copilot', category: 'Softwares', icon: 'fa-brands fa-github' },
    { name: 'ChatGPT Plus', category: 'Softwares', icon: 'fa-solid fa-robot' },
    { name: 'Canva', category: 'Softwares', icon: 'fa-brands fa-canva' },
    { name: 'Slack', category: 'Softwares', icon: 'fa-brands fa-slack' },
    { name: 'Discord Nitro', category: 'Softwares', icon: 'fa-brands fa-discord' },
    { name: 'Disney+', category: 'Streamings', icon: 'fa-brands fa-disney' },
    { name: 'HBO Max', category: 'Streamings', icon: 'fa-solid fa-tv' },
    { name: 'Paramount+', category: 'Streamings', icon: 'fa-solid fa-tv' },
    { name: 'Globoplay', category: 'Streamings', icon: 'fa-solid fa-play' },
    { name: 'Gympass', category: 'Fitness', icon: 'fa-solid fa-dumbbell' },
    { name: 'Smart Fit', category: 'Fitness', icon: 'fa-solid fa-dumbbell' },
    { name: 'Headspace', category: 'Saúde', icon: 'fa-solid fa-brain' },
    { name: 'Duolingo', category: 'Educação', icon: 'fa-solid fa-language' },
    { name: 'Alura', category: 'Educação', icon: 'fa-solid fa-code' },
    { name: 'Uber One', category: 'Outros', icon: 'fa-brands fa-uber' },
    { name: 'Rappi Prime', category: 'Outros', icon: 'fa-solid fa-motorcycle' },
    { name: 'Mercado Livre', category: 'Compras', icon: 'fa-solid fa-handshake' },
    { name: 'Kindle Unlimited', category: 'Educação', icon: 'fa-brands fa-amazon' },
    { name: 'iFood Club', category: 'Outros', icon: 'fa-solid fa-utensils' }
];

function setupNameAutocomplete() {
    const input = document.getElementById('sub-name');
    const suggestionsBox = document.getElementById('name-suggestions');

    if (!input || !suggestionsBox) return;

    input.addEventListener('input', () => {
        const value = input.value.toLowerCase();
        suggestionsBox.innerHTML = '';

        if (value.length < 1) {
            suggestionsBox.classList.add('hidden');
            return;
        }

        const matches = knownServices.filter(service => 
            service.name.toLowerCase().includes(value)
        );

        if (matches.length > 0) {
            suggestionsBox.classList.remove('hidden');
            matches.forEach(service => {
                const div = document.createElement('div');
                div.className = 'px-5 py-3 text-white/80 hover:bg-white/10 cursor-pointer flex items-center gap-3 transition-colors';
                div.innerHTML = `
                    <i class="${service.icon} w-5 text-center"></i>
                    <span>${service.name}</span>
                `;
                
                div.addEventListener('click', () => {
                    input.value = service.name;
                    suggestionsBox.classList.add('hidden');
                    
                    // Auto-select category if valid
                    if (service.category) {
                        setDropdownValue('sub-category', service.category);
                    }
                });

                suggestionsBox.appendChild(div);
            });
        } else {
            suggestionsBox.classList.add('hidden');
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.classList.add('hidden');
        }
    });
}

function setupFormPullDownBackGesture() {
    const formView = document.getElementById('form-view');
    if (!formView) return;

    const card = formView.querySelector('.w-full.p-6.rounded-\\[24px\\]');
    if (!card) return;

    let startY = 0;
    let startX = 0;
    let currentY = 0;
    let isTracking = false;
    let isVerticalGesture = false;
    const threshold = 95;
    const maxPull = 160;
    const interactiveSelector = 'input, button, select, textarea, .select-options, .select-option';

    const resetCard = () => {
        card.classList.remove('swiping');
        card.style.transition = 'transform 180ms ease, opacity 180ms ease';
        card.style.transform = 'translateY(0)';
        card.style.opacity = '1';
    };

    const onStart = (e) => {
        if (formView.classList.contains('hidden')) return;
        if (e.target.closest(interactiveSelector)) return;

        const point = e.type.includes('touch') ? e.touches[0] : e;
        startY = point.clientY;
        startX = point.clientX;
        currentY = 0;
        isTracking = true;
        isVerticalGesture = false;
        card.style.transition = 'none';
    };

    const onMove = (e) => {
        if (!isTracking) return;

        const point = e.type.includes('touch') ? e.touches[0] : e;
        const deltaY = point.clientY - startY;
        const deltaX = point.clientX - startX;

        if (deltaY <= 0) return;

        if (!isVerticalGesture) {
            if (Math.abs(deltaY) < 8) return;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                isTracking = false;
                resetCard();
                return;
            }
            isVerticalGesture = true;
        }

        if (window.scrollY > 0) return;

        if (e.cancelable) e.preventDefault();

        const resistedPull = Math.min(deltaY * 0.6, maxPull);
        currentY = resistedPull;
        card.style.transform = `translateY(${resistedPull}px)`;
        card.style.opacity = `${Math.max(0.7, 1 - (resistedPull / 500))}`;
    };

    const onEnd = () => {
        if (!isTracking) return;
        isTracking = false;

        if (currentY >= threshold) {
            resetCard();
            window.cancelEdit();
            return;
        }

        resetCard();
    };

    card.addEventListener('touchstart', onStart, { passive: true });
    card.addEventListener('touchmove', onMove, { passive: false });
    card.addEventListener('touchend', onEnd);
    card.addEventListener('touchcancel', onEnd);

    card.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove, { passive: false });
    window.addEventListener('mouseup', onEnd);
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
        usagePeriod: "monthly",
        type: "family",
        members: 4
    },
    {
        id: 2,
        name: "Spotify",
        category: "Streamings",
        price: 21.90,
        period: "monthly",
        usageCount: 30,
        usagePeriod: "monthly",
        type: "individual",
        members: 1
    },
    {
        id: 3,
        name: "Adobe Creative Cloud",
        category: "Softwares",
        price: 299.00,
        period: "monthly",
        usageCount: 12,
        usagePeriod: "monthly",
        type: "individual",
        members: 1
    },
    {
        id: 4,
        name: "Duolingo Plus",
        category: "Educação",
        price: 239.88,
        period: "yearly",
        usageCount: 25,
        usagePeriod: "yearly",
        type: "individual",
        members: 1
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

// Mapeamento de Ícones
const getSubscriptionIcon = (name, category) => {
    const lowerName = name.toLowerCase();

    // Marcas Específicas (Brands)
    if (lowerName.includes('netflix')) return 'fa-brands fa-netflix';
    if (lowerName.includes('spotify')) return 'fa-brands fa-spotify';
    if (lowerName.includes('deezer')) return 'fa-brands fa-deezer';
    if (lowerName.includes('youtube')) return 'fa-brands fa-youtube';
    if (lowerName.includes('amazon') || lowerName.includes('prime')) return 'fa-brands fa-amazon';
    if (lowerName.includes('apple') || lowerName.includes('icloud') || lowerName.includes('tv+')) return 'fa-brands fa-apple';
    if (lowerName.includes('google') || lowerName.includes('drive') || lowerName.includes('gemini') || lowerName.includes('youtube')) return 'fa-brands fa-google';
    if (lowerName.includes('microsoft') || lowerName.includes('office') || lowerName.includes('xbox') || lowerName.includes('game pass')) return 'fa-brands fa-microsoft';
    if (lowerName.includes('adobe') || lowerName.includes('photoshop') || lowerName.includes('illustrator')) return 'fa-brands fa-adobe';
    if (lowerName.includes('dropbox')) return 'fa-brands fa-dropbox';
    if (lowerName.includes('playstation') || lowerName.includes('psn')) return 'fa-brands fa-playstation';
    if (lowerName.includes('steam')) return 'fa-brands fa-steam';
    if (lowerName.includes('twitch')) return 'fa-brands fa-twitch';
    if (lowerName.includes('github')) return 'fa-brands fa-github';
    if (lowerName.includes('canva')) return 'fa-brands fa-canva';
    if (lowerName.includes('slack')) return 'fa-brands fa-slack';
    if (lowerName.includes('discord')) return 'fa-brands fa-discord';
    if (lowerName.includes('nintendo') || lowerName.includes('switch')) return 'fa-brands fa-nintendo-switch';
    if (lowerName.includes('chatgpt') || lowerName.includes('openai')) return 'fa-solid fa-robot';
    if (lowerName.includes('disney')) return 'fa-brands fa-disney';
    if (lowerName.includes('ifood')) return 'fa-solid fa-utensils';
    if (lowerName.includes('hbo') || lowerName.includes('max')) return 'fa-solid fa-tv';
    if (lowerName.includes('paramount')) return 'fa-solid fa-tv';
    if (lowerName.includes('globo') || lowerName.includes('telecine')) return 'fa-solid fa-play';
    if (lowerName.includes('duolingo')) return 'fa-solid fa-language';
    if (lowerName.includes('headspace') || lowerName.includes('calm')) return 'fa-solid fa-brain';
    if (lowerName.includes('alura') || lowerName.includes('udemy')) return 'fa-solid fa-code';

    // Ícones Genéricos por Categoria
    switch (category) {
        case 'Streamings': return 'fa-solid fa-film';
        case 'Softwares': return 'fa-solid fa-laptop-code';
        case 'Saúde': return 'fa-solid fa-heart-pulse';
        case 'Mercado': return 'fa-solid fa-basket-shopping';
        case 'Educação': return 'fa-solid fa-graduation-cap';
        case 'Compras': return 'fa-solid fa-bag-shopping';
        case 'Fitness': return 'fa-solid fa-dumbbell';
        default: return 'fa-solid fa-box-open'; // Outros
    }
};

// Cores pastéis baseadas no App.tsx
const PASTEL_COLORS = ['#B9CFFE', '#EDE1F5', '#FFE0E1', '#F4EFE6'];
const DARK_TEXT_COLORS = ['#091F4D', '#240D33', '#3D0A0C', '#2E2719'];
const PIE_COLORS = ['#091F4D', '#32528f', '#567abf', '#7f98cc', '#a5b6db', '#c8d1ea', '#2f3e63', '#4e5f90'];

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
    let costPerPerson = 0;

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

        // Se for família, o custo por uso é baseado na cota da pessoa (monthlyCost / members)
        let baseCostForUse = monthlyCost;
        if (sub.type === 'family' && sub.members > 1) {
            baseCostForUse = monthlyCost / sub.members;
        }
        costPerUse = baseCostForUse / usagesPerMonth;
    }

    // Cost per person logic
    if (sub.type === 'family' && sub.members > 1) {
        costPerPerson = monthlyCost / sub.members;
    } else {
        costPerPerson = monthlyCost;
    }

    return {
        monthlyCost,
        costPerUse,
        costPerPerson
    };
};

const updateOverviewDots = () => {
    const slider = document.getElementById('overview-slider');
    if (!slider) return;

    const dots = document.querySelectorAll('.overview-slider-hint .overview-dot');
    if (!dots || dots.length === 0) return;

    const index = Math.round(slider.scrollLeft / Math.max(slider.clientWidth, 1));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
};

const setupOverviewSlider = () => {
    const slider = document.getElementById('overview-slider');
    if (!slider) return;
    if (slider.dataset.ready === 'true') return;
    slider.dataset.ready = 'true';

    slider.addEventListener('scroll', updateOverviewDots, { passive: true });

    const dots = document.querySelectorAll('.overview-slider-hint .overview-dot');
    dots?.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            slider.scrollTo({
                left: slider.clientWidth * index,
                behavior: 'smooth'
            });
        });
    });

    let isDragging = false;
    let dragStartX = 0;
    let startScrollLeft = 0;

    slider.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        dragStartX = e.clientX;
        startScrollLeft = slider.scrollLeft;
        slider.classList.add('dragging');
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - dragStartX;
        slider.scrollLeft = startScrollLeft - deltaX;
    });

    const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        slider.classList.remove('dragging');
    };

    window.addEventListener('mouseup', endDrag);
    window.addEventListener('mouseleave', endDrag);

    updateOverviewDots();
};

const renderCategoryPie = (subs) => {
    const pieEl = document.getElementById('category-pie');
    const legendEl = document.getElementById('category-pie-legend');
    const emptyEl = document.getElementById('category-pie-empty');
    if (!pieEl || !legendEl || !emptyEl) return;

    const categoryTotals = {};
    let total = 0;

    subs.forEach(sub => {
        const monthly = calculateMetrics(sub).monthlyCost;
        categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + monthly;
        total += monthly;
    });

    const entries = Object.entries(categoryTotals)
        .filter(([, value]) => value > 0)
        .sort((a, b) => b[1] - a[1]);

    if (entries.length === 0 || total <= 0) {
        pieEl.style.background = 'conic-gradient(#000000 0deg 360deg)';
        legendEl.innerHTML = '';
        emptyEl.classList.remove('hidden');
        return;
    }

    emptyEl.classList.add('hidden');

    let currentDeg = 0;
    const gradientParts = [];

    entries.forEach(([, value], index) => {
        const percent = (value / total) * 100;
        const deg = (percent / 100) * 360;
        const color = PIE_COLORS[index % PIE_COLORS.length];
        const start = currentDeg;
        const end = currentDeg + deg;
        gradientParts.push(`${color} ${start}deg ${end}deg`);
        currentDeg = end;
    });

    pieEl.style.background = `conic-gradient(${gradientParts.join(', ')})`;

    legendEl.innerHTML = entries.map(([category, value], index) => {
        const percent = Math.round((value / total) * 100);
        const color = PIE_COLORS[index % PIE_COLORS.length];
        return `
            <div class="category-pie-item" title="${category}: ${percent}%">
                <span class="category-pie-color" style="background:${color};"></span>
                <span class="category-pie-label">${category} (${percent}%)</span>
            </div>
        `;
    }).join('');
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getUsageEfficiency = (sub) => {
    const periodDays = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365
    };

    const usagePeriod = sub.usagePeriod || sub.period;
    const paidPeriod = sub.period || 'monthly';
    const usageDays = periodDays[usagePeriod];
    const paidDays = periodDays[paidPeriod];

    const usageCount = Number(sub.usageCount) || 0;

    if (usageCount <= 0 || !usageDays || !paidDays) {
        return {
            hasData: false,
            score: 50,
            label: 'Sem dados de uso',
            tone: 'neutral'
        };
    }

    const usagesInPaidPeriod = usageCount * (paidDays / usageDays);
    const score = clamp((usagesInPaidPeriod / paidDays) * 100, 0, 100);

    if (score >= 80) {
        return {
            hasData: true,
            score,
            label: 'Bom aproveitamento',
            tone: 'good'
        };
    }

    if (score >= 40) {
        return {
            hasData: true,
            score,
            label: 'Aproveitamento moderado',
            tone: 'medium'
        };
    }

    return {
        hasData: true,
        score,
        label: 'Pouco aproveitamento',
        tone: 'bad'
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
        renderCategoryPie([]);
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
                <div class="flex items-center gap-2">
                    <h2 class="text-white font-bookmania text-2xl font-normal">
                        ${category}
                    </h2>
                    <span class="category-count-badge" aria-label="${subs.length} itens na categoria">${subs.length}</span>
                </div>
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
            const efficiency = getUsageEfficiency(sub);
            const iconClass = getSubscriptionIcon(sub.name, sub.category);
            // Contêiner principal do Card
            const cardContainer = document.createElement('div');
            cardContainer.className = `scroll-reveal swipe-container`;

            // Ajuste de apresentação de custo de uso e vezes (igual ao react App.tsx)
            let usageHtml = '';
            if (sub.usageCount > 0) {
                const usageLabel = usagePeriodLabels[sub.usagePeriod] || 'no período';
                
                // Ajusta o rótulo se for cálculo familiar
                const costPerUseLabel = (sub.type === 'family' && sub.members > 1) 
                    ? 'Custo/Uso (Pessoa):' 
                    : 'Custo por Uso:';

                usageHtml = `
                    <div class="flex justify-between items-baseline gap-2">
                        <span style="color: ${textColor}; opacity: 0.7; font-size: 0.8125rem;">Uso:</span>
                        <span style="color: ${textColor}; font-weight: 500; font-size: 0.9375rem;">${sub.usageCount}x ${usageLabel}</span>
                    </div>
                    <div class="flex justify-between items-baseline gap-2 pt-2 border-t border-black/10">
                        <span style="color: ${textColor}; opacity: 0.7; font-size: 0.8125rem;">${costPerUseLabel}</span>
                        <span style="color: ${textColor}; font-weight: 600; font-size: 1.125rem;">${formatCurrency(metrics.costPerUse)}</span>
                    </div>
                `;
            }

            // HTML para Custo por Pessoa (se for família)
            let familyHtml = '';
            if (sub.type === 'family' && sub.members > 1) {
                familyHtml = `
                    <div class="flex justify-between items-baseline gap-2">
                        <span style="color: ${textColor}; opacity: 0.7; font-size: 0.8125rem;">Por Pessoa (${sub.members}):</span>
                        <span style="color: ${textColor}; font-weight: 600; font-size: 0.9375rem;">${formatCurrency(metrics.costPerPerson)}</span>
                    </div>
                `;
            }

            const usageIndicatorHtml = efficiency.hasData ? `
                <div class="usage-indicator ${efficiency.tone}">
                    <div class="usage-indicator-header">
                        <span class="usage-indicator-badge">${efficiency.label}</span>
                        <span class="usage-indicator-value">${Math.round(efficiency.score)}%</span>
                    </div>
                    <div class="usage-indicator-track" role="img" aria-label="Indicador de custo por uso, esquerda pior e direita melhor">
                        <div class="usage-indicator-pointer" style="left: ${efficiency.score}%;"></div>
                    </div>
                    <div class="usage-indicator-legend">
                        <span>Pouco uso</span>
                        <span>Bom uso</span>
                    </div>
                </div>
            ` : '';

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
                    <h3 class="mb-3 font-bookmania flex items-center gap-2" style="color: ${textColor}; font-size: 1.375rem; font-weight: 400; line-height: 1.3;">
                        <i class="${iconClass} opacity-80 text-lg"></i>
                        <span>${sub.name}</span>
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
                        ${familyHtml}
                        ${usageHtml}
                    </div>
                    ${usageIndicatorHtml}
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
    renderCategoryPie(sortedSubs);
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

    const priceVal = parseCurrencyInput(document.getElementById('sub-price').value);
    if (priceVal <= 0) {
        const field = document.getElementById('sub-price');
        field.classList.remove('input-error');
        void field.offsetWidth;
        field.classList.add('input-error');
        field.addEventListener('input', () => field.classList.remove('input-error'), { once: true });
        return;
    }

    const usagePeriodVal = document.getElementById('sub-usage-period').value;
    const periodSelected = document.getElementById('sub-period').value;

    const newSub = {
        id: editingId ? editingId : Date.now(),
        name: document.getElementById('sub-name').value,
        category: document.getElementById('sub-category').value,
        price: priceVal,
        period: periodSelected,
        usageCount: document.getElementById('sub-usage-count').value ? parseInt(document.getElementById('sub-usage-count').value) : 0,
        usagePeriod: usagePeriodVal,
        type: document.getElementById('sub-type').value,
        members: document.getElementById('sub-members').value ? parseInt(document.getElementById('sub-members').value) : 1
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
        document.getElementById('sub-members').value = '';
    }

    saveSubscriptions();

    // Select elements do not automatically reset empty on some browsers manually set to initial
    setDropdownValue('sub-category', "Streamings");
    setDropdownValue('sub-period', "monthly");
    setDropdownValue('sub-usage-period', "monthly");
    setPlanType("individual");

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
    document.getElementById('sub-price').value = formatCurrency(sub.price);
    setDropdownValue('sub-period', sub.period);
    document.getElementById('sub-usage-count').value = sub.usageCount > 0 ? sub.usageCount : '';
    setDropdownValue('sub-usage-period', sub.usagePeriod || sub.period || 'monthly');
    setPlanType(sub.type || 'individual');
    document.getElementById('sub-members').value = sub.members > 1 ? sub.members : '';

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
    document.getElementById('sub-members').value = '';

    document.getElementById('form-title').innerText = 'Nova Assinatura';
    document.getElementById('submit-btn').innerText = 'Adicionar Assinatura';

    // force defaults
    setDropdownValue('sub-category', "Streamings");
    setDropdownValue('sub-period', "monthly");
    setDropdownValue('sub-usage-period', "monthly");
    setPlanType("individual");

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
    setupPlanTypeToggle();
    setupNumericValidation();
    setupCurrencyMask();
    setupNameAutocomplete();
    setupFormPullDownBackGesture();
    setupOverviewSlider();

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

