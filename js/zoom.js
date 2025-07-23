// Image Zoom Functionality
function initImageZoom() {
    console.log('Initializing image zoom');
    const zoomableImages = document.querySelectorAll('.zoomable-image');
    const modal = document.getElementById('imageZoomModal');
    const zoomedImage = document.getElementById('zoomedImage');
    const closeButton = document.getElementById('closeZoomButton');
    
    if (!modal || !zoomedImage || !closeButton) {
        console.error('Zoom modal elements not found');
        return;
    }
    
    console.log('Found ' + zoomableImages.length + ' zoomable images');
    
    // Add click event to all zoomable images
    zoomableImages.forEach(img => {
        img.addEventListener('click', function() {
            console.log('Image clicked: ' + this.src);
            // Set the src of the zoomed image
            zoomedImage.src = this.src;
            // Show the modal
            modal.classList.remove('hidden');
            // Prevent scrolling on the body
            document.body.style.overflow = 'hidden';
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