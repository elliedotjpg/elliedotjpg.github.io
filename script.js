class GalleryPreview extends HTMLElement {
  connectedCallback() {
    if (this.querySelector('.gallery-preview')) {
      return;
    }
    const template = document.querySelector('#preview-template');
    const templateContent = template.content.cloneNode(true);
    // Populate content with attributes from HTML
    const imgSrc = this.getAttribute('src');
    const imgElement = templateContent.querySelector('.preview-image');
    imgElement.src = imgSrc;

    // Hide spinner when image loads
    imgElement.onload = () => {
      const spinner = this.querySelector('.loading-spinner');
      if (spinner) spinner.classList.add('hidden');
    };

    imgElement.onerror = () => {
      const spinner = this.querySelector('.loading-spinner');
      if (spinner) spinner.classList.add('hidden');
    };
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
    };
    img.src = imgSrc;
  }
}

class VideoGalleryPreview extends HTMLElement {
  connectedCallback() {
    if (this.querySelector('.video-gallery-preview')) {
      return;
    }
    const videoTemplate = document.querySelector('#video-preview-template');
    const videoTemplateContent = videoTemplate.content.cloneNode(true);
    // Populate content with attributes from HTML

    const video = videoTemplateContent.querySelector('.preview-video');
    video.src = this.getAttribute('src') || this.getAttribute('video-src');

    // Hide spinner when video loads enough data
    video.onloadeddata = () => {
      const spinner = this.querySelector('.loading-spinner');
      if (spinner) spinner.classList.add('hidden');
    };

    video.onerror = () => {
      const spinner = this.querySelector('.loading-spinner');
      if (spinner) spinner.classList.add('hidden');
    };

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

      // Apply aspect ratio based classes

    });
  }

  setupVideoAutoplay(video) {
    // Only autoplay if device has sufficient resources
    if (navigator.hardwareConcurrency > 2 && navigator.deviceMemory > 2) {
      // Preload video metadata for smoother playback
      video.preload = 'metadata';

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Play when visible
              video.play().catch(error => {
                // Auto-play was prevented
              });
            } else {
              // Pause when not visible
              video.pause();
            }
          });
        }, { threshold: 0.1 });

        observer.observe(video);
      } else {
        video.play().catch(e => { });
      }
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

  // Preload video metadata for smoother playback
  const videoSrc = element.src;

  // Add hardware acceleration class
  modalVideo.classList.add('gpu-accelerated');

  // Preload metadata directly on the modal video
  modalVideo.preload = 'metadata';
  modalVideo.src = videoSrc;

  // Pause the preview video
  element.pause();

  // OPTIMIZATION: Pause ALL other preview videos to free up resources
  document.querySelectorAll('.preview-video').forEach(vid => {
    vid.pause();
  });

  // Hide image, show video
  modalImg.style.display = "none";
  modalVideo.style.display = "block";
  modalVideo.controls = true;
  modalVideo.muted = false;
  modalVideo.playsinline = false;

  // Enable hardware acceleration
  modalVideo.style.transform = 'translate3d(0,0,0)';
  modalVideo.style.backfaceVisibility = 'hidden';
  modalVideo.style.willChange = 'transform';

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
  // Native controls handle click-to-play/pause automatically. 
  // We removed the manual listener to prevent conflict (double-toggling).


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
  // Handle initial layout check
  handleGalleryLayout();

  // Create a debounced resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleGalleryLayout, 100);
  });
});

