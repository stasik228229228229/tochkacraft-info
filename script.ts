declare const ScrollReveal: any;

interface MinecraftServerStatus {
    online: boolean;
    players: {
        online: number;
        max: number;
        list?: string[];
    };
}

interface Rule {
    text: string;
    isForbidden: boolean;
}

interface Guide {
    title: string;
    steps: string[];
}

interface ContentData {
    rules: Rule[];
    guides: Guide[];
}

document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.remove('no-js');

    const tabButtons = document.querySelectorAll<HTMLButtonElement>('.tab-button');
    const tabNav = document.querySelector<HTMLElement>('.tab-nav');
    const ipItems = document.querySelectorAll<HTMLDivElement>('.ip-item');
    const toast = document.getElementById('toast-notification') as HTMLDivElement;
    let toastTimer: number;
    const serverIp = 'mc.okoshkoproduction.fun';

    const preloader = document.getElementById('preloader') as HTMLDivElement;
    preloader.classList.add('fade-out');
    document.body.classList.add('loaded');

    const cursorDot = document.querySelector<HTMLDivElement>('.cursor-dot');
    const cursorOutline = document.querySelector<HTMLDivElement>('.cursor-outline');

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e: MouseEvent) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.style.left = `${e.clientX}px`;
            cursorOutline.style.top = `${e.clientY}px`;
        });
        document.addEventListener('mouseenter', () => {
            cursorDot.classList.remove('cursor-hidden');
            cursorOutline.classList.remove('cursor-hidden');
        });
        document.addEventListener('mouseleave', () => {
            cursorDot.classList.add('cursor-hidden');
            cursorOutline.classList.add('cursor-hidden');
        });
    }

    const fetchServerStatus = async (): Promise<void> => {
        const statusDot = document.querySelector<HTMLDivElement>('.status-dot');
        const statusText = document.querySelector<HTMLSpanElement>('.status-text');
        const playerListContainer = document.getElementById('player-list-container');

        if (!statusDot || !statusText || !playerListContainer) return;

        try {
            const response = await fetch(`https://api.mcsrvstat.us/2/${serverIp}`);
            const data: MinecraftServerStatus = await response.json();
            
            statusDot.className = 'status-dot';

            if (data.online) {
                statusDot.classList.add('online');
                statusText.textContent = `Онлайн: ${data.players.online} / ${data.players.max}`;

                if (data.players.online > 0 && data.players.list) {
                    let playerHtml = '<h4>Игроки на сервере:</h4>';
                    playerHtml += data.players.list.map(player => `<div class="player-item">${player}</div>`).join('');
                    playerListContainer.innerHTML = playerHtml;
                } else if (data.players.online > 0) {
                    playerListContainer.innerHTML = '<h4>Игроки на сервере:</h4><div class="player-item">Список игроков скрыт</div>';
                } else {
                    playerListContainer.innerHTML = '<div class="player-item">На сервере сейчас никого нет</div>';
                }
            } else {
                statusDot.classList.add('offline');
                statusText.textContent = 'Сервер оффлайн';
                playerListContainer.innerHTML = '<div class="player-item">Сервер сейчас выключен</div>';
            }
        } catch (error) {
            console.error('Ошибка при получении статуса сервера:', error);
            statusDot.className = 'status-dot offline';
            statusText.textContent = 'Ошибка статуса';
            playerListContainer.innerHTML = '<div class="player-item">Не удалось загрузить данные</div>';
        }
    };
    
    fetchServerStatus();
    setInterval(fetchServerStatus, 60000);

    const sr = ScrollReveal({
        distance: '20px',
        duration: 600,
        easing: 'ease-out',
        reset: false
    });

    const applyRevealAnimation = (container: HTMLElement): void => {
        const elements = container.querySelectorAll('h2, .rules-grid, .gallery, .accordion, .warning, .ip-list, .info-card, .creators-section');
        sr.reveal(elements, {
            origin: 'bottom',
            interval: 80
        });
    };

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!tabNav || tabNav.classList.contains('disabled')) return;

            const targetTabId = button.dataset.tab;
            if (!targetTabId) return;

            const targetContent = document.getElementById(targetTabId);
            const currentActiveButton = document.querySelector<HTMLButtonElement>('.tab-button.active');
            const currentActiveContent = document.querySelector<HTMLElement>('.tab-content.active');
            
            if (currentActiveButton === button || !targetContent || !currentActiveButton || !currentActiveContent) return;

            tabNav.classList.add('disabled');
            localStorage.setItem('lastTab', targetTabId);

            currentActiveButton.classList.remove('active');
            button.classList.add('active');
            currentActiveContent.classList.remove('active');
            
            sr.sync();

            targetContent.classList.add('active');
            applyRevealAnimation(targetContent);
            
            setTimeout(() => {
                tabNav.classList.remove('disabled');
            }, 800);
        });
    });

    const backgroundGlow = document.querySelector<HTMLDivElement>('.background-glow');
    if (backgroundGlow) {
        document.body.addEventListener('mousemove', (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const x = (clientX / innerWidth - 0.5) * 80;
            const y = (clientY / innerHeight - 0.5) * 80;
            backgroundGlow.style.setProperty('--parallax-x', `${-x}px`);
            backgroundGlow.style.setProperty('--parallax-y', `${-y}px`);
        });
    }

    const showToast = (message: string): void => {
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.classList.add('show');
        toastTimer = window.setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    ipItems.forEach(item => {
        item.addEventListener('click', () => {
            const ipAddress = item.textContent;
            if (!ipAddress) return;

            navigator.clipboard.writeText(ipAddress).then(() => {
                showToast('IP скопирован! Приятной игры!');
                item.classList.add('copied');
                setTimeout(() => item.classList.remove('copied'), 2000);
            }).catch(err => {
                console.error('Ошибка при копировании IP: ', err);
                showToast('Не удалось скопировать IP');
            });
        });
    });

    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
    }

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
    }

    const lastTab = localStorage.getItem('lastTab');
    if (lastTab && document.querySelector(`[data-tab="${lastTab}"]`)) {
        document.querySelector('.tab-button.active')?.classList.remove('active');
        document.querySelector('.tab-content.active')?.classList.remove('active');
        document.querySelector(`[data-tab="${lastTab}"]`)?.classList.add('active');
        document.getElementById(lastTab)?.classList.add('active');
    }

    const loadContent = async (): Promise<void> => {
        const rulesContainer = document.getElementById('rules-container');
        const guidesContainer = document.getElementById('guides-container');
        
        if (!rulesContainer || !guidesContainer || !tabNav) return;
        
        tabNav.classList.add('disabled');

        try {
            const response = await fetch('content.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const content: ContentData = await response.json();

            rulesContainer.innerHTML = content.rules.map(rule => `
                <div class="rule-card ${rule.isForbidden ? 'forbidden' : ''}">${rule.text}</div>
            `).join('');

            guidesContainer.innerHTML = content.guides.map((guide, index) => `
                <div class="guide-item">
                    <button class="guide-title" aria-expanded="false" aria-controls="guide-content-${index}">
                        ${guide.title}
                    </button>
                    <div class="guide-content" id="guide-content-${index}" aria-hidden="true">
                        <ol class="guide-steps">
                            ${guide.steps.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            `).join('');

            const guideItems = guidesContainer.querySelectorAll<HTMLDivElement>('.guide-item');
            guideItems.forEach(item => {
                const title = item.querySelector<HTMLButtonElement>('.guide-title');
                const contentEl = item.querySelector<HTMLDivElement>('.guide-content');
                if (!title || !contentEl) return;

                title.addEventListener('click', () => {
                    const isExpanded = title.getAttribute('aria-expanded') === 'true';
                    
                    title.setAttribute('aria-expanded', String(!isExpanded));
                    contentEl.setAttribute('aria-hidden', String(isExpanded));
                    item.classList.toggle('active', !isExpanded);

                    if (!isExpanded) {
                        contentEl.style.maxHeight = contentEl.scrollHeight + "px";
                    } else {
                        contentEl.style.maxHeight = '';
                    }
                });
            });
        } catch (error) {
            console.error("Не удалось загрузить контент:", error);
            const errorMessage = '<p>Не удалось загрузить контент. Пожалуйста, попробуйте обновить страницу позже.</p>';
            rulesContainer.innerHTML = errorMessage;
            guidesContainer.innerHTML = errorMessage;
        } finally {
            sr.sync();
            tabNav.classList.remove('disabled');
        }
    };

    loadContent().then(() => {
        const activeTab = document.querySelector<HTMLElement>('.tab-content.active');
        if (activeTab) {
            applyRevealAnimation(activeTab);
        }
    });
});