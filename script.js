class GalleryPreview extends HTMLElement {
  connectedCallback() {
    const template = document.querySelector('#preview-template');
    const templateContent = template.content.cloneNode(true);
    // Populate content with attributes from HTML
    const imgSrc = this.getAttribute('src');
    templateContent.querySelector('.preview-image').src = imgSrc;
    templateContent.querySelector('.preview-image').alt = this.getAttribute('title');
    templateContent.querySelector('.preview-software').textContent = this.getAttribute('software');
    templateContent.querySelector('.preview-title').textContent = this.getAttribute('title');

    const extraImages = this.getAttribute('extra-images');
    if (extraImages) {
      templateContent.querySelector('.preview-image').setAttribute('data-extra-images', extraImages);
    }

    // Pass description to the image element
    const desc = this.getAttribute('desc');
    if (desc) {
      templateContent.querySelector('.preview-image').setAttribute('data-desc', desc);
    }

    this.appendChild(templateContent);

    // Apply dynamic sizing to all gallery previews
    this.applyDynamicSizing(imgSrc);
  }

  applyDynamicSizing(imgSrc) {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const galleryElement = this.querySelector('.gallery-preview') || this;

      // Add dynamic sizing class
      galleryElement.classList.add('dynamic-sizing');

      // Store aspect ratio as a custom property for CSS
      galleryElement.style.setProperty('--aspect-ratio', aspectRatio);
      galleryElement.style.setProperty('--preview-aspect-ratio', aspectRatio);

      // Apply aspect ratio to the image element itself
      const imageElement = galleryElement.querySelector('.preview-image');
      if (imageElement) {
        imageElement.style.aspectRatio = aspectRatio;
      }

      // Apply aspect ratio based classes
      if (aspectRatio > 1.5) {
        // Wide landscape
        galleryElement.classList.add('wide-landscape');
      } else if (aspectRatio > 1.2) {
        // Regular landscape
        galleryElement.classList.add('landscape');
      } else if (aspectRatio < 0.67) {
        // Tall portrait
        galleryElement.classList.add('tall-portrait');
      } else if (aspectRatio < 0.8) {
        // Regular portrait
        galleryElement.classList.add('portrait');
      } else {
        // Square-ish
        galleryElement.classList.add('square');
      }

      // Apply responsive sizing based on viewport
      this.applyResponsiveSizing(galleryElement, aspectRatio);
    };
    img.src = imgSrc;
  }

  // Apply responsive sizing based on viewport
  applyResponsiveSizing(element, aspectRatio) {
    const updateSize = () => {
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth <= 599;
      const isTablet = viewportWidth > 599 && viewportWidth <= 955;

      if (isMobile) {
        // Mobile sizing - adjust based on aspect ratio to prevent clipping
        const maxWidth = viewportWidth / 2 - 10;
        if (aspectRatio < 1) {
          // Portrait orientation - calculate height based on width to prevent clipping
          element.style.width = maxWidth + 'px';
          element.style.height = Math.round(maxWidth / aspectRatio) + 'px';
        } else {
          // Landscape or square orientation
          const maxHeight = 160;
          const width = Math.min(Math.round(aspectRatio * maxHeight), maxWidth);
          element.style.width = width + 'px';
          element.style.height = maxHeight + 'px';
        }
      } else if (isTablet) {
        // Tablet sizing - adjust based on aspect ratio to prevent clipping
        const maxWidth = viewportWidth / 3 - 10;
        if (aspectRatio < 1) {
          // Portrait orientation - calculate height based on width to prevent clipping
          element.style.width = maxWidth + 'px';
          element.style.height = Math.round(maxWidth / aspectRatio) + 'px';
        } else {
          // Landscape or square orientation
          const maxHeight = 220;
          const width = Math.min(Math.round(aspectRatio * maxHeight), maxWidth);
          element.style.width = width + 'px';
          element.style.height = maxHeight + 'px';
        }
      }
    };

    // Apply initial size
    updateSize();

    // Update on resize
    window.addEventListener('resize', () => {
      clearTimeout(element.resizeTimeout);
      element.resizeTimeout = setTimeout(updateSize, 100);
    });
  }
}

