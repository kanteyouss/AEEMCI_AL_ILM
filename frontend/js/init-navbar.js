// Navbar initialization function - reusable across all pages
function initNavbar() {
    const toggle = document.getElementById('alilm-toggle');
    const nav = document.getElementById('alilm-nav');
    const overlay = document.getElementById('alilm-overlay');

    if (toggle && nav && overlay) {
        function closeMenu() {
            nav.classList.remove('active');
            overlay.classList.remove('active');
            toggle.innerHTML = '☰';
            document.body.style.overflow = '';
        }

        function openMenu() {
            nav.classList.add('active');
            overlay.classList.add('active');
            toggle.innerHTML = '✕';
            document.body.style.overflow = 'hidden';
        }

        function toggleMenu(e) {
            e.stopPropagation();
            if (nav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        // Support both click and touch events
        toggle.addEventListener('click', toggleMenu);
        toggle.addEventListener('touchstart', function (e) {
            e.preventDefault();
            toggleMenu(e);
        });

        overlay.addEventListener('click', closeMenu);
        overlay.addEventListener('touchstart', function (e) {
            e.preventDefault();
            closeMenu();
        });

        // Mark current page as active
        const currentPath = window.location.pathname;
        nav.querySelectorAll('a').forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '/' && href === '/')) {
                link.classList.add('active');
            }
        });

        // Don't add click listeners to links - let them navigate naturally
        // The menu will close automatically when the page reloads
    }
}

// Load navbar and initialize
fetch('/components/navbar.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('navbar-root').innerHTML = html;
        initNavbar();

        // Apply dynamic visibility settings if api.js is loaded
        if (typeof applyGlobalNavConfig === 'function') {
            applyGlobalNavConfig();
        }
    });
