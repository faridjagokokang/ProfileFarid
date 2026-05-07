document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('porto_current_user')) {
        const bs = document.getElementById('boot-screen');
        if (bs) bs.style.display = 'none';
        return;
    }

    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');

    if (!bootScreen || !bootText) return;

    const sequence = [
        "SYSTEM BOOT INITIATED...",
        "LOADING KERNEL... [OK]",
        "MOUNTING VFS... [OK]",
        "INITIALIZING PROTOCOLS...",
        "CONNECTING TO SERVER... [ESTABLISHED]",
        "BYPASSING SECURITY FIREWALL...",
        "ACCESS GRANTED."
    ];

    let i = 0;
    function printLine() {
        if (i < sequence.length) {
            const p = document.createElement('p');
            p.textContent = "> " + sequence[i];
            bootText.appendChild(p);
            i++;
            setTimeout(printLine, Math.random() * 250 + 100);
        } else {
            setTimeout(() => {
                bootScreen.style.opacity = '0';
                setTimeout(() => bootScreen.style.display = 'none', 500);
            }, 800);
        }
    }

    setTimeout(printLine, 300);
});