class VideoGalleryPreview extends HTMLElement {
  connectedCallback() {
    const videoTemplate = document.querySelector('#video-preview-template');
    const videoTemplateContent = videoTemplate.content.cloneNode(true);
    // Populate content with attributes from HTML

    const video = videoTemplateContent.querySelector('.preview-video');
    video.src = this.getAttribute('src') || this.getAttribute('video-src');
    video.setAttribute('data-title', this.getAttribute('title') || this.getAttribute('video-title'));

    videoTemplateContent.querySelector('.video-prev-software').textContent = this.getAttribute('software') || this.getAttribute('video-software');
    videoTemplateContent.querySelector('.video-prev-title').textContent = this.getAttribute('title') || this.getAttribute('video-title');

    const extraImages = this.getAttribute('extra-images');
    if (extraImages) {
      video.setAttribute('data-extra-images', extraImages);
    }

    // Pass description to the video element
    const desc = this.getAttribute('desc') || this.getAttribute('video-desc');
    if (desc) {
      video.setAttribute('data-desc', desc);
    }

    this.appendChild(videoTemplateContent);

    // Apply dynamic sizing to video previews
    this.applyVideoDynamicSizing(video);

    // Attempt to autoplay video preview
    this.setupVideoAutoplay(video);
  }

  applyVideoDynamicSizing(video) {
    // Set up event listener to get video dimensions
    video.addEventListener('loadedmetadata', () => {
      const aspectRatio = video.videoWidth / video.videoHeight;
      const galleryElement = this.querySelector('.video-gallery-preview') || this;

      // Add dynamic sizing class
      galleryElement.classList.add('dynamic-sizing');

      // Store aspect ratio as a custom property for CSS
      galleryElement.style.setProperty('--aspect-ratio', aspectRatio);
      galleryElement.style.setProperty('--preview-aspect-ratio', aspectRatio);

      // Apply aspect ratio to the video element itself
      video.style.aspectRatio = aspectRatio;

      // Apply aspect ratio based classes
      if (aspectRatio > 1.5) {
        // Wide landscape
        galleryElement.classList.add('wide-landscape');
      } else if (aspectRatio > 1.2) {
        // Regular landscape
        galleryElement.classList.add('landscape');
      } else if (aspectRatio < 0.67) {
        // Tall portrait
        galleryElement.classList.add('tall-portrait');
      } else if (aspectRatio < 0.8) {
        // Regular portrait
        galleryElement.classList.add('portrait');
      } else {
        // Square-ish
        galleryElement.classList.add('square');
      }

      // Apply responsive sizing based on viewport
      this.applyVideoResponsiveSizing(galleryElement, aspectRatio, video);
    });
  }

