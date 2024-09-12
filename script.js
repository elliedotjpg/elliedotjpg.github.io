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

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById("myImg");
var modalImg = document.getElementById("img01");
//var captionText = document.getElementById("caption");
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
  //captionText.innerHTML = this.alt;
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
  }

// Open Tab Function
function openTab(evt, projectName) {
    // Declare all variables
    var i, galleryDirectoryContent, tablinks;
  
    // Get all elements with class="galleryDirectoryContent" and hide them
    galleryDirectoryContent = document.getElementsByClassName("galleryDirectoryContent");
    for (i = 0; i < galleryDirectoryContent.length; i++) {
        galleryDirectoryContent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(projectName).style.display = "block";
    evt.currentTarget.className += " active";
}

  