function handleGalleryLayout() {
  const width = window.innerWidth;
  // Match the CSS media query breakpoints for 2-column layout
  // 1. max-width: 538px
  // 2. min-width: 955px and max-width: 1040px
  // Also consider natural wrapping if width is smaller than what fits 3 columns (~790px)
  const isTwoColumnMode = (width < 850) || (width >= 955 && width <= 1315);

  // Find all gallery directories
  const galleries = document.querySelectorAll('.galleryDirectoryContent .flexRow');

  galleries.forEach(gallery => {
    // Check if this gallery has 3 columns directly
    const columns = Array.from(gallery.children).filter(child => child.classList.contains('flexColumns'));

    if (columns.length >= 3) {
      const col1 = columns[0];
      const col2 = columns[1];
      const col3 = columns[2];

      if (isTwoColumnMode) {
        // We need to move items from col3 to col1 and col2
        // Only if col3 is visible/has content we haven't engaged with yet
        if (col3.style.display !== 'none') {
          // Get all items from col3
          const items = Array.from(col3.children);

          items.forEach((item, index) => {
            // Store original parent to restore later
            item.dataset.originalCol = '3';

            // Distribute evenly
            if (index % 2 === 0) {
              col1.appendChild(item);
            } else {
              col2.appendChild(item);
            }
          });

          // Hide the third column
          col3.style.display = 'none';
        }
      } else {
        // Restore items to col3 if we are in 3-column mode
        if (col3.style.display === 'none') {
          col3.style.display = 'flex'; // Restore display

          // Find all items that belong to col3 in col1 and col2
          const col1Items = Array.from(col1.children).filter(item => item.dataset.originalCol === '3');
          const col2Items = Array.from(col2.children).filter(item => item.dataset.originalCol === '3');

          // Combine and sort them to try and maintain order?
          // The order they were appended was: 0->col1, 1->col2, 2->col1, 3->col2
          // So if we pull them out, we should try to put them back in order.

          // Let's gather them all and sort by some index? Or just append all?
          // Since we didn't store index, just appending works, but order might be slightly shuffled if we did strict even distribution.
          // However, for masonry, shuffle is often fine.

          // To be safer, let's just append all found items back to col3.
          [...col1Items, ...col2Items].forEach(item => {
            col3.appendChild(item);
            delete item.dataset.originalCol; // Clean up
          });
        }
      }
    }
  });
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
// Hero Section Slideshow Logic
document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
});

function initHeroSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  // 1. Gather all unique images from gallery
  const galleryImages = [];
  const processedSrcs = new Set();

  // Get all gallery-preview elements
  const previews = document.querySelectorAll('gallery-preview');

  previews.forEach(preview => {
    const src = preview.getAttribute('src');
    const title = preview.getAttribute('title');

    // Only add if src exists and not already added
    if (src && !processedSrcs.has(src)) {
      // Filter out placeholders if any
      if (src.includes('placeholder')) return;

      galleryImages.push({
        src: src,
        title: title || '',
        element: preview // Store reference to original element
      });
      processedSrcs.add(src);
    }
  });

  // Shuffle images to keep it fresh
  shuffleArray(galleryImages);

  // Take top 8 images for the slider to keep DOM light
  const heroImages = galleryImages.slice(0, 8);

  if (heroImages.length === 0) return;

  // 2. Build Slides
  heroImages.forEach((imgData, index) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide';

    // Background container for zoom effect
    const bg = document.createElement('div');
    bg.className = 'hero-slide-bg';
    bg.style.backgroundImage = `url('${imgData.src}')`;
    bg.style.filter = 'brightness(0.8)'; // Moved dimming here
    slide.appendChild(bg);

    if (index === 0) slide.classList.add('active');

    // Add Caption
    if (imgData.title) {
      const caption = document.createElement('div');
      caption.className = 'hero-slide-caption';
      caption.textContent = imgData.title;
      slide.appendChild(caption);
    }

    // Add Click Event to Navigate
    slide.addEventListener('click', () => {
      const targetElement = imgData.element;
      if (!targetElement) return;

      // Find which tab this element belongs to
      const parentContent = targetElement.closest('.galleryDirectoryContent');
      if (parentContent) {
        const tabId = parentContent.id;

        // Find the tab button (handling both quote types in onclick attribute)
        const tabBtn = document.querySelector(`.tablinks[onclick*="'${tabId}'"]`) ||
          document.querySelector(`.tablinks[onclick*='"${tabId}"']`);

        if (tabBtn) {
          tabBtn.click();

          // Scroll to element after a short delay to allow tab switch
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Add a temporary subtle highlight animation
            const originalTransform = targetElement.style.transform;
            targetElement.style.transition = 'transform 0.4s ease';
            targetElement.style.transform = 'scale(1.02)';

            setTimeout(() => {
              targetElement.style.transform = originalTransform;
            }, 800);
          }, 100);
        }
      }
    });

    slider.appendChild(slide);
  });

  // 3. Start Auto-Play
  let currentSlide = 0;
  const slideCount = heroImages.length;

  // Only start interval if we have more than 1 slide
  if (slideCount > 1) {
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slideCount;

      // Update transform
      slider.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

      // Update active class for captions and zoom effect
      const slides = slider.querySelectorAll('.hero-slide');
      slides.forEach((s, i) => {
        if (i === currentSlide) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });

    }, 5000); // 5 seconds per slide
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