  // Apply responsive sizing for videos based on viewport
  applyVideoResponsiveSizing(element, aspectRatio, video) {
    const updateSize = () => {
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth <= 599;
      const isTablet = viewportWidth > 599 && viewportWidth <= 955;

      if (isMobile) {
        // Mobile sizing for videos - adjust based on aspect ratio to prevent clipping
        const maxWidth = viewportWidth / 2 - 10;
        if (aspectRatio < 1) {
          // Portrait orientation - calculate height based on width to prevent clipping
          element.style.width = maxWidth + 'px';
          element.style.height = Math.round(maxWidth / aspectRatio) + 'px';
        } else {
          // Landscape or square orientation
          const maxHeight = 160;
          const width = Math.min(Math.round(aspectRatio * maxHeight), maxWidth);
          element.style.width = width + 'px';
          element.style.height = maxHeight + 'px';
        }
      } else if (isTablet) {
        // Tablet sizing for videos - adjust based on aspect ratio to prevent clipping
        const maxWidth = viewportWidth / 3 - 10;
        if (aspectRatio < 1) {
          // Portrait orientation - calculate height based on width to prevent clipping
          element.style.width = maxWidth + 'px';
          element.style.height = Math.round(maxWidth / aspectRatio) + 'px';
        } else {
          // Landscape or square orientation
          const maxHeight = 220;
          const width = Math.min(Math.round(aspectRatio * maxHeight), maxWidth);
          element.style.width = width + 'px';
          element.style.height = maxHeight + 'px';
        }
      } else {
        // Desktop sizing for videos - adjust based on aspect ratio to prevent clipping
        if (aspectRatio < 1) {
          // Portrait orientation - use width as the limiting factor
          const baseWidth = 200;
          const calculatedHeight = baseWidth / aspectRatio;
          element.style.width = baseWidth + 'px';
          element.style.height = Math.min(calculatedHeight, 400) + 'px';
        } else {
          // Landscape or square orientation
          const baseHeight = 240;
          const calculatedWidth = aspectRatio * baseHeight;
          element.style.width = Math.min(Math.max(calculatedWidth, 150), 400) + 'px';
          element.style.height = baseHeight + 'px';
        }
      }

      // Ensure video element maintains aspect ratio
      video.style.aspectRatio = aspectRatio;
      video.style.setProperty('--video-aspect-ratio', aspectRatio);
    };

    // Apply initial size
    updateSize();

    // Update on resize
    window.addEventListener('resize', () => {
      clearTimeout(element.resizeTimeout);
      element.resizeTimeout = setTimeout(updateSize, 100);
    });
  }

  setupVideoAutoplay(video) {
    // Try to play the video immediately
    const attemptPlay = () => {
      video.play().catch(error => {
        console.log('Autoplay prevented, waiting for user interaction');
        // Add hover to play functionality as fallback
        this.addEventListener('mouseenter', () => {
          video.play().catch(e => console.log('Play on hover failed:', e));
        }, { once: true });
      });
    };

    // Try to play when video is loaded
    video.addEventListener('loadeddata', attemptPlay, { once: true });

    // Also try when element enters viewport (Intersection Observer)
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            attemptPlay();
            observer.unobserve(video);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(video);
    }
  }
}

// Register custom element
customElements.define('gallery-preview', GalleryPreview);
customElements.define('video-gallery-preview', VideoGalleryPreview);

