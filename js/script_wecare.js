document.addEventListener("DOMContentLoaded", function () {
    // Initialize Locomotive Scroll
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true
    });

    // Scroll down to the next section on click
    const scrollDownButton = document.getElementById('scroll-down');
    const bodySection = document.getElementById('body');
    
    scrollDownButton.addEventListener('click', function () {
        scroll.scrollTo(bodySection);
    });
});
