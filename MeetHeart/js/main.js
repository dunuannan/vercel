/**
 * 「遇见」心理育人辅导员工作室 - 主要交互脚本
 * 功能：导航、动画、轮播、表单交互等
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // 全局变量
    // ========================================
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    const navMenu = document.getElementById('navMenu');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    
    // ========================================
    // 导航栏滚动效果
    // ========================================
    function handleScroll() {
        const scrollY = window.scrollY;
        
        // 导航栏样式变化
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // 返回顶部按钮显示/隐藏
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // 更新导航高亮
        updateActiveNav();
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // ========================================
    // 返回顶部
    // ========================================
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ========================================
    // 移动端菜单
    // ========================================
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
        
        // 切换汉堡菜单动画
        const spans = this.querySelectorAll('span');
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
    
    // 移动端下拉菜单
    const navDropdowns = document.querySelectorAll('.nav-dropdown');
    navDropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 1023) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // 点击链接关闭菜单
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 1023) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    });
    
    // ========================================
    // 搜索功能
    // ========================================
    searchBtn.addEventListener('click', function() {
        searchOverlay.classList.add('active');
        searchOverlay.querySelector('input').focus();
    });
    
    searchClose.addEventListener('click', function() {
        searchOverlay.classList.remove('active');
    });
    
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    });
    
    // ESC键关闭搜索
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchOverlay.classList.remove('active');
        }
    });
    
    // ========================================
    // 导航高亮更新
    // ========================================
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // ========================================
    // 数字滚动动画
    // ========================================
    const statNumbers = document.querySelectorAll('.stat-number[data-count], .stat-number-large[data-count]');
    
    function animateNumber(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2秒
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        element.classList.add('counting');
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                element.classList.remove('counting');
            }
            element.textContent = Math.floor(current);
        }, 16);
    }
    
    // 使用 Intersection Observer 触发动画
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (!element.classList.contains('counted')) {
                    element.classList.add('counted');
                    animateNumber(element);
                }
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => numberObserver.observe(num));
    
    // ========================================
    // 学生心声轮播
    // ========================================
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonials-dots .dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    let currentSlide = 0;
    const totalSlides = testimonialCards.length;
    let autoPlayTimer;
    
    function showSlide(index) {
        // 边界处理
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        currentSlide = index;
        
        // 更新卡片显示
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === currentSlide) {
                card.classList.add('active');
            }
        });
        
        // 更新指示点
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // 事件绑定
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoPlay();
        });
    });
    
    // 自动播放
    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, 6000);
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }
    
    // 鼠标悬停暂停
    const sliderContainer = document.querySelector('.testimonials-slider');
    sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    sliderContainer.addEventListener('mouseleave', startAutoPlay);
    
    // 启动自动播放
    startAutoPlay();
    
    // ========================================
    // 新闻 Tab 切换
    // ========================================
    const newsTabs = document.querySelectorAll('.news-tab');
    
    newsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            newsTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换内容的逻辑
            // 实际项目中会从服务器获取对应 tab 的数据
            const tabType = this.getAttribute('data-tab');
            console.log('切换到:', tabType);
        });
    });
    
    // ========================================
    // 滚动显示动画 (Intersection Observer)
    // ========================================
    const fadeElements = document.querySelectorAll('.pillar-card, .team-card, .resource-card, .achievement-card');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 添加延迟，实现错落动画
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });
    
    // ========================================
    // 平滑滚动 (兼容性处理)
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // 卡片悬停效果增强
    // ========================================
    const cards = document.querySelectorAll('.pillar-card, .team-card, .resource-card, .achievement-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });
    
    // ========================================
    // 图片懒加载 (简单实现)
    // ========================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // 降级处理
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
    
    // ========================================
    // 表单输入框焦点效果
    // ========================================
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // ========================================
    // 页面加载完成后的初始化
    // ========================================
    // 添加页面加载动画
    document.body.classList.add('loaded');
    
    // 初始调用一次滚动处理
    handleScroll();
    
    console.log('「遇见」心理育人辅导员工作室网站已加载完成');
});

// ========================================
// 工具函数
// ========================================

/**
 * 节流函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * 检测元素是否在视口中
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