// Video click handler for modal
function onVideoClick(element) {
  const modal = document.getElementById("myModal");
  const modalVideo = document.getElementById("myVideo");
  const modalImg = document.getElementById("myImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalSoftware = document.getElementById("modalSoftware");

  // Pause the preview video
  element.pause();

  // Hide image, show video
  modalImg.style.display = "none";
  modalVideo.style.display = "block";
  modalVideo.src = element.src;
  modalVideo.controls = true;
  modalVideo.muted = false;
  modalVideo.playsinline = false;

  // Get the parent gallery preview element to extract title and software
  const galleryPreview = element.closest('.video-gallery-preview');
  if (galleryPreview) {
    const titleElement = galleryPreview.querySelector('.video-prev-title');
    const softwareElement = galleryPreview.querySelector('.video-prev-software');

    // Set title with fallback to filename if no title is available
    const title = titleElement && titleElement.textContent ? titleElement.textContent : '';
    modalTitle.textContent = title;

    // Set description
    const modalDescription = document.getElementById("modalDescription");
    const desc = element.getAttribute('data-desc') || '';
    modalDescription.textContent = desc;

    // Handle software tags
    const modalSoftwareTags = document.getElementById("modalSoftwareTags");
    if (modalSoftwareTags) {
      modalSoftwareTags.innerHTML = '';
      const software = softwareElement && softwareElement.textContent ? softwareElement.textContent : '';

      if (software) {
        const softwareList = software.split(',').map(s => s.trim());
        softwareList.forEach(sw => {
          const tag = document.createElement('div');
          tag.className = 'software-tag';
          tag.textContent = sw;
          modalSoftwareTags.appendChild(tag);
        });
      }
    }
  }



  // Handle extra images gallery
  const modalGallery = document.getElementById("modalGallery");
  if (modalGallery) {
    modalGallery.innerHTML = '';
    modalGallery.style.display = 'none';

    const extraImages = element.getAttribute('data-extra-images');
    if (extraImages) {
      const images = extraImages.split(',').map(s => s.trim());
      if (images.length > 0) {
        modalGallery.style.display = 'grid';

        // Add the main video thumbnail (active) - for video we might not have a thumbnail easily available?
        // Or we can just use a "Main Video" button or maybe a screenshot if available.
        // For now, let's just show the gallery images.
        // Wait, consistent behavior would be nice.
        // The main video is already playing.
        // Users might want to switch back to main video if they view an image.

        // Let's create a thumb for the main video.
        // Since we don't have a poster, we can maybe use a video element as thumb? Or just text.
        // Or simply, if I click an image, the main view becomes image. How to go back to video?
        // I should probably add the main video to the gallery list.

        const videoThumb = document.createElement('video');
        videoThumb.src = element.src;
        videoThumb.className = 'modal-gallery-thumb active';
        videoThumb.muted = true;
        // videoThumb.play(); // Playing in thumb might be too heavy? Maybe just pause at 0.

        videoThumb.onclick = function () {
          updateModalMainImage(this.src); // This function is in index.html, might not be accessible?
          // updateModalMainImage is defined in index.html script tag. JavaScript in modules vs scripts.
          // index.html script is non-module, script.js is loaded as defer.
          // They share global scope. So updateModalMainImage should be available.
          setActiveThumb(this);
        };
        modalGallery.appendChild(videoThumb);

        // Add extra images
        images.forEach(imgSrc => {
          const thumb = document.createElement('img');
          thumb.src = imgSrc;
          thumb.className = 'modal-gallery-thumb';
          thumb.onclick = function () {
            updateModalMainImage(this.src);
            setActiveThumb(this);
          };
          modalGallery.appendChild(thumb);
        });
      }
    }
  }

  modal.style.display = "flex";

  // Store reference to preview video to resume it later
  modal.dataset.previewVideo = element.src;

  // Add click event listener to modal video for play/pause functionality
  // Remove any existing listener first to prevent duplicates
  modalVideo.removeEventListener('click', handleVideoClick);
  modalVideo.addEventListener('click', handleVideoClick);

  // Handle video aspect ratio for proper modal display
  element.addEventListener('loadedmetadata', function () {
    const aspectRatio = element.videoWidth / element.videoHeight;

    // Remove any existing aspect ratio classes
    modalVideo.classList.remove('portrait-video', 'tall-portrait-video', 'landscape-video', 'square-video');

    // Add appropriate class based on aspect ratio
    if (aspectRatio < 0.67) {
      // Tall portrait
      modalVideo.classList.add('tall-portrait-video');
      // For tall portrait, adjust max dimensions to fit screen
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const maxHeight = viewportHeight - 150; // Account for modal padding and description
      const maxWidth = viewportWidth - 100; // Account for modal padding

      // Calculate dimensions to fit within viewport while maintaining aspect ratio
      if (maxHeight * aspectRatio <= maxWidth) {
        modalVideo.style.height = maxHeight + 'px';
        modalVideo.style.width = (maxHeight * aspectRatio) + 'px';
      } else {
        modalVideo.style.width = maxWidth + 'px';
        modalVideo.style.height = (maxWidth / aspectRatio) + 'px';
      }
    } else if (aspectRatio < 0.8) {
      // Regular portrait
      modalVideo.classList.add('portrait-video');
      // For portrait, adjust max dimensions to fit screen
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const maxHeight = viewportHeight - 150; // Account for modal padding and description
      const maxWidth = viewportWidth - 100; // Account for modal padding

      // Calculate dimensions to fit within viewport while maintaining aspect ratio
      if (maxHeight * aspectRatio <= maxWidth) {
        modalVideo.style.height = maxHeight + 'px';
        modalVideo.style.width = (maxHeight * aspectRatio) + 'px';
      } else {
        modalVideo.style.width = maxWidth + 'px';
        modalVideo.style.height = (maxWidth / aspectRatio) + 'px';
      }
    } else if (aspectRatio > 1.5) {
      // Wide landscape
      modalVideo.classList.add('landscape-video');
      // For wide landscape, use width as limiting factor
      const viewportWidth = window.innerWidth;
      const maxWidth = viewportWidth - 100; // Account for modal padding
      modalVideo.style.width = maxWidth + 'px';
      modalVideo.style.height = (maxWidth / aspectRatio) + 'px';
    } else {
      // Regular landscape or square
      modalVideo.classList.add('square-video');
      // For regular landscape or square, use standard sizing
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const maxWidth = viewportWidth - 100;
      const maxHeight = viewportHeight - 150;

      // Calculate dimensions to fit within viewport while maintaining aspect ratio
      if (maxWidth / aspectRatio <= maxHeight) {
        modalVideo.style.width = maxWidth + 'px';
        modalVideo.style.height = (maxWidth / aspectRatio) + 'px';
      } else {
        modalVideo.style.height = maxHeight + 'px';
        modalVideo.style.width = (maxHeight * aspectRatio) + 'px';
      }
    }
  }, { once: true });

  // Add window resize listener for modal video
  window.addEventListener('resize', handleModalVideoResize);
}

// Handle video click for play/pause functionality
function handleVideoClick(event) {
  event.stopPropagation(); // Prevent the click from propagating to the modal
  const video = event.target;

  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

// Flippable Card Custom Element
class FlippableCard extends HTMLElement {
  connectedCallback() {
    const template = document.querySelector('#flippable-card-template');
    const templateContent = template.content.cloneNode(true);

    // Get attributes
    const softwareName = this.getAttribute('software-name') || 'Software Name';
    const softwareIcon = this.getAttribute('software-icon') || '';
    const years = this.getAttribute('years') || '0 years';
    const proficiency = parseInt(this.getAttribute('proficiency')) || 0;

    // Populate front of card
    const iconContainer = templateContent.querySelector('.software-icon');

    // Check if software-icon contains SVG code or is a URL/path
    if (softwareIcon.trim().startsWith('<svg')) {
      // It's SVG code, insert it directly
      iconContainer.innerHTML = softwareIcon;
    } else if (softwareIcon.trim().startsWith('http') || softwareIcon.includes('/')) {
      // It's a URL or path, create an img element
      const img = document.createElement('img');
      img.src = softwareIcon;
      img.alt = softwareName;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'contain';
      iconContainer.appendChild(img);
    } else {
      // Fallback: create a text placeholder
      iconContainer.innerHTML = `<div style="font-size: 12px; text-align: center; color: white;">${softwareName.substring(0, 3).toUpperCase()}</div>`;
    }

    templateContent.querySelector('.card-software-name').textContent = softwareName;

    // Populate back of card
    templateContent.querySelector('.card-years').textContent = years;

    // Create proficiency dots
    const dotsContainer = templateContent.querySelector('.proficiency-dots');
    for (let i = 1; i <= 5; i++) {
      const dot = document.createElement('div');
      dot.className = 'proficiency-dot';
      if (i <= proficiency) {
        dot.classList.add('filled');
      }
      dotsContainer.appendChild(dot);
    }

    // Add proficiency label
    const proficiencyLabel = document.createElement('div');
    proficiencyLabel.className = 'proficiency-label';
    proficiencyLabel.textContent = 'Proficiency Level';
    templateContent.querySelector('.card-proficiency').insertBefore(proficiencyLabel, dotsContainer);

    this.appendChild(templateContent);

    // Remove click event for flipping since we're using hover
    // Add keyboard support for accessibility
    this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'button');
    this.setAttribute('aria-label', `Flippable card for ${softwareName}. Hover to flip and see proficiency details.`);

    const card = this.querySelector('.flippable-card');
    this.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();

        // Toggle flip on keyboard interaction for accessibility
        if (card.classList.contains('flipped')) {
          card.classList.remove('flipped');
        } else {
          card.classList.add('flipped');
        }
      }
    });

    // Optional: Add touch support for mobile devices
    this.addEventListener('touchstart', (e) => {
      e.preventDefault();
      // Toggle flip on touch for mobile devices
      if (card.classList.contains('flipped')) {
        card.classList.remove('flipped');
      } else {
        card.classList.add('flipped');
      }
    });
  }
}

