document.addEventListener("DOMContentLoaded", function () {
    // Initialize Locomotive Scroll
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'), // Select the scroll container element
        smooth: true // Enable smooth scrolling
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

    // Drag to scroll functionality for the media container
    const mediaContainer = document.querySelector('.media-container');
    let isDown = false; // Track if the mouse is down
    let startX; // Store the starting X position of the mouse
    let scrollLeft; // Store the initial scroll position

    // Event listener for mousedown to initiate dragging
    mediaContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        mediaContainer.classList.add('active'); // Add active class for styling
        startX = e.pageX - mediaContainer.offsetLeft; // Calculate the start position
        scrollLeft = mediaContainer.scrollLeft; // Get the initial scroll position
    });

    // Event listener for mouseleave to end dragging
    mediaContainer.addEventListener('mouseleave', () => {
        isDown = false;
        mediaContainer.classList.remove('active'); // Remove active class
    });

    // Event listener for mouseup to end dragging
    mediaContainer.addEventListener('mouseup', () => {
        isDown = false;
        mediaContainer.classList.remove('active'); // Remove active class
    });

    // Event listener for mousemove to perform the drag scrolling
    mediaContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return; // Only proceed if the mouse is down
        e.preventDefault();
        const x = e.pageX - mediaContainer.offsetLeft; // Calculate the current position
        const walk = (x - startX) * 3; // Determine the scroll distance
        mediaContainer.scrollLeft = scrollLeft - walk; // Scroll the container
    });
});
