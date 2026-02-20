// Mobile scroll highlight effect
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth < 768) {
        let activeCard = null;

        const observerOptions = {
            root: null,
            rootMargin: '-45% 0px -45% 0px', // Target center of the screen
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (activeCard) {
                        activeCard.classList.remove('mobile-active');
                    }
                    activeCard = entry.target;
                    activeCard.classList.add('mobile-active');
                }
            });
        }, observerOptions);

        const selectors = [
            '#responsibilities .group',
            '#skills .group',
            '#projects .project-card',
            '#personal-projects .project-card',
            '#soft-skills .group'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(card => {
                observer.observe(card);
            });
        });
    }
});