// Register the flippable card custom element
customElements.define('flippable-card', FlippableCard);

// Initialize dynamic layout calculation
document.addEventListener('DOMContentLoaded', () => {
  // Initialize gallery layout after DOM is loaded
  setTimeout(() => {
    initializeGalleryLayout();

    // Recalculate layout on window resize
    window.addEventListener('resize', debounce(initializeGalleryLayout, 300));
  }, 500);
});

// Debounce function to prevent excessive calculations during resize
function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Initialize dynamic sizing for all gallery sections
function initializeGalleryLayout() {
  // Get all gallery sections
  const allSections = document.querySelectorAll('.galleryDirectoryContent');

  allSections.forEach(section => {
    // Collect all previews and their aspect ratios
    const previewData = [];

    // Handle image gallery previews
    const galleryPreviews = section.querySelectorAll('gallery-preview');
    galleryPreviews.forEach((preview) => {
      const imgSrc = preview.getAttribute('src');
      if (imgSrc) {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const galleryElement = preview.querySelector('.gallery-preview') || preview;

          // Store preview data
          previewData.push({
            element: galleryElement,
            aspectRatio: aspectRatio,
            type: 'image'
          });

          // If this is the last image, calculate layout
          if (previewData.length === galleryPreviews.length + section.querySelectorAll('video-gallery-preview').length) {
            calculateOptimalLayout(section, previewData);
          }
        };
        img.src = imgSrc;
      }
    });

    // Handle video gallery previews
    const videoGalleryPreviews = section.querySelectorAll('video-gallery-preview');
    videoGalleryPreviews.forEach((preview) => {
      const videoSrc = preview.getAttribute('src') || preview.getAttribute('video-src');
      if (videoSrc) {
        const video = preview.querySelector('.preview-video');
        if (video) {
          // Set up event listener to get video dimensions
          video.addEventListener('loadedmetadata', () => {
            const aspectRatio = video.videoWidth / video.videoHeight;
            const galleryElement = preview.querySelector('.video-gallery-preview') || preview;

            // Store preview data
            previewData.push({
              element: galleryElement,
              aspectRatio: aspectRatio,
              type: 'video'
            });

            // If this is the last video, calculate layout
            if (previewData.length === galleryPreviews.length + videoGalleryPreviews.length) {
              calculateOptimalLayout(section, previewData);
            }
          });
        }
      }
    });
  });
}

