class GalleryPreview extends HTMLElement {
    connectedCallback() {
      const template = document.querySelector('#preview-template');
      const templateContent = template.content.cloneNode(true);
      // Populate content with attributes from the HTML
      templateContent.querySelector('.preview-image').src = this.getAttribute('src');
      templateContent.querySelector('.preview-image').alt = this.getAttribute('title');
      templateContent.querySelector('.preview-software').textContent = this.getAttribute('software');
      templateContent.querySelector('.preview-title').textContent = this.getAttribute('title');
      templateContent.querySelector('.preview-description').textContent = this.getAttribute('desc');
  
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
      videoTemplateContent.querySelector('.vid-prev-description').textContent = this.getAttribute('desc') || this.getAttribute('video-desc');
  
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
    
    // Get the parent gallery preview element to extract description
    const galleryPreview = element.closest('.video-gallery-preview');
    if (galleryPreview) {
      const title = galleryPreview.querySelector('.vid-prev-title').textContent;
      const software = galleryPreview.querySelector('.vid-prev-software').textContent;
      const description = galleryPreview.querySelector('.vid-prev-description').textContent;
      
      modalDesc.innerHTML = `
        <h2>${title}</h2>
        <p><em>Software: ${software}</em></p>
        <p>${description}</p>
      `;
    }
    
    modal.style.display = "flex";
    
    // Store reference to preview video to resume it later
    modal.dataset.previewVideo = element.src;
  }