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

      videoTemplateContent.querySelector('.preview-video').src = this.getAttribute('video-src');
      videoTemplateContent.querySelector('.preview-video').alt = this.getAttribute('video-title');
      videoTemplateContent.querySelector('.vid-prev-software').textContent = this.getAttribute('video-software');
      videoTemplateContent.querySelector('.vid-prev-title').textContent = this.getAttribute('video-title');
      videoTemplateContent.querySelector('.vid-prev-description').textContent = this.getAttribute('video-desc');
  
      this.appendChild(videoTemplateContent);
    }
  }

  // Register the custom element
  customElements.define('gallery-preview', GalleryPreview);
  customElements.define('video-gallery-preview', VideoGalleryPreview);


  