// Load HTML sections
document.addEventListener('DOMContentLoaded', function() {
    // Load all section content
    loadSection('nav-container', 'sections/navigation.html');
    loadSection('hero-container', 'sections/hero.html');
    loadSection('about-container', 'sections/about.html');
    loadSection('packages-container', 'sections/packages.html');
    loadSection('services-container', 'sections/services.html');
    loadSection('contact-container', 'sections/contact.html');
    loadSection('footer-container', 'sections/footer.html');
});

// Function to load HTML sections
function loadSection(containerId, sectionPath) {
    fetch(sectionPath)
        .then(response => response.text())
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
            
            // Initialize section-specific scripts after loading
            if (sectionPath === 'sections/navigation.html') {
                initMobileMenu();
            } else if (sectionPath === 'sections/hero.html') {
                initHeroSlideshow();
            } else if (sectionPath.includes('packages.html')) {
                initPackageToggles();
            }
        })
        .catch(error => console.error(`Error loading ${sectionPath}:`, error));
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && closeMobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.add('open');
        });
        
        closeMobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
        
        // Mobile Menu Links (close menu when clicked)
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        });
    }
}

// Package Toggle
function initPackageToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            content.classList.toggle('show');
            const icon = button.querySelector('svg');
            icon.classList.toggle('rotate-180');
        });
    });
}

// Hero Slideshow
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;
    
    function showSlide(n) {
        slides.forEach(slide => slide.style.opacity = '0');
        dots.forEach(dot => dot.classList.replace('bg-gray-500', 'bg-gray-200'));
        
        slides[n].style.opacity = '1';
        dots[n].classList.replace('bg-gray-200', 'bg-gray-500');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Initialize dots click events
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto slideshow
    setInterval(nextSlide, 5000);
}