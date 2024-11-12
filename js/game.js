document.addEventListener("DOMContentLoaded", function () {
    

    



     
    
    
    
    const scrollDownButton = document.getElementById('scroll-down');
    const bodySection = document.getElementById('body');
    const audio = document.getElementById('pageAudio'); // Background audio
    const clickAudio = document.getElementById('clickAudio'); // Click sound effect audio
    const hoverAudio = document.getElementById('hoverAudio'); // Hover sound effect audio

    // Attempt to play the background audio when the page is loaded
    const playPromise = audio.play();

    // Check if play() was successful or needs user interaction
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Autoplay failed, audio will require manual interaction.');
        });
    }

    // Set the audio to repeat when it ends
    audio.addEventListener('ended', function () {
        audio.currentTime = 0; // Reset the audio to the beginning
        audio.play(); // Play again
    });

    // Create a container for the audio toggle button
    const audioToggleButton = document.createElement('div');
    audioToggleButton.id = 'audio-toggle';
    audioToggleButton.classList.add('audio-on'); // Initially add 'audio-on' class
    document.body.appendChild(audioToggleButton);

    // Create an <img> element for the sound-on GIF
    const audioOnImage = document.createElement('img');
    audioOnImage.src = 'assets/audios/sound-on.gif'; // Path to your sound-on GIF
    audioOnImage.alt = 'Sound On';
    audioOnImage.id = 'audio-on-image'; // Add an ID for easier manipulation

    // Create a span element for the hover text
    const hoverText = document.createElement('span');
    hoverText.classList.add('hover-text');
    hoverText.innerText = 'Sound Off'; // Default text when audio is on

    // Add the image and text to the audio toggle button
    audioToggleButton.appendChild(audioOnImage);
    audioToggleButton.appendChild(hoverText);

    // Toggle audio on/off when the button is clicked
    audioToggleButton.addEventListener('click', () => {
        // Play click sound on toggle interaction
        clickAudio.play();

        if (audio.muted) {
            // Unmute the audio and show the sound-on GIF
            audio.muted = false;
            audio.currentTime = 0;
            audio.play();
            audioToggleButton.classList.remove('audio-off');
            audioToggleButton.classList.add('audio-on');
            audioOnImage.style.display = 'block'; // Show the sound-on GIF
            hoverText.innerText = 'Sound Off'; // Change hover text to "Sound On"
        } else {
            // Mute the audio and hide the sound-on GIF
            audio.muted = true;
            audioToggleButton.classList.remove('audio-on');
            audioToggleButton.classList.add('audio-off');
            audioOnImage.style.display = 'none'; // Hide the sound-on GIF
            hoverText.innerText = 'Sound On'; // Change hover text to "Sound Off"
        }
    });

    // Play hover audio when hovering over the audio toggle button
    audioToggleButton.addEventListener('mouseenter', () => {
        hoverAudio.currentTime = 0; // Reset audio to the start
        hoverAudio.play(); // Play hover audio
    });

    // Locomotive Scroll initialization for larger screens
    let scroll;
    if (window.innerWidth > 768) {
        scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true
        });
    }

    // Play click sound and scroll to body section when the down arrow is clicked
    scrollDownButton.addEventListener('click', function (e) {
        // Prevent the default behavior of the button
        e.preventDefault();

        // Play the click sound after a small delay to ensure no conflict with scrolling
        setTimeout(() => {
            clickAudio.play();
        }, 50); // 50ms delay before playing the sound

        // If Locomotive Scroll is active (on larger screens), use it to scroll
        if (scroll) {
            scroll.scrollTo(bodySection, {
                duration: 1000, // Smooth scrolling duration
                offset: 5,
                easing: [0.25, 0.1, 0.25, 1.0] // Custom easing function for smoothness
            });
        } else {
            // For smaller screens, use native smooth scrolling
            bodySection.scrollIntoView({ behavior: 'smooth' });
        }
    });





    // Select the cursor elements
    const cursor = document.querySelector('.cursor'); // Outer circle
    const cursorBorder = document.querySelector('.cursor-border'); // Inner circle

    // Track mouse movement and update cursor positions
    window.addEventListener('mousemove', (e) => {
        const { clientX: x, clientY: y } = e;

        // Center both inner and outer circles perfectly on the cursor
        cursor.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
        cursorBorder.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
    });

    // List of interactive elements that trigger the hover effect
    const interactiveElements = document.querySelectorAll(
        'a, button, input, [role="button"], .scroll-down, #audio-toggle'
    );

    // Add hover effect on interactive elements
    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('is-hover'); // Enlarge cursor on hover
        });

        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('is-hover'); // Reset cursor size
        });
    });










});
