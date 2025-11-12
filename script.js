document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const container = document.querySelector('.container');
    const ipItems = document.querySelectorAll('.ip-item');
    const toast = document.getElementById('toast-notification');
    let toastTimer;

    const preloader = document.getElementById('preloader');
    preloader.classList.add('fade-out');
    document.body.classList.add('loaded');

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    window.addEventListener('mousemove', (e) => {
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

    const serverIp = 'mc.okoshkoproduction.fun';
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    async function fetchServerStatus() {
        try {
            const response = await fetch(`https://api.mcsrvstat.us/2/${serverIp}`);
            const data = await response.json();
            statusDot.classList.remove('loading');
            if (data.online) {
                statusDot.classList.add('online');
                statusText.textContent = `Онлайн: ${data.players.online} / ${data.players.max}`;
            } else {
                statusDot.classList.add('offline');
                statusText.textContent = 'Сервер оффлайн';
            }
        } catch (error) {
            console.error('Ошибка при получении статуса сервера:', error);
            statusDot.classList.remove('loading');
            statusDot.classList.add('offline');
            statusText.textContent = 'Ошибка статуса';
        }
    }
    fetchServerStatus();

    const sr = ScrollReveal({
        distance: '30px',
        duration: 800,
        easing: 'ease-out',
        reset: false
    });

    function applyScrollReveal(container) {
        const elements = container.querySelectorAll('h2, .recommendations-grid, .rules-grid, .gallery, .accordion, .warning, .callout-note, .ip-list');
        sr.reveal(elements, {
            origin: 'bottom',
            interval: 100,
            cleanup: true 
        });
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.dataset.tab;
            const targetContent = document.getElementById(targetTabId);
            const currentActiveButton = document.querySelector('.tab-button.active');
            const currentActiveContent = document.querySelector('.tab-content.active');
            if (currentActiveButton === button) return;

            currentActiveButton.classList.remove('active');
            button.classList.add('active');

            if (currentActiveContent) {
                currentActiveContent.classList.remove('active');
                targetContent.classList.add('active');
                applyScrollReveal(targetContent);
            }
        });
    });

    if (container) {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            container.style.setProperty('--mouse-x', `${x}px`);
            container.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    function showToast(message) {
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.classList.add('show');
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    ipItems.forEach(item => {
        item.addEventListener('click', () => {
            const ipAddress = item.textContent;
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

    const guideItems = document.querySelectorAll('.guide-item');
    guideItems.forEach(item => {
        const title = item.querySelector('.guide-title');
        const content = item.querySelector('.guide-content');
        title.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                item.classList.remove('active');
                content.style.maxHeight = null;
            }
        });
    });

    applyScrollReveal(document.querySelector('.tab-content.active'));
});