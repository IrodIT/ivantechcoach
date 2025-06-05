document.addEventListener('DOMContentLoaded', () => {
    const hamburgerButton = document.getElementById('hamburger-button');
    const closeMenuButton = document.getElementById('close-menu-button');
    const fullscreenMenu = document.getElementById('fullscreen-menu');
    const navLinks = fullscreenMenu.querySelectorAll('ul a[href^="#"]'); // For closing menu on nav link click
    const body = document.body;

    // Function to toggle menu visibility
    function toggleMenu() {
        const isMenuOpen = hamburgerButton.getAttribute('aria-expanded') === 'true' || false;
        hamburgerButton.setAttribute('aria-expanded', !isMenuOpen);
        hamburgerButton.classList.toggle('open');
        fullscreenMenu.toggleAttribute('hidden');
        fullscreenMenu.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (fullscreenMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    }

    // Event listener for hamburger button click
    if (hamburgerButton && fullscreenMenu) {
        hamburgerButton.addEventListener('click', toggleMenu);
    }

    // Event listener for close button click
    if (closeMenuButton && fullscreenMenu) {
        closeMenuButton.addEventListener('click', toggleMenu);
    }

    // Event listener to close menu when a navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (fullscreenMenu.classList.contains('active')) {
                toggleMenu();
            }
            // Close any open submenus when a main link is clicked
            closeAllSubmenus(null); // Pass null as we are not in a submenu click event
        });
    });

    // Submenu handling
    const submenuParentItems = fullscreenMenu.querySelectorAll('.has-submenu > a[role="button"]');

    function closeAllSubmenus(exceptThisSubmenuContent) {
        const allSubmenuContents = fullscreenMenu.querySelectorAll('.submenu');
        allSubmenuContents.forEach(submenuContent => {
            if (submenuContent !== exceptThisSubmenuContent && submenuContent.classList.contains('open')) {
                submenuContent.classList.remove('open');
                submenuContent.setAttribute('hidden', '');
                const parentLink = submenuContent.previousElementSibling;
                if (parentLink && parentLink.getAttribute('aria-expanded') === 'true') {
                    parentLink.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    submenuParentItems.forEach(item => {
        const submenuId = item.getAttribute('aria-controls');
        const submenuContent = document.getElementById(submenuId);

        if (submenuContent) {
            item.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent navigation for the parent link

                const isSubmenuOpen = item.getAttribute('aria-expanded') === 'true' || false;

                // If this submenu is not the one currently open, or if no submenu is open,
                // close all other submenus before opening this one.
                if (!isSubmenuOpen) {
                    closeAllSubmenus(submenuContent);
                }

                // Toggle current submenu
                item.setAttribute('aria-expanded', !isSubmenuOpen);
                submenuContent.classList.toggle('open');
                submenuContent.toggleAttribute('hidden');
            });
        }
    });

    // Optional: Close menu when clicking outside of it (on the overlay backdrop)
    // Note: This needs careful implementation if the menu content itself is part of the overlay.
    // For this setup, clicking the overlay itself (if not on a button/link) can close it.
    if (fullscreenMenu) {
        fullscreenMenu.addEventListener('click', function(e) {
            // If the click is directly on the overlay (not its children like .overlay-content)
            // This is a simple check; for more robust, check e.target === this
            if (e.target === fullscreenMenu && fullscreenMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    // Update current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Intersection Observer for scroll animations (fade-in sections)
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the item is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Optional: stop observing after it's visible
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        section.classList.add('animated-section'); // Class for initial state
        scrollObserver.observe(section);
    });
});
