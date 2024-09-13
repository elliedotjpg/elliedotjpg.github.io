class GalleryPreview extends HTMLElement {
    connectedCallback() {
      const template = document.querySelector('#preview-template');
      const templateContent = template.content.cloneNode(true);
  
      // Populate content with attributes from the HTML
      templateContent.querySelector('.preview-image').src = this.getAttribute('src');
      templateContent.querySelector('.preview-image').alt = this.getAttribute('title');
      templateContent.querySelector('.preview-date').textContent = this.getAttribute('date');
      templateContent.querySelector('.preview-title').textContent = this.getAttribute('title');
      templateContent.querySelector('.preview-description').textContent = this.getAttribute('desc');
  
      this.appendChild(templateContent);
    }
  }

  // Register the custom element
  customElements.define('gallery-preview', GalleryPreview);


  