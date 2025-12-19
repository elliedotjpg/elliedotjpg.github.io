class GalleryPreview extends HTMLElement {
    connectedCallback() {
      const template = document.querySelector('#preview-template');
      const templateContent = template.content.cloneNode(true);
      // Populate content with attributes from the HTML
      templateContent.querySelector('.preview-image').src = this.getAttribute('src');
      templateContent.querySelector('.preview-image').alt = this.getAttribute('title');
      templateContent.querySelector('.preview-software').textContent = this.getAttribute('software');
      templateContent.querySelector('.preview-title').textContent = this.getAttribute('title');
  
      this.appendChild(templateContent);
    }
  }

  class VideoGalleryPreview extends HTMLElement {
    connectedCallback() {
      const videoTemplate = document.querySelector('#video-preview-template');
      const videoTemplateContent = videoTemplate.content.cloneNode(true);
      // Populate content with attributes from the HTML

      const video = videoTemplateContent.querySelector('.preview-video');
      video.src = this.getAttribute('src') || this.getAttribute('video-src');
      video.setAttribute('data-title', this.getAttribute('title') || this.getAttribute('video-title'));
      
      videoTemplateContent.querySelector('.vid-prev-software').textContent = this.getAttribute('software') || this.getAttribute('video-software');
      videoTemplateContent.querySelector('.vid-prev-title').textContent = this.getAttribute('title') || this.getAttribute('video-title');
  
      this.appendChild(videoTemplateContent);
      
      // Attempt to autoplay the video preview
      this.setupVideoAutoplay(video);
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

  // Register the custom element
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