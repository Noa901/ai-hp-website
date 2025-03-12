// Publications Filter
document.addEventListener('DOMContentLoaded', function() {
    const yearFilter = document.getElementById('year-filter');
    const categoryFilter = document.getElementById('category-filter');
    const authorFilter = document.getElementById('author-filter');
    const publicationCards = document.querySelectorAll('.publication-card');

    // Filter functionality
    function filterPublications() {
        const selectedYear = yearFilter.value;
        const selectedCategory = categoryFilter.value;
        const selectedAuthor = authorFilter.value;

        publicationCards.forEach(card => {
            const year = card.getAttribute('data-year');
            const category = card.getAttribute('data-category');
            const author = card.getAttribute('data-author');

            const yearMatch = selectedYear === 'all' || year === selectedYear;
            const categoryMatch = selectedCategory === 'all' || category === selectedCategory;
            const authorMatch = selectedAuthor === 'all' || author === selectedAuthor;

            if (yearMatch && categoryMatch && authorMatch) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        // Show/hide no results message
        const noResultsMsg = document.querySelector('.no-results-message');
        const hasVisibleCards = Array.from(publicationCards).some(card => card.style.display !== 'none');

        if (!hasVisibleCards) {
            if (!noResultsMsg) {
                const msg = document.createElement('div');
                msg.className = 'no-results-message';
                msg.innerHTML = '<i class="fas fa-search"></i> 該当する論文が見つかりませんでした。';
                document.querySelector('.publications-grid').appendChild(msg);
                setTimeout(() => {
                    msg.style.opacity = '1';
                }, 10);
            }
        } else if (noResultsMsg) {
            noResultsMsg.style.opacity = '0';
            setTimeout(() => {
                noResultsMsg.remove();
            }, 300);
        }
    }

    // Add event listeners
    yearFilter.addEventListener('change', filterPublications);
    categoryFilter.addEventListener('change', filterPublications);
    authorFilter.addEventListener('change', filterPublications);

    // Smooth scroll to anchor points
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    // Handle all internal anchor links
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#') || href.includes(window.location.pathname)) {
                const hash = href.includes('#') ? href.substring(href.indexOf('#')) : null;
                if (hash) {
                    const targetElement = document.querySelector(hash);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        history.pushState(null, null, hash);
                    }
                }
            }
        });
    });

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownItems = document.querySelectorAll('.has-dropdown');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Handle dropdown menus
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        const dropdown = item.querySelector('.dropdown-menu');

        if (window.innerWidth <= 768) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                item.classList.toggle('active');
                
                // Close other dropdowns
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            dropdownItems.forEach(item => item.classList.remove('active'));
        }
    });
}); 