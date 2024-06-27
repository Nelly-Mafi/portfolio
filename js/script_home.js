document.addEventListener("DOMContentLoaded", function () {
    // Initialize ScrollMagic controller
    const controller = new ScrollMagic.Controller();

    // Hide the loading screen after a 5-second delay once everything is loaded
    window.addEventListener('load', function () {
        const loadingBar = document.querySelector('.loading-bar');
        loadingBar.style.width = '100%'; // Start filling the bar

        setTimeout(function () {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('hidden');

            // Show the main content with a fade-in effect
            const wrapper = document.querySelector('.wrapper');
            wrapper.classList.add('visible');

            // Remove the no-scroll class from body to bring back the scrollbar
            document.body.classList.remove('no-scroll');

            // Initialize Intro animations after the loading screen is hidden
            new Intro();
        }, 3000); // 3000 milliseconds = 5 seconds
    });

    // Add the no-scroll class to body to hide the scrollbar initially
    document.body.classList.add('no-scroll');

    // Function to check the background color based on scroll position
    function updateBackground() {
        // Get references to the sections
        const introSection = document.getElementById('intro');
        const whiteSpacerSection = document.querySelector('.white-spacer');
        const messageSection = document.getElementById('message');

        // Get the bounding rectangles of the sections
        const introRect = introSection.getBoundingClientRect();
        const whiteSpacerRect = whiteSpacerSection.getBoundingClientRect();
        const messageRect = messageSection.getBoundingClientRect();

        // Get the body element
        const body = document.body;

        // Check the top of the viewport to determine which section is in view
        const topOfViewport = 0;

        if (introRect.top <= topOfViewport && introRect.bottom > topOfViewport) {
            body.setAttribute('data-bg', 'light');
        } else if (whiteSpacerRect.top <= topOfViewport && whiteSpacerRect.bottom > topOfViewport) {
            body.setAttribute('data-bg', 'white');
        } else if (messageRect.top <= topOfViewport && messageRect.bottom > topOfViewport) {
            body.setAttribute('data-bg', 'dark');
        }
    }

    // Attach scroll and resize event listeners to update background on events
    window.addEventListener('scroll', updateBackground);
    window.addEventListener('resize', updateBackground);

    // Initial check to set the correct background attribute
    updateBackground();

    // Intro section animation
    new ScrollMagic.Scene({
        triggerElement: "#intro",
        duration: "100%", // Animation duration is 100% of the section height
        triggerHook: 0.5 // Trigger the animation when the element is in the middle of the viewport
    })
        .setClassToggle("#intro .hero__title span", "visible") // Add 'visible' class to the intro text spans
        .addTo(controller); // Add this scene to the controller

    // Message section animation
    new ScrollMagic.Scene({
        triggerElement: "#message",
        duration: "100%", // Animation duration is 100% of the section height
        triggerHook: 0.5 // Trigger the animation when the element is in the middle of the viewport
    })
        .setClassToggle("#welcomeText", "visible") // Add 'visible' class to the welcome text
        .addTo(controller); // Add this scene to the controller

    // Canvas animation setup
    const canvas = document.getElementById("hero-lightpass");
    const context = canvas.getContext("2d");

    const frameCount = 148;
    const currentFrame = index => (
        `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${index.toString().padStart(4, '0')}.jpg`
    );

    // Preload images for smooth animation
    const preloadImages = () => {
        for (let i = 1; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
        }
    };

    // Initialize the first image for the canvas
    const img = new Image();
    img.src = currentFrame(1);
    canvas.width = 1158;
    canvas.height = 770;
    img.onload = function () {
        context.drawImage(img, 0, 0);
    };

    // Update the canvas with the image corresponding to the current frame index
    const updateImage = index => {
        img.src = currentFrame(index);
        context.drawImage(img, 0, 0);
    };

    // Canvas animation scene
    new ScrollMagic.Scene({
        triggerElement: ".pin",
        duration: "200%", // Animation duration is 200% of the pin section height
        triggerHook: 0 // Trigger the animation as soon as the element enters the viewport
    })
        .on("progress", function (event) {
            const scrollProgress = event.progress;
            const frameIndex = Math.min(
                frameCount - 1,
                Math.ceil(scrollProgress * frameCount)
            );
            updateImage(frameIndex + 1); // Update the image based on scroll progress
        })
        .setPin(".pin") // Pin the canvas section during the animation
        .addTo(controller); // Add this scene to the controller

    // Preload all images for the canvas animation
    preloadImages();

    // Intro text animation
    class Intro {
        constructor() {
            this.$title = document.querySelector('.hero__title');
            this.$subtitle = document.querySelector('.hero__subtitle');
            this.$strings = document.querySelectorAll('.js-letters');
            this.init();
        }

        init() {
            this.$strings.forEach(el => {
                this.manageLetters(el);
            });

            this.introAnim();
        }

        manageLetters(el) {
            const text = el.innerHTML.trim();
            const letters = this.splitString(text);
            const lettersLength = letters.length;
            let final = "";

            for (let i = 0; i < lettersLength; i++) {
                final += "<span class='letter'>" + letters[i] + "</span>";
            }

            el.innerHTML = final;
        }

        splitString(str) {
            str = str.trim();
            const length = str.length;
            const retArr = [];
            for (let i = 0; i < length; i++) {
                if (str[i] === ' ') {
                    retArr[retArr.length - 1] += '&nbsp;';
                    continue;
                }
                retArr.push(str[i]);
            }
            return retArr;
        }

        introAnim() {
            const introTween = gsap.timeline();
            const $cover = document.querySelector('.hero__cover');

            introTween
                .staggerTo(this.$title.querySelectorAll('.letter'), 1.5, {
                    yPercent: -40,
                    opacity: 1,
                    ease: Back.easeOut
                }, 0.02666)
                .staggerTo(this.$subtitle, 1, {
                    yPercent: -40,
                    opacity: 1,
                    ease: Back.easeOut
                }, 0.025, '-=0.9');
        }
    }
});