// Calculate optimal layout for gallery items
function calculateOptimalLayout(section, previewData) {
  const container = section.querySelector('.galleryItems');
  if (!container) return;

  // Get container width
  const containerWidth = container.clientWidth;
  const gap = 10; // Gap between items

  // Check if we're on a small screen
  const isSmallScreen = window.innerWidth <= 599;
  const isMediumScreen = window.innerWidth > 599 && window.innerWidth <= 955;

  // Calculate optimal row height based on screen size
  let rowHeight;
  if (isSmallScreen) {
    rowHeight = Math.min(150, containerWidth / 2 - gap); // Smaller height for mobile
  } else if (isMediumScreen) {
    rowHeight = Math.min(200, containerWidth / 3 - gap); // Medium height for tablets
  } else {
    rowHeight = calculateOptimalRowHeight(containerWidth, previewData, gap); // Dynamic for desktop
  }

  // Apply calculated sizes
  previewData.forEach(preview => {
    let width, height;

    if (isSmallScreen) {
      // For small screens, adjust based on aspect ratio to prevent clipping
      const maxWidth = containerWidth / 2 - gap;
      if (preview.aspectRatio < 1) {
        // Portrait orientation - calculate height based on width to prevent clipping
        width = maxWidth;
        height = Math.round(maxWidth / preview.aspectRatio);
      } else {
        // Landscape or square orientation
        const maxHeight = 160; // Increased max height for mobile to accommodate content
        height = Math.min(rowHeight, maxHeight);
        width = Math.min(Math.round(preview.aspectRatio * height), maxWidth);
      }

      // Ensure minimum dimensions
      width = Math.max(width, 80);
      height = Math.max(height, 80);
    } else if (isMediumScreen) {
      // For medium screens, adjust based on aspect ratio to prevent clipping
      const maxWidth = containerWidth / 3 - gap;
      if (preview.aspectRatio < 1) {
        // Portrait orientation - calculate height based on width to prevent clipping
        width = maxWidth;
        height = Math.round(maxWidth / preview.aspectRatio);
      } else {
        // Landscape or square orientation
        const maxHeight = 220; // Increased max height for tablets to accommodate content
        height = Math.min(rowHeight, maxHeight);
        width = Math.min(Math.round(preview.aspectRatio * height), maxWidth);
      }

      // Ensure minimum dimensions
      width = Math.max(width, 100);
      height = Math.max(height, 100);
    } else {
      // For desktop - adjust based on aspect ratio to prevent clipping
      if (preview.aspectRatio < 1) {
        // Portrait orientation - use width as the limiting factor
        const baseWidth = 200;
        height = Math.round(baseWidth / preview.aspectRatio);
        width = baseWidth;
      } else {
        // Landscape or square orientation - increased height to accommodate content
        height = rowHeight + 40; // Add extra space for content
        width = Math.round(preview.aspectRatio * height);
      }
    }

    preview.element.style.width = width + 'px';
    preview.element.style.height = height + 'px';

    // Store aspect ratio as CSS custom property for better responsive handling
    preview.element.style.setProperty('--preview-aspect-ratio', preview.aspectRatio);

    // Update image/video dimensions with proper aspect ratio handling
    const mediaElement = preview.element.querySelector('.preview-image, .preview-video');
    if (mediaElement) {
      mediaElement.style.width = '100%';
      mediaElement.style.height = 'auto';
      mediaElement.style.objectFit = 'contain';
      mediaElement.style.aspectRatio = preview.aspectRatio;

      // For videos, ensure proper aspect ratio is maintained
      if (mediaElement.tagName === 'VIDEO') {
        mediaElement.style.setProperty('--video-aspect-ratio', preview.aspectRatio);
      }
    }
  });
}

