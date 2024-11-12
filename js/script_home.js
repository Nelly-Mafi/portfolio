document.addEventListener("DOMContentLoaded", function () {

    // Initialize loading screen and wrapper visibility
    setTimeout(function () {
        const loadingScreen = document.getElementById('loading-screen');
        const wrapper = document.querySelector('.wrapper');

        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (wrapper) wrapper.classList.add('visible');

        document.body.classList.remove('no-scroll');
    }, 4000);

    

    const isSmallScreen = window.innerWidth <= 1024;

    // Select project info elements for title and line
    const projectInfo = document.querySelector(".project-info");
    const projectTitle = document.querySelector(".project-info .project-title");
    const projectLine = document.querySelector(".project-info .line");

    let previousIndex = 0; // Track the previous slide index
    let lineAnimationPlayed = false; // Track if line animation has played
    let scrollLocked = false; // Lock to prevent multiple transitions per scroll

    // Initialize Swiper
    const swiper = new Swiper(".swiper-container", {
        lazy: false,
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        grabCursor: false,
        allowTouchMove: isSmallScreen,
        direction: "vertical",
        speed: 1500,
        effect: "coverflow",
        coverflowEffect: {
            rotate: 100,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
        },
        keyboard: { enabled: true },
        pagination: {
            el: ".swiper-pagination",
            dynamicBullets: false,
            clickable: true,
        },
        on: {
            init() { 
                updateBackground(this); 
                updateProjectTitle(this); 
                triggerFadeInOnInit(this); // Trigger fade-in on init
            },
            slideChange() {
                updateBackground(this);
                const isNext = this.activeIndex > previousIndex || (previousIndex === this.slides.length - 1 && this.activeIndex === 0);
                handleLineAnimation(this);
                updateProjectTitle(this, isNext);
                previousIndex = this.activeIndex; // Update the previous index
            },
            slideChangeTransitionEnd() {
                applyFadeInToActiveDescription(this);
            },
        },
    });

    // Function to handle the line animation
    function handleLineAnimation(swiper) {
        const activeSlide = swiper.slides[swiper.activeIndex];
        const isIntro = activeSlide.classList.contains("intro-slide");

        // Trigger animation when leaving the intro slide for the first time
        if (!isIntro && !lineAnimationPlayed) {
            projectLine.classList.remove("grow"); // Reset animation
            void projectLine.offsetWidth; // Force reflow to reset
            projectLine.classList.add("grow"); // Start animation
            lineAnimationPlayed = true; // Mark animation as played
        }

        // Reset the animation when returning to the intro slide
        if (isIntro) {
            projectLine.classList.remove("grow");
            lineAnimationPlayed = false;
        }
    }

    // Function to update background color based on active slide
    function updateBackground(swiper) {
        const activeSlide = swiper.slides[swiper.activeIndex];
        const bgColor = activeSlide.getAttribute("data-bg-color");
        const progressColor = activeSlide.getAttribute("data-progress-color");

        document.body.style.backgroundColor = bgColor;
        document.body.style.setProperty("--progress-color", progressColor);
        document.body.style.setProperty("--theme-color", bgColor);
    }

    // Function to update project title based on swipe direction
    function updateProjectTitle(swiper, isNext) {
        if (!projectInfo || !projectTitle) return;

        const activeSlide = swiper.slides[swiper.activeIndex];
        const title = activeSlide.getAttribute("data-title");

        if (activeSlide.classList.contains("intro-slide")) {
            projectInfo.style.display = "none";
            projectTitle.classList.remove("slide-in-up", "slide-out-up", "slide-in-down", "slide-out-down", "slide-in-start-up", "slide-in-start-down");
        } else {
            projectInfo.style.display = "block";

            const slideOutClass = isNext ? "slide-out-down" : "slide-out-up";
            const slideInStartClass = isNext ? "slide-in-start-down" : "slide-in-start-up";
            const slideInClass = isNext ? "slide-in-down" : "slide-in-up";

            // Slide out the old title while setting up the new title above/below
            projectTitle.classList.remove("slide-in-down", "slide-in-up", slideInStartClass); // Reset animations
            projectTitle.classList.add(slideOutClass); // Start slide-out effect

            setTimeout(() => {
                projectTitle.textContent = title || "Project Title"; // Update title text
                projectTitle.classList.remove(slideOutClass); // Remove slide-out class
                projectTitle.classList.add(slideInStartClass); // Position new title above or below

                // Trigger the slide-in effect after positioning it
                setTimeout(() => {
                    projectTitle.classList.remove(slideInStartClass);
                    projectTitle.classList.add(slideInClass); // Slide in new title from the correct direction
                }, 50); // Short delay to ensure reflow
            }, 300); // Delay to allow slide-out to complete
        }
    }

    // Function to trigger fade-in on initialization (first transition from intro to project)
    function triggerFadeInOnInit(swiper) {
        applyFadeInToActiveDescription(swiper); // Apply fade-in to first project on init
    }

    // Function to apply fade-in animation to the active project's description
    function applyFadeInToActiveDescription(swiper) {
        document.querySelectorAll('.project-description').forEach(desc => {
            desc.classList.remove('fade-in');
            desc.classList.add('fade-out');
        });

        // Fade in the active slide's project description
        const activeDescription = swiper.slides[swiper.activeIndex].querySelector('.project-description');
        if (activeDescription) {
            activeDescription.classList.remove('fade-out');
            activeDescription.classList.add('fade-in');
        }
    }

    // Custom scroll handler for controlling single slide transitions
    window.addEventListener("wheel", (event) => {
        if (!scrollLocked) {
            if (event.deltaY > 0) {
                // Scroll down, move to the next slide
                swiper.slideNext();
            } else {
                // Scroll up, move to the previous slide
                swiper.slidePrev();
            }
            // Lock scroll to prevent multiple transitions
            scrollLocked = true;
            setTimeout(() => {
                scrollLocked = false; // Unlock after delay
            }, 2000); // Adjust delay as needed (2000ms = 2 second)
        }
    });

    // Handle touch swipe for scroll on touch devices
    let touchStartY = 0;
    window.addEventListener("touchstart", (event) => {
        touchStartY = event.touches[0].clientY;
    });

    window.addEventListener("touchmove", (event) => {
        const touchEndY = event.touches[0].clientY;
        if (!scrollLocked) {
            if (touchStartY > touchEndY + 50) {
                swiper.slideNext();
                scrollLocked = true;
                setTimeout(() => {
                    scrollLocked = false;
                }, 1000); // Lock duration for touch scroll
            } else if (touchStartY < touchEndY - 50) {
                swiper.slidePrev();
                scrollLocked = true;
                setTimeout(() => {
                    scrollLocked = false;
                }, 1000); // Lock duration for touch scroll
            }
        }
    });

    // Throttle function to prevent rapid-fire hover events
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function(...args) {
            const context = this;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // Hover effect on pagination bullets with throttling
    const bullets = document.querySelectorAll(".swiper-pagination .swiper-pagination-bullet");
    bullets.forEach((bullet, index) => {
        bullet.addEventListener("mouseenter", throttle(() => {
            swiper.slideTo(index); // Navigate to the correct slide on hover
        }, 200)); // 200ms throttle for better stability
    });


    // Ripple settings and functions
    const rippleSettings = {
        maxSize: 60,
        animationSpeed: 3,
        strokeColor: [77, 77, 77],   
    };
    
    const canvasSettings = {
        blur: 20, // Keep blur for the ripple effect
        ratio: 1,
    };
    
    function Coords(x, y) {
        this.x = x || null;
        this.y = y || null;
    }
    
    const Ripple = function Ripple(x, y, circleSize, ctx) {
        this.position = new Coords(x, y);
        this.circleSize = circleSize;
        this.maxSize = rippleSettings.maxSize;
        this.opacity = 1;
        this.ctx = ctx;
        this.strokeColor = `rgba(${Math.floor(rippleSettings.strokeColor[0])},
        ${Math.floor(rippleSettings.strokeColor[1])},
        ${Math.floor(rippleSettings.strokeColor[2])},
        ${this.opacity})`;
    
        this.animationSpeed = rippleSettings.animationSpeed;
        this.opacityStep = (this.animationSpeed / (this.maxSize - circleSize)) / 2;
    };
    
    Ripple.prototype = {
        update: function update() {
        this.circleSize += this.animationSpeed;
        this.opacity -= this.opacityStep;
        this.strokeColor = `rgba(${Math.floor(rippleSettings.strokeColor[0])},
            ${Math.floor(rippleSettings.strokeColor[1])},
            ${Math.floor(rippleSettings.strokeColor[2])},
            ${this.opacity})`;
        },
        draw: function draw() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.arc(this.position.x, this.position.y, this.circleSize, 0, 2 * Math.PI);
        this.ctx.stroke();
        },
    };
    
    // SpotlightEffect class using a single radial gradient
    class SpotlightEffect {
        constructor(canvas, spotlightRadius, speed, initialAngle) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.spotlightRadius = spotlightRadius;
        this.speed = speed;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        this.spotlightX = centerX + (Math.random() - 0.5) * canvas.width * 0.4;
        this.spotlightY = centerY + (Math.random() - 0.5) * canvas.height * 0.4;
    
        this.angle = initialAngle;
    
        // Spotlight adjustable settings
        this.fadeFactor = 0.1; // Adjust fade intensity
    
        this.resizeCanvas();
        
        window.addEventListener("resize", () => this.resizeCanvas());
        }
    
        resizeCanvas() {
        this.canvas.width = window.innerWidth * canvasSettings.ratio;
        this.canvas.height = window.innerHeight * canvasSettings.ratio;
        }
    
        drawSpotlight() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
    
        // Calculate spotlight position based on rotation around center
        this.spotlightX = centerX + Math.cos(this.angle) * this.canvas.width * 0.4;
        this.spotlightY = centerY + Math.sin(this.angle) * this.canvas.height * 0.4;
        this.angle += this.speed; // Update angle for smooth rotation
    
        this.ctx.save();
        this.ctx.translate(this.spotlightX, this.spotlightY);
    
        // Single radial gradient for smooth fade effect
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.spotlightRadius);
        gradient.addColorStop(0, `rgba(253, 247, 236, ${this.fadeFactor})`); // Bright center
        gradient.addColorStop(1, "rgba(10, 10, 10, 0)"); // Transparent edge
    
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.spotlightRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        }
    
        animate() {
        this.drawSpotlight();
        }
    }
    
    // Combined animation logic for multiple spotlights
    const canvas = document.getElementById("background-canvas");
    const ctx = canvas.getContext("2d");
    const ripples = [];
    
    // Instantiate three spotlights with different sizes, speeds, and initial angles
    const spotlights = [
        new SpotlightEffect(canvas, 650, 0.0030, 0),         // Spotlight 1
        new SpotlightEffect(canvas, 550, 0.0030, Math.PI / 2),  // Spotlight 2
        new SpotlightEffect(canvas, 400, 0.0030, Math.PI),       // Spotlight 3
    ];
    
    canvas.style.filter = `blur(${canvasSettings.blur}px)`; // Keep global blur for ripple effect
    
    const canvasMouseOver = (e) => {
        const x = e.clientX * canvasSettings.ratio;
        const y = e.clientY * canvasSettings.ratio;
        ripples.unshift(new Ripple(x, y, 2, ctx));
    };
    
    const animation = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Animate all spotlights
        spotlights.forEach((spotlight) => spotlight.animate());
    
        // Animate ripple effect
        for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.update();
        r.draw();
    
        if (r.opacity <= 0) {
            ripples.splice(i, 1);
        }
        }
    
        requestAnimationFrame(animation);
    };
    
    animation();
    canvas.addEventListener("mousemove", canvasMouseOver);







    
    
    
    
});
