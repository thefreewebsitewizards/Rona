// Load HTML sections
document.addEventListener('DOMContentLoaded', function() {
    // Track loaded sections
    let sectionsLoaded = 0;
    const totalSections = 7;
    
    // Function to check if all sections are loaded
    function checkAllSectionsLoaded() {
        sectionsLoaded++;
        if (sectionsLoaded === totalSections) {
            console.log('All sections loaded successfully');
            // Initialize smooth scrolling after all sections are loaded
            setTimeout(initSmoothScroll, 500);
            // Initialize package toggles after all sections are loaded
            setTimeout(initPackageToggles, 500);
            // Initialize image gallery after all sections are loaded
            setTimeout(initImageGallery, 500);
        }
    }
    
    // Load all section content
    loadSection('nav-container', 'sections/navigation.html', checkAllSectionsLoaded);
    loadSection('hero-container', 'sections/hero.html', checkAllSectionsLoaded);
    loadSection('about-container', 'sections/about.html', checkAllSectionsLoaded);
    loadSection('packages-container', 'sections/packages.html', checkAllSectionsLoaded);
    loadSection('services-container', 'sections/services.html', checkAllSectionsLoaded);
    loadSection('contact-container', 'sections/contact.html', checkAllSectionsLoaded);
    loadSection('footer-container', 'sections/footer.html', checkAllSectionsLoaded);
});

// Function to load HTML sections
// Modify the loadSection function to handle layout issues
function loadSection(containerId, sectionPath, callback) {
    fetch(sectionPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${sectionPath}: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            const container = document.getElementById(containerId);
            container.innerHTML = html;
            
            // Force layout recalculation
            container.offsetHeight;
            
            // Initialize section-specific scripts after loading
            if (sectionPath === 'sections/navigation.html') {
                initMobileMenu();
            } else if (sectionPath === 'sections/hero.html') {
                initHeroSlideshow();
            } else if (sectionPath === 'sections/packages.html') {
                // Force grid layout refresh
                setTimeout(() => {
                    const grid = container.querySelector('.grid');
                    if (grid) {
                        grid.style.display = 'none';
                        grid.offsetHeight; // Force reflow
                        grid.style.display = 'grid';
                    }
                }, 100);
            }
            
            // Call the callback to track loaded sections
            if (typeof callback === 'function') {
                callback();
            }
        })
        .catch(error => {
            console.error(`Error loading ${sectionPath}:`, error);
            if (typeof callback === 'function') {
                callback();
            }
        });
}

// Mobile Menu Toggle - Replace existing initMobileMenu function
// Simple Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        let isOpen = false;
        
        mobileMenuButton.addEventListener('click', () => {
            if (isOpen) {
                mobileMenu.style.display = 'none';
                isOpen = false;
            } else {
                mobileMenu.style.display = 'block';
                isOpen = true;
            }
        });
        
        // Close menu when clicking on links
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.style.display = 'none';
                isOpen = false;
            });
        });
    }
}

// Package Toggle
// Package Toggle
function initPackageToggles() {
    console.log('Initializing package toggles');
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    if (toggleButtons.length === 0) {
        console.warn('No toggle buttons found. Will retry in 500ms.');
        setTimeout(initPackageToggles, 500);
        return;
    }
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            if (!content) {
                console.error('Toggle content not found for button:', button);
                return;
            }
            
            content.classList.toggle('show');
            const icon = button.querySelector('svg');
            if (icon) {
                icon.classList.toggle('rotate-180');
            }
            
            // Update button text
            const textSpan = button.querySelector('span');
            if (textSpan) {
                textSpan.textContent = content.classList.contains('show') ? 'Hide details' : 'Show details';
            }
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

// Smooth Scrolling for Navigation Links
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const navHeight = document.querySelector('nav').offsetHeight;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only process if the href is not just '#'
            if(this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Calculate position accounting for the fixed header
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                    
                    // Smooth scroll to the target
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without scrolling
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
}

// Image Gallery Functionality
function initImageGallery() {
    console.log('Initializing image gallery');
    const mainImage = document.getElementById('main-image');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!mainImage || galleryItems.length === 0) {
        console.warn('Gallery elements not found. Will retry in 500ms.');
        setTimeout(initImageGallery, 500);
        return;
    }
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get the clicked thumbnail image
            const thumbnailImg = this.querySelector('img');
            if (!thumbnailImg) return;
            
            // Get image paths
            const mainImagePath = mainImage.src;
            const thumbnailImagePath = thumbnailImg.src;
            
            // Get image names
            const mainImageName = mainImagePath.substring(mainImagePath.lastIndexOf('/') + 1);
            const thumbnailImageName = thumbnailImagePath.substring(thumbnailImagePath.lastIndexOf('/') + 1);
            
            // Only swap if different images
            if (mainImageName !== thumbnailImageName) {
                // Add transition effects
                mainImage.style.transition = 'all 0.3s ease';
                mainImage.style.opacity = '0.7';
                mainImage.style.transform = 'scale(0.95)';
                thumbnailImg.style.transition = 'all 0.3s ease';
                thumbnailImg.style.opacity = '0.7';
                
                // Update data attribute
                this.setAttribute('data-image', mainImageName);
                
                setTimeout(() => {
                    // Swap the images
                    mainImage.src = thumbnailImagePath;
                    thumbnailImg.src = mainImagePath;
                    
                    // Restore visibility with animation
                    mainImage.style.opacity = '1';
                    mainImage.style.transform = 'scale(1)';
                    thumbnailImg.style.opacity = '1';
                    
                    // Add bounce effect to clicked thumbnail
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                }, 200);
            }
        });
    });
}

// Debug function to check if all sections are properly loaded
function debugSections() {
    const sections = ['nav-container', 'hero-container', 'about-container', 'packages-container', 'services-container', 'contact-container', 'footer-container'];
    
    sections.forEach(id => {
        const element = document.getElementById(id);
        console.log(`Section ${id}: ${element ? 'Loaded' : 'Not loaded'}`);
        if (element) {
            console.log(`  Content: ${element.innerHTML.substring(0, 50)}...`);
        }
    });
    
    // Check if navigation is sticky
    const nav = document.querySelector('nav');
    console.log(`Navigation: ${nav ? 'Found' : 'Not found'}`);
    if (nav) {
        console.log(`  Classes: ${nav.className}`);
        console.log(`  Position: ${window.getComputedStyle(nav).position}`);
        console.log(`  Z-index: ${window.getComputedStyle(nav).zIndex}`);
    }
}

// Run debug after a delay to ensure everything has loaded
setTimeout(debugSections, 2000);