// Calculate optimal row height to fill container width
function calculateOptimalRowHeight(containerWidth, previewData, gap) {
  // Sort previews by aspect ratio for better packing
  const sortedPreviews = [...previewData].sort((a, b) => b.aspectRatio - a.aspectRatio);

  // Try different row heights to find the best fit
  const minRowHeight = 150;
  const maxRowHeight = 300;
  let bestRowHeight = 200;
  let bestWastedSpace = Infinity;

  for (let rowHeight = minRowHeight; rowHeight <= maxRowHeight; rowHeight += 10) {
    let currentWidth = 0;
    let itemsInRow = 0;

    // Calculate how many items fit in a row with this height
    for (const preview of sortedPreviews) {
      const itemWidth = preview.aspectRatio * rowHeight;

      if (currentWidth + itemWidth + (itemsInRow * gap) <= containerWidth) {
        currentWidth += itemWidth;
        itemsInRow++;
      } else {
        break;
      }
    }

    // Calculate wasted space
    const totalItemWidth = currentWidth;
    const totalGapWidth = (itemsInRow - 1) * gap;
    const usedWidth = totalItemWidth + totalGapWidth;
    const wastedSpace = containerWidth - usedWidth;

    if (wastedSpace >= 0 && wastedSpace < bestWastedSpace) {
      bestWastedSpace = wastedSpace;
      bestRowHeight = rowHeight;
    }
  }

  return bestRowHeight;
}

