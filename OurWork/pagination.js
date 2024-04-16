let currentPage = 1;
let startX = 0;
let endX = 0;

function renderGallery() {
    const galleryWrapper = document.querySelector('.galleryWrapper');
    galleryWrapper.innerHTML = '';

    let imagesLoaded = 0;

    for (let i = 1; i <= 9; i++) {
        const img = document.createElement('img');
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === 9) { 
                updateGallery(); 
            }
        };
        img.src = `../Images/Project Gallery/${i}.jpg`;
        img.alt = `Project ${i}`;
        img.className = i === currentPage ? 'gallery-img active' : 'gallery-img';
        galleryWrapper.appendChild(img);
    }

    renderPagination();
}


function renderPagination() {
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= 9; i++) {
        const button = document.createElement('button');
        button.textContent = '•';
        button.className = currentPage === i ? 'active' : '';
        button.addEventListener('click', () => changePage(i));
        pagination.appendChild(button);
    }
}

function changePage(newPage) {
    currentPage = newPage;
    renderGallery();
}

function updateGallery() {
    const galleryWindow = document.querySelector('.galleryWindow');
    const galleryWrapper = document.querySelector('.galleryWrapper');
    const activeImg = document.querySelector('.gallery-img.active');

    if (activeImg) {
        const centerOffset = galleryWindow.offsetWidth / 2;
        const activeImgOffset = activeImg.offsetLeft + activeImg.offsetWidth / 2;
        const translateX = centerOffset - activeImgOffset;
        galleryWrapper.style.transform = `translateX(${translateX}px)`;
    }

    updateButtons();
}


function updateButtons() {
    const prevButton = document.querySelector('.prevButton');
    const nextButton = document.querySelector('.nextButton');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === 9;

    prevButton.classList.toggle('disabled', currentPage === 1);
    nextButton.classList.toggle('disabled', currentPage === 9);
}


document.addEventListener('DOMContentLoaded', () => {
    renderGallery();

    document.querySelector('.prevButton').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderGallery();
        }
    });

    document.querySelector('.nextButton').addEventListener('click', () => {
        if (currentPage < 9) {
            currentPage++;
            renderGallery();
        }
    });

    const galleryWrapper = document.querySelector('.galleryWrapper');

    galleryWrapper.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX;
    });

    galleryWrapper.addEventListener('touchmove', (event) => {
        endX = event.touches[0].clientX;
    });

    galleryWrapper.addEventListener('touchend', () => {
        const threshold = 100;
        const diff = startX - endX;

        if (diff > threshold && currentPage < 9) {
            currentPage++;
        } else if (diff < -threshold && currentPage > 1) {
            currentPage--;
        }

        renderGallery();
    });

    window.addEventListener('resize', updateGallery);
});