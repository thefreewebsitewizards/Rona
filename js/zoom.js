// Image Zoom Functionality
function initImageZoom() {
    console.log('Initializing image zoom');
    const zoomableImages = document.querySelectorAll('.zoomable-image');
    const modal = document.getElementById('imageZoomModal');
    const zoomedImage = document.getElementById('zoomedImage');
    const closeButton = document.getElementById('closeZoomButton');
    const prevButton = document.getElementById('prevImageButton');
    const nextButton = document.getElementById('nextImageButton');
    
    // Current image index
    let currentImageIndex = 0;
    const imageUrls = Array.from(zoomableImages).map(img => img.src);
    
    if (!modal || !zoomedImage || !closeButton) {
        console.error('Zoom modal elements not found');
        return;
    }
    
    console.log('Found ' + zoomableImages.length + ' zoomable images');
    
    // Add click event to all zoomable images
    zoomableImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            console.log('Image clicked: ' + this.src);
            // Set the current image index
            currentImageIndex = index;
            // Set the src of the zoomed image
            zoomedImage.src = this.src;
            // Show the modal
            modal.classList.remove('hidden');
            // Prevent scrolling on the body
            document.body.style.overflow = 'hidden';
            // Update navigation buttons visibility
            updateNavigationButtons();
        });
    });
    
    // Close modal when clicking the X button
    closeButton.addEventListener('click', function() {
        console.log('Close button clicked');
        closeZoomModal();
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            console.log('Clicked outside image');
            closeZoomModal();
        }
    });
    
    // Previous image button
    if (prevButton) {
        prevButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent modal from closing
            navigateImage(-1);
        });
    }
    
    // Next image button
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent modal from closing
            navigateImage(1);
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('hidden')) return;
        
        if (e.key === 'ArrowLeft') {
            navigateImage(-1);
        } else if (e.key === 'ArrowRight') {
            navigateImage(1);
        } else if (e.key === 'Escape') {
            closeZoomModal();
        }
    });
    
    function navigateImage(direction) {
        currentImageIndex = (currentImageIndex + direction + imageUrls.length) % imageUrls.length;
        zoomedImage.src = imageUrls[currentImageIndex];
        updateNavigationButtons();
    }
    
    function updateNavigationButtons() {
        // Optional: Hide/show navigation buttons based on position
        // For a circular navigation (which we're implementing), both buttons are always visible
    }
    
    function closeZoomModal() {
        modal.classList.add('hidden');
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
    }
}

// Check if the DOM is loaded, then initialize
document.addEventListener('DOMContentLoaded', function() {
    // Wait for sections to load
    setTimeout(function checkAndInitZoom() {
        if (document.querySelector('.zoomable-image')) {
            console.log('Zoomable images found, initializing zoom');
            initImageZoom();
        } else {
            console.log('Waiting for zoomable images to load...');
            setTimeout(checkAndInitZoom, 500);
        }
    }, 1000);
});