// Testimonial Card Custom Element
class TestimonialCard extends HTMLElement {
  connectedCallback() {
    const template = document.querySelector('#testimonial-card-template');
    const templateContent = template.content.cloneNode(true);

    // Get attributes
    const name = this.getAttribute('name') || 'Client Name';
    const title = this.getAttribute('title') || 'Job Title';
    const company = this.getAttribute('company') || 'Company Name';
    const testimony = this.getAttribute('testimony') || 'Testimonial text goes here...';
    const photoSrc = this.getAttribute('photo-src') || './assets/testimonial-placeholder.jpg';

    // Populate template
    templateContent.querySelector('.testimonial-name').textContent = name;
    templateContent.querySelector('.testimonial-title').textContent = title;
    templateContent.querySelector('.testimonial-company').textContent = company;
    templateContent.querySelector('.testimonial-testimony p').textContent = testimony;
    templateContent.querySelector('.testimonial-photo img').src = photoSrc;
    templateContent.querySelector('.testimonial-photo img').alt = `${name} - ${title} at ${company}`;

    this.appendChild(templateContent);
  }
}

// Register testimonial card custom element
customElements.define('testimonial-card', TestimonialCard);

// Function to create testimonial cards from template
function createTestimonialCard(name, title, company, testimony, photoSrc) {
  // Get template
  const template = document.getElementById('testimonial-card-template');

  // Clone template content
  const clone = template.content.cloneNode(true);

  // Fill in data
  clone.querySelector('.testimonial-name').textContent = name;
  clone.querySelector('.testimonial-title').textContent = title;
  clone.querySelector('.testimonial-company').textContent = company;
  clone.querySelector('.testimonial-testimony p').textContent = testimony;

  // Set photo if provided
  if (photoSrc) {
    clone.querySelector('.testimonial-photo img').src = photoSrc;
    clone.querySelector('.testimonial-photo img').alt = `${name} - ${title} at ${company}`;
  }

  // Handle window resize for modal video
  function handleModalVideoResize() {
    const modal = document.getElementById("myModal");
    const modalVideo = document.getElementById("myVideo");

    // Only resize if modal is visible and video is displayed
    if (modal && modal.style.display === "flex" && modalVideo && modalVideo.style.display === "block") {
      // Get the video aspect ratio from the video element
      const videoWidth = modalVideo.videoWidth || modalVideo.naturalWidth;
      const videoHeight = modalVideo.videoHeight || modalVideo.naturalHeight;

      if (videoWidth && videoHeight) {
        const aspectRatio = videoWidth / videoHeight;

        // Remove any existing aspect ratio classes
        modalVideo.classList.remove('portrait-video', 'tall-portrait-video', 'landscape-video', 'square-video');

        // Add appropriate class based on aspect ratio
        if (aspectRatio < 0.67) {
          modalVideo.classList.add('tall-portrait-video');
        } else if (aspectRatio < 0.8) {
          modalVideo.classList.add('portrait-video');
        } else if (aspectRatio > 1.5) {
          modalVideo.classList.add('landscape-video');
        } else {
          modalVideo.classList.add('square-video');
        }

        // Calculate new dimensions based on current viewport
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const modalMedia = document.querySelector('.modal-media');

        if (modalMedia) {
          // For side-by-side layout, calculate dimensions based on the media container
          const maxHeight = modalMedia.clientHeight - 20; // Account for padding
          const maxWidth = modalMedia.clientWidth - 20; // Account for padding

          // Calculate dimensions to fit within container while maintaining aspect ratio
          if (maxHeight * aspectRatio <= maxWidth) {
            modalVideo.style.height = maxHeight + 'px';
            modalVideo.style.width = (maxHeight * aspectRatio) + 'px';
          } else {
            modalVideo.style.width = maxWidth + 'px';
            modalVideo.style.height = (maxWidth / aspectRatio) + 'px';
          }
        }
      }
    }
  }

  // Return complete card element
  return clone.firstElementChild;
}

// Function to add a new testimonial to the carousel
function addTestimonial(name, title, company, testimony, photoSrc) {
  const track = document.querySelector('.carousel-track');
  if (track) {
    const newCard = createTestimonialCard(name, title, company, testimony, photoSrc);
    track.appendChild(newCard);
  }
}