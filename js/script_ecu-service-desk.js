document.addEventListener("DOMContentLoaded", function () {
    const scrollDownButton = document.getElementById('scroll-down');
    const bodySection = document.getElementById('body');

    // Only initialize Locomotive Scroll on larger screens or non-iOS devices
    if (window.innerWidth > 768) {
        const scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true
        });

        scrollDownButton.addEventListener('click', function () {
            scroll.scrollTo(bodySection, {
                duration: 100,
                offset: 2,
                easing: [0.45, 0.05, 0.55, 0.95]
            });
        });
    } else {
        scrollDownButton.addEventListener('click', function () {
            bodySection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Slideshow Functionality
    const images = document.querySelectorAll('#image-slideshow-section .image-wrapper img');
    let currentImageIndex = 0;

    function showNextImage() {
        images[currentImageIndex].classList.remove('active');
        currentImageIndex = (currentImageIndex + 1) % images.length;
        images[currentImageIndex].classList.add('active');
    }

    images[currentImageIndex].classList.add('active'); // Show the first image
    setInterval(showNextImage, 2500); // Change image every 2.5 seconds
});
