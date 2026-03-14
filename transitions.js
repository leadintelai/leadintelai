document.addEventListener('DOMContentLoaded', () => {
    // Create the overlay div if it doesn't exist
    if (!document.querySelector('.page-transition-overlay')) {
        const overlay = document.createElement('div');
        overlay.classList.add('page-transition-overlay');
        document.body.appendChild(overlay);
    }

    const overlay = document.querySelector('.page-transition-overlay');
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        // Only apply to internal links, excluding anchors, target="_blank", and external domains
        const href = link.getAttribute('href');
        const isInternal = href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:');
        const isNewTab = link.getAttribute('target') === '_blank';

        if (isInternal && !isNewTab) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetUrl = href;

                // Activate overlay (fade out effect)
                overlay.classList.add('active');

                // Navigate after transition duration (matched with CSS transition: 0.5s)
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 500);
            });
        }
    });
});
