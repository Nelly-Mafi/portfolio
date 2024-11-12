document.addEventListener("DOMContentLoaded", function () {
    
    // ---- Scrolling Features Start ----
    
    // Ensure GSAP plugins are registered
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Locomotive Scroll
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        smartphone: { smooth: true },
        tablet: { smooth: true }
    });

    // Sync GSAP and Locomotive Scroll
    scroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy("[data-scroll-container]", {
        scrollTop(value) {
            return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },
        pinType: "transform", // Ensure pinType is correctly set
    });


    // Opacity effect for intro image when scrolling towards #about section
    gsap.to('.intro-image img', {
        opacity: 0, // Fade out to 0 opacity
        ease: 'none', // No easing for a smooth transition
        scrollTrigger: {
            trigger: '#about', // When the about section comes into view
            scroller: '[data-scroll-container]', // Make sure to specify the scroller
            start: 'top bottom', // Start fading out when #about reaches the bottom of the viewport
            end: 'top top', // Complete the fade-out when #about reaches the top of the viewport
            scrub: 0.5, // Link the animation to the scroll progress
        }
    });


    // Horizontal scrolling for media container
    const horizontalSections = gsap.utils.toArray('div.horizontal');

    console.log(`Found ${horizontalSections.length} horizontal sections.`);

    horizontalSections.forEach((sec, i) => {
        console.log(`Processing section ${i + 1}.`);

        const thisPinWrap = sec.querySelector('.pin-wrap');
        const mediaContainer = thisPinWrap.querySelector('.media-container');

        const containerWidth = mediaContainer.scrollWidth;
        const rightPadding = window.innerWidth * 0.33;

        console.log(`Container width: ${containerWidth}px, Right padding: ${rightPadding}px`);

        function getScrollAmount() {
            const amount = -(containerWidth - window.innerWidth + rightPadding);
            console.log(`Calculated scroll amount: ${amount}px`);
            return amount;
        }

        gsap.fromTo(
            mediaContainer,
            { x: 0 },
            {
                x: getScrollAmount(),
                ease: "none",
                scrollTrigger: {
                    trigger: sec,
                    scroller: "[data-scroll-container]",
                    start: "center center",
                    end: () => `+=${containerWidth - window.innerWidth + rightPadding}`,
                    pin: thisPinWrap,
                    pinSpacing: true, // Try enabling pinSpacing
                    scrub: 1,
                    invalidateOnRefresh: true,
                    //markers: true, 
                    anticipatePin: 1, // Smooth pinning
                    onEnter: () => console.log(`Pinning started for section ${i + 1}.`),
                    onLeave: () => console.log(`Pinning ended for section ${i + 1}.`),
                }
            }
        );
    });






    














    // Skills scrollings feature
    const prioritizedItems = gsap.utils.toArray([
        // UX/UI Design Group
        '.prioritize__item:nth-child(5)',  // UX Design
        '.prioritize__item:nth-child(12)',  // UI Design
        '.prioritize__item:nth-child(2)',  // Interaction Design
        '.prioritize__item:nth-child(4)',  // Design Research
        '.prioritize__item:nth-child(14)', // Information Design
    
        // Visual Design and Animation Group
        '.prioritize__item:nth-child(7)', // Web Design
        '.prioritize__item:nth-child(9)',  // Communication Design
        '.prioritize__item:nth-child(6)', // 2D/3D Animation
        '.prioritize__item:nth-child(3)',  // 3D Modeling
    
        // Game Design and Development Group
        '.prioritize__item:nth-child(15)',  // Game Design
        '.prioritize__item:nth-child(1)',  // Game Development
    
        // Development and Technical Group
        '.prioritize__item:nth-child(11)', // Front-End Development
        '.prioritize__item:nth-child(10)', // Data Analysis
    
        // Communication and Mentorship Group
        '.prioritize__item:nth-child(8)',  // Public Speaking
        '.prioritize__item:nth-child(13)', // Mentorship & Teaching
    
        // Final "And Mooooore" Section
        '.prioritize__item:nth-child(16)'  // And Mooooore
    ]);
    
    
    

    // Pin the #skills-section with ScrollTrigger
    const skillsSection = document.querySelector('#skills-section');
    const skillPinWrap = skillsSection.querySelector('.skill-pin-wrap');

    // Ensure the #skills-section is pinned with ScrollTrigger
    // Pin the #skills-section with ScrollTrigger
    gsap.fromTo(
        skillPinWrap,
        { opacity: 1 }, // Ensure visibility at the start
        {
            opacity: 1, // Maintain visibility during pinning
            scrollTrigger: {
                trigger: skillsSection,
                scroller: '[data-scroll-container]', // Use Locomotive's scroll container
                start: 'center center', // Start pinning earlier
                end: () => {
                    const sectionHeight = skillsSection.scrollHeight; // Use `scrollHeight` to get full height
                    const viewportHeight = window.innerHeight;
                    const buffer = 100; // Subtract buffer to prevent premature unpin
                    const calculatedEnd = sectionHeight - buffer; // Ensure pin lasts beyond section height

                    // Debug logs for end calculation
                    console.log('--- Calculating End Value ---');
                    console.log(`Section Scroll Height: ${sectionHeight}px`);
                    console.log(`Viewport Height: ${viewportHeight}px`);
                    console.log(`Calculated End (with buffer): ${calculatedEnd}px`);

                    return `+=${calculatedEnd}`; // Extend pin duration based on section height
                },
                pin: skillPinWrap, // Pin the wrapper
                pinSpacing: false, // Prevent layout shift issues
                scrub: 6, // Smooth pinning effect
                anticipatePin: 1, // Smooth pin behavior
                invalidateOnRefresh: true, // Handle resize properly
                onEnter: () => console.log("[Pin] Pinning started."),
                onLeave: (self) => {
                    console.log("[Pin] Pinning ended.");
                    console.log(`Scroll progress at leave: ${self.progress}`);
                    gsap.set(skillPinWrap, { opacity: 1 }); // Ensure visibility stays intact
                },
                onEnterBack: () => console.log("[Pin] Re-entered from back-scroll."),
                onLeaveBack: () => console.log("[Pin] Left on back-scroll.")
            }
        }
    );

    // Sequential fade-in animation for prioritized items with blur effect
    gsap.fromTo(
        prioritizedItems,
        { opacity: 0, filter: 'blur(10px)' }, // Start hidden and blurred
        {
            opacity: 1, // Smooth fade-in effect
            filter: 'blur(0px)', // Gradually remove blur
            ease: 'none', // Smooth easing
            duration: 1.5, // Longer fade-in duration for smoothness
            stagger: 1, // Delay between each item appearance
            scrollTrigger: {
                trigger: '#skills-section',
                scroller: '[data-scroll-container]', // Use Locomotive's scroll container
                start: 'top center', // Start animation earlier
                end: () => `+=${skillsSection.scrollHeight + 100}`, // Extend animation duration
                scrub: true, // Link animation progress with scroll
                onUpdate: (self) => console.log(`[Animation] Fade-in progress: ${self.progress}`),
            }
        }
    );

















    // Refresh ScrollTrigger on page load and after resizing
    ScrollTrigger.addEventListener("refresh", () => scroll.update());
    ScrollTrigger.refresh();   
    
    // ---- Scrolling Features End ----







    // Hover feature of award and publication cards
    document.querySelectorAll('.card').forEach(card => {
        const image = card.querySelector('.card-image');
        const content = card.querySelector('.card-content');
        const readMore = card.querySelector('.read-more');
    
        card.addEventListener('mouseenter', () => {
            console.log('Mouse entered');
            image.style.height = '80%'; 
            content.style.height = '20%'; // Content takes 10% of card height on hover
            content.querySelector('.pre-hover-content').style.opacity = '0'; // Hide only pre-hover content
            readMore.style.visibility = 'visible'; // Show read-more
            readMore.style.opacity = '1'; // Ensure it is fully visible
        });
    
        card.addEventListener('mouseleave', () => {
            console.log('Mouse left');
            image.style.height = '70%'; // Revert image height to 70%
            content.style.height = '30%'; // Revert content height to 30%
            content.querySelector('.pre-hover-content').style.opacity = '1'; // Show pre-hover content
            readMore.style.opacity = '0'; // Hide it gradually
            readMore.style.visibility = 'hidden'; // Set visibility to hidden after fade out
        });
    });
    
    
    




























    

    


    // Email link functionality (existing code)
    const emailLink = document.getElementById('email-link');
    const originalEmailText = emailLink.textContent; // Store the original email text
    let originalCopyText = "COPY EMAIL";
    let originalEmailCopiedText = "EMAIL COPIED";

    // Function to update the text based on screen size
    const updateTextForScreenSize = () => {
        if (window.innerWidth <= 768) {
            // If the screen width is 768px or less, change the text to "CONTACT" and "COPY"
            emailLink.querySelector('.original-text').textContent = 'CONTACT';
            originalCopyText = 'COPY';
        } else {
            // If the screen width is greater than 768px, revert to original text
            emailLink.querySelector('.original-text').textContent = originalEmailText;
            originalCopyText = 'COPY EMAIL';
        }
        emailLink.querySelector('.copy-text').textContent = originalCopyText;
        emailLink.querySelector('.email-copied-text').textContent = originalEmailCopiedText;
    };

    // Set the initial HTML structure for the email link
    emailLink.innerHTML = `
        <span class="original-text">${originalEmailText}</span>
        <span class="copy-text">COPY EMAIL</span>
        <span class="email-copied-text">EMAIL COPIED</span>
    `;

    // Add event listener for mouseover to show the copy text
    emailLink.addEventListener('mouseover', function () {
        emailLink.querySelector('.original-text').style.opacity = '0';
        emailLink.querySelector('.copy-text').style.opacity = '1';
    });

    // Add event listener for mouseout to revert to original text if not clicked
    emailLink.addEventListener('mouseout', function () {
        if (!emailLink.classList.contains('clicked')) {
            emailLink.querySelector('.original-text').style.opacity = '1';
            emailLink.querySelector('.copy-text').style.opacity = '0';
        }
    });

    // Add event listener for click to copy the email to clipboard
    emailLink.addEventListener('click', function (event) {
        event.preventDefault();
        const email = 'nellymafi@yahoo.com'; // Ensure email is in lowercase
        navigator.clipboard.writeText(email).then(function () {
            // Change the appearance of the email link on click
            emailLink.classList.add('clicked');
            emailLink.querySelector('.email-copied-text').style.opacity = '1';
            emailLink.querySelector('.copy-text').style.opacity = '0';
            emailLink.style.backgroundColor = 'var(--button_clicked_bkgr_color)';
            emailLink.style.color = 'var(--button_clicked_text_color)';
            // Revert to original appearance after 2 seconds
            setTimeout(function () {
                emailLink.classList.remove('clicked');
                emailLink.querySelector('.email-copied-text').style.opacity = '0';
                emailLink.querySelector('.copy-text').style.opacity = '0';
                emailLink.querySelector('.original-text').style.opacity = '1';
                emailLink.style.backgroundColor = 'var(--button_bkgr_color)';
                emailLink.style.color = 'var(--button_text_color)';
            }, 2000);
        });
    });

    // Update text on load and on window resize
    updateTextForScreenSize();
    window.addEventListener('resize', updateTextForScreenSize);

    
});
