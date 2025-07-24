// Load HTML sections
document.addEventListener('DOMContentLoaded', function() {
    // Track loaded sections
    let sectionsLoaded = 0;
    const totalSections = 7;
    
    // Function to check if all sections are loaded
    // In the checkAllSectionsLoaded function (around line 10)
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
            // Initialize contact form after all sections are loaded
            setTimeout(initContactForm, 500);
            // Add this line to ensure hero slideshow is initialized
            setTimeout(initHeroSlideshow, 500);
        }
    }
    
    // Load all section content
    // Modify the loadSection calls to use absolute paths
    loadSection('nav-container', '/sections/navigation.html', checkAllSectionsLoaded);
    loadSection('hero-container', '/sections/hero.html', checkAllSectionsLoaded);
    loadSection('about-container', '/sections/about.html', checkAllSectionsLoaded);
    loadSection('packages-container', '/sections/packages.html', checkAllSectionsLoaded);
    loadSection('services-container', '/sections/services.html', checkAllSectionsLoaded);
    loadSection('contact-container', '/sections/contact.html', checkAllSectionsLoaded);
    loadSection('footer-container', '/sections/footer.html', checkAllSectionsLoaded);
});

// Function to load HTML sections
// Modify the loadSection function to handle layout issues
// Modify the loadSection function (around line 40-50)
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
            // Fix the path comparison by removing the leading slash
            if (sectionPath === 'sections/navigation.html' || sectionPath.endsWith('navigation.html')) {
                initMobileMenu();
            } else if (sectionPath === 'sections/hero.html' || sectionPath.endsWith('hero.html')) {
                initHeroSlideshow();
            } else if (sectionPath === 'sections/packages.html' || sectionPath.endsWith('packages.html')) {
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
// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    // Use getElementById instead of querySelector for more reliable selection
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMenuButton = document.getElementById('close-mobile-menu');
    
    console.log('Mobile menu elements:', { 
        button: mobileMenuButton, 
        menu: mobileMenu, 
        overlay: mobileMenuOverlay, 
        closeBtn: closeMenuButton 
    });
    
    if (mobileMenuButton && mobileMenu && mobileMenuOverlay) {
        // Open menu
        mobileMenuButton.addEventListener('click', () => {
            console.log('Menu button clicked');
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
        
        // Close menu functions
        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        };
        
        // Close on X button click
        if (closeMenuButton) {
            closeMenuButton.addEventListener('click', closeMenu);
        }
        
        // Close on overlay click
        mobileMenuOverlay.addEventListener('click', closeMenu);
        
        // Close menu when clicking on links
        const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    } else {
        console.warn('Mobile menu elements not found:', { 
            buttonFound: !!mobileMenuButton, 
            menuFound: !!mobileMenu, 
            overlayFound: !!mobileMenuOverlay 
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
// Hero Slideshow
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;
    
    function showSlide(n) {
        // Hide all slides
        slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.style.zIndex = '0'; // Lower z-index for hidden slides
            slide.style.pointerEvents = 'none'; // Disable pointer events for hidden slides
        });
        
        // Update dots
        dots.forEach(dot => dot.classList.replace('bg-gray-500', 'bg-gray-200'));
        
        // Show current slide
        slides[n].style.opacity = '1';
        slides[n].style.zIndex = '1'; // Higher z-index for visible slide
        slides[n].style.pointerEvents = 'auto'; // Enable pointer events for visible slide
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
    
    // Set initial state
    showSlide(currentSlide);
    
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


// Initialize form submission after all sections are loaded
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) {
        console.warn('Contact form not found. Will retry in 500ms.');
        setTimeout(initContactForm, 500);
        return;
    }
    
    contactForm.addEventListener('submit', function(e) {
        // Show a success message before opening the email client
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = 'Opening Email Client...';
        
        // Create and show the success popup message
        const popup = document.createElement('div');
        popup.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50';
        popup.innerHTML = `
            <div class="bg-white rounded-xl shadow-xl p-8 max-w-md mx-auto text-center">
                <div class="text-green-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Opening Email Client</h3>
                <p class="text-gray-600 mb-6">Your email client will open shortly. You can review your message before sending.</p>
                <button class="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-600 transition duration-300 transform hover:scale-[1.02]">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Add event listener to close button
        const closeButton = popup.querySelector('button');
        closeButton.addEventListener('click', function() {
            document.body.removeChild(popup);
        });
        
        // Auto close after 1 second and proceed with form submission
        setTimeout(() => {
            if (document.body.contains(popup)) {
                document.body.removeChild(popup);
            }
            submitButton.innerHTML = originalButtonText;
            // Allow the form to submit normally (will open email client)
        }, 1000);
        
        // Delay the form submission to allow the popup to show
        setTimeout(() => {
            // Continue with the default form submission (will open email client)
        }, 1500);
    });
}
// Add this at the beginning of your main.js file
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
});
// Change these lines (around line 25-31)
loadSection('nav-container', 'sections/navigation.html', checkAllSectionsLoaded);
loadSection('hero-container', 'sections/hero.html', checkAllSectionsLoaded);
loadSection('about-container', 'sections/about.html', checkAllSectionsLoaded);
loadSection('packages-container', 'sections/packages.html', checkAllSectionsLoaded);
loadSection('services-container', 'sections/services.html', checkAllSectionsLoaded);
loadSection('contact-container', 'sections/contact.html', checkAllSectionsLoaded);
loadSection('footer-container', 'sections/footer.html', checkAllSectionsLoaded);
// Run debug after a delay to ensure everything has loaded
setTimeout(debugSections, 2000);