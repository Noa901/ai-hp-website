document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownItems = document.querySelectorAll('.has-dropdown');
    const menuLinks = document.querySelectorAll('.nav-menu a:not(.has-dropdown > a)');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            // 切换汉堡按钮动画
            this.classList.toggle('active');
            // 切换body滚动
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // 移动端下拉菜单处理
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        const dropdownMenu = item.querySelector('.dropdown-menu');
        
        // 添加动画类
        if (dropdownMenu) {
            dropdownMenu.classList.add('fade-in');
        }
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                // 只有当链接是下拉菜单的父链接时才阻止默认行为
                if (this.parentElement.classList.contains('has-dropdown')) {
                    e.preventDefault();
                    
                    dropdownItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    item.classList.toggle('active');
                }
            }
        });
    });

    // 点击菜单链接后自动关闭移动端菜单
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
                document.body.style.overflow = '';
                
                // 关闭所有下拉菜单
                dropdownItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    });

    // 点击页面其他区域关闭移动端菜单
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                menuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                dropdownItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        }
    });

    // 轮播图功能
    const slides = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoplayInterval;

    // 显示指定索引的幻灯片
    function showSlide(idx) {
        const carousel = document.querySelector('.carousel-inner');
        carousel.style.transform = `translateX(-${idx * 100}%)`;
        
        // 更新分页器状态
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === idx);
        });
        
        currentIndex = idx;
    }

    // 自动播放功能
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            showSlide(currentIndex);
        }, 4000);
    }

    // 停止自动播放
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // 点击分页器切换幻灯片
    window.goToSlide = function(idx) {
        stopAutoplay(); // 停止自动播放
        showSlide(idx);
        startAutoplay(); // 重新开始自动播放
    };

    // 触摸事件处理
    const carousel = document.querySelector('.carousel');
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoplay();
    }, false);

    carousel.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    }, false);

    carousel.addEventListener('touchend', () => {
        const difference = touchStartX - touchEndX;
        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                currentIndex = (currentIndex + 1) % totalSlides;
            } else {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            }
            showSlide(currentIndex);
        }
        startAutoplay();
    }, false);

    // 初始化轮播图
    if (slides.length > 0) {
        showSlide(0);
        startAutoplay();
    }

    // 研究卡片动画
    const cards = document.querySelectorAll('.research-card');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));

    // Smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;

            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - navHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    });
}); 