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
          // Mobile sizing
          const maxHeight = 120;
          const width = Math.min(Math.round(aspectRatio * maxHeight), viewportWidth / 2 - 10);
          element.style.width = width + 'px';
          element.style.height = maxHeight + 'px';
        } else if (isTablet) {
          // Tablet sizing
          const maxHeight = 180;
          const width = Math.min(Math.round(aspectRatio * maxHeight), viewportWidth / 3 - 10);
          element.style.width = width + 'px';
          element.style.height = maxHeight + 'px';
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
      
      videoTemplateContent.querySelector('.vid-prev-software').textContent = this.getAttribute('software') || this.getAttribute('video-software');
      videoTemplateContent.querySelector('.vid-prev-title').textContent = this.getAttribute('title') || this.getAttribute('video-title');
  
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
          // Mobile sizing for videos
          const maxHeight = 120;
          const width = Math.min(Math.round(aspectRatio * maxHeight), viewportWidth / 2 - 10);
          element.style.width = width + 'px';
          element.style.height = maxHeight + 'px';
        } else if (isTablet) {
          // Tablet sizing for videos
          const maxHeight = 180;
          const width = Math.min(Math.round(aspectRatio * maxHeight), viewportWidth / 3 - 10);
          element.style.width = width + 'px';
          element.style.height = maxHeight + 'px';
        } else {
          // Desktop sizing for videos
          const baseHeight = 200;
          const calculatedWidth = aspectRatio * baseHeight;
          element.style.width = Math.min(Math.max(calculatedWidth, 150), 400) + 'px';
          element.style.height = baseHeight + 'px';
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
    const modalDesc = document.getElementById("prevDesc");
    
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
      const title = galleryPreview.querySelector('.vid-prev-title').textContent;
      const software = galleryPreview.querySelector('.vid-prev-software').textContent;
      
      modalDesc.innerHTML = `
        <h2>${title}</h2>
        <p><em>Software: ${software}</em></p>
      `;
    }
    
    modal.style.display = "flex";
    
    // Store reference to preview video to resume it later
    modal.dataset.previewVideo = element.src;
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
      
      // Add click event for flipping
      const card = this.querySelector('.flippable-card');
      this.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Force immediate flip with consistent behavior
        if (card.classList.contains('flipped')) {
          card.classList.remove('flipped');
        } else {
          card.classList.add('flipped');
        }
      });
      
      // Add keyboard support
      this.setAttribute('tabindex', '0');
      this.setAttribute('role', 'button');
      this.setAttribute('aria-label', `Flippable card for ${softwareName}. Click to flip and see proficiency details.`);
      
      this.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          
          // Force immediate flip with consistent behavior
          if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');
          } else {
            card.classList.add('flipped');
          }
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
    return function() {
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
        // For small screens, limit size to prevent overflow
        // Calculate height based on aspect ratio to maintain proportions
        const maxHeight = 150; // Max height for mobile
        height = Math.min(rowHeight, maxHeight);
        width = Math.min(Math.round(preview.aspectRatio * height), containerWidth / 2 - gap);
        
        // Ensure minimum dimensions
        width = Math.max(width, 80);
        height = Math.max(height, 80);
      } else if (isMediumScreen) {
        // For medium screens
        const maxHeight = 200; // Max height for tablets
        height = Math.min(rowHeight, maxHeight);
        width = Math.min(Math.round(preview.aspectRatio * height), containerWidth / 3 - gap);
        
        // Ensure minimum dimensions
        width = Math.max(width, 100);
        height = Math.max(height, 100);
      } else {
        // For desktop
        height = rowHeight;
        width = Math.round(preview.aspectRatio * height);
      }
      
      preview.element.style.width = width + 'px';
      preview.element.style.height = height + 'px';
      
      // Store aspect ratio as CSS custom property for better responsive handling
      preview.element.style.setProperty('--preview-aspect-ratio', preview.aspectRatio);
      
      // Update image/video dimensions with proper aspect ratio handling
      const mediaElement = preview.element.querySelector('.preview-image, .preview-video');
      if (mediaElement) {
        mediaElement.style.width = '100%';
        mediaElement.style.height = '100%';
        mediaElement.style.objectFit = 'cover';
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