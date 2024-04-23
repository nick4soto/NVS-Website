document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const mobileNavBar = document.querySelector('.mobile-navBar');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdownContents = document.querySelectorAll('.dropdown-content');
  
    burger.addEventListener('click', () => {
      mobileNavBar.classList.toggle('nav-active');
      burger.classList.toggle('toggle');
    });
  
    dropdownContents.forEach(content => {
      content.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    });
  
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        let dropdownContent = this.parentElement.querySelector('.dropdown-content');
        dropdownContent.classList.toggle('show');
  
        if (dropdownContent.classList.contains('show')) {
          dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
        } else {
          dropdownContent.style.maxHeight = "0";
        }
      });
    });
  
    document.addEventListener('click', function(e) {
      dropdownContents.forEach(content => {
        if (content.classList.contains('show')) {
          content.classList.remove('show');
          content.style.maxHeight = "0";
        }
      });
    });
  });